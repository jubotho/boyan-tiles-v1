const { getSession } = require('./_lib/auth');
const { redis } = require('./_lib/kv');

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const token = (req.headers.authorization || '').replace('Bearer ', '');
        const username = await getSession(token);
        if (!username) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { songId, difficulty, score, maxCombo } = req.body || {};
        if (!songId || !difficulty || score === undefined) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        const numScore = Math.floor(Number(score));

        // Update leaderboard sorted set — GT = only update if new score is greater
        const lbKey = `lb:${songId}:${difficulty}`;
        await redis('ZADD', lbKey, 'GT', numScore, username);

        // Store best score details
        const detailKey = `best:${songId}:${difficulty}:${username}`;
        const existing = await redis('GET', detailKey);
        const existingScore = existing ? JSON.parse(existing).score : 0;
        if (numScore > existingScore) {
            await redis('SET', detailKey, JSON.stringify({
                score: numScore,
                maxCombo: maxCombo || 0,
                date: Date.now(),
            }));
        }

        // Get player's rank (0-indexed, so +1)
        const rank = await redis('ZREVRANK', lbKey, username);

        res.status(200).json({ rank: rank !== null ? rank + 1 : 1 });
    } catch (e) {
        console.error('Submit score error:', e);
        res.status(500).json({ error: 'Server error' });
    }
};
