const SCOPE      = require('constants/scope')

let calendarUtil = require('utils/calendar')
let dateUtil     = require('utils/date')
let stateUtil    = require('utils/state')



function selected(state, nextState) {

  if (stateUtil.isNotChanging(state, nextState, 'selected')) {
    return nextState
  }

  return {
    ...nextState,
    selected: dateUtil.create(nextState.selected)
  }

}



function today(state, nextState) {

  if (
    nextState.today &&
    stateUtil.isNotChanging(state, nextState, 'today')
  ) {
    return nextState
  }

  return {
    ...nextState,
    today: nextState.today ? dateUtil.create(nextState.today) : new Date()
  }

}



function view(state, nextState) {

  if (
    nextState.view &&
    stateUtil.isNotChanging(state, nextState, 'view', 'selected')
  ) {
    return nextState
  }

  let nextView = (
    nextState.selected &&
    stateUtil.isChanging(state, nextState, 'selected')
      ? nextState.selected
      : nextState.view || nextState.selected || nextState.today
  )

  return {
    ...nextState,
    view: calendarUtil.getStartDateOfMonth(nextView)
  }

}



function scope(state, nextState) {

  if (
    stateUtil.isNotChanging(state, nextState, 'selected') &&
    stateUtil.isChangingAny(state, nextState, 'scope', 'view')
  ) {
    return nextState
  }

  let nextScope = nextState.scope === SCOPE.YEARS
    ? SCOPE.MONTHS
    : SCOPE.DAYS

  return {
    ...nextState,
    scope: nextScope
  }

}



module.exports = {
  scope,
  selected,
  today,
  view,
}