const DAY    = require('constants/day')
const MONTH  = require('constants/month')
const SCOPE  = require('constants/scope')
const jsUtil = require('utils/js')



////////////
// CREATE //
////////////



/**
 * Creates a date object using a certain value.
 * @param  {Date|Number} value
 * @return {Date}
 */
function create(value) {

  if (Number.isInteger(value)) {
    return new Date(value)
  }

  return value

}



/**
 * Creates a date clamped in a month.
 * @param  {Number} year
 * @param  {Number} month
 * @param  {Number} date
 * @return {Date}
 */
function createInMonth(year, month, date) {

  // Create a date object from the original values
  let dateObject = new Date(year, month, date)

  // Normalize the month to be clamped within 0 and 11
  month = (month + 12) % 12

  // Until the target date's month isn't the normalized
  // month, keep reducing the date by 1
  while (dateObject.getMonth() !== month) {
    date -= 1
    dateObject = new Date(year, month, date)
  }

  return dateObject

}





////////////////////
// FORMAT & PARSE //
////////////////////



/**
 * A mapping of template hooks to formatters.
 * @private
 * @type {Object(Function)}
 */
const HOOK_FORMATTER = {

  D: (language, dateObject) => (
    `${dateObject.getDate()}`
  ),
  DD: (language, dateObject) => (
    `${jsUtil.padZero(HOOK_FORMATTER.D(language, dateObject), 2)}`
  ),
  DDD: (language, dateObject) => (
    getShortDayName(language, dateObject.getDay())
  ),
  DDDD: (language, dateObject) => (
    getFullDayName(language, dateObject.getDay())
  ),

  M: (language, dateObject) => (
    `${dateObject.getMonth() + 1}`
  ),
  MM: (language, dateObject) => (
    `${jsUtil.padZero(HOOK_FORMATTER.M(language, dateObject), 2)}`
  ),
  MMM: (language, dateObject) => (
    getShortMonthName(language, dateObject.getMonth())
  ),
  MMMM: (language, dateObject) => (
    getFullMonthName(language, dateObject.getMonth())
  ),

  YYYY: (language, dateObject) => (
    `${dateObject.getFullYear()}`
  ),

  H: (language, dateObject) => (
    `${dateObject.getHours()}`
  ),
  HH: (language, dateObject) => (
    `${jsUtil.padZero(HOOK_FORMATTER.H(language, dateObject), 2)}`
  ),
  h: (language, dateObject) => (
    `${dateObject.getHours() % 12 || 12}`
  ),
  hh: (language, dateObject) => (
    `${jsUtil.padZero(HOOK_FORMATTER.h(language, dateObject), 2)}`
  ),

  m: (language, dateObject) => (
    `${dateObject.getMinutes()}`
  ),
  mm: (language, dateObject) => (
    `${jsUtil.padZero(HOOK_FORMATTER.m(language, dateObject), 2)}`
  ),

  a: (language, dateObject) => (
    dateObject.getHours() < 11 ? 'a.m.' : 'p.m.'
  ),
  A: (language, dateObject) => (
    dateObject.getHours() < 11 ? 'AM' : 'PM'
  ),

  s: (language, dateObject) => (
    `${dateObject.getSeconds()}`
  ),
  ss: (language, dateObject) => (
    `${jsUtil.padZero(HOOK_FORMATTER.s(language, dateObject), 2)}`
  ),

  x: (language, dateObject) => (
    `${dateObject.getTime()}`
  ),

}



/**
 * A mapping of template hooks to parsers.
 * @private
 * @type {Object(Function)}
 */
