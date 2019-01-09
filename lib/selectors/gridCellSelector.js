// @flow

import type { DatePickerState } from 'pickadate/types'
import * as dateUtil from 'pickadate/utils/dateUtil'

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
  isDisabled: isDateDisabled(state, dateObject),
})

const isDateDisabled = (state, dateObject) => {
  const { minimum, maximum, disabled } = state
  return (
    dateUtil.isBeforeDate(dateObject, minimum) ||
    dateUtil.isBeforeDate(maximum, dateObject) ||
    disabled.some(value => {
      if (typeof value === 'number') {
        return dateObject.getDay() === value
      }
      if (value instanceof Date) {
        return dateUtil.isSameDate(dateObject, value)
      }
      if (Array.isArray(value)) {
        const [fromDate, toDate] = value
        return (
          dateUtil.isSameOrBeforeDate(fromDate, dateObject) &&
          dateUtil.isSameOrBeforeDate(dateObject, toDate)
        )
      }
    })
  )
}
