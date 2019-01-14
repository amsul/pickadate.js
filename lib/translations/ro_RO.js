// @flow
// Romanian

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'DD MMMM YYYY',
  templateHookWords: {
    MMM: [
      'ian',
      'feb',
      'mar',
      'apr',
      'mai',
      'iun',
      'iul',
      'aug',
      'sep',
      'oct',
      'noi',
      'dec',
    ],
    MMMM: [
      'ianuarie',
      'februarie',
      'martie',
      'aprilie',
      'mai',
      'iunie',
      'iulie',
      'august',
      'septembrie',
      'octombrie',
      'noiembrie',
      'decembrie',
    ],
    DDD: ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'],
    DDDD: ['duminică', 'luni', 'marţi', 'miercuri', 'joi', 'vineri', 'sâmbătă'],
  },
}

export default translation
