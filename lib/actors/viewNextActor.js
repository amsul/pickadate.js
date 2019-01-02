// @flow

import type { DatePickerActor } from '../types'
import * as actorUtil from '../utils/actorUtil'

const viewNextActor: DatePickerActor<> = (state, payload) => {
  let { view } = state
  view = new Date(view.getFullYear(), view.getMonth() + 1, view.getDate())
  return {
    highlighted: actorUtil.getHighlighted(state.selected, view),
    view,
  }
}

export default viewNextActor
