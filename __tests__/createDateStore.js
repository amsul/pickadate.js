// @flow

import createDateStore from 'pickadate/createDateStore'

// let sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

describe('createDateStore()', () => {
  it('creates a date store', async () => {
    let dateStore = createDateStore()
    expect(dateStore).toHaveProperty('getState')
    expect(dateStore).toHaveProperty('setSelected')
    // expect(dateStore.getState()).toEqual()
  })

  describe('setSelected()', () => {
    it('sets the selected date', () => {
      let dateStore = createDateStore()
      expect(dateStore.getState().selected).toBeNull()
      dateStore.setSelected({ value: new Date(2019, 3, 1) })
      expect(dateStore.getState().selected).toEqual(new Date(2019, 3, 1))
    })
  })
})
