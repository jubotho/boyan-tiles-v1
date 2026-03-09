const { redis } = require('./_lib/kv');

module.exports = async (req, res) => {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { songId, difficulty } = req.query || {};
        if (!songId || !difficulty) {
            return res.status(400).json({ error: 'songId and difficulty required' });
        }

        const lbKey = `lb:${songId}:${difficulty}`;
        const raw = await redis('ZREVRANGE', lbKey, 0, 9, 'WITHSCORES');

        // raw = [member, score, member, score, ...]
        const entries = [];
        if (raw) {
            for (let i = 0; i < raw.length; i += 2) {
                entries.push({
                    username: raw[i],
                    score: parseInt(raw[i + 1], 10),
                });
            }
        }

        // Fetch level details for each entry
        for (const entry of entries) {
            const detail = await redis('GET', `best:${songId}:${difficulty}:${entry.username}`);
            if (detail) {
                const parsed = JSON.parse(detail);
                entry.level = parsed.level || 1;
            } else {
                entry.level = 1;
            }
        }

        res.status(200).json({ entries });
    } catch (e) {
        console.error('Leaderboard error:', e);
        res.status(500).json({ error: 'Server error' });
    }
};
