// ui.js
import { IMAGE_BASE_URL } from "./api.js";

// 북마크 버튼의 상태를 업데이트
export function updateBookmarkButton(button, isBookmarked) {
  button.textContent = isBookmarked ? "💖" : "🤍";
}

// 영화 카드 렌더링
export function createMovieCard(movie, isBookmarked, toggleBookmark) {
  const { id, title, poster_path, vote_average, overview } = movie;

  const movieCard = document.createElement("div");
  movieCard.className = "movie-card";

  movieCard.innerHTML = `
    <img src="${
      poster_path
        ? IMAGE_BASE_URL + poster_path
        : "https://via.placeholder.com/200x300"
    }" alt="${title}">
    <div class="info">
        <h3>${title}</h3>
        <p class="rating">${vote_average.toFixed(1)}</p>
        <p>${
          overview
            ? overview.slice(0, 100) + "..."
            : "No description available."
        }</p>
        <button class="bookmark-btn" data-id="${id}">
            ${isBookmarked ? "💖" : "🤍"}
        </button>
    </div>
  `;

  // 북마크 버튼 이벤트 리스너
  const bookmarkButton = movieCard.querySelector(".bookmark-btn");
  bookmarkButton.addEventListener("click", (event) => {
    event.stopPropagation(); // 상세 페이지 이동 방지
    toggleBookmark(movie);
    updateBookmarkButton(bookmarkButton, !isBookmarked);
  });

  // 영화 카드 클릭 시 상세 페이지로 이동
  movieCard.addEventListener("click", () => {
    window.location.href = `details.html?id=${id}`;
  });

  return movieCard;
}

// 영화 목록 렌더링
export function renderMovies(movieListElement, movies, isMovieBookmarked, toggleBookmark) {
  movieListElement.innerHTML = ""; // 기존 목록 초기화
  movies.forEach((movie) => {
    const isBookmarked = isMovieBookmarked(movie.id);
    const movieCard = createMovieCard(movie, isBookmarked, toggleBookmark);
    movieListElement.appendChild(movieCard);
  });
}

// 상세 페이지 렌더링
export function renderMovieDetails(movieDetailsElement, movie) {
  const { title, poster_path, vote_average, overview, release_date, genres, credits } = movie;
  const cast = credits.cast.slice(0, 5).map((actor) => actor.name).join(", ");

  movieDetailsElement.innerHTML = `
    <div class="movie-detail-card">
        <img src="${
          poster_path
            ? IMAGE_BASE_URL + poster_path
            : "https://via.placeholder.com/400x600"
        }" alt="${title}">
        <div class="details">
            <h2>${title} <span class="rating">(${vote_average.toFixed(1)})</span></h2>
            <p class="release-date">Release Date: ${release_date}</p>
            <p class="genres">Genres: ${genres.map((genre) => genre.name).join(", ")}</p>
            <p class="overview">${overview}</p>
            <p class="cast"><strong>Cast:</strong> ${cast}</p>
        </div>
    </div>
  `;
}
