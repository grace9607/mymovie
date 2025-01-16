import { API_KEY, BASE_URL, IMAGE_BASE_URL, LANGUAGE, DUMMY_BASE_URL } from "./api.js";

// 모달 요소 가져오기
const modal = document.getElementById("movie-modal");
const modalContent = document.getElementById("modal-movie-details");
const closeModalButton = document.querySelector(".close-btn");

// 모달 열기 함수
export function openModal(movieId) {
  fetchMovieDetails(movieId); // 영화 상세 정보 가져오기
  modal.classList.remove("hidden");
  modal.style.display = "block"; 
}

// 모달 닫기 함수
export function closeModal() {
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
export function renderMovieDetails(movie) {
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
                : `"${DUMMY_BASE_URL}/400x600/000/fff&text=No+Image"`
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
}

// 이벤트 리스너 추가
closeModalButton.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal(); // 모달 외부 클릭 시 닫기
  }
});
// 모달 코드 마지막 라인