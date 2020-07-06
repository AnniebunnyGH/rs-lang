// eslint-disable-next-line import/prefer-default-export
export const GAME_MODES = {
  learned: 'изученные',
  all: 'все',
};

export const SPRINT_MODES = [
  { points: 10, сlassElement: '', innerText: '' },
  { points: 20, сlassElement: 'correct_first', innerText: '+ 20 баллов' },
  { points: 40, сlassElement: 'correct_second', innerText: '+ 40 баллов'},
  { points: 80, сlassElement: 'correct_third', innerText: '+ 80 баллов' },
];

export const ERR_MSG = 'Изученных слов недостаточно, чтобы начать игру. Переключите режим.';
