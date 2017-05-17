const ACTION      = require('constants/action')
const STATE       = require('constants/state')

let actions       = require('actions')
let reducers      = require('reducers')
let animationUtil = require('utils/animation')
let dateUtil      = require('utils/date')
let jsUtil        = require('utils/js')
let logUtil       = require('utils/log')



////////////
// CREATE //
////////////



/**
 * Creates a picker.
 * @param  {Object} [stateChanges]
 * @param  {Object} [options={}]
 *         {Function[]} [options.addons]
 *         {Function} [options.reducer]
 * @return {picker}
 */
function create(stateChanges, options = {}) {

  /**
   * The collection of state listeners.
   * @private
   * @type {Function[]}
   */
  let stateListeners = []

  /**
   * The state of the picker.
   * @type {Object}
   */
  let state = getInitialState(stateChanges, options.reducer)

  /**
   * The animation frame for notifying the state listeners.
   * @private
   * @type {Number}
   */
  let animationFrame = null

  /**
   * Triggers the state listeners with the previous state.
   * @private
   * @param  {Object} previousState
   */
  let triggerStateListeners = (previousState) => {
    animationFrame = animationUtil.getFrame(
      animationFrame,
      () => jsUtil.triggerAll(stateListeners, previousState)
    )
  }

  /**
   * Adds a state listener.
   * @param  {Function} listener
   */
  let addStateListener = (listener) => {
    stateListeners.push(listener)
  }

  /**
   * Removes a state listener.
   * @param  {Function} listener
   */
  let removeStateListener = (listener) => {
    let indexOfListener = stateListeners.indexOf(listener)
    if (indexOfListener > -1) {
      stateListeners.splice(indexOfListener, 1)
    }
  }

  /**
   * Dispatches an action that updates the state.
   * @param  {Object} action
   *         {ACTION.TYPE} action.type
   *         {Object} [action.payload]
   */
  let dispatch = (action) => {
    let previousState = state
    state = getNextState(state, action, options.reducer)
    triggerStateListeners(previousState)
  }

  /**
   * Gets the state of the picker.
   * @return {Object}
   */
  let getState = () => state

  /**
   * Gets the formatted value based on the selected state.
   * @param  {String} [template=state.template]
   * @param  {LANGUAGE} [language=state.language]
   * @return {String}
   */
  let getValue = (template = state.template, language = state.language) => {
    let { selected } = state
    return selected ? dateUtil.format(selected, template, language) : ''
  }

  // Create the picker api.
  let picker = {
    addStateListener,
    dispatch,
    getState,
    getValue,
    removeStateListener,
  }

  // Go through the actions and create a higher order function
  // for each that dispatches the action with the state and
  // any other arguments passed.
  Object.keys(actions).forEach(actionName => {
    /* istanbul ignore if: used as a debugging aid */
    if (picker[actionName]) {
      throw new Error(`The picker property "${actionName}" is already defined`)
    }
    picker[actionName] = (...args) => {
      picker.dispatch(actions[actionName](state, ...args))
    }
  })

  // Add all the addons
  jsUtil.triggerAll(options.addons, picker)

  // Return the final picker api
  return picker

}



/**
 * Gets the next state by passing a state through reducers
 * with a certain action.
 * @private
 * @param  {Object} state
 * @param  {Object} action
 * @param  {Function} [reducer]
 * @return {Object}
 */
function getNextState(state, action, reducer) {

  /* istanbul ignore if */
  if (process.env.DEBUG) {
    console.group('Action dispatched: %o', action.type)
    console.assert(action.type, 'An undefined action was dispatched')
    logUtil.payload(action.payload)
  }

  let previousState = state
  state = reducers.reduce(state, action)
  state = reducer ? reducer(state, action) : state

  /* istanbul ignore if */
  if (process.env.DEBUG) {
    logUtil.diff(previousState, state)
    console.groupEnd()
  }

  return state

}



/**
 * Gets the initial state with certain changes applied.
 * @private
 * @param  {Object} [stateChanges]
 * @param  {Function} [reducer]
 * @return {Object}
 */
function getInitialState(stateChanges, reducer) {

  let state = { ...STATE.INITIAL, ...stateChanges }
  let { language, selected, template } = state

  let action = {
    payload : { language, template, value: selected },
    type    : ACTION.TYPE.INITIALIZE,
  }

  return getNextState(state, action, reducer)

}





/////////////
// EXPORTS //
/////////////



module.exports = {
  create,
}
