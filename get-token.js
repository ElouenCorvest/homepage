// get-token.js
const clientId = "95fff7c44e02482a903e863f78271e05";
const clientSecret = "649ee66a88c54234a4739caa3d76d70d";

// Paste the long code you just copied from the URL bar
const code = "AQCkM6nmMJ5kwtIjuG5c9_AeyQFjLdRCVm3AIYsWM1x5cHLHUl04MK7rZOFJ8R_X-1ZX4sqw1Yk--8vyZznKNKK_dBsQYm-hUHAM_didksKPyUbmtTMWxkbRSL3mKPbRF-aoXoFKkWTuslsdi9HMs29OcdWxVxb00vhs4boB_RkW28kua4L7ZOl9e5MlqE8wms9FQNVoqe5qH8FuE9VkV2PSvNpwA4bM2bn2Bn6eTNrLmeQSqkg"; 

async function getTokens() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            // THIS MUST MATCH EXACTLY:
            redirect_uri: 'https://example.com/callback' 
        })
    });

    const data = await response.json();
    console.log("👇 HERE ARE YOUR TOKENS 👇\n");
    console.log(data);
}

getTokens();