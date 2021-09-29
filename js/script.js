const main = document.querySelector('.main');
const sectionRigth = document.querySelector('#rigth')
const championsHTML = document.querySelector('.champions');
const championImg = document.querySelector('#champion-img');

let skinNumber = 0;
let lastSkinNumber = 0;
let selectedChampionSkinsNumbers = [];

const getChampionInfo = async (championName) => {
  const result = await fetch(`https://ddragon.leagueoflegends.com/cdn/11.19.1/data/pt_BR/champion/${championName}.json`);
  const convertedResult = await result.json();
  const championObject = Object.values(convertedResult.data)[0];
  return championObject;
}

// const showInfo = (championObject) => {
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
  const skinsSection = document.querySelector('#skins-count');
  const skinsAmount = skins.length;
  lastSkinNumber = skinsAmount - 1;
  selectedChampionSkinsNumbers = skins.map((skin) => skin.num);


  nameSection.innerText = name;
  titleSection.innerText = title;
  //troquei para html pois vem tags da api
  loreSection.innerHTML = lore;
  classSection.innerText = tags;
  championImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_${skinNumber}.jpg`;
  skinsSection.innerText = `${skinsAmount} skins;`;
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
  skinNumber = 0;
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
    if (event.target.classList.contains('left-arrow') && skinNumber > 0) {
      skinNumber -= 1;
      championImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChampion.id}_${selectedChampionSkinsNumbers[skinNumber]}.jpg`;
    }
    if (event.target.classList.contains('rigth-arrow') && skinNumber < lastSkinNumber) {
      skinNumber += 1;
      championImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChampion.id}_${selectedChampionSkinsNumbers[skinNumber]}.jpg`;
    }
  }));
}

start();
changeSkinButtons();
