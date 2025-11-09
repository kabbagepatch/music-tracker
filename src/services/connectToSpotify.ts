const CLIENT_ID = '8c02f3ab3b3c434382158a7002d555f7';
const REDIRECT_URI =  window.location.origin; // 'http://[::1]:1420';

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-top-read",
  "playlist-read-private",
];

const currentToken = {
  get access_token() { return localStorage.getItem('access_token') || null; },
  get refresh_token() { return localStorage.getItem('refresh_token') || null; },
  get expires_in() { return localStorage.getItem('refresh_in') || null },
  get expires() { return localStorage.getItem('expires') || null },

  save: function (response : any) {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('expires_in', expires_in);

    const now = new Date();
    const expiry = new Date(now.getTime() + (expires_in * 1000));
    localStorage.setItem('expires', expiry.toString());
  }
};

const generateRandomString = (length : number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain : string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

const base64encode = (input : ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const conntectToSpotify = async () => {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed);

  localStorage.removeItem('access_token');

  window.localStorage.setItem('code_verifier', codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    scope: scopes.join(' '),
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  const authUrl = new URL(authorizationEndpoint);
  authUrl.search = params.toString();
  window.location.href = authUrl.toString();
}

export const getUserAccessToken = async (code : string = '') => {
  const existingToken = localStorage.getItem('access_token');
  if (existingToken) {
    return existingToken;
  }

  if (!code) {
    console.log("No code found in URL.");
    return null;
  }
  console.log("Code found:", code);

  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  const updatedUrl = url.search ? url.href : url.href.replace('?', '');
  window.history.replaceState({}, document.title, updatedUrl);

  // stored in the previous step
  const codeVerifier = localStorage.getItem('code_verifier') || '';

  const tokenEndpoint = "https://accounts.spotify.com/api/token";
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  }

  const body = await fetch(tokenEndpoint, payload);
  const response = await body.json();

  console.log("Token response:", response);
  localStorage.setItem('access_token', response.access_token);
}

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code') || '';
await getUserAccessToken(code);
