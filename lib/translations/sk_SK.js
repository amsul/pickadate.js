// @flow
// Slovak

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'D. MMMM YYYY',
  templateHookWords: {
    MMM: [
      'jan',
      'feb',
      'mar',
      'apr',
      'máj',
      'jún',
      'júl',
      'aug',
      'sep',
      'okt',
      'nov',
      'dec',
    ],
    MMMM: [
      'január',
      'február',
      'marec',
      'apríl',
      'máj',
      'jún',
      'júl',
      'august',
      'september',
      'október',
      'november',
      'december',
    ],
    DDD: ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'],
    DDDD: [
      'nedeľa',
      'pondelok',
      'utorok',
      'streda',
      'štvrtok',
      'piatok',
      'sobota',
    ],
  },
}

export default translation
