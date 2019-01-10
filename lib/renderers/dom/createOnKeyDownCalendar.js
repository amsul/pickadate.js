// @flow

import type { DatePickerCoreApi } from 'pickadate/types'
import { KEY_CODE, ARROW_KEY_CODES } from 'pickadate/constants'

const createOnKeyDownCalendar = (picker: DatePickerCoreApi) =>
  function onKeyDownCalendar(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.BACKSPACE) {
      event.preventDefault()
      picker.clear()
    } else if (
      event.keyCode === KEY_CODE.ENTER ||
      event.keyCode === KEY_CODE.SPACE
    ) {
      event.preventDefault()
      picker.setSelected({ value: picker.store.getState().highlighted })
    } else if (ARROW_KEY_CODES.includes(event.keyCode)) {
      event.preventDefault()
      picker.setHighlighted({ keyCode: event.keyCode })
    }
  }

export default createOnKeyDownCalendar
