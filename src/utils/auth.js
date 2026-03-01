const REDIRECT_URI = "http://127.0.0.1:5173/callback";

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", REDIRECT_URI);
    params.append("scope", "user-read-private user-read-email user-top-read user-read-recently-played user-read-currently-playing user-read-playback-state");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    console.log("Redirecting to Spotify with URI:", REDIRECT_URI);
    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");
    console.log("getAccessToken called. Verifier:", verifier, "Code:", code);

    if (!verifier) {
        console.error("No code verifier found in localStorage");
        return null;
    }

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("code_verifier", verifier);

    try {
        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        const response = await result.json();
        console.log("Spotify Token Response:", response);

        if (!result.ok) {
            console.error("Token exchange failed:", response);
            return null;
        }

        if (response.access_token) {
            localStorage.setItem("access_token", response.access_token);
            // Set expiry if needed, but for now simple storage
        }
        return response.access_token;
    } catch (error) {
        console.error("Network error during token exchange:", error);
        return null;
    }
}
