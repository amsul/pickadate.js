// @flow

import type { DatePickerActor } from '../types'

const viewPreviousActor: DatePickerActor<> = (state, payload) => {
  const { view } = state
  return {
    view: new Date(view.getFullYear(), view.getMonth() - 1, view.getDate()),
  }
}

export default viewPreviousActor
