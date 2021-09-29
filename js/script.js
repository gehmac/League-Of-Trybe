const main = document.querySelector('.main');
const firstScreen = document.querySelector('#first-screen');
const hiddenSection = document.querySelector('#hidden-section');
const sectionRigth = document.querySelector('#rigth')
const championsSection = document.querySelector('.champions');
const titleSection = document.querySelector('#champion-title');
const nameSection = document.querySelector('#champion-name');
const loreSection = document.querySelector('#champion-lore');
const classSection = document.querySelector('#champion-class');
const championImg = document.querySelector('#champion-img');
const skinNameSection = document.querySelector('.skin-name');
const skinsCounterSection = document.querySelector('#skins-counter');


let skinIndex = 0;
let lastSkinIndex = 0;
let selectedChampionSkins = [];

const getChampionInfo = async (championName) => {
  const result = await fetch(`https://ddragon.leagueoflegends.com/cdn/11.19.1/data/pt_BR/champion/${championName}.json`);
  const convertedResult = await result.json();
  const championObject = Object.values(convertedResult.data)[0];
  return championObject;
}

const resetSkinCounter = () => {
  skinsCounterSection.innerHTML = '';
};

const selectLittleBall = (option) => {
  const previousSelectedBall = document.querySelector('.selected-ball');
  previousSelectedBall.classList.remove('selected-ball');
  if (option === 'previous') {
    previousSelectedBall.previousElementSibling.classList.add('selected-ball');
  }
  if (option === 'next') {
    previousSelectedBall.nextElementSibling.classList.add('selected-ball');
  }
  if (option === 'first') {
    skinsCounterSection.firstElementChild.classList.add('selected-ball');
  }
  if (option === 'last') {
    skinsCounterSection.lastElementChild.classList.add('selected-ball');
  }

};

const createLittleBall = () => {
  const littleBall = document.createElement('span');
  littleBall.innerText = '✤';
  littleBall.className = 'little-ball';
  return littleBall;
};

const appendLittleBalls = (amount) => {
  for (let index = 1; index <= amount; index += 1) {
    const littleBall = createLittleBall();
    skinsCounterSection.appendChild(littleBall);
    if (index === 1) {
      littleBall.classList.add('selected-ball');
    }
  }
};

const showInfo = ({
  name,
  title,
  lore,
  tags,
  skins,
  id,
}) => {
  const skinsAmount = skins.length;
  lastSkinIndex = skinsAmount - 1;
  selectedChampionSkins = skins;

  nameSection.innerText = `${name}`;
  titleSection.innerText = title;
  loreSection.innerHTML = lore;
  classSection.innerText = tags.join(`\n`);
  skinNameSection.innerText = 'Padrão';
  championImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_${skinIndex}.jpg`;

  resetSkinCounter();
  appendLittleBalls(skinsAmount);
};

const changeVisibility = () => {
  firstScreen.classList.add('hidden');
  hiddenSection.classList.remove('hidden');
};

const handleChampionClick = async (event) => {
  const previousSelected = document.querySelector('.selected-champion')
  const championName = event.target.id
  if (!previousSelected) {
    changeVisibility();
  } else {
    previousSelected.classList.remove('selected-champion');
  }
  event.target.classList.add('selected-champion');
  skinIndex = 0;
  const championInfo = await getChampionInfo(championName);
  showInfo(championInfo);
}

const renderChampion = (championName) => {
  const championImgURL = `http://ddragon.leagueoflegends.com/cdn/11.19.1/img/champion/${championName}.png`;
  const img = document.createElement('img');
  img.id = championName;
  img.className = 'champion';
  img.src = championImgURL;
  img.addEventListener('click', handleChampionClick);
  championsSection.appendChild(img);
};

const renderAllChampions = (championsList) => {
  championsList.forEach(champion => renderChampion(champion));
};

const getChampionsList = async () => {
  const response = await fetch('https://ddragon.leagueoflegends.com/cdn/11.19.1/data/pt_BR/champion.json');
  const translatedResponse = await response.json();
  const championsList = Object.keys(translatedResponse.data);
  return championsList;
};

const changeSkinButtons = () => {
  const arrows = document.querySelectorAll('.arrow');
  arrows.forEach(arrow => arrow.addEventListener('click', event => {
    const currentChampion = document.querySelector('.selected-champion');
    if (event.target.classList.contains('left-arrow') && skinIndex >= 0) {
      if (skinIndex === 0) {
        skinIndex = lastSkinIndex;
        selectLittleBall('last');
        skinNameSection.innerText = selectedChampionSkins[skinIndex].name;
      } else {
        skinIndex -= 1;
        selectLittleBall('previous');
      }
      championImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChampion.id}_${selectedChampionSkins[skinIndex].num}.jpg`;
      if (skinIndex === 0) {
        skinNameSection.innerText = `Padrão`;
      }
    }
    if (event.target.classList.contains('rigth-arrow') && skinIndex <= lastSkinIndex) {
      if (skinIndex === lastSkinIndex) {
        skinIndex = 0;
        selectLittleBall('first');
        skinNameSection.innerText = `Padrão`;
      } else {
        skinIndex += 1;
        selectLittleBall('next');
        skinNameSection.innerText = selectedChampionSkins[skinIndex].name;
      }
      championImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChampion.id}_${selectedChampionSkins[skinIndex].num}.jpg`;
    }
  }));
};

const renderFilteredChampions = (filteredChampions) => {
  filteredChampions.forEach(champion => renderChampion(champion));
};

const searchChampion = async (event) => {
  const keyValue = event.target.value.toLowerCase();
  const championsList = await getChampionsList();
  const listInLowerCase = championsList.map((name) => name.toLowerCase());
  const indexes = [];
  listInLowerCase.forEach((champion, index) => {
    if (champion.includes(keyValue)) indexes.push(index);
  });
  championsSection.innerHTML = '';
  indexes.forEach((index) => renderChampion(championsList[index]));
}

const addListenerToInput = () => {
  const inputKey = document.querySelector('#site-search');

  inputKey.addEventListener('keyup', searchChampion);
};

const start = async () => {
  const championsList = await getChampionsList();
  renderAllChampions(championsList);
};

start();
changeSkinButtons();
addListenerToInput();
