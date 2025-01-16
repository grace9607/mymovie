// 로고 요소 가져오기
const logo = document.getElementById("logo");

// 로고 클릭 이벤트 핸들러 함수
function handleLogoClick(e, { isSearchMode, currentPage, searchQuery, updateURL, getPopularMovies }) {
    e.preventDefault();

    isSearchMode.value = false; // 외부 상태를 객체로 관리
    currentPage.value = 1;
    searchQuery.value = "";

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

// 특정 영화가 북마크되어 있는지 확인
export function isMovieBookmarked(movieId) {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    return bookmarks.some((movie) => movie.id === movieId);
}

// 북마크 추가 및 해제 기능
export function toggleBookmark(movie) {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (isMovieBookmarked(movie.id)) {
      bookmarks = bookmarks.filter((item) => item.id !== movie.id); // 이미 북마크 되어 있으면 제거
    } else {
      bookmarks.push(movie); // 북마크 안 되어 있으면 추가
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

