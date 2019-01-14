// @flow
// Lietuviškai

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'YYYY-MM-DD',
  templateHookWords: {
    MMM: [
      'Sau',
      'Vas',
      'Kov',
      'Bal',
      'Geg',
      'Bir',
      'Lie',
      'Rgp',
      'Rgs',
      'Spa',
      'Lap',
      'Grd',
    ],
    MMMM: [
      'Sausis',
      'Vasaris',
      'Kovas',
      'Balandis',
      'Gegužė',
      'Birželis',
      'Liepa',
      'Rugpjūtis',
      'Rugsėjis',
      'Spalis',
      'Lapkritis',
      'Gruodis',
    ],
    DDD: ['Sk', 'Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št'],
    DDDD: [
      'Sekmadienis',
      'Pirmadienis',
      'Antradienis',
      'Trečiadienis',
      'Ketvirtadienis',
      'Penktadienis',
      'Šeštadienis',
    ],
  },
}

export default translation
