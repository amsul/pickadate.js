---
id: api-state-options
title: List of State Options
---

Below is a list of all the valid `state` properties.

## `selected`

| Type           |
| -------------- |
| `Date`, `null` |

The date selected by the user.

## `highlighted`

| Type   |
| ------ |
| `Date` |

The date highlighted while navigating around the picker.

## `view`

| Type   |
| ------ |
| `Date` |

The date used to represent the currently visible month.

## `firstDayOfWeek`

| Type                              |
| --------------------------------- |
| `0`, `1`, `2`, `3`, `4`, `5`, `6` |

The index of the first day of the week.

`0` → Sunday

`6` → Saturday

## `maximum`

| Type           |
| -------------- |
| `Date`, `null` |

The maximum date that can be selected.

## `minimum`

| Type           |
| -------------- |
| `Date`, `null` |

The minimum date that can be selected.

## `disabled`

| Type                                                       |
| ---------------------------------------------------------- |
| <code>Array<number &#124; Date &#124; [Date, Date]></code> |

The list of disabled dates.

For numbers, that particular day of the week is disabled.

For dates, that specific date is disabled.

For tuples of two dates, they're used as a range of "from" and "to" dates to disable.
