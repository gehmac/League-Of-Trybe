const main = document.querySelector('.main');
const sectionRigth = document.querySelector('#rigth')
const championsHTML = document.querySelector('.champions');

const getChampionInfo = async (championName) => {
  const result = await fetch(`https://ddragon.leagueoflegends.com/cdn/11.19.1/data/pt_BR/champion/${championName}.json`);
  const convertedResult = await result.json();
  const championObject = Object.values(convertedResult.data)[0];
  return championObject;
}

const showInfo = (championObject) => {
  console.log(championObject);
  const nameSection = document.querySelector('#champion-name');
  const titleSection = document.querySelector('#champion-title');
  const loreSection = document.querySelector('#champion-lore');
  const classSection = document.querySelector('#champion-class');
  const championImg = document.querySelector('#champion-img');
  const skinsAmount = championObject.skins.length;

  nameSection.innerText = championObject.name;
  titleSection.innerText = championObject.title;
  loreSection.innerText = championObject.lore;
  classSection.innerText = championObject.tags;
  championImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championObject.name}_0.jpg`
};

const handleChampionClick = async (event) => {
  const previousSelected = document.querySelector('.selected-champion')
  const championName = event.target.id
  if (!previousSelected) {
    // changeDisplay();
  } else {
    previousSelected.classList.remove('selected-champion');
  }
  event.target.classList.add('selected-champion');
  const championInfo = await getChampionInfo(championName);
  showInfo(championInfo);
}

const renderChampion = (champion) => {
  const championImgURL = `http://ddragon.leagueoflegends.com/cdn/11.19.1/img/champion/${champion}.png`;
  const img = document.createElement('img');
  img.id = champion;
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

start();
