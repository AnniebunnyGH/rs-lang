import { getSettings } from '../api/settings';
import { getAggregatedUserWords } from '../api/userWords';
import Card from './Card';

const FILTERS = {
  deleted: {'userWord.optional.mode':{'$eq':'deleted'}},
  hard: {'$and':[{'userWord.difficulty':'hard', 'userWord.optional.mode': {'$not': {'$eq':'deleted'}}}]},
  learning: {'$and':[{'userWord.difficulty':{'$in':['normal', 'easy']}, 'userWord.optional.mode': {'$not': {'$eq':'deleted'}}}]},
}


function generateDataForCards(settingsData, UserWordsData) {
  const dataForCards = UserWordsData.map((wordData) => {
    const data = {
      lastUpdateDate: wordData.userWord.optional.lastUpdateDate,
      repeatCount: wordData.userWord.optional.repeatCount,
      audio: wordData.audio,
      word: wordData.word,
      wordTranslate: wordData.wordTranslate,
    }
    if(settingsData.showImageAssociation) {
      data.image = wordData.image;
    }
    if(settingsData.showWordTranscription) {
      data.transcription = wordData.transcription;
    }
    if(settingsData.showSentenceExplanation) {
      data.textMeaning = wordData.textMeaning;
      data.textMeaningTranslate = wordData.textMeaningTranslate;
    }
    if(settingsData.showExplanationExample) {
      data.textExample = wordData.textExample;
      data.textExampleTranslate = wordData.textExampleTranslate;
    }
    return data;
  });
  return dataForCards;
}

export  default async function initVocabularyPage() {
  const wordsWrapper = document.querySelector('.vocabulary_cards-wrapper');
const settingsData = await getSettings();
// getAllUserWords().then((result) => console.log(result));
// getAggregatedUserWords({'userWord.difficulty':{'$eq':'normal'}}).then((result) => console.log(result));
const UserWordsData = await getAggregatedUserWords(FILTERS.learning, 3600);
const dataForCards = generateDataForCards(settingsData.optional, UserWordsData[0].paginatedResults);
const cards = [];
dataForCards.forEach((cardData) => {
  const card = new Card(cardData);
  cards.push(card);
  wordsWrapper.append(card.generate());
});
}