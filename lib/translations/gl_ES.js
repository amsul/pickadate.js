// @flow
// Galician

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'DDDD D de MMMM de YYYY',
  templateHookWords: {
    MMM: [
      'xan',
      'feb',
      'mar',
      'abr',
      'mai',
      'xun',
      'xul',
      'ago',
      'sep',
      'out',
      'nov',
      'dec',
    ],
    MMMM: [
      'Xaneiro',
      'Febreiro',
      'Marzo',
      'Abril',
      'Maio',
      'Xuño',
      'Xullo',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Decembro',
    ],
    DDD: ['dom', 'lun', 'mar', 'mér', 'xov', 'ven', 'sab'],
    DDDD: [
      'domingo',
      'luns',
      'martes',
      'mércores',
      'xoves',
      'venres',
      'sábado',
    ],
  },
}

export default translation
