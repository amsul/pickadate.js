---
id: binding-javascript
title: Plain JavaScript
---

The plain JavaScript binding uses a simple DOM rendering mechanism to render the UI and keep it in sync with the state of the picker.

It comes with the following methods:

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

Continue reading below for a full reference on all the methods and events.

## `create`

| Arguments                                        | Returns                |
| ------------------------------------------------ | ---------------------- |
| [`initialState: ?Object`](#initial-state)        | [`picker`](api-picker) |
| [`initialTranslation: ?Object`](api-translation) |                        |

Creates a [`picker` object](api-picker) that can be rendered into an element.

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/2vj4opzp9n?fontsize=14&hidenavigation=1&view=split" tabindex="-1" style="width:100%; height:500px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

### Initial State

The picker can be created with an optional [initial state](api-state).

```js
const initialState = {
  selected: new Date(),
}
const picker = pickadate.create(initialState)
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/v89p1p0pqy?fontsize=14&hidenavigation=1&view=split" tabindex="-1" style="width:100%; height:500px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

### Initial Translation

The picker can also be created with an optional [translation object](api-translation).

```js
import frenchTranslation from 'pickadate/builds/translations/fr_FR'
const initialState = {
  selected: new Date(),
}
const picker = pickadate.create(initialState, frenchTranslation)
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/date-picker-create-with-translation-lu045?fontsize=14&hidenavigation=1&view=split" tabindex="-1" style="width:100%; height:500px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

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

### `options`

The third argument to `pickadate.render` is an optional object to customize how the picker renders.

Here a list of all the valid `options` properties:

- [`className`](#options.className)
- [`renderCell`](#options.renderCell)

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

### `options.renderCell`

A render method to customize the appearance of individual date cells in the grid of the picker.

#### Default value

By default, it does nothing:

```js
const renderCell = () => {}
```

#### Custom value

To customize the rendering, the date object and the default children are passed as arguments:

```js
type RenderCell = ({
  dateObject: Date,
  children: HTMLElement,
}) => ?HTMLElement,
```

The children can be used or ignored; a new element can be returned or not:

```js
const renderCell = ({ dateObject, children }) => {
  if (dateObject.getDate() === 10) {
    children.style.color = 'red'
    return
  }
  if (dateObject.getDay() === 4) {
    const newElement = document.createElement('div')
    newElement.innerHTML = `<div>${dateObject.getDate()}<div>⭐️</div></div>`
    return newElement
  }
}
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/rm2lp17rzp?fontsize=14&hidenavigation=1&view=split" tabindex="-1" style="width:100%; height:500px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

## `unrender`

| Arguments              | Returns |
| ---------------------- | ------- |
| `element: HTMLElement` | nothing |

Unrenders the UI for the picker bound to an HTML element.

```js
const element = document.getElementById('date-picker')
picker.unrender(element)
```

## Events

To bind a handler to a UI event, add an event listener to the element the picker is rendered into:

```js
const onChange = formattedValue => {
  console.log('New value:', formattedValue)
}
element.addEventListener('pickadate:change', onChange)
```

To unbind the handler, remove the listener as any other DOM event:

```js
element.removeEventListener('pickadate:change', onChange)
```

The event names are:

- `pickadate:change`
- `pickadate:mount`
- `pickadate:unmount`
- `pickadate:input-open`
- `pickadate:input-close`

### `pickadate:change`

Dispatched when the value of the picker changes.

### `pickadate:mount`

Dispatched when the picker mounts into the element.

### `pickadate:unmount`

Dispatched when the picker unmounts from the element.

### `pickadate:input-open`

Dispatched when the picker (rendered into an input element) opens.

### `pickadate:input-close`

Dispatched when the picker (rendered into an input element) closes.
