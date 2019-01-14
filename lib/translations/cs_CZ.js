// @flow
// Czech

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'D. MMMM YYYY',
  templateHookWords: {
    MMM: [
      'led',
      'úno',
      'bře',
      'dub',
      'kvě',
      'čer',
      'čvc',
      'srp',
      'zář',
      'říj',
      'lis',
      'pro',
    ],
    MMMM: [
      'leden',
      'únor',
      'březen',
      'duben',
      'květen',
      'červen',
      'červenec',
      'srpen',
      'září',
      'říjen',
      'listopad',
      'prosinec',
    ],
    DDD: ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
    DDDD: [
      'neděle',
      'pondělí',
      'úterý',
      'středa',
      'čtvrtek',
      'pátek',
      'sobota',
    ],
  },
}

export default translation
