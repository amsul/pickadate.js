const actions       = require('actions')
const animationUtil = require('utils/animation')
const dateUtil      = require('utils/date')
const jsUtil        = require('utils/js')
const stateUtil     = require('utils/state')



////////////
// CREATE //
////////////



/**
 * Creates a picker.
 * @param  {Object} [options={}]
 *         {Function[]} [options.addons]
 *         {Function} [options.reducer]
 *         {Object} [options.payload]
 * @return {picker}
 */
function create(options = {}) {

  /**
   * The collection of state listeners.
   * @private
   * @type {Function[]}
   */
  const stateListeners = []

  /**
   * The state of the picker.
   * @type {Object}
   */
  let state = stateUtil.getInitial(options.payload, options.reducer)

  /**
   * The previous state of the picker since the last notify.
   * @type {Object}
   */
  let previousState = state

  /**
   * The animation frame for notifying the state listeners.
   * @private
   * @type {Number}
   */
  let animationFrame = null

  /**
   * Triggers the state listeners with the previous state.
   * @private
   */
  const triggerStateListeners = () => {
    animationFrame = animationUtil.getFrame(animationFrame, () => {
      jsUtil.triggerAll(stateListeners, previousState)
      previousState = state
    })
  }

  /**
   * Adds a state listener.
   * @param  {Function} listener
   */
  const addStateListener = (listener) => {
    stateListeners.push(listener)
  }

  /**
   * Removes a state listener.
   * @param  {Function} listener
   */
  const removeStateListener = (listener) => {
    const indexOfListener = stateListeners.indexOf(listener)
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
  const dispatch = (action) => {
    state = stateUtil.getNext(state, action, options.reducer)
    triggerStateListeners()
  }

  /**
   * Gets the state of the picker.
   * @return {Object}
   */
  const getState = () => state

  /**
   * Gets the formatted value based on the selected state.
   * @param  {String} [template=state.template]
   * @param  {LANGUAGE} [language=state.language]
   * @return {String}
   */
  const getValue = (template = state.template, language = state.language) => {
    const { selected } = state
    return selected ? dateUtil.format(selected, template, language) : ''
  }

  // Create the picker api.
  const picker = {
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
      picker.dispatch(actions[actionName](...args))
    }
  })

  // Add all the addons
  jsUtil.triggerAll(options.addons, picker)

  // Return the final picker api
  return picker

}





/////////////
// EXPORTS //
/////////////



module.exports = {
  create,
}
