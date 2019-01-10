// @flow

import createPicker from 'pickadate/createPicker'

// const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

describe('createPicker()', () => {
  it('creates a picker', async () => {
    const picker = createPicker()
    expect(picker).toHaveProperty('store')
    expect(picker).toHaveProperty('setSelected')
    // expect(dateStore.getState()).toEqual()
  })

  describe('setSelected()', () => {
    it('sets the selected date', () => {
      const picker = createPicker()
      expect(picker.store.getState().selected).toBeNull()
      picker.setSelected({ value: new Date(2019, 3, 1) })
      expect(picker.store.getState().selected).toEqual(new Date(2019, 3, 1))
    })
  })
})
