// @flow

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
