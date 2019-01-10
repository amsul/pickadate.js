// @flow

import * as jsUtil from 'pickadate/utils/jsUtil'

describe('jsUtil', () => {
  describe('caseDash()', () => {
    it('converts a string to be dash-cased', () => {
      expect(jsUtil.caseDash('PascalCase')).toEqual('pascal-case')
      expect(jsUtil.caseDash('camelCase')).toEqual('camel-case')
      expect(jsUtil.caseDash('dash-case')).toEqual('dash-case')
    })
  })

  describe('padZero()', () => {
    it('pads a number to be a certain number of digits', () => {
      expect(jsUtil.padZero(3, 4)).toEqual('0003')
      expect(jsUtil.padZero('3', 2)).toEqual('03')
      expect(jsUtil.padZero(13, 4)).toEqual('0013')
      expect(jsUtil.padZero('13', 2)).toEqual('13')
    })
  })

  describe('mergeUpdates()', () => {
    it('merges updates into default values', () => {
      const defaults = {
        prop: true,
        lol: 'something',
        here: null,
        yup: false,
        whoa: 0,
        nope: undefined,
        nested: {
          object: 'cool',
          value: 4,
        },
      }
      const updates = {
        prop: false,
        yup: true,
        whoa: 420,
        nope: true,
        nested: {
          object: 'hot',
          another: 40,
        },
      }
      expect(jsUtil.mergeUpdates(defaults, updates)).toEqual({
        prop: false,
        lol: 'something',
        here: null,
        yup: true,
        whoa: 420,
        nested: {
          object: 'hot',
          value: 4,
        },
      })
    })
  })

  describe('copyDefinedValues()', () => {
    it('copies values that are defined to a new object', () => {
      const object = {
        prop: true,
        lol: 'something',
        here: null,
        yup: false,
        whoa: 0,
        nope: undefined,
      }
      expect(jsUtil.copyDefinedValues(object)).toEqual({
        prop: true,
        lol: 'something',
        here: null,
        yup: false,
        whoa: 0,
      })
    })
  })

  describe('createRange()', () => {
    it('creates an array of a certain range', () => {
      const range = jsUtil.createRange(4, 9)
      expect(range).toEqual([4, 5, 6, 7, 8, 9])
    })
  })
})
