// @flow

import type { DatePickerState } from 'pickadate/types'
import * as dateUtil from 'pickadate/utils/dateUtil'

type IsDisabled = (state: DatePickerState, dateObject: Date) => boolean

export const isDisabled: IsDisabled = (state, dateObject) => {
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
