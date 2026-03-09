const { getUser, verifyPassword, createSession } = require('./_lib/auth');

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const user = await getUser(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const valid = await verifyPassword(user, password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = await createSession(username.toLowerCase());
        res.status(200).json({ token, username: username.toLowerCase() });
    } catch (e) {
        console.error('Login error:', e);
        res.status(500).json({ error: 'Server error' });
    }
};
