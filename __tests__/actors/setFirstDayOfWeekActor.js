// @flow

import setFirstDayOfWeekActor from 'pickadate/actors/setFirstDayOfWeekActor'
import createPicker from 'pickadate/createPicker'

describe('setFirstDayOfWeekActor()', () => {
  it('returns a partial state with firstDayOfWeek set', () => {
    const picker = createPicker()
    expect(picker.store.getState().firstDayOfWeek).toEqual(0)

    const partialState = setFirstDayOfWeekActor(picker.store.getState(), {
      value: 4,
    })
    expect(partialState).toEqual({
      firstDayOfWeek: 4,
    })
  })

  it('returns nothing if the payload value is out of range', () => {
    const picker = createPicker()
    expect(
      // $FlowExpected
      setFirstDayOfWeekActor(picker.store.getState(), { value: -1 })
    ).toBeUndefined()
    expect(
      // $FlowExpected
      setFirstDayOfWeekActor(picker.store.getState(), { value: 8 })
    ).toBeUndefined()
  })

  it('returns nothing if the payload value is not a number', () => {
    const picker = createPicker()
    expect(
      // $FlowExpected
      setFirstDayOfWeekActor(picker.store.getState(), { value: 'nope' })
    ).toBeUndefined()
    expect(
      // $FlowExpected
      setFirstDayOfWeekActor(picker.store.getState(), { value: [8] })
    ).toBeUndefined()
  })
})
