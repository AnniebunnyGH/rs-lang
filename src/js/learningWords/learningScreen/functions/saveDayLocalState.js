export default function saveDayLocalState(learningScreenElemen) {
  const currentDate = new Date(Date.now());
  const stateItem = { ...learningScreenElemen.localState };
  const arrItem = { ...learningScreenElemen.wordArrs };
  const json = JSON.stringify(stateItem);

  window.localStorage.setItem('dayLearningDate', currentDate.getDate());
  window.localStorage.setItem('dayLearningLocalState', json);
  window.localStorage.setItem('dayLearningWordArrs', JSON.stringify(arrItem));
}
