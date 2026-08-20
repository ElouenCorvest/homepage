// src/routes/sanzowada/+page.server.ts
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from '$env/static/private';

// Helper to get a fresh Access Token using your permanent Refresh Token
async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: SPOTIFY_REFRESH_TOKEN
        })
    });

    return response.json();
}

export async function load() {
    const { access_token } = await getAccessToken();

    // Fetch top tracks with time_range=short_term (last 4 weeks)
    const topTracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });

    const topTracksData = await topTracksRes.json();
    const topTrack = topTracksData.items?.[0] || null;

    return {
        topTrack: topTrack
    };
}