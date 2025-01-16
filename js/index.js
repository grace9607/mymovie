import { API_KEY, BASE_URL, IMAGE_BASE_URL, LANGUAGE } from "./index-api.js";
import { setupLogoEvent, toggleBookmark, isMovieBookmarked } from "./index-ui.js";

let currentPage = 1; // 현재 페이지를 추적하는 변수
let isLoading = false; // 데이터 로딩 중인지 여부를 추적하는 변수
let isSearchMode = false; // 검색 모드인지 여부를 추적하는 변수
let searchQuery = ""; // 검색어를 저장하는 변수

// 외부 상태 관리 객체
const state = {
  isSearchMode: { value: false },
  currentPage: { value: 1 },
  searchQuery: { value: "" },
};

// 로고 클릭 이벤트 설정
setupLogoEvent({
  isSearchMode: state.isSearchMode,
  currentPage: state.currentPage,
  searchQuery: state.searchQuery,
  updateURL,
  getPopularMovies,
});

// 검색어 저장 및 URL 업데이트 함수
function updateURL(query) {
  const url = new URL(window.location.href); // 현재 URL
  if (query) {
    url.searchParams.set("query", query); // 검색어가 있으면 query 파라미터를 설정
  } else {
    url.searchParams.delete("query"); // 검색어가 없으면 query 파라미터를 삭제
    isSearchMode = false;
  }
  window.history.pushState({}, "", url); // URL을 새로 갱신
}

// 영화목록 렌더링
function renderMovies(movies) {
  const movieList = document.getElementById("movie-list");
  //  movieList.innerHTML = '';  기존 영화 목록 초기화하지 않음!!

  movies.forEach((movie) => {
    const { id, title, poster_path, vote_average, overview } = movie;

    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";

    // 북마크 여부 확인 (localStorage에 저장된 상태인지 0115)
    const isBookmarked = isMovieBookmarked(id);

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
                <!-- 북마크 버튼 추가 --> 
                <button class="bookmark-btn" data-id="${id}">
                    ${isBookmarked ? "💖" : "🤍"}
                </button>
            </div>
        `;

    // ✅ 영화 카드 클릭 시 상세 페이지 이동
    movieCard.addEventListener("click", (event) => {
      if (!event.target.classList.contains("bookmark-btn")) {
        // window.location.href = `details.html?id=${id}`;
        // 모달 열리도록 수정
        openModal(id);
      }
    });

    // ✅ 북마크 버튼 클릭 이벤트 추가
    movieCard
      .querySelector(".bookmark-btn")
      .addEventListener("click", (event) => {
        event.stopPropagation(); // 상세 페이지 이동 방지
        toggleBookmark(movie);

        const isBookmarked = isMovieBookmarked(movie.id); // 상태 확인 후 업데이트
        event.target.textContent = isBookmarked ? "💖" : "🤍";

      });

    // ✅ 영화 카드를 목록에 추가
    movieList.appendChild(movieCard);
  });
}

// 인기 영화 목록 가져오기 (popular) 수정 노 필요
async function getPopularMovies() {
  if (isLoading) return; // 데이터 로딩 중이면 요청을 방지
  isLoading = true; // 로딩 상태로 설정

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWE3MDQwM2E1MWZhOGY5ODJhZmQxNTk2MDU3ZDg1YyIsIm5iZiI6MTczNjMxMTc1OC4wNCwic3ViIjoiNjc3ZTAzY2VhNjc3OGFhNWIzN2FmOWJiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.fSIatiyKJSoVWQN0ZcirFgRIt5zbHGXFmnyfj99YI0o",
    },
  };

  const response = await fetch(
    `${BASE_URL}/movie/popular?language=${LANGUAGE}&page=${currentPage}`,
    options
  );
  const data = await response.json();
  console.log(data);
  renderMovies(data.results);

  // 페이지 번호 증가
  // currentPage++;
  isLoading = false; // 로딩 종료
}

async function searchMovies() {
    const query = document.getElementById("search-input").value;

  if (!query) {
    isSearchMode = false;
    currentPage = 1;
    getPopularMovies();
    updateURL(""); // URL에서 query 파라미터 삭제
    return;
  }

  isSearchMode = true;
  searchQuery = query;
  currentPage = 1; // 검색 시에는 첫 페이지부터 시작

  // 해당 기능 비활성화
  sessionStorage.setItem("searchQuery", query);

  // URL 갱신
  updateURL(query);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MWE3MDQwM2E1MWZhOGY5ODJhZmQxNTk2MDU3ZDg1YyIsIm5iZiI6MTczNjMxMTc1OC4wNCwic3ViIjoiNjc3ZTAzY2VhNjc3OGFhNWIzN2FmOWJiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.fSIatiyKJSoVWQN0ZcirFgRIt5zbHGXFmnyfj99YI0o",
    },
  };

  const response = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(
      query
    )}&language=${LANGUAGE}&page=1`,
    options
  );
  const data = await response.json();

  // 검색 시에만 목록 초기화 (0115A)
  if (currentPage === 1) {
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = "";
  }

  // 검색 결과가 없으면 전체 목록을 가져옵니다.
  if (data.results.length === 0) {
    alert("검색 결과가 없습니다. 전체 영화 목록을 로드합니다.");
    getPopularMovies();
  } else {
    renderMovies(data.results);
  }

  // 검색 버튼 클릭 시 이벤트 리스너
  const searchButton = document.querySelector("button");
  const searchInput = document.getElementById("search-input");

  if (searchButton && searchInput) {
    searchButton.addEventListener("click", () => {
      searchMovies(searchInput.value);
    });

    // 엔터키로 검색할 수 있도록 처리
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchMovies();
      }
    });
  }

  createLoadMoreButton();
}

