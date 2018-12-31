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
  minimum: null | Date,
  maximum: null | Date,
|}

export type DatePickerActor<Payload = void> = Actor<DatePickerState, Payload>

export type SetSelectedPayload = {
  value: Date | string | number,
}
export type SetMinimumPayload = {
  value: Date,
}
export type SetMaximumPayload = {
  value: Date,
}

export type DatePickerStore = Store<DatePickerState> & {
  setSelected: Action<SetSelectedPayload>,
  setMinimum: Action<SetMinimumPayload>,
  setMaximum: Action<SetMaximumPayload>,
  clear: Action<>,
  viewPrevious: Action<>,
  viewNext: Action<>,
  viewToday: Action<>,
}
