const ACTION        = require('constants/action')
const domainReducer = require('reducers/domain')
const reducerUtil   = require('utils/reducer')



/**
 * Reduces a state with the CYCLE_SCOPE action.
 * @param  {Object} state
 * @param  {ACTION.TYPE.CYCLE_SCOPE} action
 * @return {Object}
 */
function cycleScopeReducer(state, action) {
  return reducerUtil.reduceAll(state, action, [
    domainReducer.scope,
  ])
}



/**
 * Reduces a state with the DISABLE action.
 * @param  {Object} state
 * @param  {ACTION.TYPE.DISABLE} action
 * @return {Object}
 */
function disableReducer(state, action) {
  return reducerUtil.reduceAll(state, action, [
    domainReducer.disabled,

    // TODO: Update selected
    // Order matters
    // domainReducer.selected,
    // domainReducer.view,
  ])
}



/**
 * Reduces a state with the ENABLE action.
 * @param  {Object} state
 * @param  {ACTION.TYPE.ENABLE} action
 * @return {Object}
 */
function enableReducer(state, action) {
  return reducerUtil.reduceAll(state, action, [
    domainReducer.disabled,
  ])
}



/**
 * Reduces a state with the INITIALIZE action.
 * @param  {Object} state
 * @param  {ACTION.TYPE.INITIALIZE} action
 * @return {Object}
 */
function initializeReducer(state, action) {
  return reducerUtil.reduceAll(state, action, [
    domainReducer.disabled,
    domainReducer.firstDay,
    domainReducer.language,
    domainReducer.scope,
    domainReducer.today,

    // Order matters
    domainReducer.template,
    domainReducer.selected,
    domainReducer.view,
  ])

}



/**
 * Reduces a state with the SELECT action.
 * @param  {Object} state
 * @param  {ACTION.TYPE.SELECT} action
 * @return {Object}
 */
function selectReducer(state, action) {
  return reducerUtil.reduceAll(state, action, [

    // Order matters
    domainReducer.selected,
    domainReducer.view,
    domainReducer.scope,
  ])
}



/**
 * Reduces a state with the SELECT_IN_PERIOD action.
 * @param  {Object} state
 * @param  {ACTION.TYPE.SELECT_IN_PERIOD} action
 * @return {Object}
 */
function selectInPeriodReducer(state, action) {
  return reducerUtil.reduceAll(state, action, [
    domainReducer.selected,
    domainReducer.view,
  ])
}



/**
 * Reduces a state with the SET_FIRST_DAY action.
 * @param  {Object} state
 * @param  {ACTION.TYPE.SET_FIRST_DAY} action
 * @return {Object}
 */
function setFirstDayReducer(state, action) {
  return reducerUtil.reduceAll(state, action, [
    domainReducer.firstDay,
  ])
}



/**
 * Reduces a state with the SET_LANGUAGE action.
 * @param  {Object} state
 * @param  {ACTION.TYPE.SET_LANGUAGE} action
 * @return {Object}
 */
function setLanguageReducer(state, action) {
  return reducerUtil.reduceAll(state, action, [
    domainReducer.language,
  ])
}



module.exports = {
  [ACTION.TYPE.CYCLE_SCOPE]      : cycleScopeReducer,
  [ACTION.TYPE.DISABLE]          : disableReducer,
  [ACTION.TYPE.ENABLE]           : enableReducer,
  [ACTION.TYPE.INITIALIZE]       : initializeReducer,
  [ACTION.TYPE.SELECT]           : selectReducer,
  [ACTION.TYPE.SELECT_IN_PERIOD] : selectInPeriodReducer,
  [ACTION.TYPE.SET_FIRST_DAY]    : setFirstDayReducer,
  [ACTION.TYPE.SET_LANGUAGE]     : setLanguageReducer,
}
