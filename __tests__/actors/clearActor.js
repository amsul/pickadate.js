// @flow

import clearActor from 'pickadate/actors/clearActor'
import createPicker from 'pickadate/createPicker'

describe('clearActor()', () => {
  it('returns a partial state without a selected date', () => {
    const picker = createPicker()
    expect(clearActor(picker.store.getState())).toEqual({
      selected: null,
    })
  })
})
