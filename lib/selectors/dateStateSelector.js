// @flow

import type { DatePickerState } from '../types'

export const isDateDisabled = (
  dateState: DatePickerState,
  dateObject: Date
) => {
  const { minimum, maximum } = dateState
  return (
    (!!minimum && dateObject < minimum) || (!!maximum && dateObject > maximum)
  )
}
