const apiKey = import.meta.env.VITE_OMDB_API_KEY;

document.addEventListener("DOMContentLoaded", () => {
  setupSearchButton();
  setupWatchlistButton();
});

function searchMovies(searchTerm) {
  // First fetch: Get list of movies matching search term
  fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.Search) {
        // Clear the container and show each movie
        const moviesContainer = document.getElementById("movies-container");
        moviesContainer.innerHTML = "";

        // Loop through each movie in search results
        data.Search.forEach((movie) => {
          // Second fetch: Get full details for this specific movie
          fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
            .then((res) => res.json())
            .then((detailedMovie) => {
              displayMovie(detailedMovie);
            });
        });
      } else {
        showMessage(
          "Unable to find what you're looking for. Please try another search."
        );
      }
    })
    .catch((error) => console.error("Error:", error));
}

function setupSearchButton() {
  const searchBtn = document.getElementById("search-button");

  searchBtn.addEventListener("click", () => {
    console.log("Search button clicked");
    const searchInput = document.getElementById("movie-search");
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) return showEmptySearchMessage();

    searchMovies(searchTerm);
    searchInput.value = ""; 
  });
}

function setupWatchlistButton() {
  const moviesContainer = document.getElementById("movies-container");

  moviesContainer.addEventListener("click", (e) => {
    console.log("Movies container clicked");
    if (e.target.classList.contains("add-to-watchlist-btn")) {
      const movieId = e.target.dataset.id;
      addToWatchlist(movieId);
    }
  });
}

function displayMovie(movie) {
  const moviesContainer = document.getElementById("movies-container");

  // Use placeholder if poster is N/A or invalid
  const posterUrl =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "/img/placeholder-poster.png";

  // Create HTML for one movie and add it to the container
  const movieHTML = `
        <div class="movie-card">
            <img loading="lazy" src="${posterUrl}" alt="${movie.Title}" class="movie-poster" onerror="this.src='/img/placeholder-poster.png'">
            <div class="movie-details">
                <div class="movie-header">
                    <h3>${movie.Title}</h3>
                    <div class="rating">
                        <span class="star"><img src="/img/star.png" alt="star"></span>
                        <span>${movie.imdbRating}</span>
                    </div>
                </div>
                <div class="movie-info">
                    <span>${movie.Runtime}</span>
                    <span>${movie.Genre}</span>
                    <button class="add-to-watchlist-btn" data-id="${movie.imdbID}"><img src="/img/add.png" alt="Watchlist"> Watchlist</button>
                </div>
                 
                <p class="movie-plot">${movie.Plot}</p>
            </div>
        </div>
        <div class="divider"></div>
        
    `;

  moviesContainer.innerHTML += movieHTML;
}

// Show message with icon (for no results found)
function showMessage(message) {
  const moviesContainer = document.getElementById("movies-container");
  moviesContainer.innerHTML = `
    <img src="./img/movie-icon.png" alt="film icon" class="film-icon" />
    <p>${message}</p>
  `;
}

// Show message without icon (for empty search)
function showEmptySearchMessage() {
  const moviesContainer = document.getElementById("movies-container");
  moviesContainer.innerHTML = `
    <p>Unable to find what you're looking for. Please try another search.</p>
  `;
}

//Add a movie to watchlist using local storage
function addToWatchlist(movieId) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (!watchlist.includes(movieId)) {
    watchlist.push(movieId);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    showToast("Added to watchlist!");
  } else {
    showToast("Already in your watchlist");
  }
}

function showToast(message) {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => toast.classList.add('show'), 50);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
