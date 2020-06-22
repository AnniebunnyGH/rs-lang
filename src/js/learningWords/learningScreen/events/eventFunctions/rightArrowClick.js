/* eslint-disable no-param-reassign */
import switchCardMode from './switchCardMode';
import createCard from '../../domBuilder/lightTree/createCard';
import createResults from '../../domBuilder/lightTree/createResults';

import { createUserWord } from '../../../../api/userWords';

import checkAnswer from './checkAnswer';
import readIt from '../../functions/readWord';

import saveDayLocalState from '../../functions/saveDayLocalState';

export default function rightClick(learningScreenElement) {
  let isAnswerCorrect = true;
  let isFirstTimeDone = false;
  const { currentNewWordCardIndex } = learningScreenElement.state;
  const { currentLearningCardIndex } = learningScreenElement.state;

  if (learningScreenElement.state.mode === 'newWord') {
    isFirstTimeDone = learningScreenElement.localState.newWordProgressArr[currentNewWordCardIndex];
  } else {
    isFirstTimeDone =
      learningScreenElement.localState.learningProgressArr[currentLearningCardIndex];
  }
  console.log('123123121312');
  if (learningScreenElement.state.mode === 'learning') {
    isAnswerCorrect = checkAnswer(learningScreenElement.querySelector('card-word'));

    if (isAnswerCorrect) {
      learningScreenElement
        .querySelectorAll('div.dot[slot=learningStatusPoint]')
      [currentLearningCardIndex].classList.remove('error');
      learningScreenElement
        .querySelectorAll('div.dot[slot=learningStatusPoint]')
      [currentLearningCardIndex].classList.add('success');
      learningScreenElement.localState.learningProgressArr[currentLearningCardIndex] = true;
      saveDayLocalState(learningScreenElement);
      learningScreenElement.state.currentLearningCardIndex += 1;
    } else {
      learningScreenElement
        .querySelectorAll('div.dot[slot=learningStatusPoint]')
      [currentLearningCardIndex].classList.add('error');
    }
  } else {
    learningScreenElement
      .querySelectorAll('div.dot[slot=newWordStatusPoint]')[currentNewWordCardIndex].classList.add('active');
    learningScreenElement.localState.newWordProgressArr[currentNewWordCardIndex] = true;
    saveDayLocalState(learningScreenElement);
    console.log(createUserWord);
    const userWord = createUserWord("5e9f5ee35eb9e72bc21af4ac", { "difficulty": "weak", "optional": { testFieldString: 'test', testFieldBoolean: true } });
    console.log(userWord);

    learningScreenElement.state.currentNewWordCardIndex += 1;
  }

  if (
    learningScreenElement.state.currentNewWordCardIndex ===
    learningScreenElement.settings.newWordCount &&
    learningScreenElement.state.mode === 'newWord'
  ) {
    learningScreenElement.setState('currentNewWordCardIndex', 0);
    switchCardMode(learningScreenElement);
  }
  if (
    learningScreenElement.localState.newWordProgressArr.indexOf(false) === -1 &&
    learningScreenElement.localState.learningProgressArr.indexOf(false) === -1 &&
    learningScreenElement.state.currentLearningCardIndex >= learningScreenElement.settings.wordCount
  ) {
    createResults(learningScreenElement);
  } else if (isAnswerCorrect) {
    if (learningScreenElement.settings.enableAutomaticAudio && !isFirstTimeDone) {
      const card = learningScreenElement.querySelector('card-word');
      readIt(card.state.word);
      if (card.settings.showExplanationExample) {
        readIt(card.state.textExample);
      }
      if (card.settings.showSentenceExplanation) {
        readIt(card.state.textMining);
      }
    }

    createCard(learningScreenElement);
  }
}
