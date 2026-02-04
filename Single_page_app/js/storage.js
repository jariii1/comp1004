const STORAGE_KEY = "musicTrackerTracks";// Key for localStorage

function getTracks() {// Retrieves tracks from localStorage
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveTracks(tracks) {// Saves tracks to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
}
