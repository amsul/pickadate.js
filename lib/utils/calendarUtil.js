// @flow

import type { Weekdays, WeekdaysIndex } from 'pickadate/types'
import * as jsUtil from 'pickadate/utils/jsUtil'

const DAYS_IN_WEEK = 7

/**
 * Gets the weekday labels.
 */
export const getWeekdayLabels = (
  weekdays: Weekdays,
  firstDayOfWeek: WeekdaysIndex
): Weekdays =>
  (weekdays: any).map(
    (_, dayIndex) => weekdays[(dayIndex + firstDayOfWeek) % DAYS_IN_WEEK]
  )

/**
 * Gets the dates in weeks.
 */
export const getDatesInWeeks = (
  originDateObject: Date,
  firstDayOfWeek: WeekdaysIndex
): Array<Array<Date>> => {
  const year = originDateObject.getFullYear()
  const month = originDateObject.getMonth()
  const monthOfLastDayInFirstWeek = getMonthOfLastDayInFirstWeek(
    year,
    month,
    firstDayOfWeek
  )

  const shift = monthOfLastDayInFirstWeek === month ? 0 : -1
  const start = 0 + shift
  const end = 5 + shift

  return jsUtil
    .createRange(start, end)
    .map(weekIndex => getDatesInWeek(year, month, weekIndex, firstDayOfWeek))
}

/**
 * Gets the dates in a week.
 */
export const getDatesInWeek = (
  year: number,
  month: number,
  weekIndex: number,
  firstDayOfWeek: WeekdaysIndex
): Array<Date> => {
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
export const getMonthOfLastDayInFirstWeek = (
  year: number,
  month: number,
  firstDayOfWeek: WeekdaysIndex
) => {
  const startDayOfMonth = getStartDayOfMonth(year, month) - firstDayOfWeek
  const date = DAYS_IN_WEEK - startDayOfMonth
  if (startDayOfMonth < 0) {
    return new Date(year, month, firstDayOfWeek - date).getMonth()
  }
  return new Date(year, month, date).getMonth()
}

/**
 * Gets the start day of a month.
 */
export const getStartDayOfMonth = (year: number, month: number) => {
  const startDateOfMonth = new Date(year, month, 1)
  return startDateOfMonth.getDay()
}

/**
 * Gets the start date of a month, give a date.
 */
export const getStartDateOfMonth = (dateObject: Date) => {
  const year = dateObject.getFullYear()
  const month = dateObject.getMonth()
  return new Date(year, month, 1)
}
