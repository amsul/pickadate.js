// @flow
// Serbian (Cyrillic)

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'D. MMMM YYYY.',
  templateHookWords: {
    MMM: [
      'јан.',
      'феб.',
      'март',
      'апр.',
      'мај',
      'јун',
      'јул',
      'авг.',
      'септ.',
      'окт.',
      'нов.',
      'дец.',
    ],
    MMMM: [
      'јануар',
      'фебруар',
      'март',
      'април',
      'мај',
      'јун',
      'јул',
      'август',
      'септембар',
      'октобар',
      'новембар',
      'децембар',
    ],
    DDD: ['нед.', 'пон.', 'ут.', 'ср.', 'чет.', 'пет.', 'суб.'],
    DDDD: [
      'недеља',
      'понедељак',
      'уторак',
      'среда',
      'четвртак',
      'петак',
      'субота',
    ],
  },
}

export default translation
