const { getUser, hashPassword, generateSalt } = require('../_lib/auth');
const { redis } = require('../_lib/kv');

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { adminSecret, username, newPassword } = req.body || {};

        if (!process.env.ADMIN_SECRET || adminSecret !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (!username || !newPassword) {
            return res.status(400).json({ error: 'username and newPassword required' });
        }

        const user = await getUser(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const salt = generateSalt();
        const hash = hashPassword(newPassword, salt);
        await redis('SET', `user:${username.toLowerCase()}`, JSON.stringify({
            hash, salt, createdAt: user.createdAt,
        }));

        res.status(200).json({ ok: true });
    } catch (e) {
        console.error('Reset password error:', e);
        res.status(500).json({ error: 'Server error' });
    }
};
