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

    list.appendChild(li);
  });
}
