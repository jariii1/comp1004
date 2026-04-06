document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault()

    const target = link.dataset.view

    document.querySelectorAll(".view").forEach(v => {
      v.classList.remove("active")
    })const clientId = "5a77f12758da4c94a068385d5745ea5a";
const redirectUri = "http://127.0.0.1:5173/";
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-recently-played"
].join(" ");

const app = document.getElementById("app");

/* =======================
   SPA ENTRY POINT ************works
======================= */

init();

async function init() {
  const code = new URLSearchParams(window.location.search).get("code");

  document
    .getElementById("spotify-button")
    ?.addEventListener("click", login);

   // If there's no code in the URL, the user hasn't logged in yet — stop here
  if (!code) return;

    try {
    const token = await getAccessToken(code);
 
    // Save the token so it survives page refreshes
    localStorage.setItem("access_token", token);
 
    // Clean the code from the URL bar (looks tidier, avoids reuse issues)
    window.history.replaceState({}, document.title, "/");
 
    // Fetch the user's top tracks from Spotify
    const topTracks = await fetchTopTracks(token);
 
    // Pass the tracks to ui.js to display them
    renderTracks(topTracks);
 
    // Switch the view to the library so the user sees it immediately
    showView("library");
 
  } catch (err) {
    console.error("Something went wrong during init:", err);
  }
}



/* =======================
   AUTH ****************works
======================= */
async function login() {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
    code_challenge_method: "S256",
    code_challenge: challenge
  });

  window.location = `https://accounts.spotify.com/authorize?${params}`;
}

 
async function getAccessToken(code) {
  const verifier = localStorage.getItem("verifier");

localStorage.setItem("access_token", token);

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier
  });
  

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!res.ok) throw new Error("Failed to get access token");

  const data = await res.json();
  return data.access_token;
}


/* =======================
   PKCE HELPERS
======================= */

function generateCodeVerifier(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/* =======================
   SPOTIFY DATA FETCHING
======================= */

//fetches the user's top tracks from Spotify
//limit it to 20 tracks for better performance and UI display
async function fetchTopTracks(token) {
  const res = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=20", {
    headers: { Authorization: `Bearer ${token}` }
  });

  // If the response isn't OK, throw an error to be caught in init()
  if (!res.ok) throw new Error("Failed to fetch top tracks");

  // Extract the track items from the response and return them
  const data = await res.json();
  return data.items;
}

    document.getElementById(target).classList.add("active")
  })
})


// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'undefined';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

async function getTopTracks(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
  )).items;
}

const topTracks = await getTopTracks();
console.log(
  topTracks?.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);
