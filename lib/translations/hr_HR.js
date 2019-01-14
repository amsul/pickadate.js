// @flow
// Croatian

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'D. MMMM YYYY.',
  templateHookWords: {
    MMM: [
      'sij',
      'velj',
      'ožu',
      'tra',
      'svi',
      'lip',
      'srp',
      'kol',
      'ruj',
      'lis',
      'stu',
      'pro',
    ],
    MMMM: [
      'siječanj',
      'veljača',
      'ožujak',
      'travanj',
      'svibanj',
      'lipanj',
      'srpanj',
      'kolovoz',
      'rujan',
      'listopad',
      'studeni',
      'prosinac',
    ],
    DDD: ['ned', 'pon', 'uto', 'sri', 'čet', 'pet', 'sub'],
    DDDD: [
      'nedjelja',
      'ponedjeljak',
      'utorak',
      'srijeda',
      'četvrtak',
      'petak',
      'subota',
    ],
  },
}

export default translation
