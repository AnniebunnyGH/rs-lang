import { getConfiguration } from "../configuration";
import { getAllUserWords } from "../api/userWords";

class DayStat {
  constructor() {
    this.state = {
      wordCount: 0,
      learnedWords: 0,
      dayWordPlanCount: 0,
      dayLearnedWords: 0,
      dayNewWordPlanCount: 0,
      daylearnedNewWords: 0,
      rightCount: 0,
      errorCount: 0,
      bestSeries: 0,
    };

    let date = new Date(Date.now());
    date = date.getDate();
    this.currentDate = date;
  }

  async getInitValues() {
    const config = await getConfiguration();
    const userWords = await getAllUserWords();
    this.state.wordCount = userWords.length;
    this.state.learnedWords = userWords.filter((element) => { return element.optional.successPoint >= 3.5 || element.optional.mode === 'deleted' }).length;
    this.state.dayWordPlanCount = +config.maxCardsWithWordsPerDay;
    this.state.dayNewWordPlanCount = +config.maxNewWordsPerDay;
  }

  async init() {
    await this.getInitValues();
    this.updateStat();
  }

  saveStat() {
    const dayStat = {
      state: this.state,
      currentDate: this.currentDate
    };
    window.localStorage.setItem('dayStat', JSON.stringify(dayStat));
  }

  getStat() {
    return JSON.parse(window.localStorage.getItem('dayStat'));
  }

  updateStat() {
    const dayStat = this.getStat();
    if (dayStat !== null) {
      if (+this.currentDate === +dayStat.currentDate) {
        this.state.dayLearnedWords += dayStat.state.dayLearnedWords;
        this.state.daylearnedNewWords += dayStat.state.daylearnedNewWords;
        this.state.rightCount += dayStat.state.rightCount;
        this.state.errorCount += dayStat.state.errorCount;
        if (dayStat.state.bestSeries > this.state.bestSeries) { this.state.bestSeries = dayStat.state.bestSeries; }
      }
    }

    const dayLearningStat = JSON.parse(window.localStorage.getItem('dayLearningStat'));
    const dayLearningProgressArrs = JSON.parse(window.localStorage.getItem('dayLearningLocalState'));
    const learningDate = window.localStorage.getItem('dayLearningDate');
    if (+this.currentDate === +learningDate) {
      const learnedNewWords = dayLearningProgressArrs.newWordProgressArr.filter((element) => element).length;
      const learnedWords = dayLearningProgressArrs.learningProgressArr.filter((element) => element).length;

      this.state.dayLearnedWords += learnedWords + learnedNewWords;
      this.state.daylearnedNewWords += learnedNewWords;
      this.state.rightCount += dayLearningStat.rightAnswers;
      this.state.errorCount += learnedWords + learnedNewWords - dayLearningStat.rightAnswers;
      if (dayLearningStat.longestRightAnswerSeries > this.state.bestSeries) {
        this.state.bestSeries = dayLearningStat.longestRightAnswerSeries;
      }
    }
  }

}

const dayStat = new DayStat();
export default dayStat;