const HOOK_PARSER = {

  D    : getStartingDigits,
  DD   : getStartingDigits,
  DDD  : getStartingWord,
  DDDD : getStartingWord,

  M    : getStartingDigits,
  MM   : getStartingDigits,
  MMM  : getStartingWord,
  MMMM : getStartingWord,

  YYYY : getStartingDigits,

  H    : getStartingDigits,
  HH   : getStartingDigits,
  h    : getStartingDigits,
  hh   : getStartingDigits,

  m    : getStartingDigits,
  mm   : getStartingDigits,

  a    : getStartingLowerCaseMeridiem,
  A    : getStartingUpperCaseMeridiem,

  s    : getStartingDigits,
  ss   : getStartingDigits,

  x    : getStartingDigits,

}



/* istanbul ignore if */
if (process.env.DEBUG) {
  const extraFormatterKeys = Object.keys(HOOK_FORMATTER)
    .filter(key => !HOOK_PARSER[key])
  console.assert(
    !extraFormatterKeys.length,
    'Missing keys to parse with', extraFormatterKeys
  )
  const extraParserKeys = Object.keys(HOOK_PARSER)
    .filter(key => !HOOK_FORMATTER[key])
  console.assert(
    !extraParserKeys.length,
    'Missing keys to format with', extraParserKeys
  )
}



/**
 * A collection of the template hooks.
 * @private
 * @type {String[]}
 */
const HOOKS = Object.keys(HOOK_FORMATTER)



/**
 * A regular expression that matches all segments of a template string.
 * @private
 * @type {RegExp}
 */
const HOOKS_REGEXP = new RegExp([

  // Match any characters escaped with square brackets
  '(\\[.*?\\])',

  // Match any template hooks
  `(?:\\b(${HOOKS.join('|')})\\b)`,

  // Match all other characters
  '(.)',

].join('|'), 'g')



/**
 * Gets the starting word from a string.
 * @private
 * @param  {String} string
 * @return {String}
 */
function getStartingWord(string) {
  return string.replace(/(^\w*)(.*)/, '$1')
}



/**
 * Gets the starting digits from a string.
 * @private
 * @param  {String} string
 * @return {String}
 */
function getStartingDigits(string) {
  return string.replace(/(^\d*)(.*)/, '$1')
}



/**
 * Gets the starting lower-case meridiem from a string.
 * @private
 * @param  {String} string
 * @return {String}
 */
function getStartingLowerCaseMeridiem(string) {
  return string.replace(/(^[ap]\.m\.)?(.*)/, '$1')
}



/**
 * Gets the starting upper-case meridiem from a string.
 * @private
 * @param  {String} string
 * @return {String}
 */
function getStartingUpperCaseMeridiem(string) {
  return string.replace(/(^[AP]M)?(.*)/, '$1')
}



/**
 * Matches the hooks of a template.
 * @private
 * @param  {String} template
 * @return {Object[]}
 */
function matchHooks(template) {
  return (
    template

      // Split the template using the regular expression
      .split(HOOKS_REGEXP)

      // Map the chunks to keep a reference of their match group index
      .map((chunk, index) => ({ chunk, index: index % 4 }))

      // Filter out false-y chunks
      .filter(match => !!match.chunk)

  )
}



/**
 * Gets the date units (date, month, & year) from a hook value map.
 * @private
 * @param  {Object<String>} hookValue
 * @param  {LANGUAGE} language
 * @return {Object}
 */
function getDateUnitsFromHookValue(hookValue, language) {

  // Grab the year, date, minutes, and seconds from the hook values
  const year    = hookValue.YYYY
  const date    = hookValue.DD || hookValue.D
  const minutes = hookValue.mm || hookValue.m
  const seconds = hookValue.ss || hookValue.s

  // Grab the month from the hook value by name or number
  const month = getMonthFromHookValue(hookValue, language)

  // Grab the hours from the hook value by number or meridiem
  const hours = getHoursFromHookValue(hookValue)

  return {
    hours, minutes, seconds,
    year, month, date,
  }

}



/**
 * Gets the month from a hook value map.
 * @private
 * @param  {Object<String>} hookValue
 * @param  {LANGUAGE} language
 * @return {Number}
 */
