const apiKey = import.meta.env.VITE_OMDB_API_KEY;

document.addEventListener("DOMContentLoaded", () => {
  loadWatchlist();
  setupRemoveButtons();
});

function loadWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const watchlistContainer = document.getElementById("watchlist-container");

  if (watchlist.length === 0) {
    showEmptyWatchlist();
    return;
  }

  watchlistContainer.innerHTML = "";

  // Fetch details for each movie in watchlist
  watchlist.forEach((movieId) => {
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`)
      .then((res) => res.json())
      .then((movie) => {
        displayMovie(movie);
      })
      .catch((error) => console.error("Error:", error));
  });
}

function displayMovie(movie) {
  const watchlistContainer = document.getElementById("watchlist-container");
  
  const posterUrl =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "/img/placeholder-poster.png";

  const movieHTML = `
    <div class="movie-card">
      <img src="${posterUrl}" alt="${movie.Title}" class="movie-poster" onerror="this.src='/img/placeholder-poster.png'">
      <div class="movie-details">
        <div class="movie-header">
          <h3>${movie.Title}</h3>
          <div class="rating">
            <span class="star">⭐</span>
            <span>${movie.imdbRating}</span>
          </div>
        </div>
        <div class="movie-info">
          <span>${movie.Runtime}</span>
          <span>${movie.Genre}</span>
          <button class="remove-watchlist" data-id="${movie.imdbID}">
          <img src="/img/remove-icon.png" alt="Remove"> Remove
        </button>
        </div>
        <p class="movie-plot">${movie.Plot}</p>
      </div>
    </div>
    <div class="divider"></div>
  `;

  watchlistContainer.innerHTML += movieHTML;
}

function setupRemoveButtons() {
  const watchlistContainer = document.getElementById("watchlist-container");

  watchlistContainer.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("remove-watchlist") ||
      e.target.closest(".remove-watchlist")
    ) {
      const button = e.target.closest(".remove-watchlist");
      const movieId = button.dataset.id;
      removeFromWatchlist(movieId);
    }
  });
}

function removeFromWatchlist(movieId) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist = watchlist.filter((id) => id !== movieId);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  loadWatchlist();
}

function showEmptyWatchlist() {
  const watchlistContainer = document.getElementById("watchlist-container");
  watchlistContainer.innerHTML = `
    <p>Your watchlist is looking a little empty...</p>
    <a href="index.html" class="add-movies-link">
        <img src="/img/add.png" alt="Watchlist"> 
        <p>Let's add some movies!</p>
    </a>
    `;
}
