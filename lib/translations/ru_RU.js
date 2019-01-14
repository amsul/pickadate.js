// @flow
// Russian

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'D MMMM YYYY г.',
  templateHookWords: {
    MMM: [
      'янв',
      'фев',
      'мар',
      'апр',
      'май',
      'июн',
      'июл',
      'авг',
      'сен',
      'окт',
      'ноя',
      'дек',
    ],
    MMMM: [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ],
    DDD: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
    DDDD: [
      'воскресенье',
      'понедельник',
      'вторник',
      'среда',
      'четверг',
      'пятница',
      'суббота',
    ],
  },
}

export default translation
