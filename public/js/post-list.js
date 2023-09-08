// 게시글 리스트
window.addEventListener('DOMContentLoaded', async function () {
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
        let image = post['image'];

        //   let temp_html = `<div class="solo-card">
        // <div class="card w-75">
        let temp_html = `<div class="solo-card">
        <div class="card w-75">
      <div class="card">
      <div class="card-body">
      <h5 class="card-title"> ${image}</h5>
      <h5 class="card-title">제목: ${title}</h5>
      <p class="card-text">${content}</p>
      <p class="card-text">과목: ${subject}</p>
      </div>
      </div>
      </div>`;
        postBox.insertAdjacentHTML('beforeend', temp_html);
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

// 검색 기능
window.onload = function () {
  //실행될 코드
  let allQuestionList;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZTExODAzMzVhNGE2NzMxMTJlOTg1ZDQzZTUxMjMyYyIsInN1YiI6IjY0NzU3YWViOTI0Y2U2MDExNmM1ZmM3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LsITjGVhhqpYuf7KH_NEVSX7r45y_7tMtZ7OFN3UgCk',
    },
  };

  fetch('/api/post', {}).then((response) => {
    return response.json();
  });
  // .then((data) => {
  //   //가져온 데이터 사용
  //   let movies = data.results;
  //   globalMovies = data.results;

  //   renderMovieCards(movies);

  let rows = data.data;
  console.log(data);
  const postBox = document.getElementById('posts-box');
  rows.forEach((post) => {
    let title = post['title'];
    let content = post['content'];
    let subject = post['subject'];
    let image = post['image'];

    //검색어 입력값 가져오기
    var searchInput = document.getElementById('search-input');
    console.log('searchInput:', searchInput);

    var searchBtn = document.getElementById('search-btn');

    // movies = movies.filter(movie => movie.title.includes(searchInput))
    // renderMovieCards(movies);

    //영화 검색, 대소문자 구분 안함
    //영화 검색, 대소문자 구분 안함
    //영화 검색, 대소문자 구분 안함 => alt + shift + 아래 화살표 키

    searchInput.addEventListener('change', (e) => {
      console.log(e.target.value);
      const searchInputvalue = e.target.value;
      var searchResults = movies.filter((post) => {
        return post.title.toLowerCase().includes(searchInputvalue.toLowerCase());
      });
      renderMovieCards(searchResults);
    });
    // renderMovieCards(searchResults);
  });
};
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
