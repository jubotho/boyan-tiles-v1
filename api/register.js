const { getUser, createUser, createSession } = require('./_lib/auth');

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        if (username.length < 2 || username.length > 20) {
            return res.status(400).json({ error: 'Username must be 2-20 characters' });
        }
        if (password.length < 3) {
            return res.status(400).json({ error: 'Password must be at least 3 characters' });
        }

        const created = await createUser(username, password);
        if (!created) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        const token = await createSession(username.toLowerCase());
        res.status(200).json({ token, username: username.toLowerCase() });
    } catch (e) {
        console.error('Register error:', e);
        res.status(500).json({ error: 'Server error' });
    }
};
