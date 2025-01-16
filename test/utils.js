// import { currentPage } from "./index.js"

// 로고 요소 가져오기
const logo = document.getElementById("logo");

// 로고 클릭 이벤트 핸들러 함수
function handleLogoClick(e, { isSearchMode, currentPage, searchQuery, updateURL, getPopularMovies }) {
    e.preventDefault();

    isSearchMode.value = false; // 외부 상태를 객체로 관리
    currentPage.value = 1;
    // currentPage = 1;
    searchQuery.value = "";

    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";
    
    sessionStorage.removeItem("searchQuery");
    updateURL("");

    // 기존 영화 목록 초기화
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = ""; // 기존 영화 목록 제거

    getPopularMovies(); // 인기 영화 호출
    window.scrollTo(0, 0); // 화면 맨 위로 이동
}

// 로고 클릭 이벤트 설정 함수
export function setupLogoEvent({ isSearchMode, currentPage, searchQuery, updateURL, getPopularMovies }) {
    logo.addEventListener("click", (e) =>
        handleLogoClick(e, { isSearchMode, currentPage, searchQuery, updateURL, getPopularMovies })
    );
}


// [더 보기] 버튼 생성
export function createLoadMoreButton({ currentPage, isSearchMode, searchMovies, getPopularMovies }) {
    const loadMoreButton = document.createElement("button");
    loadMoreButton.textContent = "더 보기";
    loadMoreButton.className = "load-more-button";
  
    // 버튼 클릭 시 페이지 번호 증가 및 새로운 영화 로드
    loadMoreButton.addEventListener("click", () => {
      // event.preventDefault();
      currentPage++; // 페이지 번호 증가
    //   getPopularMovies();  // 새로운 페이지 영화 로드
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