function getMonthFromHookValue(hookValue, language) {

  if (hookValue.MMMM) {
    return getIndexOfFullMonthName(hookValue.MMMM, language)
  }

  if (hookValue.MMM) {
    return getIndexOfShortMonthName(hookValue.MMM, language)
  }

  return (hookValue.MM || hookValue.M) - 1

}



/**
 * Gets the hours from a hook value map.
 * @private
 * @param  {Object<String>} hookValue
 * @return {Number|null}
 */
function getHoursFromHookValue(hookValue) {

  const hours = hookValue.HH || hookValue.H
  if (hours) {
    return hours
  }

  return getHoursBasedOnMeridiem(
    hookValue.hh || hookValue.h,
    hookValue.a || hookValue.A
  )

}



/**
 * Gets the hours based on the meridiem from a hook value map.
 * @private
 * @param  {String} hours
 * @param  {String} meridiem
 * @return {Number}
 */
function getHoursBasedOnMeridiem(hours, meridiem) {

  if (!isValidParsedDateUnit(hours) || !meridiem) {
    return null
  }

  hours = parseInt(hours, 10)

  return /^p/i.test(meridiem) && hours < 12 ? hours + 12 : hours

}



/**
 * Checks if a parsed date unit is a valid date unit.
 * @private
 * @param  {String|null}  dateUnit
 * @return {Boolean}
 */
function isValidParsedDateUnit(dateUnit) {
  return dateUnit != null && /^\d+$/.test(dateUnit)
}



/**
 * Checks if all parsed date units are valid date units.
 * @private
 * @param  {...(String|null)} dateUnits
 * @return {Boolean}
 */
function areValidParsedDateUnits(...dateUnits) {
  return dateUnits.every(isValidParsedDateUnit)
}



/**
 * Formats a date object with a given template and language.
 * @param  {Date} dateObject
 * @param  {String} template
 * @param  {LANGUAGE} language
 * @return {String}
 */
function format(dateObject, template, language) {

  dateObject = create(dateObject)

  return (

    // Match hooks within the template
    matchHooks(template)

      // Map through the matches while formatting template hooks
      // and removing the hooks of escaped characters
      .map(match => (
        match.index === 2 ? HOOK_FORMATTER[match.chunk](language, dateObject) :
        match.index === 1 ? match.chunk.replace(/^\[(.*)]$/, '$1') :
        match.chunk
      ))

      // Join the chunks together into a string
      .join('')

  )

}



/**
 * Parses a date string with a given template.
 * @param  {String} dateString
 * @param  {String} template
 * @param  {LANGUAGE} language
 * @return {Date|null}
 */
function parse(dateString, template, language) {

  // Keep a reference to the original date string
  const originalDateString = dateString

  // Create a mapping of hook to the parsing value
  const hookValue = {}

  // Match hooks within the template and iterate over it
  matchHooks(template).some(match => {

    // Grab the string to strip off of the date string
    let stringToStrip = match.chunk

    // If the match is a template hook, parse it to get
    // the actual string to strip
    if (match.index === 2) {
      stringToStrip = HOOK_PARSER[stringToStrip](dateString)
      hookValue[match.chunk] = stringToStrip
    }

    // Otherwise if the characters were escaped,
    // remove the hooks of escaped characters
    else if (match.index === 1) {
      stringToStrip = stringToStrip.replace(/^\[(.*)]$/, '$1')
    }

    // Grab the length of the string to strip
    const lengthToStrip = stringToStrip.length

    // If there is no length to strip,
    // or the string to strip does not match the starting
    // of the date string, log an error and stop parsing
    if (
      !lengthToStrip
      ||
      stringToStrip !== dateString.substring(0, lengthToStrip)
    ) {
      console.error(
        'Unable to parse the date %o. Expected to match %o at position %o',
        originalDateString,
        match.chunk,
        originalDateString.length - dateString.length
      )
      return true
    }

    // Otherwise, strip the string from the date string
    // and continue iterating over the matches
    dateString = dateString.slice(lengthToStrip)

  })

  // If there's a unix timestamp, use that directly
  if (hookValue.x) {
    return new Date(parseInt(hookValue.x, 10))
  }

  // Get the date units from the hook value
  const {
    hours, minutes, seconds,
    year, month, date,
  } = getDateUnitsFromHookValue(hookValue, language)

  // If date units are not found, return `null`
  if (!areValidParsedDateUnits(date, month, year)) {
    return null
  }

  // Otherwise, create a date the date
  return new Date(year, month, date, hours || 0, minutes || 0, seconds || 0)

}





