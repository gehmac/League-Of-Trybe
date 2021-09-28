const main = document.querySelector('.main');
const sectionRigth = document.querySelector('#rigth')
const championsHTML = document.querySelector('.champions');

const getChampionInfo = async (championName) => {
  const champion = await fetch(`https://ddragon.leagueoflegends.com/cdn/11.19.1/data/pt_BR/champion/${championName}.json`);
  const convertedChampion = await champion.json();
  // console.log(convertedChampion);
  const objChampion = {
    name: convertedChampion.name,
    title: convertedChampion.title,
    
  }
  return objChampion;
}
getChampionInfo('Aatrox');

const showInfo = ({ data }) => {
  const championData = Object.values(data)[0];
  const nameSection = document.querySelector('#champion-name');
  const loreSection = document.querySelector('#lore');
  const classSection = document.querySelector('#class');
  const championImg = document.querySelector('#champion-img');

  nameSection.innerText = championData.name;
  loreSection.innerText = championData.lore;
  classSection.innerText = championData.info;
  championImg.src = 
}

const handleChampionClick = (event) => {
  const previousSelected = document.querySelector('.selected-champion')
  const championName = event.target.id
  if (!previousSelected) {
    // changeDisplay();
  }
  else {
    previousSelected.classList.remove('selected-champion');
  }
  event.target.classList.add('selected-champion');
  const championInfo = getChampionInfo(championName);
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