// @flow

export type Store<State> = {
  addActor: (Actor<State, Object>) => any,
  subscribe: Function,
  getState: () => State,
}

export type Actor<State, Payload> = (
  state: State,
  payload: Payload
) => ?$Shape<State>

export type Action<Payload, Return = void> = (payload: Payload) => Return

export type DatePickerState = {|
  selected: null | Date | Date[] | Date[][],
|}

export type DatePickerActor<Payload> = Actor<DatePickerState, Payload>

export type SetSelectedPayload = {
  value: Date | string | number,
}
