// @flow

import * as timeUtil from 'pickadate/utils/timeUtil'

describe('timeUtil', () => {
  describe('getFromDate()', () => {
    it('gets the hours and minutes from a date', () => {
      const dateObject = new Date(2020, 0, 1, 8, 41)
      const time = timeUtil.getFromDate(dateObject)
      expect(time).toEqual({
        hours: 8,
        minutes: 41,
      })
    })
  })
})
