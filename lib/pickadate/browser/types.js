// @flow

import type {
  TemplateHookWords,
  Weekdays,
  DatePickerState,
  DatePickerStore,
} from '../../types'
import type { EventName } from './event'

export type ClassName = string | Array<string>
export type ClassNameDynamic = ClassName | { [string]: boolean }

export type DatePickerConfig = {
  template: string,
  templateHookWords: TemplateHookWords,
  weekdays: Weekdays,
  className: {
    inputRoot: string,
    root: ClassName,
    root__active: string,

    header: ClassName,
    body: ClassName,
    footer: ClassName,

    monthAndYear: ClassName,
    monthAndYear_month: ClassName,
    monthAndYear_year: ClassName,

    grid: ClassName,
    grid__focused: string,
    grid_row: ClassName,
    grid_row__label: string,
    grid_label: ClassName,
    grid_cell: ClassName,
    grid_cell__today: string,
    grid_cell__highlighted: string,
    grid_cell__selected: string,
    grid_cell__outOfView: string,
    grid_cell__disabled: string,

    button_previous: ClassName,
    button_today: ClassName,
    button_next: ClassName,
    button_clear: ClassName,
    button_meridiem: ClassName,

    time: ClassName,
    time_hours: ClassName,
    time_minutes: ClassName,
    time_separator: ClassName,
    time_input: string,
    time_input__hours: string,
    time_input__minutes: string,
    time_counter: string,
    time_counter__up: string,
    time_counter__down: string,
  },
}

export type DatePickerOptions = $Shape<{
  config: $Shape<DatePickerConfig>,
  initialState: $Shape<DatePickerState>,
}>

export type DatePickerApi = {
  store: DatePickerStore,
  getConfig: () => DatePickerConfig,
  getValue: () => string,
  subscribeToValue: (callback: (formattedValue: string) => void) => void,
  addEventListener: (eventName: EventName, listener: Function) => Function,
  triggerEvent: (eventName: EventName) => void,
  render: (element: HTMLElement) => void,
}
