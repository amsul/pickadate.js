// @flow

export type Store<State> = {
  addActor: (Actor<State, any>) => any,
  subscribe: Function,
  getState: () => State,
}

export type Actor<State, Payload> = (
  state: State,
  payload: Payload
) => ?$Shape<State>

export type Action<Payload = void, Return = void> = (payload: Payload) => Return

export type DatePickerState = {|
  selected: null | Date | Date[] | Date[][],
  view: Date,
|}

export type DatePickerActor<Payload = void> = Actor<DatePickerState, Payload>

export type SetSelectedPayload = {
  value: Date | string | number,
}

export type DatePickerStore = Store<DatePickerState> & {
  setSelected: Action<SetSelectedPayload>,
  clear: Action<>,
  viewPrevious: Action<>,
  viewNext: Action<>,
  viewToday: Action<>,
}