////////////////////
// MONTHS GETTERS //
////////////////////



/**
 * Gets a list of the full month names.
 * @param  {LANGUAGE} language
 * @return {String[]}
 */
function getFullMonthNames(language) {
  return MONTH.FULL[language]
}



/**
 * Gets a list of the short month names.
 * @param  {LANGUAGE} language
 * @return {String[]}
 */
function getShortMonthNames(language) {
  return MONTH.SHORT[language]
}



/**
 * Gets the full name of a specific month.
 * @param  {LANGUAGE} language
 * @param  {Number} month
 * @return {String}
 */
function getFullMonthName(language, month) {
  return MONTH.FULL[language][month]
}



/**
 * Gets the short name of a specific month.
 * @param  {LANGUAGE} language
 * @param  {Number} month
 * @return {String}
 */
function getShortMonthName(language, month) {
  return MONTH.SHORT[language][month]
}



/**
 * Gets the index of a month by it's full name.
 * @private
 * @param  {String} fullMonthName
 * @param  {LANGUAGE} language
 * @return {Number}
 */
function getIndexOfFullMonthName(fullMonthName, language) {
  return MONTH.FULL[language].indexOf(fullMonthName)
}



/**
 * Gets the index of a month by it's short name.
 * @private
 * @param  {String} shortMonthName
 * @param  {LANGUAGE} language
 * @return {Number}
 */
function getIndexOfShortMonthName(shortMonthName, language) {
  return MONTH.SHORT[language].indexOf(shortMonthName)
}





//////////////////
// DAYS GETTERS //
//////////////////



/**
 * Gets a list of the full day names.
 * @param  {LANGUAGE} language
 * @return {String[]}
 */
function getFullDayNames(language) {
  return DAY.FULL[language]
}



/**
 * Gets a list of the short day names.
 * @param  {LANGUAGE} language
 * @return {String[]}
 */
function getShortDayNames(language) {
  return DAY.SHORT[language]
}



/**
 * Gets the full name of a specific day.
 * @param  {LANGUAGE} language
 * @param  {Number} day
 * @return {String}
 */
function getFullDayName(language, day) {
  return DAY.FULL[language][day]
}



/**
 * Gets the short name of a specific day.
 * @param  {LANGUAGE} language
 * @param  {Number} day
 * @return {String}
 */
function getShortDayName(language, day) {
  return DAY.SHORT[language][day]
}





//////////////
// CHECKERS //
//////////////



/**
 * Checks if one date is before another, given a certain scope.
 * @param  {Date}  one
 * @param  {Date}  two
 * @param  {SCOPE} [scope]
 * @return {Boolean}
 */
function isBefore(one, two, scope) {

  if (scope === SCOPE.YEARS) {
    return one.getFullYear() < two.getFullYear()
  }

  if (scope === SCOPE.MONTHS) {
    return (
      one.getFullYear() < two.getFullYear()
      ||
      one.getFullYear() === two.getFullYear() &&
      one.getMonth() < two.getMonth()
    )
  }

  return one < two

}



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
// EXPORTS //
/////////////



module.exports = {

  // Create
  create,
  createInMonth,

  // Format & parse
  format,
  parse,

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
  isBefore,
  isSameDate,
  isSameMonth,
  isSameYear,

}
