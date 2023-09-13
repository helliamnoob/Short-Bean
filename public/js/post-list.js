import { jwtToken } from '../util/isLogin.util.js';

// 게시글 리스트
window.addEventListener('DOMContentLoaded', async function () {
  if (!jwtToken) {
    alert('로그인 후 이용가능한 서비스입니다.');
    window.location.href = `/`;
  }
  fetch('/api/post', {})
    .then((response) => response.json())
    .then((data) => {
      let rows = data.data;
      console.log(data);
      const postBox = document.getElementById('posts-box');
      rows.forEach((post) => {
        let title = post['title'];
        let content = post['content'];
        let subject = post['subject'];

        let temp_html = `<div class="solo-card">
        <div class="card w-75">
      <div class="card">
      <div class="card-body">
      
      <h5 class="card-title">제목: ${title}</h5>
      <p class="card-text">${content}</p>
      <p class="card-text">과목: ${subject}</p>
      </div>
      </div>
      </div>`;
        postBox.insertAdjacentHTML('beforeend', temp_html);

        // 게시글 리스트 클릭하면 상세페이지로-!
        const cardBodyElements = document.querySelectorAll('.card-body');

        cardBodyElements.forEach((cardBodyElement, index) => {
          cardBodyElement.addEventListener('click', function (event) {
            window.location.href = `/public/views/post.html?post_id=${rows[index].post_id}`;
          });
        });
      });
    });
});

// 페이지네이션
const placePerPage = 10; // 페이지 당 갯수

const getTotalPageCount = () => {
  return Math.ceil(data.length / COUNT_PER_PAGE);
};

//----------------------------------
// 검색 기능
// async function search() {
//   //검색으로 새로 불러오는 데이터
//   let { results: movies } = await getMovies();
//   let inputtext;
//   inputtext = document.getElementById('search-input').value.toUpperCase(); // 대문자 변환해서 입력받은 데이터 할당

//   //검색 유효성 검사
//   if (inputtext.trim() === '') {
//     alert('검색어를 입력해주세요.');
//     return;
//   }

//   const searchData = movies.filter((x) => {
//     let a = x.title.toUpperCase();
//     return a.includes(inputtext);
//   }); // title 도 대문자로 includes로 문자열이 포함되어있으면 serchData로 반환

//   setpage(searchData);
// }

//
// const setpage = function (arr) {
//   // 데이터를 찍는 함수
//   let html = '';

//   arr.forEach((x) => {
//     let htmlSegment = `
//         <div id="${x.id}" class="post-card">
//             <img src=`${res.post_id.image}`>
//             <h3>${x.title}</h5>
//             <p>${x.subject}</p>

//         </div>
//     `;
//     html += htmlSegment;
//   });

//   let container = document.querySelector('.card-list');
//   container.innerHTML = html;
// };

// // 검색 기능
// window.onload = function () {
//   //실행될 코드
//   let allQuestionList;

//   const options = {
//     method: 'GET',
//     headers: {
//       accept: 'application/json',
//       Authorization:
//         'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZTExODAzMzVhNGE2NzMxMTJlOTg1ZDQzZTUxMjMyYyIsInN1YiI6IjY0NzU3YWViOTI0Y2U2MDExNmM1ZmM3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LsITjGVhhqpYuf7KH_NEVSX7r45y_7tMtZ7OFN3UgCk',
//     },
//   };

//   fetch('/api/post', {}).then((response) => {
//     return response.json();
//   });
//   // .then((data) => {
//   //   //가져온 데이터 사용
//   //   let movies = data.results;
//   //   globalMovies = data.results;

//   //   renderMovieCards(movies);

//   let rows = data.data;
//   console.log(data);
//   const postBox = document.getElementById('posts-box');
//   rows.forEach((post) => {
//     let title = post['title'];
//     let content = post['content'];
//     let subject = post['subject'];
//     let image = post['image'];

//     //검색어 입력값 가져오기
//     var searchInput = document.getElementById('search-input');
//     console.log('searchInput:', searchInput);

//     var searchBtn = document.getElementById('search-btn');

//     // movies = movies.filter(movie => movie.title.includes(searchInput))
//     // renderMovieCards(movies);

//     //영화 검색, 대소문자 구분 안함
//     //영화 검색, 대소문자 구분 안함
//     //영화 검색, 대소문자 구분 안함 => alt + shift + 아래 화살표 키

//     searchInput.addEventListener('change', (e) => {
//       console.log(e.target.value);
//       const searchInputvalue = e.target.value;
//       var searchResults = movies.filter((post) => {
//         return post.title.toLowerCase().includes(searchInputvalue.toLowerCase());
//       });
//       renderMovieCards(searchResults);
//     });
//     // renderMovieCards(searchResults);
//   });
// };
//영화 카드 리스트 UI 업데이트
//searchResults배열은 검색어와 일치하는 영화
// renderMovieCards(searchResults);

// 검색 이벤트 리스너 등록
// var searchForm = document.querySelector('.search');
// searchForm.addEventListener('submit', handleSearch);

//영화 카드 리스트 UI 업데이트
//   function renderMovieCards(movies) {
//     var cardContainer = document.querySelector('.card-container');
//     cardContainer.innerHTML = ''; //기존 카드 제거
//     let a = [];

//     var searchInput = document.getElementById('search-input').value;
//     movies.forEach((movie) => {
//       // if (searchInput === movie.title) {

//       var id = movie.id;
//       var title = movie.title;
//       var overview = movie.overview;
//       var posterPath = movie.poster_path;
//       var voteAverage = movie.vote_average;
//       var movieId = movie.id; //영화 id 추가

//       //이미지 주소
//       var imgPath = 'https://image.tmdb.org/t/p/w500' + posterPath;

