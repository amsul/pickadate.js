const ACTION = require('constants/action')



//////////////
// TEMPLATE //
//////////////



/**
 * Returns an action that sets the template to use to format a value.
 * @param  {String} template
 * @return {Object}
 */
let format = (template) => ({
  type    : ACTION.TYPE.FORMAT,
  payload : { template },
})





//////////
// OPEN //
//////////



/**
 * Returns an action that closes the picker.
 * @return {Object}
 */
// let close = () => ({
//   type    : ACTION.TYPE.SET_OPEN,
//   payload : { isOpened: false },
// })



/**
 * Returns an action that opens the picker.
 * @return {Object}
 */
// let open = () => ({
//   type    : ACTION.TYPE.SET_OPEN,
//   payload : { isOpened: true },
// })





////////////
// SELECT //
////////////



/**
 * Returns an action that selects a value for the picker.
 * @param  {Object} value
 * @param  {Object} template TODO: Default to initial state's template
 * @return {Object}
 */
let select = (value, template) => ({
  type    : ACTION.TYPE.SELECT,
  payload : { template, value },
})



/**
 * Returns an action that clears the value of the picker.
 * @return {Object}
 */
let clear = () => select(null)





//////////
// VIEW //
//////////



/**
 * Returns an action that shows the previous view of a certain scope.
 * @param  {SCOPE} scope
 * @return {Object}
 */
let showPreviousView = (scope) => ({
  type    : ACTION.TYPE.SHOW_PREVIOUS_VIEW,
  payload : { scope },
})



/**
 * Returns an action that shows the next view of a certain scope.
 * @param  {SCOPE} scope
 * @return {Object}
 */
let showNextView = (scope) => ({
  type    : ACTION.TYPE.SHOW_NEXT_VIEW,
  payload : { scope },
})



/**
 * Returns an action that shows the view of a certain date.
 * @param  {Date} view
 * @return {Object}
 */
let showView = (view) => ({
  type    : ACTION.TYPE.SHOW_VIEW,
  payload : { view },
})





///////////
// SCOPE //
///////////



/**
 * Returns an action that cycles to the next the scope of the picker.
 * @return {Object}
 */
let cycleScope = () => ({
  type: ACTION.TYPE.CYCLE_SCOPE,
})





/////////////
// EXPORTS //
/////////////



module.exports = {
  clear,
  // close,
  format,
  // open,
  select,
  cycleScope,
  showNextView,
  showPreviousView,
  showView,
}