const crypto = require('crypto');
const { redis } = require('./kv');

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';
const TOKEN_BYTES = 32;
const SESSION_TTL = 30 * 24 * 60 * 60; // 30 days in seconds

function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
}

function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
}

function generateToken() {
    return crypto.randomBytes(TOKEN_BYTES).toString('hex');
}

async function getUser(username) {
    const data = await redis('GET', `user:${username.toLowerCase()}`);
    return data ? JSON.parse(data) : null;
}

async function createUser(username, password) {
    const salt = generateSalt();
    const hash = hashPassword(password, salt);
    const userData = JSON.stringify({ hash, salt, createdAt: Date.now() });
    // NX = only set if key does not exist
    const result = await redis('SET', `user:${username.toLowerCase()}`, userData, 'NX');
    return result !== null;
}

async function verifyPassword(user, password) {
    const hash = hashPassword(password, user.salt);
    return hash === user.hash;
}

async function createSession(username) {
    const token = generateToken();
    await redis('SET', `session:${token}`, username.toLowerCase(), 'EX', SESSION_TTL);
    return token;
}

async function getSession(token) {
    if (!token) return null;
    return await redis('GET', `session:${token}`);
}

module.exports = {
    hashPassword, generateSalt, generateToken,
    getUser, createUser, verifyPassword,
    createSession, getSession,
};
