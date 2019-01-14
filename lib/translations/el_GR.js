// @flow
// Greek

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'D MMMM YYYY',
  templateHookWords: {
    MMM: [
      'Ιαν',
      'Φεβ',
      'Μαρ',
      'Απρ',
      'Μαι',
      'Ιουν',
      'Ιουλ',
      'Αυγ',
      'Σεπ',
      'Οκτ',
      'Νοε',
      'Δεκ',
    ],
    MMMM: [
      'Ιανουάριος',
      'Φεβρουάριος',
      'Μάρτιος',
      'Απρίλιος',
      'Μάιος',
      'Ιούνιος',
      'Ιούλιος',
      'Αύγουστος',
      'Σεπτέμβριος',
      'Οκτώβριος',
      'Νοέμβριος',
      'Δεκέμβριος',
    ],
    DDD: ['Κυρ', 'Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ'],
    DDDD: [
      'Κυριακή',
      'Δευτέρα',
      'Τρίτη',
      'Τετάρτη',
      'Πέμπτη',
      'Παρασκευή',
      'Σάββατο',
    ],
  },
}

export default translation
