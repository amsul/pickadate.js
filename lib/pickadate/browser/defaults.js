// @flow

import type { TemplateHookWords } from '../../types'
import type { CreateOptions } from './types'

export const TEMPLATE_HOOK_WORDS: TemplateHookWords = {
  MMM: [
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
  MMMM: [
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
  DDD: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  DDDD: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
}

export const CREATE_OPTIONS: CreateOptions = {
  template: 'DDD, MMMM DD, YYYY @ h:mm a',
  templateHookWords: TEMPLATE_HOOK_WORDS,
  weekdays: TEMPLATE_HOOK_WORDS.DDD,
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
