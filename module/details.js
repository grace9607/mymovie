import { BASE_URL, API_KEY } from "./api.js";
import { renderMovieDetails } from "./ui.js";

// URL에서 movieId 추출
function getMovieIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// 영화 상세 정보 가져오기
async function fetchMovieDetails(movieId) {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko&append_to_response=credits`
  );
  const movie = await response.json();

  const movieDetailsElement = document.getElementById("movie-details");
  renderMovieDetails(movieDetailsElement, movie);
}

// 초기 로드
const movieId = getMovieIdFromURL();
if (movieId) {
  fetchMovieDetails(movieId);
} else {
  console.error("Movie ID not found in URL.");
}
