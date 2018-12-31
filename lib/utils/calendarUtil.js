// @flow

import * as jsUtil from './jsUtil'

const DAYS_IN_WEEK = 7

/**
 * Gets the dates in weeks.
 */
export const getDatesInWeeks = (originDateObject: Date): Array<Array<Date>> => {
  const year = originDateObject.getFullYear()
  const month = originDateObject.getMonth()
  const firstDayOfWeek = 0

  const monthOfLastDayInFirstWeek = getMonthOfLastDayInFirstWeek(year, month)

  const shift = monthOfLastDayInFirstWeek === month ? 0 : 1

  const start = 0 + shift
  const end = 5 + shift

  return jsUtil
    .createRange(start, end)
    .map(weekIndex => getDatesInWeek(year, month, weekIndex, firstDayOfWeek))
}

/**
 * Gets the dates in a week.
 */
const getDatesInWeek = (year, month, weekIndex, firstDayOfWeek) => {
  const startDayOfMonth = getStartDayOfMonth(year, month)
  const startDayOfWeek = weekIndex * DAYS_IN_WEEK

  const start = 1
  const end = 7

  return jsUtil
    .createRange(start, end)
    .map(
      date =>
        new Date(
          year,
          month,
          date + startDayOfWeek - startDayOfMonth + firstDayOfWeek
        )
    )
}

/**
 * Gets the month of the last day in the first week of a month.
 */
const getMonthOfLastDayInFirstWeek = (year, month) => {
  const startDayOfMonth = getStartDayOfMonth(year, month)
  return new Date(year, month, DAYS_IN_WEEK - startDayOfMonth).getMonth()
}

/**
 * Gets the start day of a month.
 */
const getStartDayOfMonth = (year, month) => {
  const startDateOfMonth = new Date(year, month, 1)
  return startDateOfMonth.getDay()
}
