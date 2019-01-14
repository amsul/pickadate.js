// @flow
// Hindi

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'DD/MM/YYYY',
  templateHookWords: {
    MMM: [
      'जन',
      'फर',
      'मार्च',
      'अप्रैल',
      'मई',
      'जून',
      'जु',
      'अग',
      'सित',
      'अक्टू',
      'नव',
      'दिस',
    ],
    MMMM: [
      'जनवरी',
      'फरवरी',
      'मार्च',
      'अप्रैल',
      'मई',
      'जून',
      'जुलाई',
      'अगस्त',
      'सितम्बर',
      'अक्टूबर',
      'नवम्बर',
      'दिसम्बर',
    ],
    DDD: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
    DDDD: [
      'रविवार',
      'सोमवार',
      'मंगलवार',
      'बुधवार',
      'गुरुवार',
      'शुक्रवार',
      'शनिवार',
    ],
  },
}

export default translation
