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

    monthAndYear: 'pickadate--monthAndYear',
    monthAndYear_month: 'pickadate--monthAndYear_month',
    monthAndYear_year: 'pickadate--monthAndYear_year',

    grid: 'pickadate--grid',
    grid_row: 'pickadate--grid_row',
    grid_row__label: 'pickadate--grid_row__label',
    grid_label: 'pickadate--grid_label',
    grid_cell: 'pickadate--grid_cell',
    grid_cell__today: 'pickadate--grid_cell__today',
    grid_cell__highlighted: 'pickadate--grid_cell__highlighted',
    grid_cell__selected: 'pickadate--grid_cell__selected',
    grid_cell__outOfView: 'pickadate--grid_cell__outOfView',
    grid_cell__disabled: 'pickadate--grid_cell__disabled',

    button_previous: ['pickadate--button', 'pickadate--button__previous'],
    button_today: ['pickadate--button', 'pickadate--button__today'],
    button_next: ['pickadate--button', 'pickadate--button__next'],
    button_clear: ['pickadate--button', 'pickadate--button__clear'],
    button_meridiem: ['pickadate--button', 'pickadate--button__meridiem'],

    time: 'pickadate--time',
    time_hours: ['pickadate--time_unit', 'pickadate--time_unit__hours'],
    time_minutes: ['pickadate--time_unit', 'pickadate--time_unit__minutes'],
    time_separator: 'pickadate--time_separator',
    time_input: 'pickadate--time_input',
    time_input__hours: 'pickadate--time_input__hours',
    time_input__minutes: 'pickadate--time_input__minutes',
    time_counter: 'pickadate--time_counter',
    time_counter__up: 'pickadate--time_counter__up',
    time_counter__down: 'pickadate--time_counter__down',
  },
}
