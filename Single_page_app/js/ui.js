function renderTracks(tracks) {// Renders the list of tracks in the UI
  const list = document.getElementById("trackList");
  list.innerHTML = "";

  tracks.forEach((track, index) => {//  Create list item for each track
    const li = document.createElement("li");
    li.className = "track";

    li.innerHTML = `
      <span>${track.title} – ${track.artist}</span>
      <button onclick="removeTrack(${index})">✕</button>
    `;
/* =======================
   NAVIGATION
======================= */

// Wait for the page to fully load before touching the DOM
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a[data-view]");

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetView = link.dataset.view;
      showView(targetView);
    });
  });
});

// Shows one view and hides all others
// Called from app.js too — that's why it's a named function, not just inline code
function showView(id) {
  document.querySelectorAll(".view").forEach(view => {
    view.classList.toggle("active", view.id === id);
  });
}


/* =======================
   TRACK RENDERING
======================= */

// Takes an array of Spotify track objects and displays them in #trackList
function renderTracks(tracks) {
  const list = document.getElementById("trackList");
  list.innerHTML = "";

  // If no tracks came back, show a message instead of a blank list
  if (!tracks || tracks.length === 0) {
    list.innerHTML = "<p>No tracks found.</p>";
    return;
  }

  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.className = "track";

    // Spotify track structure:
    // track.name            → the song title
    // track.artists         → array of artists (a song can have more than one)
    // track.artists[0].name → the main artist
    // track.album.images[0].url → album art (first image is the largest)
    // track.duration_ms     → length in milliseconds — we convert it to m:ss below

    const artistName = track.artists[0].name;
    const albumArt = track.album.images[0]?.url;
    const duration = msToMinutes(track.duration_ms);

    li.innerHTML = `
      <img src="${albumArt}" alt="Album art" class="track-art">
      <div class="track-info">
        <span class="track-title">${track.name}</span>
        <span class="track-artist">${artistName}</span>
      </div>
      <span class="track-duration">${duration}</span>
      <button class="track-remove" onclick="removeTrack(${index})">✕</button>
    `;

    list.appendChild(li);
  });
}

// Converts milliseconds to a readable m:ss format
// e.g. 217000 → "3:37"
function msToMinutes(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  // padStart(2, "0") makes sure seconds always shows two digits: "3:07" not "3:7"
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
    list.appendChild(li);
  });
}
