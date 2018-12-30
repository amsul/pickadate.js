// @flow

export type DatepickerState = {|
  selected: null | Date | Date[] | Date[][],
|}

export type SetSelectedPayload = {
  value: Date | string | number,
}

export type DatepickerActor<Payload> = (
  state: DatepickerState,
  payload: Payload
) => ?$Shape<DatepickerState>

export type DatepickerAction<Payload, Return = void> = (
  payload: Payload
) => Return
