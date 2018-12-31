// @flow

//////////
// BASE //
//////////

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

//////////////
// GENERICS //
//////////////

export type WeekdaysIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type Weekdays = [string, string, string, string, string, string, string]
export type Months = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
]

/////////////////
// DATE PICKER //
/////////////////

export type DatePickerState = {|
  firstDayOfWeek: WeekdaysIndex,
  selected: null | Date /*| Date[] | Date[][]*/,
  view: Date,
  minimum: null | Date,
  maximum: null | Date,
|}

export type DatePickerActor<Payload = void> = Actor<DatePickerState, Payload>

export type SetSelectedPayload = {
  value: Date | string | number,
  isUpdatingView?: boolean,
}
export type SetMinimumPayload = {
  value: Date,
}
export type SetMaximumPayload = {
  value: Date,
}
export type SetFirstDayOfWeekPayload = {
  value: WeekdaysIndex,
}

export type DatePickerStore = Store<DatePickerState> & {
  setSelected: Action<SetSelectedPayload>,
  setMinimum: Action<SetMinimumPayload>,
  setMaximum: Action<SetMaximumPayload>,
  setFirstDayOfWeek: Action<SetFirstDayOfWeekPayload>,
  clear: Action<>,
  viewPrevious: Action<>,
  viewNext: Action<>,
  viewToday: Action<>,
}
