// @flow

import type { DatePickerActor, SetHighlightedPayload } from 'pickadate/types'
import * as dateUtil from 'pickadate/utils/dateUtil'
import * as calendarUtil from 'pickadate/utils/calendarUtil'
import { KEY_CODE } from 'pickadate/constants'

const KEY_CODE_TO_DAY_DELTA = {
  [KEY_CODE.DOWN]: 7,
  [KEY_CODE.UP]: -7,
  [KEY_CODE.LEFT]: -1,
  [KEY_CODE.RIGHT]: 1,
}

const setHighlightedActor: DatePickerActor<SetHighlightedPayload> = (
  state,
  payload
) => {
  const dayDelta = KEY_CODE_TO_DAY_DELTA[payload.keyCode]
  if (!dayDelta) {
    return
  }

  const highlighted = new Date(state.highlighted)
  highlighted.setDate(highlighted.getDate() + dayDelta)

  const view = dateUtil.isSameMonth(state.view, highlighted)
    ? undefined
    : calendarUtil.getStartDateOfMonth(highlighted)

  return {
    highlighted,
    view,
  }
}

export default setHighlightedActor
