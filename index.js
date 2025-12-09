const apiKey = import.meta.env.VITE_OMDB_API_KEY;

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("search-button");

  searchBtn.addEventListener("click", () => {
    console.log("Search button clicked");
    const searchTerm = document.getElementById("movie-search").value;
    searchMovies(searchTerm);
  });
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
      }
    })
    .catch((error) => console.error("Error:", error));
}

function displayMovie(movie) {
  const moviesContainer = document.getElementById("movies-container");

  // Create HTML for one movie and add it to the container
  const movieHTML = `
        <div class="movie-card">
            <img src="${movie.Poster}" alt="${movie.Title}" class="movie-poster">
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
                </div>
                 <button class="add-watchlist" data-id="${movie.imdbID}"><img src="/img/add.png" alt="Watchlist"> Watchlist</button>
                <p class="movie-plot">${movie.Plot}</p>
            </div>
        </div>
        <div class="divider"></div>
        
    `;

  moviesContainer.innerHTML += movieHTML;
}
