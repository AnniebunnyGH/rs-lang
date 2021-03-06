import Card from './Card';
import Loader from './Loader';
import { createElementObj } from '../../utils/create';
import { shuffleArray } from '../../helpers/math-hepler';
import { getUserWords, getWordsByLevelAndRound } from '../utils';


export default class CardsBoard {
  constructor() {
    this.currentCards = [];
    this.mixedСards = [];
    this.audioObj = new Audio();
    this.loader = new Loader(true);
    this.wordsAmntInRound = 10;
    this.filter = { '$and': [{ 'userWord.difficulty': { '$in': ['normal', 'easy', 'hard'] }, 'userWord.optional.mode': { '$not': { '$eq': 'deleted' } } }] };
  }

  generate() {
    this.cardsContainer = createElementObj({ tagName: 'div', classNames: 'cards_container' });
    this.wrapper = createElementObj({ tagName: 'div', classNames: 'wrapper_game-board', children: [this.cardsContainer, this.loader.getElement()] });
    return this.wrapper;
  }

  async changeCards(data) {
    this.cardsContainer.classList.add('hidden');
    this.loader.show();
    this.cardsContainer.innerHTML = '';
    this.currentCards.length = 0;
    this.mixedСards.length = 0;
    let userData = '';
    try {
      if (data.studied) {
        userData = await getUserWords(this.filter, this.wordsAmntInRound).then()
      } else {
        userData = await getWordsByLevelAndRound(data, this.wordsAmntInRound);
      }
      shuffleArray(userData);
      userData.forEach((cardData) => {
        this.currentCards.push(new Card(cardData));
      });
      this.currentCards.map((card) => this.cardsContainer.append(card.generateCard()));
      this.loader.hide();
      this.cardsContainer.classList.remove('hidden');
    } catch (err) {
      // eslint-disable-next-line no-undef
      UIkit.notification({
        message: `<span uk-icon='icon: warning'></span> ${err}`,
        status: 'warning',
        pos: 'top-center',
      });

      this.loader.hide();
      const customEvent = new CustomEvent('speakitBackToHomepage');
      document.dispatchEvent(customEvent);
    };
  }

  getCardsContainer() {
    return this.cardsContainer;
  }

  getCardByEvent(eventTarget) {
    const currentCard = this.currentCards.find((card) => {
      const cardElement = card.getElement();
      return cardElement.contains(eventTarget);
    });
    return currentCard;
  }

  playAudio(audioSrc) {
    this.audioObj.src = audioSrc;
    this.audioObj.play();
  }

  makeInactiveAllCards() {
    this.currentCards.forEach((card) => card.makeInactive());
  }

  startGameMode() {
    this.makeInactiveAllCards();
    this.wrapper.classList.add('hidden');
    this.mixedСards = this.currentCards;
    shuffleArray(this.mixedСards);
    this.gameModeCurrentWordIndex = 0;
  }

  stopGameMode() {
    this.wrapper.classList.remove('hidden');
    this.currentCards.forEach((card) => card.markAsNotAnswered());
  }

  getCurrentWordInfo() {
    const currentCard = this.mixedСards[this.gameModeCurrentWordIndex];
    return {
      img: currentCard.getImgUrl(),
      translate: currentCard.getTranslate(),
      word: currentCard.getWord(),
      transcription: currentCard.getTranscription(),
    };
  }

  getWordsWithCorrectAnswer() {
    return this.currentCards.filter((card) => card.wasAnswered());
  }

  getWordsWithNotCorrectAnswer() {
    return this.currentCards.filter((card) => card.wasError());
  }

  cardOnClickHandler(event, callback) {
    const currentCard = this.getCardByEvent(event.target);
    if (currentCard) {
      this.makeInactiveAllCards();
      currentCard.makeActive();
      this.playAudio(currentCard.getAudioSrc());
      if (callback) {
        callback({ img: currentCard.getImgUrl(), translate: currentCard.getTranslate() });
      }
    }
  }

  checkAnswers(inputValue) {
    const currentCard = this.mixedСards[this.gameModeCurrentWordIndex];
    if (currentCard.getWord().toLowerCase() === inputValue.toLowerCase()) {
      currentCard.markAsAnswered();
      return true;
    }
    return false;
  }

  markErroneousAnswer() {
    const currentCard = this.mixedСards[this.gameModeCurrentWordIndex];
    currentCard.markAsError();
  }

  increaseCurrentWordIndex() {
    this.gameModeCurrentWordIndex += 1;
  }

  isAllWordsPass() {
    return this.mixedСards.length > this.gameModeCurrentWordIndex;
  }

  updateCards() {
    this.cardsContainer.innerHTML = '';
    this.currentCards.forEach((card) => {
      card.removeChangeForResults();
      this.cardsContainer.append(card.getElement());
    });
    this.makeInactiveAllCards();
  }
}
