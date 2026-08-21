// src/routes/sanzowada/+page.server.ts
import { HEVY_API_KEY, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN, TMDB_API_KEY } from '$env/static/private';

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
    // Spotify
    const { access_token } = await getAccessToken();

    // Fetch top tracks with time_range=short_term (last 4 weeks)
    const topTracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });

    const topTracksData = await topTracksRes.json();
    const topTrack = topTracksData.items?.[0] || null;

    // Hevy
    const hevyRes = await fetch('https://api.hevyapp.com/v1/workouts?page=1&pageSize=1', {
        method: 'GET', // Standard practice is to capitalize HTTP methods
        headers: {
            'api-key': HEVY_API_KEY 
        }
    });

    // TMDB
    const tmdbRes = await fetch('https://api.themoviedb.org/3/trending/movie/week?language=en-US', {
        method: 'GET', // Standard practice is to capitalize HTTP methods
        headers: {
            "Authorization": 'Bearer ' + TMDB_API_KEY
        }
    });

    const rawText = await hevyRes.text();
    const hevyData = JSON.parse(rawText)
    const hevyLastWorkout = hevyData.workouts[0]
    const tmdbData = await tmdbRes.json();
    const tmdbTrendingMovies = tmdbData.results || null;
    const topFiveMovies = tmdbTrendingMovies
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 5);
    console.log(topFiveMovies)
    
    return {
        topTrack: topTrack,
        hevyLastWorkout: hevyLastWorkout,
        topFiveMovies: topFiveMovies
    };
}