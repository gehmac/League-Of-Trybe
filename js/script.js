const main = document.querySelector('.main');
const sectionRigth = document.querySelector('#rigth')
const championsHTML = document.querySelector('.champions');
const championImg = document.querySelector('#champion-img');
const skinNameSection = document.querySelector('.skin-name');


let skinIndex = 0;
let lastSkinIndex = 0;
let selectedChampionSkins = [];

const getChampionInfo = async (championName) => {
  const result = await fetch(`https://ddragon.leagueoflegends.com/cdn/11.19.1/data/pt_BR/champion/${championName}.json`);
  const convertedResult = await result.json();
  const championObject = Object.values(convertedResult.data)[0];
  return championObject;
}

const showInfo = ({
  name,
  title,
  lore,
  tags,
  skins,
  id,
}) => {
  const nameSection = document.querySelector('#champion-name');
  const titleSection = document.querySelector('#champion-title');
  const loreSection = document.querySelector('#champion-lore');
  const classSection = document.querySelector('#champion-class');
  const skinsSection = document.querySelector('#skins-counter');
  const skinsAmount = skins.length;
  lastSkinIndex = skinsAmount - 1;
  selectedChampionSkins = skins;

  nameSection.innerText = name;
  titleSection.innerText = title;
  loreSection.innerHTML = lore;
  classSection.innerText = tags;
  skinNameSection.innerText = 'Padrão';
  championImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_${skinIndex}.jpg`;
  skinsSection.innerText = `${skinsAmount} skins`;
};

const changeVisibility = () => {
  const firstScreen = document.querySelector('#first-screen');
  const hiddenSection = document.querySelector('#hidden-section');

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
  championsHTML.appendChild(img);
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

const start = async () => {
  const championsList = await getChampionsList();
  renderAllChampions(championsList);
};

const changeSkinButtons = () => {
  const arrows = document.querySelectorAll('.arrow');
  arrows.forEach(arrow => arrow.addEventListener('click', event => {
    const currentChampion = document.querySelector('.selected-champion');
    if (event.target.classList.contains('left-arrow') && skinIndex > 0) {
      skinIndex -= 1;
      championImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChampion.id}_${selectedChampionSkins[skinIndex].num}.jpg`;
      skinNameSection.innerText = selectedChampionSkins[skinIndex].name;
    }
    if (event.target.classList.contains('rigth-arrow') && skinIndex < lastSkinIndex) {
      skinIndex += 1;
      championImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChampion.id}_${selectedChampionSkins[skinIndex].num}.jpg`;
      skinNameSection.innerText = selectedChampionSkins[skinIndex].name;
    }
  }));
}

start();
changeSkinButtons();
