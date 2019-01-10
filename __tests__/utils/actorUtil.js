// @flow

import * as actorUtil from 'pickadate/utils/actorUtil'

describe('actorUtil', () => {
  describe('getHighlighted()', () => {
    it('gets the highlighted date based on no "selected" and "view" date', () => {
      const selected = null
      const view = new Date(2020, 2, 1, 8, 41)
      const highlighted = actorUtil.getHighlighted(selected, view)
      expect(highlighted).toEqual(new Date(2020, 2, 1))
    })

    it('gets the highlighted date based on a "selected" and "view" date in the same month', () => {
      const selected = new Date(2020, 0, 8, 8, 41)
      const view = new Date(2020, 0, 1, 10, 41)
      const highlighted = actorUtil.getHighlighted(selected, view)
      expect(highlighted).toEqual(new Date(2020, 0, 8))
    })

    it('gets the highlighted date based on a "selected" and "view" date in different months', () => {
      const selected = new Date(2020, 0, 1, 8, 41)
      const view = new Date(2020, 2, 1, 8, 41)
      const highlighted = actorUtil.getHighlighted(selected, view)
      expect(highlighted).toEqual(new Date(2020, 2, 1))
    })
  })
})
