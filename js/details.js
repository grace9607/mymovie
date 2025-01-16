import "./api.js";
import { BASE_URL, API_KEY, IMAGE_BASE_URL } from "./api.js";
// import './.env';
// import { BASE_URL, API_KEY, IMAGE_BASE_URL } from './.env';

// const DETAIL_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// URL에서 movieId 가져오기
function getMovieIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// 영화 상세 정보 가져오기
async function fetchMovieDetails(movieId) {
  // const options = {
  //     method: 'GET',
  //     headers: {
  //         accept: 'application/json',
  //         Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWE3MDQwM2E1MWZhOGY5ODJhZmQxNTk2MDU3ZDg1YyIsIm5iZiI6MTczNjMxMTc1OC4wNCwic3ViIjoiNjc3ZTAzY2VhNjc3OGFhNWIzN2FmOWJiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.fSIatiyKJSoVWQN0ZcirFgRIt5zbHGXFmnyfj99YI0o'
  //     }
  // };
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko&append_to_response=credits`
  );
  // const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=61a70403a51fa8f982afd1596057d85c&language=ko&append_to_response=credits`);
  const data = await response.json();
  console.log(data);
  // renderMovieDetails(data.results);
  renderMovieDetails(data);
}

// 영화 상세 정보 렌더링
function renderMovieDetails(movie) {
  const {
    title,
    poster_path,
    vote_average,
    overview,
    release_date,
    genres,
    credits,
  } = movie;
  const cast = credits.cast
    .slice(0, 5)
    .map((actor) => actor.name)
    .join(", ");

  const movieDetails = document.getElementById("movie-details");
  movieDetails.innerHTML = `
        <div class="movie-detail-card">
            <img src="${
              poster_path
                ? IMAGE_BASE_URL + poster_path
                : "https://via.placeholder.com/400x600"
            }" alt="${title}">
            <div class="details">
                <h2>${title} <span class="rating">(${vote_average.toFixed(
    1
  )})</span></h2>
                <p class="release-date">Release Date: ${release_date}</p>
                <p class="genres">Genres: ${genres
                  .map((genre) => genre.name)
                  .join(", ")}</p>
                <p class="overview">${overview}</p>
                <p class="cast"><strong>Cast:</strong> ${cast}</p>
            </div>
        </div>
    `;
  //     document.getElementById('poster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  //     document.getElementById('title').textContent = movie.title;
  //     document.getElementById('rating').textContent = movie.vote_average;
  //     document.getElementById('tagline').textContent = movie.tagline || 'No tagline available.';
  //     document.getElementById('overview').textContent = movie.overview || 'No description available.';
  //     document.getElementById('release-date').textContent = movie.release_date;
}

// 초기 로드
const movieId = getMovieIdFromURL();
if (movieId) {
  fetchMovieDetails(movieId);
} else {
  console.error("Movie ID not found in URL.");
}

// 뒤로가기 버튼
// document.getElementById('back-botton').addEventListener('click', () => {
//     window.history.back();
// });

// 초기 실행
// if (movieId) {
//     fetchMovieDetails(movieId);
// } else {
//     alert('Invalid movie ID!');
// }

// 1. 뒤로가기 버튼 생성
function createBackButton() {
  const button = document.createElement("button"); // 버튼 요소 생성
  button.innerText = "뒤로가기"; // 버튼 텍스트
  button.className = "back-button"; // CSS 클래스 추가

  // 클릭 이벤트 연결
  button.addEventListener("click", goBack);

  // body에 버튼 추가
  document.body.prepend(button); // 화면 상단에 추가
}

// 2. 뒤로가기 기능
// function goBack() {
//     const searchQuery = sessionStorage.getItem('searchQuery'); // 저장된 검색어 가져오기
//     if (searchQuery) {
//         // 검색어가 있으면 검색 페이지로 돌아가서 해당 결과를 다시 표시
//         window.location.href = `main.html?query=${searchQuery}`;
//     } else {
//         // 검색어가 없으면 기본 페이지로 돌아가기
//         window.history.back();  // 브라우저 뒤로가기
//     }
// }

function goBack() {
  // // sessionStorage에서 검색어를 초기화
  // sessionStorage.removeItem('searchQuery'); // 검색어 초기화

  // 검색어가 있으면 검색 페이지로 돌아가서 해당 결과를 다시 표시
  const searchQuery = sessionStorage.getItem("searchQuery");
  if (searchQuery) {
    window.location.href = `main.html?query=${searchQuery}`; // 검색 페이지로 이동
  } else {
    // 검색어가 없으면 기본 페이지로 돌아가기 (전체 목록)
    window.location.href = "main.html"; // 인기 영화 목록 페이지로 이동
  }
}

// 3. 페이지 로드 시 버튼 생성
window.onload = function () {
  createBackButton();
};

// 검색된 영화 목록 페이지에서 검색어를 저장하는 코드 (index.html에서 사용)
// function storeSearchQuery(query) {
//     if (query) {
//         sessionStorage.setItem('searchQuery', query); // 검색어를 sessionStorage에 저장
//     }
//     else {

//     }
// }

// // 예시: 검색어를 저장하는 부분 (검색 페이지에서)
// document.addEventListener('DOMContentLoaded', () => {
//     const searchInput = document.getElementById('search-input');
//     const searchButton = document.querySelector('button');

//     if (searchInput && searchButton) {
//         searchButton.addEventListener('click', () => {
//             const query = searchInput.value;
//             if (query) {
//                 storeSearchQuery(query); // 검색어 저장
//                 searchMovies(query);      // 영화 검색 실행
//             }
//             else {
//                 getPopularMovies();
//             }
//         });
//     }
// });
