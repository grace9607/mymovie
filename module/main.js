import { BASE_URL, LANGUAGE } from "./api.js";
import { renderMovies } from "./ui.js";

let currentPage = 1; // 현재 페이지
let isLoading = false; // 로딩 상태
let isSearchMode = false; // 검색 모드
let searchQuery = ""; // 검색어

// 북마크 추가/제거
function toggleBookmark(movie) {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  const index = bookmarks.findIndex((item) => item.id === movie.id);

  if (index > -1) {
    bookmarks.splice(index, 1); // 제거
  } else {
    bookmarks.push(movie); // 추가
  }

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

// 북마크 상태 확인
function isMovieBookmarked(movieId) {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  return bookmarks.some((movie) => movie.id === movieId);
}

// 인기 영화 가져오기
async function getPopularMovies() {
  if (isLoading) return;
  isLoading = true;

  const response = await fetch(
    `${BASE_URL}/movie/popular?language=${LANGUAGE}&page=${currentPage}`,
    { headers: { accept: "application/json" } }
  );
  const data = await response.json();

  const movieList = document.getElementById("movie-list");
  renderMovies(movieList, data.results, isMovieBookmarked, toggleBookmark);

  isLoading = false;
}

window.onload = function () {
  getPopularMovies();
};
