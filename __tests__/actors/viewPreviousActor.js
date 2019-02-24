// @flow

import viewPreviousActor from 'pickadate/actors/viewPreviousActor'
import createPicker from 'pickadate/createPicker'

describe('viewPreviousActor()', () => {
  it('returns a partial state with the view and highlighted set', () => {
    const picker = createPicker({ view: new Date(2030, 3, 20) })

    expect(picker.store.getState().selected).toEqual(null)
    expect(picker.store.getState().view).toEqual(new Date(2030, 3, 1))

    const partialState = viewPreviousActor(picker.store.getState())
    expect(partialState).toEqual({
      highlighted: new Date(2030, 2, 1),
      view: new Date(2030, 2, 1),
    })
  })

  it('returns a partial state with the view and highlighted set as the selected', () => {
    const picker = createPicker({
      selected: new Date(2030, 2, 15),
      view: new Date(2030, 3, 1),
    })

    expect(picker.store.getState().selected).toEqual(new Date(2030, 2, 15))
    expect(picker.store.getState().view).toEqual(new Date(2030, 3, 1))

    const partialState = viewPreviousActor(picker.store.getState())
    expect(partialState).toEqual({
      highlighted: new Date(2030, 2, 15),
      view: new Date(2030, 2, 1),
    })
  })

  it('returns a partial state with the view and highlighted not set as the selected', () => {
    const picker = createPicker({
      selected: new Date(2030, 0, 15),
      view: new Date(2030, 3, 1),
    })

    expect(picker.store.getState().selected).toEqual(new Date(2030, 0, 15))
    expect(picker.store.getState().view).toEqual(new Date(2030, 3, 1))

    const partialState = viewPreviousActor(picker.store.getState())
    expect(partialState).toEqual({
      highlighted: new Date(2030, 2, 1),
      view: new Date(2030, 2, 1),
    })
  })
})
