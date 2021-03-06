export default function createStatusBar(learningScreenElement) {
  learningScreenElement.insertAdjacentHTML(
    'beforeend',
    `
  <div slot='progressLine' style='width:0%;'></div>
  <span slot='numberStatus'></span>`,
  );
}

export function updateStatusBar(learningScreenElement) {
  const mode = learningScreenElement.state.mode;
  const allWordCount =
    learningScreenElement.wordArrs.newWords.length +
    learningScreenElement.wordArrs.learnedWords.length;
  const doneWordCount =
    learningScreenElement.localState.newWordProgressArr.filter((element) => element).length +
    learningScreenElement.localState.learningProgressArr.filter((element) => element).length -
    learningScreenElement.localState.needToRepeatProgressArr.filter((element) => !element).length;

  const progressLine = learningScreenElement.querySelector('[slot=progressLine]');
  const numberStatus = learningScreenElement.querySelector('[slot=numberStatus]');

  const maxWidth = +window
    .getComputedStyle(learningScreenElement.shadowRoot.querySelector('#lineStatus'))
    .width.slice(0, -2);
  const widthPercent = Math.floor((maxWidth * doneWordCount * 100) / allWordCount) / 100;
  progressLine.style.width = `${widthPercent}px`;
  numberStatus.innerHTML = `${doneWordCount}/${allWordCount}`;
}
