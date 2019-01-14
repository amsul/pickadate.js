// @flow
// Catalan

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'DDDD D de MMMM de YYYY',
  templateHookWords: {
    MMM: [
      'Gen',
      'Feb',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Oct',
      'Nov',
      'Des',
    ],
    MMMM: [
      'Gener',
      'Febrer',
      'Març',
      'Abril',
      'Maig',
      'juny',
      'Juliol',
      'Agost',
      'Setembre',
      'Octubre',
      'Novembre',
      'Desembre',
    ],
    DDD: ['diu', 'dil', 'dim', 'dmc', 'dij', 'div', 'dis'],
    DDDD: [
      'diumenge',
      'dilluns',
      'dimarts',
      'dimecres',
      'dijous',
      'divendres',
      'dissabte',
    ],
  },
}

export default translation
