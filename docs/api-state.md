---
id: api-state
title: The State Object
---

Below is a list of all the valid `state` properties.

## `selected`

| Type                          |
| ----------------------------- |
| <code>Date &vert; null</code> |

The date selected by the user.

#### Default value

```js
const selected = null
```

## `highlighted`

| Type   |
| ------ |
| `Date` |

The date highlighted while navigating around the picker.

#### Default value

```js
const highlighted = initialState.view
```

## `view`

| Type   |
| ------ |
| `Date` |

The date used to represent the currently visible month.

#### Default value

```js
const view = new Date()
```

## `firstDayOfWeek`

| Type                                                                 |
| -------------------------------------------------------------------- |
| <code>0 &vert; 1 &vert; 2 &vert; 3 &vert; 4 &vert; 5 &vert; 6</code> |

The index of the first day of the week.

`0` → Sunday

`6` → Saturday

#### Default value

```js
const firstDayOfWeek = 0
```

## `maximum`

| Type                          |
| ----------------------------- |
| <code>Date &vert; null</code> |

The maximum date that can be selected.

#### Default value

```js
const maximum = null
```

## `minimum`

| Type                          |
| ----------------------------- |
| <code>Date &vert; null</code> |

The minimum date that can be selected.

#### Default value

```js
const minimum = null
```

## `disabled`

| Type                                                       |
| ---------------------------------------------------------- |
| <code>Array<number &vert; Date &vert; [Date, Date]></code> |

The list of disabled dates.

**For numbers:** that particular day of the week is disabled.

**For dates:** that specific date is disabled.

**For tuples of two dates:** they're used as a range of "from" and "to" dates to disable.

#### Default value

```js
const disabled = []
```

## `template`

| Type     |
| -------- |
| `string` |

The template used to format the selected date value.

The formatting hooks listed below can be used in the template.

#### Default value

```js
const template = 'D MMMM, YYYY @ h:mm a'
```

### Formatting hooks

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

### Escaping formatting hooks

In order to type out characters of formatting hooks literally, they can be escaped by surrounding them with square brackets (`[]`).

For example:

```js
'Unescaped MMMM' // Output: 'Unescaped January'
```

In contrast to:

```js
'Escaped [MMMM]' // Output: 'Escaped MMMM'
```

## `templateHookWords`

| Type                                                     |
| -------------------------------------------------------- |
| <code>{<br/>&nbsp;&nbsp;[string]: string[],<br/>}</code> |

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
