// @flow

import * as calendarUtil from 'pickadate/utils/calendarUtil'

describe('calendarUtil', () => {
  describe('getWeekdayLabels()', () => {
    it('gets weekday labels starting with the first day of the week', () => {
      const weekdays = ['1', '2', '3', '4', '5', '6', '7']

      expect(calendarUtil.getWeekdayLabels(weekdays, 3)).toEqual([
        '4',
        '5',
        '6',
        '7',
        '1',
        '2',
        '3',
      ])

      expect(calendarUtil.getWeekdayLabels(weekdays, 0)).toEqual([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
      ])
    })
  })

  describe('getDatesInWeeks()', () => {
    it('gets an array of arrays of dates in a week', () => {
      const originDateObject = new Date(2019, 0, 7)
      const firstDayOfWeek = 0
      const datesInWeeks = calendarUtil.getDatesInWeeks(
        originDateObject,
        firstDayOfWeek
      )
      expect(datesInWeeks).toEqual([
        [
          new Date(2018, 11, 30),
          new Date(2018, 11, 31),
          new Date(2019, 0, 1),
          new Date(2019, 0, 2),
          new Date(2019, 0, 3),
          new Date(2019, 0, 4),
          new Date(2019, 0, 5),
        ],
        [
          new Date(2019, 0, 6),
          new Date(2019, 0, 7),
          new Date(2019, 0, 8),
          new Date(2019, 0, 9),
          new Date(2019, 0, 10),
          new Date(2019, 0, 11),
          new Date(2019, 0, 12),
        ],
        [
          new Date(2019, 0, 13),
          new Date(2019, 0, 14),
          new Date(2019, 0, 15),
          new Date(2019, 0, 16),
          new Date(2019, 0, 17),
          new Date(2019, 0, 18),
          new Date(2019, 0, 19),
        ],
        [
          new Date(2019, 0, 20),
          new Date(2019, 0, 21),
          new Date(2019, 0, 22),
          new Date(2019, 0, 23),
          new Date(2019, 0, 24),
          new Date(2019, 0, 25),
          new Date(2019, 0, 26),
        ],
        [
          new Date(2019, 0, 27),
          new Date(2019, 0, 28),
          new Date(2019, 0, 29),
          new Date(2019, 0, 30),
          new Date(2019, 0, 31),
          new Date(2019, 1, 1),
          new Date(2019, 1, 2),
        ],
        [
          new Date(2019, 1, 3),
          new Date(2019, 1, 4),
          new Date(2019, 1, 5),
          new Date(2019, 1, 6),
          new Date(2019, 1, 7),
          new Date(2019, 1, 8),
          new Date(2019, 1, 9),
        ],
      ])
    })

    it('gets an array of arrays of dates in a week with a different first day of the week', () => {
      const originDateObject = new Date(2019, 0, 7)
      const firstDayOfWeek = 3
      const datesInWeeks = calendarUtil.getDatesInWeeks(
        originDateObject,
        firstDayOfWeek
      )
      expect(datesInWeeks).toEqual([
        [
          new Date(2018, 11, 26),
          new Date(2018, 11, 27),
          new Date(2018, 11, 28),
          new Date(2018, 11, 29),
          new Date(2018, 11, 30),
          new Date(2018, 11, 31),
          new Date(2019, 0, 1),
        ],
        [
          new Date(2019, 0, 2),
          new Date(2019, 0, 3),
          new Date(2019, 0, 4),
          new Date(2019, 0, 5),
          new Date(2019, 0, 6),
          new Date(2019, 0, 7),
          new Date(2019, 0, 8),
        ],
        [
          new Date(2019, 0, 9),
          new Date(2019, 0, 10),
          new Date(2019, 0, 11),
          new Date(2019, 0, 12),
          new Date(2019, 0, 13),
          new Date(2019, 0, 14),
          new Date(2019, 0, 15),
        ],
        [
          new Date(2019, 0, 16),
          new Date(2019, 0, 17),
          new Date(2019, 0, 18),
          new Date(2019, 0, 19),
          new Date(2019, 0, 20),
          new Date(2019, 0, 21),
          new Date(2019, 0, 22),
        ],
        [
          new Date(2019, 0, 23),
          new Date(2019, 0, 24),
          new Date(2019, 0, 25),
          new Date(2019, 0, 26),
          new Date(2019, 0, 27),
          new Date(2019, 0, 28),
          new Date(2019, 0, 29),
        ],
        [
          new Date(2019, 0, 30),
          new Date(2019, 0, 31),
          new Date(2019, 1, 1),
          new Date(2019, 1, 2),
          new Date(2019, 1, 3),
          new Date(2019, 1, 4),
          new Date(2019, 1, 5),
        ],
      ])
    })
  })

  describe('getDatesInWeek()', () => {
    it('gets an array of dates in a week', () => {
      const year = 2020
      const month = 4
      const weekIndex = 2
      const firstDayOfWeek = 0
      const datesInWeek = calendarUtil.getDatesInWeek(
        year,
        month,
        weekIndex,
        firstDayOfWeek
      )
      expect(datesInWeek).toEqual([
        new Date(2020, 4, 10),
        new Date(2020, 4, 11),
        new Date(2020, 4, 12),
        new Date(2020, 4, 13),
        new Date(2020, 4, 14),
        new Date(2020, 4, 15),
        new Date(2020, 4, 16),
      ])
    })

    it('gets an array of dates in a week with a different first day of the week', () => {
      const year = 2020
      const month = 4
      const weekIndex = 2
      const firstDayOfWeek = 2
      const datesInWeek = calendarUtil.getDatesInWeek(
        year,
        month,
        weekIndex,
        firstDayOfWeek
      )
      expect(datesInWeek).toEqual([
        new Date(2020, 4, 12),
        new Date(2020, 4, 13),
        new Date(2020, 4, 14),
        new Date(2020, 4, 15),
        new Date(2020, 4, 16),
        new Date(2020, 4, 17),
        new Date(2020, 4, 18),
      ])
    })
  })

  describe('getMonthOfLastDayInFirstWeek()', () => {
    it('gets the month of the last day in the first week of a month', () => {
      expect(calendarUtil.getMonthOfLastDayInFirstWeek(2020, 4, 0)).toEqual(4)
      expect(calendarUtil.getMonthOfLastDayInFirstWeek(2020, 4, 1)).toEqual(4)
      expect(calendarUtil.getMonthOfLastDayInFirstWeek(2020, 4, 2)).toEqual(4)
      expect(calendarUtil.getMonthOfLastDayInFirstWeek(2020, 4, 3)).toEqual(4)
      expect(calendarUtil.getMonthOfLastDayInFirstWeek(2020, 4, 4)).toEqual(4)
      expect(calendarUtil.getMonthOfLastDayInFirstWeek(2020, 4, 5)).toEqual(4)
      expect(calendarUtil.getMonthOfLastDayInFirstWeek(2020, 4, 6)).toEqual(3)

      expect(calendarUtil.getMonthOfLastDayInFirstWeek(2019, 0, 0)).toEqual(0)
      expect(calendarUtil.getMonthOfLastDayInFirstWeek(2019, 0, 1)).toEqual(0)
      expect(calendarUtil.getMonthOfLastDayInFirstWeek(2019, 0, 2)).toEqual(0)
      expect(calendarUtil.getMonthOfLastDayInFirstWeek(2019, 0, 3)).toEqual(11)
      expect(calendarUtil.getMonthOfLastDayInFirstWeek(2019, 0, 4)).toEqual(11)
      expect(calendarUtil.getMonthOfLastDayInFirstWeek(2019, 0, 5)).toEqual(11)
      expect(calendarUtil.getMonthOfLastDayInFirstWeek(2019, 0, 6)).toEqual(11)
    })
  })

  describe('getStartDayOfMonth()', () => {
    it('gets the start day of a month', () => {
      expect(calendarUtil.getStartDayOfMonth(2015, 4)).toEqual(5)
      expect(calendarUtil.getStartDayOfMonth(2016, 4)).toEqual(0)
      expect(calendarUtil.getStartDayOfMonth(2017, 4)).toEqual(1)
      expect(calendarUtil.getStartDayOfMonth(2018, 4)).toEqual(2)
      expect(calendarUtil.getStartDayOfMonth(2019, 4)).toEqual(3)
      expect(calendarUtil.getStartDayOfMonth(2020, 4)).toEqual(5)
    })
  })

  describe('getStartDateOfMonth()', () => {
    it('gets the start date of a month', () => {
      const startDate = calendarUtil.getStartDateOfMonth(new Date(2020, 4, 12))
      expect(startDate).toEqual(new Date(2020, 4, 1))
    })
  })
})
