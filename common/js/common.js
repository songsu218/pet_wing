/** @format */

const petBox = document.querySelector('.listCon');

const API_KEY = '6f47736f4961736137306665535277';
const ANI_VIEW = 'TbAdpWaitAnimalView';
const IMG_VIEW = 'TbAdpWaitAnimalPhotoView';

// <'iframe src="" frameborder="0"></iframe>'

var swiper = new Swiper('.videoArea', {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// grid
const fetchPet = async () => {
  let url = new URL(`http://openapi.seoul.go.kr:8088/${API_KEY}/json/${ANI_VIEW}/1/100/`);
  const response = await fetch(url);
  const data = await response.json();
  const petBord = await data.TbAdpWaitAnimalView.row.map((pet) => createHtml(pet)).join('');
  petBox.innerHTML = petBord;
};

const fetchImg = async (num) => {
  let url = new URL(`http://openapi.seoul.go.kr:8088/${API_KEY}/json/${IMG_VIEW}/1/100/`);
  const response = await fetch(url);
  const data = await response.json();
  let img = data.TbAdpWaitAnimalPhotoView.row.filter((no) => no.ANIMAL_NO === num && no.PHOTO_KND === 'THUMB');
  return img;
};

fetchPet();

function createHtml(pet) {
  let img = fetchImg(pet.ANIMAL_NO);
  console.log(img);
  let gender = pet.SEXDSTN === 'M' ? "<i class='fa-solid fa-mars'></i>" : "<i class='fa-solid fa-venus'></i>";
  let spcs = pet.SPCS === 'DOG' ? "<i class='fa-solid fa-dog'></i>" : "<i class='fa-solid fa-cat'></i>";
  let adp = pet.ADP_STTUS === 'P' ? 'petState on' : 'petState';
  return `<li>
        <div class="petImg">
            <img src="https://svgsilh.com/svg/304156.svg" alt="">
        </div>
        <strong class="petName">${pet.NM}</strong>
        <time class="petDate">${pet.ENTRNC_DATE}</time>
        <span class="petType">${spcs}</span>
        <span class="petGender">${gender}</span>
        <span class="${adp}">
            입양
            <br />
            진행중
        </span>
    </li>`;
}
