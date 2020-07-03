/* eslint-disable no-param-reassign */
const curLvl = document.getElementById('game-control__current_level');
const listLvl = document.querySelectorAll('.game-control__list_level li');
const listLvlContainer = document.querySelector('.game-control__list_level');

const btnRound = document.querySelector('.game-control__btn_round');
const btnLevel = document.querySelector('.game-control__btn_level');

const curRound = document.getElementById('game-control__current_round');
const listRound = document.querySelectorAll('.game-control__list_round li');
const listRoundContainer = document.querySelector('.game-control__list_round');


export function getCurrentLevel() {
  return (+curLvl.textContent) - 1;
}

function resetLevelList() {
  listLvl.forEach((level) => {
    level.classList.remove('list__active');
  });
}

function addLevelListEventHandler() {
  listLvl.forEach((level) => {
    level.onclick = () => {
      resetLevelList();
      const ind = level.textContent.split(' ').pop();
      level.classList.add('list__active');

      curLvl.textContent = ind;
    }
  });
}


export function getCurrentRound() {
  return (+curRound.textContent) - 1;
}

function resetRoundList() {
  listRound.forEach((round) => {
    round.classList.remove('list__active');
  });
}

function addRoundListEventHandler() {
  listRound.forEach((round) => {
    round.onclick = () => {
      resetRoundList();
      const ind = round.textContent.split(' ').pop();
      round.classList.add('list__active');

      curRound.textContent = ind;
    }
  });
}


export function addDropdownsEventHandlers() {
  addLevelListEventHandler();
  addRoundListEventHandler();
}


function disableList(listContainer) {
  listContainer.classList.add('game-control__list_disabled');
  btnRound.classList.add('disable');
  btnLevel.classList.add('disable');
}

function enableList(listContainer) {
  listContainer.classList.remove('game-control__list_disabled');
  btnRound.classList.remove('disable');
  btnLevel.classList.remove('disable');
}

export function disableDropdowns() {
  disableList(listLvlContainer);
  disableList(listRoundContainer);
}

export function enableDropdowns() {
  enableList(listLvlContainer);
  enableList(listRoundContainer);
}
