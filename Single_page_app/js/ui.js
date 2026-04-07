// We store tracks here so sorting can re-use them without re-fetching from Spotify
let currentTracks = [];

/* =======================
   NAVIGATION
======================= */

export function showView(id) {
  document.querySelectorAll(".view").forEach(view => {
    view.classList.toggle("active", view.id === id);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Nav link clicks
  document.querySelectorAll("nav a[data-view]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      showView(link.dataset.view);
    });
  });

  // Sort controls — listen for changes on both dropdowns
  // Whenever either one changes, re-sort and re-render with the current values
  document.getElementById("sortField")?.addEventListener("change", applySort);
  document.getElementById("sortOrder")?.addEventListener("change", applySort);
});


/* =======================
   SORTING
======================= */

function applySort() {
  const field = document.getElementById("sortField").value;
  const order = document.getElementById("sortOrder").value;

  // Make a copy of the array so we don't mutate the original
  // (spread [...] creates a shallow copy)
  const sorted = [...currentTracks].sort((a, b) => {
    // For each field, we extract the value we want to compare
    // Then at the end we apply ascending or descending
    let valA, valB;

    if (field === "title") {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
      // localeCompare handles strings correctly (handles accents, capitals, etc.)
      return order === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    if (field === "artist") {
      valA = a.artists[0].name.toLowerCase();
      valB = b.artists[0].name.toLowerCase();
      return order === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    if (field === "duration") {
      valA = a.duration_ms;
      valB = b.duration_ms;
    }

    if (field === "plays") {
      // Spotify gives us a popularity score (0–100) rather than an exact play count
      valA = a.popularity;
      valB = b.popularity;
    }

    if (field === "year") {
      // release_date can be "2021-03-19" or just "2021" — parseInt handles both
      valA = parseInt(a.album.release_date);
      valB = parseInt(b.album.release_date);
    }

    if (field === "rating") {
      // Spotify has no rating system — skip for now
      return 0;
    }

    // For numbers: ascending = smallest first (a - b), descending = largest first (b - a)
    return order === "asc" ? valA - valB : valB - valA;
  });

  renderTracks(sorted);
}


/* =======================
   TRACK RENDERING
======================= */

// Called from app.js after fetching tracks
// Also stores them in currentTracks so sorting can re-use them
export function renderTracks(tracks) {
  // Only update currentTracks when we get fresh data from Spotify
  // (not when called from applySort, which passes a sorted copy)
  if (tracks !== currentTracks) {
    currentTracks = tracks;
  }

  const list = document.getElementById("trackList");
  list.innerHTML = "";

  if (!tracks || tracks.length === 0) {
    list.innerHTML = "<p style='color: var(--color-text-secondary); padding: 1rem'>No tracks found.</p>";
    return;
  }

  tracks.forEach((track) => {
    const li = document.createElement("li");
    li.className = "track";

    const artistName = track.artists[0].name;
    const albumArt = track.album.images[0]?.url;
    const duration = msToMinutes(track.duration_ms);
    const year = track.album.release_date?.slice(0, 4); // "2021-03-19" → "2021"

    li.innerHTML = `
      <img src="${albumArt}" alt="Album art" class="track-art">
      <div class="track-info">
        <span class="track-title">${track.name}</span>
        <span class="track-artist">${artistName}</span>
      </div>
      <span class="track-year">${year}</span>
      <span class="track-duration">${duration}</span>
    `;

    list.appendChild(li);
  });
}

/* =======================
   ALBUM RENDERING
======================= */
// Similar to renderTracks but for albums instead of tracks
export function renderAlbums(albums) {
  const list = document.getElementById("albumList");
  list.innerHTML = "";

  if (!albums || albums.length === 0) {
    list.innerHTML = "<p style='color: var(--color-text-secondary); padding: 1rem'>No albums found.</p>";
    return;
  }

  albums.forEach((album) => {
    const li = document.createElement("li");
    li.className = "album";

    const artistName = album.artists[0].name;
    const albumArt = album.images[0]?.url;
    const year = album.release_date?.slice(0, 4);
    
    li.innerHTML = `
      <img src="${albumArt}" alt="Album art" class="album-art">
      <div class="album-info">
        <span class="album-title">${album.name}</span>
        <span class="album-artist">${artistName}</span>
      </div>
      <span class="album-year">${year}</span>
    `;

    list.appendChild(li);
  });
}

/* =======================
   PLAYLIST RENDERING
======================= */
//playlist rendering would be similar, but playlists don't have a duration or release year, so we'd show different info (like number of tracks) and render to a different list element.
export function renderPlaylists(playlists) {
  const list = document.getElementById("playlistList");
  list.innerHTML = "";

  if (!playlists || playlists.length === 0) {
    list.innerHTML = "<p style='color: var(--color-text-secondary); padding: 1rem'>No playlists found.</p>";
    return;
  }

  playlists.forEach((playlist) => {
    const li = document.createElement("li");
    li.className = "playlist";

    const playlistArt = playlist.images[0]?.url;
    
    li.innerHTML = `
      <img src="${playlistArt}" alt="Playlist art" class="playlist-art">
      <div class="playlist-info">
        <span class="playlist-title">${playlist.name}</span>
        <span class="playlist-tracks">${playlist.tracks.total} tracks</span>
      </div>
    `;

    list.appendChild(li);
  });
}

// Converts milliseconds → "m:ss"  e.g. 217000 → "3:37"
function msToMinutes(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