// [더 보기] 버튼 생성
function createLoadMoreButton() {
  const loadMoreButton = document.createElement("button");
  loadMoreButton.textContent = "더 보기";
  loadMoreButton.className = "load-more-button";

  // 버튼 클릭 시 페이지 번호 증가 및 새로운 영화 로드
  loadMoreButton.addEventListener("click", () => {
    // event.preventDefault();
    currentPage++; // 페이지 번호 증가
    // getPopularMovies();  // 새로운 페이지 영화 로드
    if (isSearchMode) {
      searchMovies(); // 검색 모드에서 더 보기 버튼 클릭 시 검색 결과 로드
    } else {
      getPopularMovies(); // 인기 영화 목록에서 더 보기 버튼 클릭 시 인기 영화 목록 로드
    }
  });

  // 이미 [더 보기] 버튼이 있다면 추가하지 않도록 체크
  const existingButton = document.querySelector(".load-more-button");
  if (!existingButton) {
    document.body.appendChild(loadMoreButton); // 버튼을 화면에 추가
  }
}

// 페이지가 로드될 때 북마크 목록을 화면에 출력
window.onload = function () {

  const storedQuery = sessionStorage.getItem("searchQuery"); // 저장된 검색어 가져오기
  const searchInput = document.getElementById("search-input");

  if (storedQuery) {
    searchInput.value = storedQuery; // 검색어 필드에 검색어 입력
    searchMovies(storedQuery); // 저장된 검색어로 검색 실행
  } else {
    // 검색어가 없으면 인기 영화 목록 로드
    getPopularMovies();
  }

  // 검색 버튼 클릭 시 이벤트 리스너
  const searchButton = document.querySelector("button");
  if (searchButton && searchInput) {
    searchButton.addEventListener("click", () => {
      searchMovies(searchInput.value);
    });

    // 엔터키로 검색도 가능하도록 처리
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchMovies(searchInput.value);
      }
    });
  }

  createLoadMoreButton(); // '더 보기' 버튼 생성
};


// 모달 코드 처음 라인
// 모달 요소 가져오기
const modal = document.getElementById("movie-modal");
const modalContent = document.getElementById("modal-movie-details");
const closeModalButton = document.querySelector(".close-btn");

// 모달 열기 함수
function openModal(movieId) {
  fetchMovieDetails(movieId); // 영화 상세 정보 가져오기
  modal.classList.remove("hidden");
  modal.style.display = "block"; 
}

// 모달 닫기 함수
function closeModal() {
  modal.classList.add("hidden");
  modal.style.display = "none"; // 모달 숨기기
  modalContent.innerHTML = ""; // 모달 내용을 초기화
}

// 상세 정보 가져오기
async function fetchMovieDetails(movieId) {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko&append_to_response=credits`
  );
  const data = await response.json();
  renderMovieDetails(data);
}

// 영화 상세 정보 렌더링
function renderMovieDetails(movie) {
  console.log("상세정보 렌더링 시작");
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

  modalContent.innerHTML = `
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
    console.log("여기까지?");
}

// 이벤트 리스너 추가
closeModalButton.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal(); // 모달 외부 클릭 시 닫기
  }
});
// 모달 코드 마지막 라인