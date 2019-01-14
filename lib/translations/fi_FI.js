// @flow
// Finnish

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'D.M.YYYY',
  templateHookWords: {
    MMM: [
      'jaan',
      'veebr',
      'märts',
      'apr',
      'mai',
      'juuni',
      'juuli',
      'aug',
      'sept',
      'okt',
      'nov',
      'dets',
    ],
    MMMM: [
      'jaanuar',
      'veebruar',
      'märts',
      'aprill',
      'mai',
      'juuni',
      'juuli',
      'august',
      'september',
      'oktoober',
      'november',
      'detsember',
    ],
    DDD: ['püh', 'esm', 'tei', 'kol', 'nel', 'ree', 'lau'],
    DDDD: [
      'pühapäev',
      'esmaspäev',
      'teisipäev',
      'kolmapäev',
      'neljapäev',
      'reede',
      'laupäev',
    ],
  },
}

export default translation
