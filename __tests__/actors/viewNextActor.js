// @flow

import viewNextActor from 'pickadate/actors/viewNextActor'
import createPicker from 'pickadate/createPicker'

describe('viewNextActor()', () => {
  it('returns a partial state with the view and highlighted set', () => {
    const picker = createPicker({ view: new Date(2030, 3, 20) })

    expect(picker.store.getState().selected).toEqual(null)
    expect(picker.store.getState().view).toEqual(new Date(2030, 3, 1))

    const partialState = viewNextActor(picker.store.getState())
    expect(partialState).toEqual({
      highlighted: new Date(2030, 4, 1),
      view: new Date(2030, 4, 1),
    })
  })

  it('returns a partial state with the view and highlighted set as the selected', () => {
    const picker = createPicker({
      selected: new Date(2030, 4, 15),
      view: new Date(2030, 3, 1),
    })

    expect(picker.store.getState().selected).toEqual(new Date(2030, 4, 15))
    expect(picker.store.getState().view).toEqual(new Date(2030, 3, 1))

    const partialState = viewNextActor(picker.store.getState())
    expect(partialState).toEqual({
      highlighted: new Date(2030, 4, 15),
      view: new Date(2030, 4, 1),
    })
  })

  it('returns a partial state with the view and highlighted not set as the selected', () => {
    const picker = createPicker({
      selected: new Date(2030, 6, 15),
      view: new Date(2030, 3, 1),
    })

    expect(picker.store.getState().selected).toEqual(new Date(2030, 6, 15))
    expect(picker.store.getState().view).toEqual(new Date(2030, 3, 1))

    const partialState = viewNextActor(picker.store.getState())
    expect(partialState).toEqual({
      highlighted: new Date(2030, 4, 1),
      view: new Date(2030, 4, 1),
    })
  })
})
