// @flow

import * as classNameUtil from 'pickadate/utils/classNameUtil'

describe('classNameUtil', () => {
  describe('flatten()', () => {
    it('flattens a list of class names into a flat object map', () => {
      expect(classNameUtil.flatten('one')).toEqual({
        one: true,
      })

      expect(classNameUtil.flatten(['one', null, 'two', true])).toEqual({
        one: true,
        two: true,
      })

      expect(
        classNameUtil.flatten(['one', null, 'two', [true, 'three', 'four']])
      ).toEqual({
        one: true,
        two: true,
        three: true,
        four: true,
      })

      expect(
        classNameUtil.flatten([
          'one',
          null,
          'two',
          { three: true, four: false },
        ])
      ).toEqual({
        one: true,
        two: true,
        three: true,
        four: false,
      })
    })
  })

  describe('join()', () => {
    it('joins a list of class names into a string', () => {
      expect(classNameUtil.join('one')).toEqual('one')

      expect(classNameUtil.join(['one', null, 'two', true])).toEqual('one two')

      expect(
        classNameUtil.join(['one', null, 'two', [true, 'three', 'four']])
      ).toEqual('one two three four')

      expect(
        classNameUtil.join(['one', null, 'two', { three: true, four: false }])
      ).toEqual('one two three')
    })
  })
})
