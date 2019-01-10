// @flow

import type { TemplateHookWords } from 'pickadate/types'
import * as jsUtil from 'pickadate/utils/jsUtil'

//////////////
// CHECKERS //
//////////////

export const isSameDate = (one: mixed, two: mixed) =>
  one instanceof Date &&
  two instanceof Date &&
  isSameMonth(one, two) &&
  one.getDate() === two.getDate()

export const isSameMonth = (one: mixed, two: mixed) =>
  one instanceof Date &&
  two instanceof Date &&
  isSameYear(one, two) &&
  one.getMonth() === two.getMonth()

export const isSameYear = (one: mixed, two: mixed) =>
  one instanceof Date &&
  two instanceof Date &&
  one.getFullYear() === two.getFullYear()

export const isBeforeDate = (one: mixed, two: mixed) =>
  one instanceof Date &&
  two instanceof Date &&
  (one.getFullYear() < two.getFullYear() ||
    (isSameYear(one, two) && one.getMonth() < two.getMonth()) ||
    (isSameMonth(one, two) && one.getDate() < two.getDate()))

export const isSameOrBeforeDate = (one: mixed, two: mixed) =>
  isSameDate(one, two) || isBeforeDate(one, two)

////////////
// FORMAT //
////////////

/**
 * A mapping of template hooks to formatters.
 */
const HOOK_FORMATTER = {
  D: dateObject => `${dateObject.getDate()}`,
  DD: dateObject => `${jsUtil.padZero(HOOK_FORMATTER.D(dateObject), 2)}`,
  DDD: (dateObject, words) => words[dateObject.getDay()],
  DDDD: (dateObject, words) => words[dateObject.getDay()],

  M: dateObject => `${dateObject.getMonth() + 1}`,
  MM: dateObject => `${jsUtil.padZero(HOOK_FORMATTER.M(dateObject), 2)}`,
  MMM: (dateObject, words) => words[dateObject.getMonth()],
  MMMM: (dateObject, words) => words[dateObject.getMonth()],

  YYYY: dateObject => `${dateObject.getFullYear()}`,

  H: dateObject => `${dateObject.getHours()}`,
  HH: dateObject => `${jsUtil.padZero(HOOK_FORMATTER.H(dateObject), 2)}`,
  h: dateObject => `${dateObject.getHours() % 12 || 12}`,
  hh: dateObject => `${jsUtil.padZero(HOOK_FORMATTER.h(dateObject), 2)}`,

  m: dateObject => `${dateObject.getMinutes()}`,
  mm: dateObject => `${jsUtil.padZero(HOOK_FORMATTER.m(dateObject), 2)}`,

  a: dateObject => (dateObject.getHours() < 12 ? 'a.m.' : 'p.m.'),
  A: dateObject => (dateObject.getHours() < 12 ? 'AM' : 'PM'),

  s: dateObject => `${dateObject.getSeconds()}`,
  ss: dateObject => `${jsUtil.padZero(HOOK_FORMATTER.s(dateObject), 2)}`,

  x: dateObject => `${dateObject.getTime()}`,
}

const getStartingDigits = string => string.replace(/(^\d*)(.*)/, '$1')

const getStartingWord = string => string.replace(/(^\w*)(.*)/, '$1')

const getStartingLowerCaseMeridiem = string =>
  string.replace(/(^[ap]\.m\.)?(.*)/, '$1')

const getStartingUpperCaseMeridiem = string =>
  string.replace(/(^[AP]M)?(.*)/, '$1')

/**
 * A mapping of template hooks to parsers.
 */
const HOOK_PARSER = {
  D: getStartingDigits,
  DD: getStartingDigits,
  DDD: getStartingWord,
  DDDD: getStartingWord,

  M: getStartingDigits,
  MM: getStartingDigits,
  MMM: getStartingWord,
  MMMM: getStartingWord,

  YYYY: getStartingDigits,

  H: getStartingDigits,
  HH: getStartingDigits,
  h: getStartingDigits,
  hh: getStartingDigits,

  m: getStartingDigits,
  mm: getStartingDigits,

  a: getStartingLowerCaseMeridiem,
  A: getStartingUpperCaseMeridiem,

  s: getStartingDigits,
  ss: getStartingDigits,

  x: getStartingDigits,
}

{
  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'development') {
    const extraFormatterKeys = Object.keys(HOOK_FORMATTER).filter(
      key => !HOOK_PARSER[key]
    )
    console.assert(
      !extraFormatterKeys.length,
      'Missing keys to parse with',
      extraFormatterKeys
    )
    const extraParserKeys = Object.keys(HOOK_PARSER).filter(
      key => !HOOK_FORMATTER[key]
    )
    console.assert(
      !extraParserKeys.length,
      'Missing keys to format with',
      extraParserKeys
    )
  }
}

/**
 * A collection of the template hooks.
 */
const HOOKS = Object.keys(HOOK_FORMATTER)

/**
 * A regular expression that matches all segments of a template string.
 */
const HOOKS_REGEXP = new RegExp(
  [
    // Match any characters escaped with square brackets
    '(\\[.*?\\])',

    // Match any template hooks
    `(?:\\b(${HOOKS.join('|')})\\b)`,

    // Match all other characters
    '(.)',
  ].join('|'),
  'g'
)

type Format = (
  dateObject: Date,
  template: string,
  templateHookWords: TemplateHookWords
) => string

export const format: Format = (dateObject, template, templateHookWords) =>
  // Match hooks within the template
  matchHooks(template)
    // Map through the matches while formatting template hooks
    // and removing the hooks of escaped characters
    .map(match => {
      if (match.index === 2) {
        const formatter = HOOK_FORMATTER[match.chunk]
        return formatter(dateObject, templateHookWords[match.chunk])
      }
      if (match.index === 1) {
        return match.chunk.replace(/^\[(.*)]$/, '$1')
      }
      return match.chunk
    })

    // Join the chunks together into a string
    .join('')

const matchHooks = template =>
  template
    // Split the template using the regular expression
    .split(HOOKS_REGEXP)

    // Map the chunks to keep a reference of their match group index
    .map((chunk, index) => ({ chunk, index: index % 4 }))

    // Filter out false-y chunks
    .filter(match => !!match.chunk)
