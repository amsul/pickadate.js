// @flow

import lolex from 'lolex'
import viewTodayActor from 'pickadate/actors/viewTodayActor'
import createPicker from 'pickadate/createPicker'

describe('viewTodayActor()', () => {
  it('returns a partial state with the view and highlighted set', () => {
    const clock = lolex.install({ now: new Date(2024, 5, 19) })

    const picker = createPicker({ view: new Date(2030, 3, 20) })

    expect(picker.store.getState().selected).toEqual(null)
    expect(picker.store.getState().view).toEqual(new Date(2030, 3, 20))

    const partialState = viewTodayActor(picker.store.getState())
    expect(partialState).toEqual({
      highlighted: new Date(2024, 5, 1),
      view: new Date(2024, 5, 1),
    })

    clock.uninstall()
  })

  it('returns a partial state with the view and highlighted set as the selected', () => {
    const clock = lolex.install({ now: new Date(2024, 5, 19) })

    const picker = createPicker({
      selected: new Date(2024, 5, 15),
      view: new Date(2030, 3, 1),
    })

    expect(picker.store.getState().selected).toEqual(new Date(2024, 5, 15))
    expect(picker.store.getState().view).toEqual(new Date(2030, 3, 1))

    const partialState = viewTodayActor(picker.store.getState())
    expect(partialState).toEqual({
      highlighted: new Date(2024, 5, 15),
      view: new Date(2024, 5, 1),
    })

    clock.uninstall()
  })

  // it('returns a partial state with the view and highlighted not set as the selected', () => {
  //   const picker = createPicker({
  //     selected: new Date(2030, 0, 15),
  //     view: new Date(2030, 3, 1),
  //   })

  //   expect(picker.store.getState().selected).toEqual(new Date(2030, 0, 15))
  //   expect(picker.store.getState().view).toEqual(new Date(2030, 3, 1))

  //   const partialState = viewPreviousActor(picker.store.getState())
  //   expect(partialState).toEqual({
  //     highlighted: new Date(2030, 2, 1),
  //     view: new Date(2030, 2, 1),
  //   })
  // })
})
