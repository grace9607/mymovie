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







// // 북마크 추가/제거 함수
// export function toggleBookmark(movie) {
//     const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
//     const index = bookmarks.findIndex((item) => item.id === movie.id);
  
//     if (index !== -1) {
//       // 이미 북마크된 경우 제거
//       bookmarks.splice(index, 1);
//     } else {
//       // 북마크 추가
//       bookmarks.push(movie);
//     }
  
//     localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
//   }
  
//   // 북마크 여부 확인 함수
//   export function isMovieBookmarked(movieId) {
//     const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
//     return bookmarks.some((item) => item.id === movieId);
//   }
  
//   // 모든 북마크 가져오기
//   export function getAllBookmarks() {
//     return JSON.parse(localStorage.getItem("bookmarks")) || [];
//   }