// @flow

import type { WordMap } from '../types'
import * as jsUtil from './jsUtil'

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

////////////
// FORMAT //
////////////

/**
 * A mapping of template hooks to formatters.
 */
const HOOK_FORMATTER = {
  D: (wordMap, dateObject) => `${dateObject.getDate()}`,
  DD: (wordMap, dateObject) =>
    `${jsUtil.padZero(HOOK_FORMATTER.D(wordMap, dateObject), 2)}`,
  DDD: (wordMap, dateObject) => wordMap.weekdaysShort[dateObject.getDay()],
  DDDD: (wordMap, dateObject) =>
    wordMap.weekdaysFull[(wordMap, dateObject.getDay())],

  M: (wordMap, dateObject) => `${dateObject.getMonth() + 1}`,
  MM: (wordMap, dateObject) =>
    `${jsUtil.padZero(HOOK_FORMATTER.M(wordMap, dateObject), 2)}`,
  MMM: (wordMap, dateObject) =>
    wordMap.monthsShort[(wordMap, dateObject.getMonth())],
  MMMM: (wordMap, dateObject) =>
    wordMap.monthsFull[(wordMap, dateObject.getMonth())],

  YYYY: (wordMap, dateObject) => `${dateObject.getFullYear()}`,

  H: (wordMap, dateObject) => `${dateObject.getHours()}`,
  HH: (wordMap, dateObject) =>
    `${jsUtil.padZero(HOOK_FORMATTER.H(wordMap, dateObject), 2)}`,
  h: (wordMap, dateObject) => `${dateObject.getHours() % 12 || 12}`,
  hh: (wordMap, dateObject) =>
    `${jsUtil.padZero(HOOK_FORMATTER.h(wordMap, dateObject), 2)}`,

  m: (wordMap, dateObject) => `${dateObject.getMinutes()}`,
  mm: (wordMap, dateObject) =>
    `${jsUtil.padZero(HOOK_FORMATTER.m(wordMap, dateObject), 2)}`,

  a: (wordMap, dateObject) => (dateObject.getHours() < 12 ? 'a.m.' : 'p.m.'),
  A: (wordMap, dateObject) => (dateObject.getHours() < 12 ? 'AM' : 'PM'),

  s: (wordMap, dateObject) => `${dateObject.getSeconds()}`,
  ss: (wordMap, dateObject) =>
    `${jsUtil.padZero(HOOK_FORMATTER.s(wordMap, dateObject), 2)}`,

  x: (wordMap, dateObject) => `${dateObject.getTime()}`,
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

// if (process.env.NODE_ENV !== 'production') {
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
// }

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

type Format = (dateObject: Date, template: string, wordMap: WordMap) => string

export const format: Format = (dateObject, template, wordMap) =>
  // Match hooks within the template
  matchHooks(template)
    // Map through the matches while formatting template hooks
    // and removing the hooks of escaped characters
    .map(match =>
      // prettier-ignore
      match.index === 2 ? HOOK_FORMATTER[match.chunk](wordMap, dateObject) :
      match.index === 1 ? match.chunk.replace(/^\[(.*)]$/, '$1') :
      match.chunk
    )

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
