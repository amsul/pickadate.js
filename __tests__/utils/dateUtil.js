// @flow

import * as dateUtil from 'pickadate/utils/dateUtil'
import { TEMPLATE_HOOK_WORDS } from 'pickadate/defaults'

describe('dateUtil', () => {
  describe('isSameDate()', () => {
    it('checks if two dates are the same', () => {
      const date = new Date(2019, 0, 1)
      expect(dateUtil.isSameDate(date, new Date(2019, 0, 1))).toEqual(true)
      expect(dateUtil.isSameDate(date, new Date(2019, 0, 2))).toEqual(false)
      expect(dateUtil.isSameDate(date, new Date(2019, 1, 2))).toEqual(false)
      expect(dateUtil.isSameDate(date, new Date(2020, 0, 2))).toEqual(false)
    })

    it('handles non-dates', () => {
      const date = new Date(2019, 0, 1)
      expect(dateUtil.isSameDate(date, 'nope')).toEqual(false)
      expect(dateUtil.isSameDate(date, [2019, 0, 1])).toEqual(false)
    })
  })

  describe('isSameMonth()', () => {
    it('checks if two dates have the same month', () => {
      const date = new Date(2019, 0, 1)
      expect(dateUtil.isSameMonth(date, new Date(2019, 0, 1))).toEqual(true)
      expect(dateUtil.isSameMonth(date, new Date(2019, 0, 2))).toEqual(true)
      expect(dateUtil.isSameMonth(date, new Date(2019, 1, 2))).toEqual(false)
      expect(dateUtil.isSameMonth(date, new Date(2020, 0, 2))).toEqual(false)
    })

    it('handles non-dates', () => {
      const date = new Date(2019, 0, 1)
      expect(dateUtil.isSameMonth(date, 'nope')).toEqual(false)
      expect(dateUtil.isSameMonth(date, [2019, 0, 1])).toEqual(false)
    })
  })

  describe('isSameYear()', () => {
    it('checks if two dates have the same year', () => {
      const date = new Date(2019, 0, 1)
      expect(dateUtil.isSameYear(date, new Date(2019, 0, 1))).toEqual(true)
      expect(dateUtil.isSameYear(date, new Date(2019, 0, 2))).toEqual(true)
      expect(dateUtil.isSameYear(date, new Date(2019, 1, 2))).toEqual(true)
      expect(dateUtil.isSameYear(date, new Date(2020, 0, 2))).toEqual(false)
    })

    it('handles non-dates', () => {
      const date = new Date(2019, 0, 1)
      expect(dateUtil.isSameYear(date, 'nope')).toEqual(false)
      expect(dateUtil.isSameYear(date, [2019, 0, 1])).toEqual(false)
    })
  })

  describe('isBeforeDate()', () => {
    it('checks if one date is before another', () => {
      const date = new Date(2019, 5, 5)

      // Year
      expect(dateUtil.isBeforeDate(new Date(2017, 5, 5), date)).toEqual(true)
      expect(dateUtil.isBeforeDate(new Date(2018, 5, 5), date)).toEqual(true)
      expect(dateUtil.isBeforeDate(new Date(2019, 5, 5), date)).toEqual(false)
      expect(dateUtil.isBeforeDate(new Date(2020, 5, 5), date)).toEqual(false)

      // Month
      expect(dateUtil.isBeforeDate(new Date(2019, 3, 5), date)).toEqual(true)
      expect(dateUtil.isBeforeDate(new Date(2019, 4, 5), date)).toEqual(true)
      expect(dateUtil.isBeforeDate(new Date(2019, 5, 5), date)).toEqual(false)
      expect(dateUtil.isBeforeDate(new Date(2019, 6, 5), date)).toEqual(false)

      // Date
      expect(dateUtil.isBeforeDate(new Date(2019, 5, 3), date)).toEqual(true)
      expect(dateUtil.isBeforeDate(new Date(2019, 5, 4), date)).toEqual(true)
      expect(dateUtil.isBeforeDate(new Date(2019, 5, 5), date)).toEqual(false)
      expect(dateUtil.isBeforeDate(new Date(2019, 5, 6), date)).toEqual(false)
    })

    it('handles non-dates', () => {
      const date = new Date(2019, 0, 1)
      expect(dateUtil.isBeforeDate('nope', date)).toEqual(false)
      expect(dateUtil.isBeforeDate([2019, 0, 1], date)).toEqual(false)
    })
  })

  describe('isSameOrBeforeDate()', () => {
    it('checks if one date is before another or the same', () => {
      const date = new Date(2019, 5, 5)

      // Year
      expect(dateUtil.isSameOrBeforeDate(new Date(2017, 5, 5), date)).toEqual(
        true
      )
      expect(dateUtil.isSameOrBeforeDate(new Date(2018, 5, 5), date)).toEqual(
        true
      )
      expect(dateUtil.isSameOrBeforeDate(new Date(2019, 5, 5), date)).toEqual(
        true
      )
      expect(dateUtil.isSameOrBeforeDate(new Date(2020, 5, 5), date)).toEqual(
        false
      )

      // Month
      expect(dateUtil.isSameOrBeforeDate(new Date(2019, 3, 5), date)).toEqual(
        true
      )
      expect(dateUtil.isSameOrBeforeDate(new Date(2019, 4, 5), date)).toEqual(
        true
      )
      expect(dateUtil.isSameOrBeforeDate(new Date(2019, 5, 5), date)).toEqual(
        true
      )
      expect(dateUtil.isSameOrBeforeDate(new Date(2019, 6, 5), date)).toEqual(
        false
      )

      // Date
      expect(dateUtil.isSameOrBeforeDate(new Date(2019, 5, 3), date)).toEqual(
        true
      )
      expect(dateUtil.isSameOrBeforeDate(new Date(2019, 5, 4), date)).toEqual(
        true
      )
      expect(dateUtil.isSameOrBeforeDate(new Date(2019, 5, 5), date)).toEqual(
        true
      )
      expect(dateUtil.isSameOrBeforeDate(new Date(2019, 5, 6), date)).toEqual(
        false
      )
    })

    it('handles non-dates', () => {
      const date = new Date(2019, 0, 1)
      expect(dateUtil.isSameOrBeforeDate('nope', date)).toEqual(false)
      expect(dateUtil.isSameOrBeforeDate([2019, 0, 1], date)).toEqual(false)
    })
  })

  describe('format()', () => {
    const date = new Date(2019, 8, 2, 14, 5, 4)
    const templateHookWords = TEMPLATE_HOOK_WORDS

    it('formats a date object based on a template for dates', () => {
      expect(dateUtil.format(date, 'D', templateHookWords)).toEqual('2')
      expect(dateUtil.format(date, 'DD', templateHookWords)).toEqual('02')
    })

    it('formats a date object based on a template for days', () => {
      expect(dateUtil.format(date, 'DDD', templateHookWords)).toEqual('Mon')
      expect(dateUtil.format(date, 'DDDD', templateHookWords)).toEqual('Monday')
    })

    it('formats a date object based on a template for months', () => {
      expect(dateUtil.format(date, 'M', templateHookWords)).toEqual('9')
      expect(dateUtil.format(date, 'MM', templateHookWords)).toEqual('09')
      expect(dateUtil.format(date, 'MMM', templateHookWords)).toEqual('Sep')
      expect(dateUtil.format(date, 'MMMM', templateHookWords)).toEqual(
        'September'
      )
    })

    it('formats a date object based on a template for years', () => {
      expect(dateUtil.format(date, 'YYYY', templateHookWords)).toEqual('2019')
    })

    it('formats a date object based on a template for hours', () => {
      expect(dateUtil.format(date, 'H', templateHookWords)).toEqual('14')
      expect(dateUtil.format(date, 'HH', templateHookWords)).toEqual('14')
      expect(dateUtil.format(date, 'h', templateHookWords)).toEqual('2')
      expect(dateUtil.format(date, 'hh', templateHookWords)).toEqual('02')

      const midnightDate = new Date(2019, 8, 2, 0, 5, 4)
      expect(dateUtil.format(midnightDate, 'H', templateHookWords)).toEqual('0')
      expect(dateUtil.format(midnightDate, 'HH', templateHookWords)).toEqual(
        '00'
      )
      expect(dateUtil.format(midnightDate, 'h', templateHookWords)).toEqual(
        '12'
      )
      expect(dateUtil.format(midnightDate, 'hh', templateHookWords)).toEqual(
        '12'
      )
    })

    it('formats a date object based on a template for minutes', () => {
      expect(dateUtil.format(date, 'm', templateHookWords)).toEqual('5')
      expect(dateUtil.format(date, 'mm', templateHookWords)).toEqual('05')
    })

    it('formats a date object based on a template for seconds', () => {
      expect(dateUtil.format(date, 's', templateHookWords)).toEqual('4')
      expect(dateUtil.format(date, 'ss', templateHookWords)).toEqual('04')
    })

    it('formats a date object based on a template for meridiem', () => {
      expect(dateUtil.format(date, 'a', templateHookWords)).toEqual('p.m.')
      expect(dateUtil.format(date, 'A', templateHookWords)).toEqual('PM')

      const amDate = new Date(2019, 8, 2, 4, 5, 4)
      expect(dateUtil.format(amDate, 'a', templateHookWords)).toEqual('a.m.')
      expect(dateUtil.format(amDate, 'A', templateHookWords)).toEqual('AM')
    })

    it('formats a date object based on a template for unix', () => {
      expect(dateUtil.format(date, 'x', templateHookWords)).toEqual(
        date.getTime().toString()
      )
    })

    it('formats a date object based on a template with combinations of hooks', () => {
      expect(dateUtil.format(date, 'D-M-YYYY', templateHookWords)).toEqual(
        '2-9-2019'
      )
      expect(dateUtil.format(date, 'DD-MMM-YYYY', templateHookWords)).toEqual(
        '02-Sep-2019'
      )
      expect(
        dateUtil.format(date, 'DDDD, D MMMM, YYYY @ h:mm a', templateHookWords)
      ).toEqual('Monday, 2 September, 2019 @ 2:05 p.m.')
    })

    it('formats a date object based on a template with escaped hooks characters', () => {
      expect(
        dateUtil.format(date, 'Escaped [D] is: D-M-YYYY', templateHookWords)
      ).toEqual('Escaped D is: 2-9-2019')
    })
  })
})
