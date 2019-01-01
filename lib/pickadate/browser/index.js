// @flow

import type { DatePickerStore, WordMap } from '../../types'
import type { PickerOptions } from './renderer'
import * as jsUtil from '../../utils/jsUtil'
import * as dateUtil from '../../utils/dateUtil'
import createDateStore from '../../createDateStore'
import * as renderer from './renderer'

const defaultWordMap: WordMap = {
  monthsShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  monthsFull: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  weekdaysFull: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
}

const defaultPickerOptions: PickerOptions = {
  weekdays: defaultWordMap.weekdaysShort,
  className: {
    root: 'pickadate--root',
    header: 'pickadate--header',
    body: 'pickadate--body',
    footer: 'pickadate--footer',

    grid: 'pickadate--grid',
    grid_row: 'pickadate--grid_row',
    grid_row__label: 'pickadate--grid_row__label',
    grid_label: 'pickadate--grid_label',
    grid_cell: 'pickadate--grid_cell',
    grid_cell__today: 'pickadate--grid_cell__today',
    grid_cell__selected: 'pickadate--grid_cell__selected',
    grid_cell__outOfView: 'pickadate--grid_cell__outOfView',
    grid_cell__disabled: 'pickadate--grid_cell__disabled',

    button_previous: ['pickadate--button', 'pickadate--button_previous'],
    button_today: ['pickadate--button', 'pickadate--button_today'],
    button_next: ['pickadate--button', 'pickadate--button_next'],
    button_clear: ['pickadate--button', 'pickadate--button_clear'],
    button_meridiem: ['pickadate--button', 'pickadate--button_meridiem'],

    time: 'pickadate--time',
    time_hours: ['pickadate--time_unit', 'pickadate--time_unit__hours'],
    time_minutes: ['pickadate--time_unit', 'pickadate--time_unit__minutes'],
    time_input: 'pickadate--time_input',
    time_input__hours: 'pickadate--time_input__hours',
    time_input__minutes: 'pickadate--time_input__minutes',
    time_counter: 'pickadate--time_counter',
    time_counter__up: 'pickadate--time_counter__up',
    time_counter__down: 'pickadate--time_counter__down',
  },
}

const container = renderer.createRootBox(
  renderer.createHeaderBox(
    renderer.createPreviousButton(),
    renderer.createTodayButton(),
    renderer.createNextButton()
  ),
  renderer.createBodyBox(renderer.createGridButton()),
  renderer.createFooterBox(
    renderer.createTimeBox(
      renderer.createHourInput(),
      renderer.createMinuteInput(),
      renderer.createMeridiemButton()
    ),
    renderer.createClearButton()
  )
)

const renderDatePicker = (
  dateStore: DatePickerStore,
  element: HTMLElement,
  options?: $Shape<PickerOptions> = defaultPickerOptions
) => {
  if (options !== defaultPickerOptions) {
    options = jsUtil.mergeObjects(defaultPickerOptions, options)
  }
  const pickerElement = container(dateStore, options)
  element.appendChild(pickerElement)
}

type DateOptions = {
  template: string,
  wordMap: WordMap,
  renderFallback: () => any,
}

const defaultDateOptions: DateOptions = {
  template: 'DDD, MMMM DD, YYYY @ h:mm a',
  wordMap: defaultWordMap,
  renderFallback: () => {},
}

const renderDate = (
  dateStore: DatePickerStore,
  element: HTMLElement,
  options?: $Shape<DateOptions> = defaultDateOptions
) => {
  if (options !== defaultDateOptions) {
    options = jsUtil.mergeObjects(defaultDateOptions, options)
  }

  const renderFormattedDate = () => {
    const state = dateStore.getState()
    const { selected } = state
    if (!selected) {
      return options.renderFallback()
    }
    return dateUtil.format(selected, options.template, options.wordMap)
  }

  const render = () => {
    element.innerHTML = ''
    renderer.appendChildren(element, renderFormattedDate())
  }

  render()
  dateStore.subscribe(render)
}

export default {
  createDateStore,
  renderDatePicker,
  renderDate,
}
