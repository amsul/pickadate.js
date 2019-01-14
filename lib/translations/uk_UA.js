// @flow
// Ukrainian

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'DD MMMM YYYY p.',
  templateHookWords: {
    MMM: [
      'січ',
      'лют',
      'бер',
      'кві',
      'тра',
      'чер',
      'лип',
      'сер',
      'вер',
      'жов',
      'лис',
      'гру',
    ],
    MMMM: [
      'січень',
      'лютий',
      'березень',
      'квітень',
      'травень',
      'червень',
      'липень',
      'серпень',
      'вересень',
      'жовтень',
      'листопад',
      'грудень',
    ],
    DDD: ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
    DDDD: [
      'неділя',
      'понеділок',
      'вівторок',
      'середа',
      'четвер',
      'п‘ятниця',
      'субота',
    ],
  },
}

export default translation
