// @flow

import setMinimumActor from 'pickadate/actors/setMinimumActor'
import createPicker from 'pickadate/createPicker'

describe('setMinimumActor()', () => {
  it('returns a partial state with minimum set', () => {
    const picker = createPicker()
    expect(picker.store.getState().minimum).toEqual(null)

    const partialState = setMinimumActor(picker.store.getState(), {
      value: new Date(2030, 3, 20),
    })
    expect(partialState).toEqual({
      minimum: new Date(2030, 3, 20),
    })
  })

  it('returns nothing if the payload value is not a date', () => {
    const picker = createPicker()
    expect(
      // $FlowExpected
      setMinimumActor(picker.store.getState(), { value: 'nope' })
    ).toBeUndefined()
    expect(
      // $FlowExpected
      setMinimumActor(picker.store.getState(), { value: [8] })
    ).toBeUndefined()
  })
})
