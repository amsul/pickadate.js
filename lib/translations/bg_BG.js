// @flow
// Bulgarian

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'DD MMMM YYYY г.',
  templateHookWords: {
    MMM: [
      'янр',
      'фев',
      'мар',
      'апр',
      'май',
      'юни',
      'юли',
      'авг',
      'сеп',
      'окт',
      'ное',
      'дек',
    ],
    MMMM: [
      'януари',
      'февруари',
      'март',
      'април',
      'май',
      'юни',
      'юли',
      'август',
      'септември',
      'октомври',
      'ноември',
      'декември',
    ],
    DDD: ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
    DDDD: [
      'неделя',
      'понеделник',
      'вторник',
      'сряда',
      'четвъртък',
      'петък',
      'събота',
    ],
  },
}

export default translation
