---
id: binding-javascript
title: Plain JavaScript
---

The plain JavaScript binding uses a simple DOM rendering mechanism to render the UI and keep it in sync with the state of the picker.

The binding comes with the following methods:

- [`create`](#create)
- [`render`](#render)
- [`unrender`](#unrender)

## Overview

The first step is to create a [`picker` object](api-picker):

```js
const picker = pickadate.create()
```

With the `picker` created, it can be rendered into any HTML element:

```js
const element = document.getElementById('pickadate')
pickadate.render(element, picker)
```

Once done with the UI and it is ready to be destroyed, it can be unrendered from the HTML element:

```js
const element = document.getElementById('pickadate')
pickadate.unrender(element)
```

## `create`

| Arguments                            | Returns                |
| ------------------------------------ | ---------------------- |
| [`initialState: ?Object`](api-state) | [`picker`](api-picker) |

Creates a [`picker` object](api-picker) with an optional [initial state](api-state).

```js
const initialState = {
  selected: new Date(),
}
const picker = pickadate.create(initialState)
```

## `render`

| Arguments                      | Returns |
| ------------------------------ | ------- |
| `element: HTMLElement`         | nothing |
| [`picker`](api-picker)         |         |
| [`options: ?Object`](#options) |         |

Renders the UI for the picker into an HTML element.

If the element is an `input` element, a new `div` is created as a sibling and the UI is rendered into it instead.

```js
const element = document.getElementById('date-picker')
pickadate.render(element, picker)
```

The third argument is an optional object to customize how the picker renders:

```js
pickadate.render(element, picker, {
  weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
})
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/13vv2y0jw4?hidenavigation=1" tabindex="-1" style="width:100%; height:500px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

### `options`

Below is a list of all the valid `options` properties.

### `options.template`

The template used to format the selected date value.

The formatting hooks listed below can be used in the template.

#### Default value

```js
const template = 'D MMMM, YYYY @ h:mm a'
```

#### Formatting hooks

| Hook   | Description                                 | Result             |
| ------ | ------------------------------------------- | ------------------ |
| `D`    | Date of the month                           | 1 - 31             |
| `DD`   | Date of the month with a leading zero       | 01 - 31            |
|        |                                             |                    |
| `DDD`  | Day of the week in short form               | Sun - Sat          |
| `DDDD` | Day of the week in full form                | Sunday - Saturday  |
|        |                                             |                    |
| `M`    | Month of the year                           | 1 - 12             |
| `MM`   | Month of the year with a leading zero       | 01 - 12            |
| `MMM`  | Month name in short form                    | Jan - Dec          |
| `MMMM` | Month name in full form                     | January - December |
|        |                                             |                    |
| `YYYY` | The year                                    | 2000 - 2999        |
|        |                                             |                    |
| `H`    | Hours in 24-hour format                     | 0 - 23             |
| `HH`   | Hours in 24-hour format with a leading zero | 00 - 23            |
| `h`    | Hours in 12-hour format                     | 1 - 12             |
| `hh`   | Hours in 12-hour format with a leading zero | 01 - 12            |
|        |                                             |                    |
| `m`    | Minutes in hour                             | 0 - 59             |
| `mm`   | Minutes in hour with a leading zero         | 00 - 59            |
|        |                                             |                    |
| `a`    | Day time period (meridiem)                  | a.m. / p.m.        |
| `A`    | Day time period in uppercase (meridiem)     | AM / PM            |
|        |                                             |                    |
| `s`    | Seconds in minute                           | 0 - 59             |
| `ss`   | Seconds in minute with a leading zero       | 00 - 59            |
|        |                                             |                    |
| `x`    | The unix time stamp                         | 587534400000       |

### `options.templateHookWords`

A mapping of hooks to words for the parser to use.

#### Default value

```js
const templateHookWords = {
  MMM  : ['Jan', 'Feb', ..., 'Dec'],
  MMMM : ['January', 'February', ..., 'December'],
  DDD  : ['Sun', 'Mon', ..., 'Sat'],
  DDDD : ['Sunday', 'Monday', ..., 'Saturday'],
}
```

### `options.weekdays`

The weekday labels to use as the heading labels of the grid.

#### Default value

```js
const weekdays = ['Sun', 'Mon', ..., 'Sat']
```

### `options.className`

The various class names used to style the picker UI.

<div class="table--options--classNames"></div>

| Key                                                                                                                | Type                 | Description                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------- |
| `root`                                                                                                             | `string`, `string[]` | The root element of the picker.                                                                                 |
| `root__active`                                                                                                     | `string`, `string[]` | The active state of the `root`.                                                                                 |
| `inputRoot`                                                                                                        | `string`             | The wrapper of the `root` when an input element is the source element.                                          |
| `header`, `body`, `footer`                                                                                         | `string`, `string[]` | The respective header, body, and footer sections of the picker.                                                 |
| `monthAndYear`, `monthAndYear_month`, `monthAndYear_year`                                                          | `string`, `string[]` | The month and year text elements.                                                                               |
| `grid`                                                                                                             | `string`, `string[]` | The grid button element.                                                                                        |
| `grid__focused`                                                                                                    | `string`             | The focused state of the `grid`. This is to be used alongside the `:focus` pseudo selector state of the `grid`. |
| `grid_row`                                                                                                         | `string`, `string[]` | The rows in the grid.                                                                                           |
| `grid_row__label`                                                                                                  | `string`             | The modification added to `grid_row` for the heading labels row in the grid.                                    |
| `grid_label`                                                                                                       | `string`, `string[]` | The heading labels of the grid.                                                                                 |
| `grid_cell`                                                                                                        | `string`, `string[]` | The cells of the grid.                                                                                          |
| `grid_cell__today`, `grid_cell__highlighted`, `grid_cell__selected`, `grid_cell__outOfView`, `grid_cell__disabled` | `string`             | The modifications applied to `grid_cell` based on the state of the cell.                                        |
| `button_previous`                                                                                                  | `string`, `string[]` | The "previous" button.                                                                                          |
| `button_next`                                                                                                      | `string`, `string[]` | The "next" button.                                                                                              |
| `button_today`                                                                                                     | `string`, `string[]` | The "today" button.                                                                                             |
| `button_clear`                                                                                                     | `string`, `string[]` | The "clear" button.                                                                                             |
| `button_meridiem`                                                                                                  | `string`, `string[]` | The "meridiem" button in the time units.                                                                        |
| `time`                                                                                                             | `string`, `string[]` | The time units section.                                                                                         |
| `time_hours`                                                                                                       | `string`, `string[]` | The "hours" section.                                                                                            |
| `time_minutes`                                                                                                     | `string`, `string[]` | The "minutes" section.                                                                                          |
| `time_separator`                                                                                                   | `string`, `string[]` | The "separator" between the hours & minutes.                                                                    |
| `time_input`                                                                                                       | `string`             | The input of a time unit.                                                                                       |
| `time_input__hours`                                                                                                | `string`             | The input of the "hours" unit.                                                                                  |
| `time_input__minutes`                                                                                              | `string`             | The input of the "minutes" unit.                                                                                |
| `time_counter`                                                                                                     | `string`             | The counters of a time unit.                                                                                    |
| `time_counter__up`, `time_counter__down`                                                                           | `string`             | The up/down counter of a time unit.                                                                             |

#### Default value

```js
const className = {
  root: 'pickadate--root',
  root__active: 'pickadate--root__active',
  inputRoot: 'pickadate--input-root',

  header: 'pickadate--header',
  body: 'pickadate--body',
  footer: 'pickadate--footer',

  monthAndYear: 'pickadate--monthAndYear',
  monthAndYear_month: 'pickadate--monthAndYear_month',
  monthAndYear_year: 'pickadate--monthAndYear_year',

  grid: 'pickadate--grid',
  grid__focused: 'pickadate--grid__focused',
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
}
```

## `unrender`

| Arguments              | Returns |
| ---------------------- | ------- |
| `element: HTMLElement` | nothing |

Unrenders the UI for the picker bound to an HTML element.

```js
const element = document.getElementById('date-picker')
picker.unrender(element)
```
