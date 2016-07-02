const DAY    = require('constants/day')
const MONTH  = require('constants/month')

let language = require('language')
let jsUtil   = require('utils/js')



////////////
// CREATE //
////////////



function create(value) {

  if (Number.isInteger(value)) {
    return new Date(value)
  }

  // if (typeof value === 'string') {
  //   // TODO: Parse string into a date
  //   debugger
  // }

  return value

}





////////////
// FORMAT //
////////////



/**
 * A mapping of template hooks to formatters.
 * @private
 * @type {Object(Function)}
 */
const TEMPLATE = {
  d(dateObject) {
    return `${dateObject.getDate()}`
  },
  dd(dateObject) {
    return `${jsUtil.padZero(TEMPLATE.d(dateObject), 2)}`
  },
  ddd(dateObject) {
    return getShortDayName(dateObject.getDay())
  },
  dddd(dateObject) {
    return getFullDayName(dateObject.getDay())
  },
  m(dateObject) {
    return `${dateObject.getMonth() + 1}`
  },
  mm(dateObject) {
    return `${jsUtil.padZero(TEMPLATE.m(dateObject), 2)}`
  },
  mmm(dateObject) {
    return getShortMonthName(dateObject.getMonth())
  },
  mmmm(dateObject) {
    return getFullMonthName(dateObject.getMonth())
  },
  yyyy(dateObject) {
    return `${dateObject.getFullYear()}`
  },
}



/**
 * A collection of the template hooks.
 * @private
 * @type {String[]}
 */
const TEMPLATE_HOOKS = Object.keys(TEMPLATE)



/**
 * A regular expression that matches all segments of a template string.
 * @private
 * @type {RegExp}
 */
const TEMPLATE_REGEXP = new RegExp([

  // Match any characters escaped with square brackets
  '(\\[.*?\\])',

  // Match any template hooks
  `(?:\\b(${TEMPLATE_HOOKS.join('|')})\\b)`,

  // Match all other characters
  '(.)',

].join('|'), 'g')



/**
 * Formats a date object with a given template.
 * @param  {Date} dateObject
 * @param  {String} template
 * @return {String}
 */
function format(dateObject, template) {

  dateObject = create(dateObject)

  return (
    template

      // Split the template using the regular expression
      .split(TEMPLATE_REGEXP)

      // Map the chunks to keep a reference of their match index
      .map((chunk, index) => ({ chunk, index: index % 4 }))

      // Filter out false-y chunks
      .filter(match => !!match.chunk)

      // Map through the matches while formatting template hooks
      // and removing the hooks of escaped characters
      .map(match => (
        match.index === 2
          ? TEMPLATE[match.chunk](dateObject)
          : match.chunk.replace(/^\[(.*)]$/, '$1')
      ))

      // Join the chunks together into a string
      .join('')

  )

}





////////////////////
// MONTHS GETTERS //
////////////////////



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





//////////////////
// DAYS GETTERS //
//////////////////



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



/**
 * Checks if two dates fall on the same date.
 * @param  {Date}  one
 * @param  {Date}  two
 * @return {Boolean}
 */
function isSameDate(one, two) {

  one = create(one)
  two = create(two)

  return (
    isSameMonth(one, two) &&
    one.getDate() === two.getDate()
  )

}



/**
 * Checks if two dates fall on the same month.
 * @param  {Date}  one
 * @param  {Date}  two
 * @return {Boolean}
 */
function isSameMonth(one, two) {

  one = create(one)
  two = create(two)

  return (
    isSameYear(one, two) &&
    one.getMonth() === two.getMonth()
  )

}



/**
 * Checks if two dates fall on the same year.
 * @param  {Date}  one
 * @param  {Date}  two
 * @return {Boolean}
 */
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

  // Create
  create,

  // Format
  format,

  // Months getters
  getFullMonthName,
  getFullMonthNames,
  getShortMonthName,
  getShortMonthNames,

  // Days getters
  getFullDayName,
  getFullDayNames,
  getShortDayName,
  getShortDayNames,

  // Checkers
  isSameDate,
  isSameMonth,
  isSameYear,

}