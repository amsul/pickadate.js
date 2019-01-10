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

| Type                                                                 |
| -------------------------------------------------------------------- |
| <code>0 &vert; 1 &vert; 2 &vert; 3 &vert; 4 &vert; 5 &vert; 6</code> |

The index of the first day of the week.

`0` → Sunday

`6` → Saturday

## `maximum`

| Type                          |
| ----------------------------- |
| <code>Date &vert; null</code> |

The maximum date that can be selected.

## `minimum`

| Type                          |
| ----------------------------- |
| <code>Date &vert; null</code> |

The minimum date that can be selected.

## `disabled`

| Type                                                       |
| ---------------------------------------------------------- |
| <code>Array<number &vert; Date &vert; [Date, Date]></code> |

The list of disabled dates.

For numbers, that particular day of the week is disabled.

For dates, that specific date is disabled.

For tuples of two dates, they're used as a range of "from" and "to" dates to disable.
