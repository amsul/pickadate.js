// @flow

export const isSameDate = (one: Date, two: Date) =>
  isSameMonth(one, two) && one.getDate() === two.getDate()

export const isSameMonth = (one: Date, two: Date) =>
  isSameYear(one, two) && one.getMonth() === two.getMonth()

export const isSameYear = (one: Date, two: Date) =>
  one.getFullYear() === two.getFullYear()
