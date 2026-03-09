const SUPABASE_URL = 'https://xsimzarwecoqcrozgqas.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaW16YXJ3ZWNvcWNyb3pncWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNzEyNzIsImV4cCI6MjA4ODY0NzI3Mn0.XWS9nCkV3uHrnsi8Fa16A4syguYrLOdIoBbxDwPobUA';

let sb = null;
let currentUser = null;

// Initialize Supabase client
export function initSupabase() {
    if (!window.supabase?.createClient) {
        console.warn('Supabase SDK not loaded — leaderboard disabled');
        return false;
    }
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return true;
}

// Sign in anonymously (auto-creates account on first visit)
export async function ensureAuth() {
    if (!sb) return null;
    try {
        const { data: { session } } = await sb.auth.getSession();
        if (session) {
            currentUser = session.user;
            return currentUser;
        }
        const { data, error } = await sb.auth.signInAnonymously();
        if (error) throw error;
        currentUser = data.user;
        return currentUser;
    } catch (e) {
        console.warn('Supabase auth failed:', e.message);
        return null;
    }
}

// Username helpers — localStorage is the source of truth, Supabase is backup
export function getStoredUsername() {
    return localStorage.getItem('boyan_username') || '';
}

export async function saveUsername(name) {
    localStorage.setItem('boyan_username', name);
    if (!sb || !currentUser) return;
    try {
        await sb.from('profiles').upsert({
            id: currentUser.id,
            username: name,
        });
    } catch (e) {
        console.warn('Failed to save username:', e.message);
    }
}

// Submit a score to the leaderboard
export async function submitScore({ songId, difficulty, score, maxCombo, level }) {
    if (!sb || !currentUser || score <= 0) return null;
    const username = getStoredUsername() || 'Player';
    try {
        const { data, error } = await sb.from('leaderboard').insert({
            user_id: currentUser.id,
            username,
            song_id: songId,
            difficulty,
            score,
            max_combo: maxCombo,
            level,
        }).select().single();
        if (error) throw error;
        return data;
    } catch (e) {
        console.warn('Failed to submit score:', e.message);
        return null;
    }
}

// Fetch top scores
export async function getLeaderboard({ songId, difficulty, limit = 15 } = {}) {
    if (!sb) return [];
    try {
        let q = sb.from('leaderboard')
            .select('username, score, max_combo, level, created_at')
            .order('score', { ascending: false })
            .limit(limit);
        if (songId) q = q.eq('song_id', songId);
        if (difficulty) q = q.eq('difficulty', difficulty);
        const { data, error } = await q;
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.warn('Failed to fetch leaderboard:', e.message);
        return [];
    }
}

// Get rank for a given score
export async function getPlayerRank({ songId, difficulty, score }) {
    if (!sb) return null;
    try {
        let q = sb.from('leaderboard')
            .select('id', { count: 'exact', head: true })
            .gt('score', score);
        if (songId) q = q.eq('song_id', songId);
        if (difficulty) q = q.eq('difficulty', difficulty);
        const { count, error } = await q;
        if (error) throw error;
        return (count || 0) + 1;
    } catch (e) {
        return null;
    }
}

export function isOnline() {
    return !!sb && !!currentUser;
}
