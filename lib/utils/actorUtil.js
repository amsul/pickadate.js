// @flow

import * as dateUtil from 'pickadate/utils/dateUtil'

export const getHighlighted = (selected: ?Date, view: Date) => {
  if (selected && dateUtil.isSameMonth(selected, view)) {
    return new Date(
      selected.getFullYear(),
      selected.getMonth(),
      selected.getDate()
    )
  }

  return new Date(view.getFullYear(), view.getMonth(), 1)
}
