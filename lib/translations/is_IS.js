// @flow
// Icelandic

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'DD. MMMM YYYY',
  templateHookWords: {
    MMM: [
      'jan',
      'feb',
      'mar',
      'apr',
      'maí',
      'jún',
      'júl',
      'ágú',
      'sep',
      'okt',
      'nóv',
      'des',
    ],
    MMMM: [
      'janúar',
      'febrúar',
      'mars',
      'apríl',
      'maí',
      'júní',
      'júlí',
      'ágúst',
      'september',
      'október',
      'nóvember',
      'desember',
    ],
    DDD: ['sun', 'mán', 'þri', 'mið', 'fim', 'fös', 'lau'],
    DDDD: [
      'sunnudagur',
      'mánudagur',
      'þriðjudagur',
      'miðvikudagur',
      'fimmtudagur',
      'föstudagur',
      'laugardagur',
    ],
  },
}

export default translation
