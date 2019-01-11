// @flow

import type { DatePickerActor } from 'pickadate/types'
import * as actorUtil from 'pickadate/utils/actorUtil'

const viewPreviousActor: DatePickerActor<> = state => {
  let { view } = state
  view = new Date(view.getFullYear(), view.getMonth() - 1, 1)
  return {
    highlighted: actorUtil.getHighlighted(state.selected, view),
    view,
  }
}

export default viewPreviousActor
