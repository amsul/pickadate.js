// @flow
// Bosnian

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'DD. MMMM YYYY.',
  templateHookWords: {
    MMM: [
      'jan',
      'feb',
      'mar',
      'apr',
      'maj',
      'jun',
      'jul',
      'aug',
      'sep',
      'okt',
      'nov',
      'dec',
    ],
    MMMM: [
      'januar',
      'februar',
      'mart',
      'april',
      'maj',
      'juni',
      'juli',
      'august',
      'septembar',
      'oktobar',
      'novembar',
      'decembar',
    ],
    DDD: ['ne', 'po', 'ut', 'sr', 'če', 'pe', 'su'],
    DDDD: [
      'nedjelja',
      'ponedjeljak',
      'utorak',
      'srijeda',
      'cetvrtak',
      'petak',
      'subota',
    ],
  },
}

export default translation
