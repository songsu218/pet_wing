/** @format */

const petBox = document.querySelector('.listCon');
const actBox = document.querySelector('.tabList');

const API_KEY = '6f47736f4961736137306665535277';
const ANI_VIEW = 'TbAdpWaitAnimalView';
const IMG_VIEW = 'TbAdpWaitAnimalPhotoView';

var swiper = new Swiper('.videoArea', {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// 두개의 API를 활용하고 있습니다.
const fetchPet = async () => {
  let url = new URL(`http://openapi.seoul.go.kr:8088/${API_KEY}/json/${ANI_VIEW}/1/100/`);
  //   console.log('fetchPet URL', url);
  const response = await fetch(url);
  const dataInfo = await response.json();
  return dataInfo;
};

const fetchImg = async (num) => {
  let url = new URL(`http://openapi.seoul.go.kr:8088/${API_KEY}/json/${IMG_VIEW}/1/100/`);
  //   console.log('fetchImg URL', url);
  const response = await fetch(url);
  const dataImg = await response.json();
  return dataImg;
};

// Promise.all을 사용하여 두개의 API를 동시에 호출합니다.
Promise.all([fetchPet(), fetchImg()]).then((data) => {
  // console.log('dataInfo', data[0]);
  // console.log('dataImg', data[1]);
  const dataInfo = data[0].TbAdpWaitAnimalView.row;
  const dataImg = data[1].TbAdpWaitAnimalPhotoView.row;
  //   console.log('dataInfo', dataInfo);
  //   console.log('dataImg', dataImg);

  //호출이 완료되면 reanderList 함수를 호출합니다.
  reanderList(dataInfo, dataImg);
  const petAct = createActive(dataInfo);
  actBox.innerHTML = petAct;
});

// 리스트를 렌더링하는 함수입니다.
const reanderList = (dataInfo, dataImg) => {
  const petBord = dataInfo.map((pet) => createHtml(pet, dataImg)).join('');
  petBox.innerHTML = petBord;
};

// 리스트 내부의 하나의 아이템을 생성하는 함수입니다.
// 이때 두개의 API에서 공통적으로 사용되는 ANIMAL_NO를 사용하여 이미지를 매칭합니다.
function createHtml(pet, dataImg) {
  let gender =
    pet.SEXDSTN === 'M' ? "<i class='fa-solid fa-mars'></i>" : "<i class='fa-solid fa-venus'></i>";
  let spcs =
    pet.SPCS === 'DOG' ? "<i class='fa-solid fa-dog'></i>" : "<i class='fa-solid fa-cat'></i>";
  let adp = pet.ADP_STTUS === 'P' ? 'petState on' : 'petState';

  let img = dataImg.filter((no) => no.ANIMAL_NO === pet.ANIMAL_NO && no.PHOTO_KND === 'THUMB');

  let imgSrc =
    img.length > 0
      ? `https://${img[0].PHOTO_URL}`
      : pet.SPCS === 'DOG'
      ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Dog.svg'
      : 'https://svgsilh.com/svg/304156.svg';

  return `<li>
        <div class="petImg">
            <img src=${imgSrc} alt="">
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

// 동물 카테고리를 생성하는 함수입니다.
function createActive(pet) {
  let dog = 0;
  let cat = 0;

  pet.forEach((idx) => {
    idx.SPCS === 'DOG' ? dog++ : cat++;
  });
  return `<li class="active" data-cate="all"><span>전체 ${pet.length}마리</span></li>
  <li data-cate="dog"><span>개 ${dog}마리</span></li>
  <li data-cate="cat"><span>고양이 ${cat}마리</span></li>`;
}

actBox.addEventListener('click', (e) => {
  if (e.target.parentElement.tagName !== 'LI') return;
  const list = e.currentTarget.childNodes;
  list.forEach((idx) => {
    if (idx.nodeName !== 'LI') return;
    idx.classList.remove('active');
  });
  let li = e.target.parentElement;
  li.classList.add('active');

  let category = e.target.parentElement.dataset.cate;
  selectList(category);
});

function selectList(category) {
  Promise.all([fetchPet(), fetchImg()]).then((data) => {
    let dataInfo = data[0].TbAdpWaitAnimalView.row;
    switch (category) {
      case 'all':
        break;
      case 'dog':
        dataInfo = dataInfo.filter((no) => no.SPCS === 'DOG');
        break;
      case 'cat':
        dataInfo = dataInfo.filter((no) => no.SPCS === 'CAT');
        break;
      default:
        break;
    }
    const dataImg = data[1].TbAdpWaitAnimalPhotoView.row;
    reanderList(dataInfo, dataImg);
  });
}
