// @flow
// Serbian (Latin)

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'D. MMMM YYYY.',
  templateHookWords: {
    MMM: [
      'jan.',
      'feb.',
      'mart',
      'apr.',
      'maj',
      'jun',
      'jul',
      'avg.',
      'sept.',
      'okt.',
      'nov.',
      'dec.',
    ],
    MMMM: [
      'januar',
      'februar',
      'mart',
      'april',
      'maj',
      'jun',
      'juli',
      'avgust',
      'septembar',
      'oktobar',
      'novembar',
      'decembar',
    ],
    DDD: ['ned.', 'pon.', 'ut.', 'sr.', 'čet.', 'pet.', 'sub.'],
    DDDD: [
      'nedelja',
      'ponedeljak',
      'utorak',
      'sreda',
      'četvrtak',
      'petak',
      'subota',
    ],
  },
}

export default translation
