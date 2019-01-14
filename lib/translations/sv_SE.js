// @flow
// Swedish

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'YYYY-MM-DD',
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
      'januari',
      'februari',
      'mars',
      'april',
      'maj',
      'juni',
      'juli',
      'augusti',
      'september',
      'oktober',
      'november',
      'december',
    ],
    DDD: ['sön', 'mån', 'tis', 'ons', 'tor', 'fre', 'lör'],
    DDDD: [
      'söndag',
      'måndag',
      'tisdag',
      'onsdag',
      'torsdag',
      'fredag',
      'lördag',
    ],
  },
}

export default translation
