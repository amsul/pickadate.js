// @flow

import type { DatePickerActor } from 'pickadate/types'

const clearActor: DatePickerActor<> = (state, payload) => ({
  selected: null,
})

export default clearActor
