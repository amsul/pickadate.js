// @flow

import type { DatePickerStore } from 'pickadate/types'
import { KEY_CODE, ARROW_KEY_CODES } from 'pickadate/constants'

const createOnKeyDownCalendar = (dateStore: DatePickerStore) =>
  function onKeyDownCalendar(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.BACKSPACE) {
      event.preventDefault()
      dateStore.clear()
    } else if (
      event.keyCode === KEY_CODE.ENTER ||
      event.keyCode === KEY_CODE.SPACE
    ) {
      event.preventDefault()
      dateStore.setSelected({ value: dateStore.getState().highlighted })
    } else if (ARROW_KEY_CODES.includes(event.keyCode)) {
      event.preventDefault()
      dateStore.setHighlighted({ keyCode: event.keyCode })
    }
  }

export default createOnKeyDownCalendar
