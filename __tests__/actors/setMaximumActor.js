// @flow

import setMaximumActor from 'pickadate/actors/setMaximumActor'
import createPicker from 'pickadate/createPicker'

describe('setMaximumActor()', () => {
  it('returns a partial state with maximum set', () => {
    const picker = createPicker()
    expect(picker.store.getState().maximum).toEqual(null)

    const partialState = setMaximumActor(picker.store.getState(), {
      value: new Date(2030, 3, 20),
    })
    expect(partialState).toEqual({
      maximum: new Date(2030, 3, 20),
    })
  })

  it('returns nothing if the payload value is not a date', () => {
    const picker = createPicker()
    expect(
      // $FlowExpected
      setMaximumActor(picker.store.getState(), { value: 'nope' })
    ).toBeUndefined()
    expect(
      // $FlowExpected
      setMaximumActor(picker.store.getState(), { value: [8] })
    ).toBeUndefined()
  })
})
