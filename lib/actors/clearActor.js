// @flow

import type { DatePickerActor } from '../types'

const clearActor: DatePickerActor<> = (state, payload) => ({
  selected: null,
})

export default clearActor
