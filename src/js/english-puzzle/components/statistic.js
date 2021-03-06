import { removeChild } from '../../utils/helpers';
import { DATA_URL } from '../../utils/constants';
import { Statistics } from '../../statistics/components/statistics';
import { errorFields, successFields } from '../../games/constants';
import * as downloadHelper from '../../download/download';

function createStatisticSentence(audioSrc, textExample){
  const newElement = `<div class="line">
    <button class = "btn_pronoucing"><audio src = ${DATA_URL}${audioSrc}></button>
    <p>${textExample}</p>
  </div>`;

  return newElement;
}

export function addStatisticRoundEnglishPuzzle(dataPageRound){
  let correct = 0;
  let error = 0;
  const errorField = document.querySelector('.modal-round__error');
  removeChild(errorField);
  const correctField = document.querySelector('.modal-round__correct');
  removeChild(correctField);
  correctField.insertAdjacentHTML('beforeend', `<h3>Я знаю <span>0</span</h3></h3>`);
  errorField.insertAdjacentHTML('beforeend', `<h3>Я не знаю <span>0</span</h3></h3>`);
  dataPageRound.forEach((sentence) =>{
    const element = createStatisticSentence(sentence.audioExample, sentence.textExample);
    const textExample = sentence.textExample.replace("<b>", "").replace("</b>", "");

    if(sentence.result){
      correct+=1;
      correctField.insertAdjacentHTML('beforeend', element);
      correctField.querySelector('span').innerText = `${correct}`;

      successFields.push(`${textExample}`);
      successFields.push(`${sentence.textExampleTranslate}`);
      successFields.push(`${sentence.word} - ${sentence.wordTranslate}`);
      successFields.push("\r\n");
    }
    else{
      error+=1;
      errorField.insertAdjacentHTML('beforeend', element);
      errorField.querySelector('span').innerText = `${error}`;

      errorFields.push(`${textExample}`);
      errorFields.push(`${sentence.textExampleTranslate}`);
      errorFields.push(`${sentence.word} - ${sentence.wordTranslate}`);
      errorFields.push("\r\n");
    }
  });
  document.querySelectorAll('.modal-round .btn_pronoucing').forEach((button) => {
    button.addEventListener('click', () => {
      const audio = button.querySelector('audio');
      const audioPlay = new Audio(audio.src);
      audioPlay.play();
  });
});
}

export function createStaticticRound(imageSrc, infoAboutImage){
  const resultBlock = document.querySelector('.block-results');
  const statisticElement =
  `<div id="modal-close-default" uk-modal class ="modal">
      <div class="uk-modal-dialog modal-round"">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <div class="uk-modal-header">
            <img src = ${imageSrc}>
            <p>${infoAboutImage}</p>
          </div>
          <div uk-overflow-auto class = 'uk-modal-body'>
          <div class="modal-round__correct">
            <h3>Я знаю <span>0</span></h3>
          </div>
          <div class="modal-round__error">
            <h3>Я не знаю <span>0</span</h3>
          </div>
          </div>
          <div class="uk-modal-footer">
            <button id="modal-btn-report">Создать отчет</button>
        </div>
      </div>
  </div>
`;
    resultBlock.insertAdjacentHTML('beforeend', statisticElement);
    document.getElementById('modal-btn-report').addEventListener('click', () => {
    errorFields.push('\r\n\r\n');

    const text = `Отчет по игре "English-puzzle"\r\n\r\n${errorFields.join('\r\n')}${successFields.join('\r\n')}`;
    downloadHelper.download(`english-puzzle-report_${new Date().toISOString()}.txt`, text);
  });
}


