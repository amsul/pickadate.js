// @flow

import type { DatePickerState } from '../types'
import * as dateUtil from '../utils/dateUtil'

export const isDateDisabled = (
  dateState: DatePickerState,
  dateObject: Date
) => {
  const { minimum, maximum, disabled } = dateState
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
