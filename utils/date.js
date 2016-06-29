const DAY    = require('constants/day')
const MONTH  = require('constants/month')

let language = require('language')



////////////
// CREATE //
////////////



function create(value) {

  if (Number.isInteger(value)) {
    return new Date(value)
  }

  if (typeof value === 'string') {
    // TODO: Parse string into a date
    debugger
  }

  return value

}





////////////
// MONTHS //
////////////



/**
 * Gets a list of the full month names.
 * @return {String[]}
 */
function getFullMonthNames() {
  return getLanguageValues(MONTH.FULL)
}



/**
 * Gets a list of the short month names.
 * @return {String[]}
 */
function getShortMonthNames() {
  return getLanguageValues(MONTH.SHORT)
}



/**
 * Gets the full name of a specific month.
 * @param  {Number} month
 * @return {String}
 */
function getFullMonthName(month) {
  return getLanguageValue(MONTH.FULL, month)
}



/**
 * Gets the short name of a specific month.
 * @param  {Number} month
 * @return {String}
 */
function getShortMonthName(month) {
  return getLanguageValue(MONTH.SHORT, month)
}





//////////
// DAYS //
//////////



/**
 * Gets a list of the full day names.
 * @return {String[]}
 */
function getFullDayNames() {
  return getLanguageValues(DAY.FULL)
}



/**
 * Gets a list of the short day names.
 * @return {String[]}
 */
function getShortDayNames() {
  return getLanguageValues(DAY.SHORT)
}



/**
 * Gets the full name of a specific day.
 * @param  {Number} day
 * @return {String}
 */
function getFullDayName(day) {
  return getLanguageValue(DAY.FULL, day)
}



/**
 * Gets the short name of a specific day.
 * @param  {Number} day
 * @return {String}
 */
function getShortDayName(day) {
  return getLanguageValue(DAY.SHORT, day)
}





//////////////
// CHECKERS //
//////////////



function isSameDate(one, two) {

  one = create(one)
  two = create(two)

  return (
    isSameMonth(one, two) &&
    one.getDate() === two.getDate()
  )

}



function isSameMonth(one, two) {

  one = create(one)
  two = create(two)

  return (
    isSameYear(one, two) &&
    one.getMonth() === two.getMonth()
  )

}



function isSameYear(one, two) {

  one = create(one)
  two = create(two)

  return (
    one instanceof Date &&
    two instanceof Date &&
    one.getFullYear() === two.getFullYear()
  )

}





/////////////
// HELPERS //
/////////////



/**
 * Gets the values for a language.
 *
 * @private
 *
 * @param  {Object} languagesValues
 * @return {Object}
 */
function getLanguageValues(languagesValues) {
  let languageValues = languagesValues[language.current]
  return Object.keys(languageValues).map(key => languageValues[key])
}



/**
 * Gets the value for a language by key.
 *
 * @private
 *
 * @param  {Object} languagesValues
 * @param  {String} key
 * @return {String}
 */
function getLanguageValue(languagesValues, key) {
  return languagesValues[language.current][key]
}





/////////////
// EXPORTS //
/////////////



module.exports = {
  create,
  getFullDayName,
  getFullDayNames,
  getFullMonthName,
  getFullMonthNames,
  getShortDayName,
  getShortDayNames,
  getShortMonthName,
  getShortMonthNames,
  isSameDate,
  isSameMonth,
  isSameYear,
}