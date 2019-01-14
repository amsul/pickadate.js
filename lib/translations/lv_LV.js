// @flow
// Latvian

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'YYYY.MM.DD. DDDD',
  templateHookWords: {
    MMM: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mai',
      'Jūn',
      'Jūl',
      'Aug',
      'Sep',
      'Okt',
      'Nov',
      'Dec',
    ],
    MMMM: [
      'Janvāris',
      'Februāris',
      'Marts',
      'Aprīlis',
      'Maijs',
      'Jūnijs',
      'Jūlijs',
      'Augusts',
      'Septembris',
      'Oktobris',
      'Novembris',
      'Decembris',
    ],
    DDD: ['Sv', 'P', 'O', 'T', 'C', 'Pk', 'S'],
    DDDD: [
      'Svētdiena',
      'Pirmdiena',
      'Otrdiena',
      'Trešdiena',
      'Ceturtdiena',
      'Piektdiena',
      'Sestdiena',
    ],
  },
}

export default translation
