// @flow
// Hungarian

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'YYYY. MMMM DD.',
  templateHookWords: {
    MMM: [
      'jan',
      'febr',
      'márc',
      'ápr',
      'máj',
      'jún',
      'júl',
      'aug',
      'szept',
      'okt',
      'nov',
      'dec',
    ],
    MMMM: [
      'január',
      'február',
      'március',
      'április',
      'május',
      'június',
      'július',
      'augusztus',
      'szeptember',
      'október',
      'november',
      'december',
    ],
    DDD: ['V', 'H', 'K', 'Sze', 'CS', 'P', 'Szo'],
    DDDD: [
      'vasárnap',
      'hétfő',
      'kedd',
      'szerda',
      'csütörtök',
      'péntek',
      'szombat',
    ],
  },
}

export default translation
