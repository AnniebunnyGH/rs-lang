/* eslint-disable no-param-reassign */
import { getUserId } from '../utils/storage';
import sendRequest from './requests';
import { BACKEND_URL } from '../utils/constants';

async function createUserWord(wordId, word) {
  try {
    const userId = getUserId();
    const urlRequest = `${BACKEND_URL}/users/${userId}/words/${wordId}`;
    const content = await sendRequest('POST', urlRequest, true, word);
    return content;
  } catch (error) {
    return error;
  }
}

async function makeRequestByWordId(methodRequest, wordId, word) {
  try {
    const userId = getUserId();
    const urlRequest = `${BACKEND_URL}/users/${userId}/words/${wordId}`;
    const content = await sendRequest(methodRequest, urlRequest, true, word);
    return content;
  } catch (error) {
    return error;
  }
}

async function getAllUserWords() {
  try {
    const userId = getUserId();
    const urlRequest = `${BACKEND_URL}/users/${userId}/words`;
    const content = await sendRequest('GET', urlRequest, true);
    return content;
  } catch (error) {
    return error;
  }
}

async function getUserWordById(wordId) {
  const result = await makeRequestByWordId('GET', wordId);
  return result;
}

async function updateUserWord(wordId, word) {
  if(Object.prototype.hasOwnProperty.call(word, 'id')){
    delete word.id;
  }
  if(Object.prototype.hasOwnProperty.call(word, 'wordId')){
    delete word.wordId;
  }
  const result = await makeRequestByWordId('PUT', wordId, word);
  return result;
}
async function deleteUserWord(wordId) {
  const result = await makeRequestByWordId('DELETE', wordId);
  return result;
}

async function getAggregatedWords(){
  try {
    const userId = getUserId();
    const urlRequest = `${BACKEND_URL}/users/${userId}/aggregatedWords?wordsPerPage=10&filter=%7B%22%24or%22%3A%5B%7B%22userWord.optional.mode%22%3A%22needToRepeat%22%7D%2C%7B%22userWord.optional.mode%22%3A%22learning%22%7D%5D%7D`;
    const content = await sendRequest('GET', urlRequest, true);
    return content[0];
  } catch (error) {
    return error;
  }
}

async function getAggregatedUserWords(filterParam, wordsPerPage = 10) {
  try {
    const userId = getUserId();
    const filter = encodeURIComponent(JSON.stringify(filterParam));
    const urlRequest = `${BACKEND_URL}/users/${userId}/aggregatedWords?filter=${filter}&wordsPerPage=${wordsPerPage}`;
    const content = await sendRequest('GET', urlRequest, true);
    return content;
  } catch (error) {
    return error;
  }
}

export { getAllUserWords, getUserWordById, updateUserWord,
      deleteUserWord, createUserWord, getAggregatedWords, getAggregatedUserWords };
