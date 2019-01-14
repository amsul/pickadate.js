// @flow
// Khmer

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'ថ្ងៃទី D ខែMMMM ឆ្នាំ YYYY',
  templateHookWords: {
    MMM: [
      'មក.',
      'កុ.',
      'មី.',
      'មេ.',
      'ឧស.',
      'មិថុ.',
      'កក្ក.',
      'សី.',
      'កញ.',
      'តុ.',
      'វិច្ឆ.',
      'ធ.',
    ],
    MMMM: [
      'មករា',
      'កុម្ភៈ',
      'មីនា',
      'មេសា',
      'ឧសភា',
      'មិថុនា',
      'កក្កដា',
      'សីហា',
      'កញ្ញា',
      'តុលា',
      'វិច្ឆិកា',
      'ធ្នូ',
    ],
    DDD: ['អា.', 'ច.', 'អ.', 'ព.', 'ព្រ.', 'សុ.', 'ស.'],
    DDDD: ['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'],
  },
}

export default translation