//       //새로운 카드 요소 생성
//       // var newCard = document.createElement('div');
//       // newCard.className = 'movie-card';
//       const html = `
//                   <div class="movie-card">
//                       <img src="${imgPath}" alt="${title}" data-id="${id}"/>
//                       <h2>${title}</h2>
//                       <p>${overview}</p>
//                       <span>평점: ${voteAverage}</span>
//                   </div>
//               `;
//       a.push(html);
//       //     newCard.innerHTML = `
//       //     <img src="${imgPath}" alt="${title}" data-id="${id}"/>
//       //     <h2>${title}</h2>
//       //     <p>${overview}</p>
//       //     <span>평점: ${voteAverage}</span>
//       // `;

//       //카드를 카드 컨테이너에 추가
//       // cardContainer.appendChild(newCard);
//       cardContainer.innerHTML = a.join('');
//       // };
//     });

//     //  //영화 이미지 클릭 이벤트 리스너 등록
//     //  console.log( document.querySelectorAll('.movie-card')); //
//     const movieImages = document.querySelectorAll('.movie-card img');
//     console.log(movieImages);
//     movieImages.forEach((image) => {
//       image.addEventListener('click', handleImageClick);

//       // 영화 이미지 클릭 이벤트 핸들러
//       function handleImageClick(event) {
//         console.log(event.target);
//         const movieId = event.target.dataset.id; //클릭한 이미지의 영화 id 가져오기
//         alert('ID: ' + movieId);
//       }
//     });
//   }
// };

// -------------------------------------
// // 검색 기능
// function search() {
//   const searchInput = document.getElementById('searchInput').value;
//   fetch(`/api/search?q=${searchInput}`)
//     .then((response) => response.json())
//     .then((data) => {
//       displayResults(data);
//     })
//     .catch((error) => {
//       console.error('검색 요청 오류:', error);
//     });
// }

// function displayResults(results) {
//   const searchResults = document.getElementById('searchResults');
//   searchResults.innerHTML = '';

//   results.forEach((result) => {
//     const resultElement = document.createElement('p');
//     resultElement.textContent = result.title;
//     searchResults.appendChild(resultElement);
//   });
// }

// // 검색 버튼 클릭 시 서버에 검색 요청 보내기
// searchButton.addEventListener('click', async function () {
//   const searchInputValue = searchInput.value;
//   try {
//     const response = await fetch(`/api/search?q=${searchInputValue}`);
//     if (response.ok) {
//       const data = await response.json();
//       // 검색 결과를 처리하고 페이지에 표시하는 로직을 추가
//       // 예를 들어, 검색 결과를 화면에 출력하거나 데이터를 다룰 수 있음
//       console.log(data);
//     } else {
//       console.error('검색 요청 실패:', response.statusText);
//     }
//   } catch (error) {
//     console.error('검색 요청 오류:', error);
//   }
// });

// // 검색 기능
// const searchButton = document.getElementById('search-button');
// const searchInput = document.getElementById('search-input');

// const urlParams = new URLSearchParams(window.location.search);
// const search_data = urlParams.get('search_data');

// searchInput.addEventListener('keyup', function (event) {
//   if (event.key === 'Enter') {
//     const searchInputValue = searchInput.value;
//     window.location.href = `post-list.html?search_data=${searchInputValue}`;
//   }
// });

// searchButton.addEventListener('click', function () {
//   const searchInputValue = searchInput.value;
//   window.location.href = `post-list.html?search_data=${searchInputValue}`;
// });

// 검색 input
let searchInput = document.getElementById('searchInput');
// 검색 버튼
let searchBtn = document.getElementById('searchButton');

// 검색 버튼 클릭 시 이벤트 리스너
searchBtn.addEventListener('click', async () => {
  document.getElementById('grid').innerHTML = '';
  const searchInputValue = searchInput.value;

  // 검색어를 서버에 보내고 관련된 포스트 정보를 가져오는 함수 호출
  const posts = await searchPosts(searchInputValue);

  // 가져온 포스트 정보를 화면에 표시하는 함수 호출
  renderPosts(posts);
});

// 서버로부터 검색 결과를 가져오는 함수
async function searchPosts(searchInputValue) {
  try {
    // 서버 API 엔드포인트를 호출하여 검색 결과를 가져옴
    const response = await fetch(`/api/search_post?title=${searchInputValue}`);
    if (!response.ok) {
      throw new Error('서버에서 검색 결과를 가져오는데 실패했습니다.');
    }

    // JSON 형식의 응답 데이터를 파싱
    const data = await response.json();
    return data.data; // 가져온 포스트 데이터를 반환
  } catch (error) {
    console.error('검색 오류:', error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

// 포스트 정보를 화면에 표시하는 함수
function renderPosts(posts) {
  const grid = document.getElementById('grid');

  if (posts.length === 0) {
    // 검색 결과가 없을 때 메시지 표시
    grid.innerHTML = '검색 결과가 없습니다.';
  } else {
    // 검색 결과를 화면에 표시
    posts.forEach((post) => {
      const postElement = createPostElement(post);
      grid.appendChild(postElement);
    });
  }
}

// 포스트 하나의 요소를 생성하는 함수
function createPostElement(post) {
  const { title, content, subject } = post;

  const postElement = document.createElement('div');
  postElement.classList.add('post');

  const titleElement = document.createElement('h2');
  titleElement.textContent = `제목: ${title}`;

  const contentElement = document.createElement('p');
  contentElement.textContent = `내용: ${content}`;

  const subjectElement = document.createElement('p');
  subjectElement.textContent = `과목: ${subject}`;

  postElement.appendChild(titleElement);
  postElement.appendChild(contentElement);
  postElement.appendChild(subjectElement);

  return postElement;
}
