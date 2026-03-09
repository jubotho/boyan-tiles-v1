const { createClient } = require('redis');

let client = null;

async function getClient() {
    if (!client || !client.isOpen) {
        client = createClient({ url: process.env.REDIS_URL });
        client.on('error', (err) => console.error('Redis error:', err));
        await client.connect();
    }
    return client;
}

// Raw Redis command interface — keeps all other files unchanged
async function redis(...args) {
    const c = await getClient();
    return c.sendCommand(args.map(String));
}

module.exports = { redis };
