const ACTION     = require('constants/action')

let calendarUtil = require('utils/calendar')



//////////////
// TEMPLATE //
//////////////



/**
 * Returns an action that sets the template to use to format a value.
 * ??
 * @param  {String} template
 * @return {Object}
 */
// let format = (template) => ({
//   type    : ACTION.TYPE.FORMAT,
//   payload : { template },
// })





//////////
// OPEN //
//////////



/**
 * Returns an action that marks the picker as closed.
 * @return {Object}
 */
// let close = () => ({
//   type    : ACTION.TYPE.SET_OPEN,
//   payload : { isOpened: false },
// })



/**
 * Returns an action that marks the picker as opened.
 * @return {Object}
 */
// let open = () => ({
//   type    : ACTION.TYPE.SET_OPEN,
//   payload : { isOpened: true },
// })





/////////////
// CONFIRM //
/////////////



/**
 * Returns an action that confirms the selected value.
 * @return {Object}
 */
let confirm = () => ({
  type : ACTION.TYPE.CONFIRM,
})





////////////
// SELECT //
////////////



/**
 * Returns an action that selects a value.
 *
 * TODO: Require a `scope` and `template` when there is a value
 *
 * @param  {Object} state
 * @param  {Date|Number|null} [value]
 * @return {Object}
 */
let select = ({ scope, selected, template }, value) => ({
  type    : ACTION.TYPE.SELECT,
  payload : { scope, selected, template, value },
})



/**
 * Returns an action that clears the value.
 * @return {Object}
 */
let clear = () => select({}, null)





//////////
// SHOW //
//////////



/**
 * Returns an action that selects a scoped value.
 * @param  {Object} state
 * @param  {Date|String} value
 * @return {Object}
 */
let show = ({ scope, selected, template }, value) => ({
  type    : ACTION.TYPE.SHOW,
  payload : { scope, selected, template, value },
})



/**
 * Returns an action that selects a scoped value from the previous view.
 * @param  {Object} state
 * @return {Object}
 */
let showPrevious = ({ scope, selected, template, view }) => (
  show(
    { scope, selected, template },
    calendarUtil.getDateOfPreviousScope(selected || view, scope)
  )
)



/**
 * Returns an action that selects a scoped value from the next view.
 * @param  {Object} state
 * @return {Object}
 */
let showNext = ({ scope, selected, template, view }) => (
  show(
    { scope, selected, template },
    calendarUtil.getDateOfNextScope(selected || view, scope)
  )
)



/**
 * Returns an action that selects "today".
 * @param  {Object} state
 * @return {Object}
 */
let showToday = ({ scope, selected, template, today }) => (
  show({ scope, selected, template }, today)
)





///////////
// SCOPE //
///////////



/**
 * Returns an action that cycles through the scopes.
 * @return {Object}
 */
let cycleScope = () => ({
  type: ACTION.TYPE.CYCLE_SCOPE,
})





/////////////
// DISABLE //
/////////////



/**
 * Returns an action that disables dates and days.
 * @param  {Object}    state
 * @param  {...(Date|Number)} values
 * @return {Object}
 */
let disable = (state, ...values) => ({
  type    : ACTION.TYPE.DISABLE,
  payload : { values },
})



/**
 * Returns an action that enables dates and days.
 * @param  {Object}    state
 * @param  {...(Date|Number)} values
 * @return {Object}
 */
let enable = (state, ...values) => ({
  type    : ACTION.TYPE.ENABLE,
  payload : { values },
})





/////////////
// EXPORTS //
/////////////



module.exports = {

  // Template
  // format,

  // Open
  // close,
  // open,

  // Confirm
  confirm,

  // Select
  clear,
  select,

  // Show
  show,
  showNext,
  showPrevious,
  showToday,

  // Scope
  cycleScope,

  // Disable
  disable,
  enable,

}