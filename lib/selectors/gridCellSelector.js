// @flow

import type { DatePickerState } from 'pickadate/types'
import * as dateUtil from 'pickadate/utils/dateUtil'
import * as dateSelector from 'pickadate/selectors/dateSelector'

type ComputeInfo = (
  state: DatePickerState,
  dateObject: Date
) => {
  isToday: boolean,
  isSelected: boolean,
  isHighlighted: boolean,
  isSameMonth: boolean,
  isDisabled: boolean,
}

export const computeInfo: ComputeInfo = (state, dateObject) => ({
  isToday: dateUtil.isSameDate(new Date(), dateObject),
  isSelected: dateUtil.isSameDate(state.selected, dateObject),
  isHighlighted: dateUtil.isSameDate(state.highlighted, dateObject),
  isSameMonth: dateUtil.isSameMonth(state.view, dateObject),
  isDisabled: dateSelector.isDisabled(state, dateObject),
})
