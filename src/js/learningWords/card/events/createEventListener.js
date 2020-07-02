/* eslint-disable no-restricted-globals */

import { stopAudio } from '../../learningScreen/events/eventFunctions/Audio';
import { updateEnableAudioHelper } from '../domBuilder/lightTree/initAudioHelpers';

export default function createEventListener(card) {
  card.addEventListener('click', () => {
    if (event.target.closest('img[slot=pronunciation]') != null) {
      card.audio.word.play();
    } else if (event.target.closest('.stopAudioButton') != null) {
      stopAudio(card);
    } else if (event.target.closest('.enableAudioButton') != null) {
      card.settings.enableAutomaticAudio = !card.settings.enableAutomaticAudio;
      document.querySelector('learning-screen').settings.enableAutomaticAudio =
        card.settings.enableAutomaticAudio;
      console.log(card.settings);
      console.log(document.querySelector('learning-screen').settings);
      stopAudio(card);
      updateEnableAudioHelper(card);
    }
  });

  card.addEventListener('keydown', () => {
    const word2 = card.querySelector('[slot=word2]');
    if (word2 != null) {
      word2.remove();
    }
  });
}
