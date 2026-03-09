const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(...args) {
    const res = await fetch(KV_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${KV_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.result;
}

module.exports = { redis };
