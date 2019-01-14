// @flow
// Slovenian

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'D. MMMM YYYY',
  templateHookWords: {
    MMM: [
      'jan',
      'feb',
      'mar',
      'apr',
      'maj',
      'jun',
      'jul',
      'avg',
      'sep',
      'okt',
      'nov',
      'dec',
    ],
    MMMM: [
      'januar',
      'februar',
      'marec',
      'april',
      'maj',
      'junij',
      'julij',
      'avgust',
      'september',
      'oktober',
      'november',
      'december',
    ],
    DDD: ['ned', 'pon', 'tor', 'sre', 'čet', 'pet', 'sob'],
    DDDD: [
      'nedelja',
      'ponedeljek',
      'torek',
      'sreda',
      'četrtek',
      'petek',
      'sobota',
    ],
  },
}

export default translation
