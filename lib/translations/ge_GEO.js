// @flow
// Georgian

import type { Translation } from 'pickadate/types'

const translation: Translation = {
  firstDayOfWeek: 1,
  template: 'D MMMM YYYY',
  templateHookWords: {
    MMM: [
      'იან',
      'თებ',
      'მარტ',
      'აპრ',
      'მაი',
      'ივნ',
      'ივლ',
      'აგვ',
      'სექტ',
      'ოქტ',
      'ნოემ',
      'დეკ',
    ],
    MMMM: [
      'იანვარი',
      'თებერვალი',
      'მარტი',
      'აპრილი',
      'მაისი',
      'ივნისი',
      'ივლისი',
      'აგვისტო',
      'სექტემბერი',
      'ოქტომბერი',
      'ნოემბერი',
      'დეკემბერი',
    ],
    DDD: ['კვ', 'ორ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ'],
    DDDD: [
      'კვირა',
      'ორშაბათი',
      'სამშაბათი',
      'ოთხშაბათი',
      'ხუშაბათი',
      'პარასკევი',
      'შაბათი',
    ],
  },
}

export default translation
