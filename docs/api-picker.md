---
id: api-picker
title: The Picker Object
---

The `picker` object provides methods to manage the UI and actions to update the state.

It can be used to customize and extend the functionality of any renderer.

## Properties

### `store`

The `store` object contains the state of the picker.

> For a full reference, read the API of [the Store Object](api-store).

## Methods

### `getValue`

| Arguments | Returns  |
| --------- | -------- |
| none      | `string` |

Gets the current selected value as a formatted string.

```js
const value = picker.getValue()
console.log(value) // '1 January, 2019 @ 12:00 a.m.'
```

### `subscribeToValue`

| Arguments            | Returns                 |
| -------------------- | ----------------------- |
| `callback: Function` | `unsubscribe: Function` |

Subscribes to updates to the selected value.

The function returned can be called to unsubscribe to the updates.

```js
const callback = formattedValue => {
  console.log(formattedValue) // '1 January, 2019 @ 12:00 a.m.'
}
const unsubscribe = picker.subscribeToValue(callback)
```

### `addEventListener`

| Arguments            | Returns                    |
| -------------------- | -------------------------- |
| `eventName: string`  | `removeListener: Function` |
| `listener: Function` |                            |

Adds a listener for a specific UI event.

The function returned can be called to remove the listener.

```js
const listener = () => {
  console.log('The selected value was changed!')
}
const removeListener = picker.addEventListener('change', listener)
```

The event names are:

- `change`
- `active`
- `inactive`
- `grid.remove-active`
- `grid.remove-inactive`

### `triggerEvent`

| Arguments           | Returns |
| ------------------- | ------- |
| `eventName: string` | nothing |

Triggers a specific UI event by name.

```js
picker.triggerEvent('change')
```

## Actions

### `setSelected`

| Arguments                                                                                                               | Returns |
| ----------------------------------------------------------------------------------------------------------------------- | ------- |
| <code>{<br/>&nbsp;&nbsp;value: Date &#124; string &#124; number,<br/>&nbsp;&nbsp;isUpdatingView?: boolean,<br/>}</code> | nothing |

An action that sets the `selected` state of the store.

> Note: `isUpdatingView` defaults to `true`. To prevent updating the view, set it to `false`.

```js
picker.setSelected({
  value: new Date(2020, 0, 1),
})
```

### `setHighlighted`

| Arguments                                             | Returns |
| ----------------------------------------------------- | ------- |
| <code>{<br/>&nbsp;&nbsp;keyCode: number,<br/>}</code> | nothing |

An action that sets the `highlighted` state of the store using a keyboard event's key code.

For instance, the "up" key's key code highlights the date 7 days before the currently highlighted date.

```js
picker.setHighlighted({
  keyCode: 39,
})
```

### `setMaximum`

| Arguments                                         | Returns |
| ------------------------------------------------- | ------- |
| <code>{<br/>&nbsp;&nbsp;value: Date,<br/>}</code> | nothing |

An action that sets the `maximum` state of the store.

```js
picker.setMaximum({
  value: new Date(2021, 0, 1),
})
```

### `setMinimum`

| Arguments                                         | Returns |
| ------------------------------------------------- | ------- |
| <code>{<br/>&nbsp;&nbsp;value: Date,<br/>}</code> | nothing |

An action that sets the `minimum` state of the store.

```js
picker.setMinimum({
  value: new Date(2019, 1, 1),
})
```

### `setTime`

| Arguments                                                                              | Returns |
| -------------------------------------------------------------------------------------- | ------- |
| <code>{<br/>&nbsp;&nbsp;hours?: number,<br/>&nbsp;&nbsp;minutes?: number,<br/>}</code> | nothing |

An action that sets the time of the `selected` state of the store.

```js
picker.setTime({
  hours: 9,
})
```

### `setFirstDayOfWeek`

| Arguments                                           | Returns |
| --------------------------------------------------- | ------- |
| <code>{<br/>&nbsp;&nbsp;value: number,<br/>}</code> | nothing |

An action that sets the `firstDayOfWeek` state of the store.

```js
picker.setFirstDayOfWeek({
  value: 5,
})
```

### `clear`

| Arguments | Returns |
| --------- | ------- |
| none      | nothing |

An action that clears the `selected` state of the store.

```js
picker.clear()
```

### `viewNext`

| Arguments | Returns |
| --------- | ------- |
| none      | nothing |

An action that updates the `view` and `highlight` state of the store to show the next month.

```js
picker.viewNext()
```

### `viewPrevious`

| Arguments | Returns |
| --------- | ------- |
| none      | nothing |

An action that updates the `view` and `highlight` state of the store to show the previous month.

```js
picker.viewPrevious()
```

### `viewToday`

| Arguments | Returns |
| --------- | ------- |
| none      | nothing |

An action that updates the `view` and `highlight` state of the store to show the month of "today".

```js
picker.viewToday()
```

### `cycleHourUp`

| Arguments | Returns |
| --------- | ------- |
| none      | nothing |

An action that updates the `selected` state of the store to cycle up through the hours of 1 - 12.

```js
picker.cycleHourUp()
```

### `cycleHourDown`

| Arguments | Returns |
| --------- | ------- |
| none      | nothing |

An action that updates the `selected` state of the store to cycle down through the hours of 1 - 12.

```js
picker.cycleHourDown()
```

### `cycleMinuteUp`

| Arguments | Returns |
| --------- | ------- |
| none      | nothing |

An action that updates the `selected` state of the store to cycle up through the minutes of 0 - 59.

```js
picker.cycleMinuteUp()
```

### `cycleMinuteDown`

| Arguments | Returns |
| --------- | ------- |
| none      | nothing |

An action that updates the `selected` state of the store to cycle down through the minutes of 0 - 59.

```js
picker.cycleMinuteDown()
```

### `cycleMeridiem`

| Arguments | Returns |
| --------- | ------- |
| none      | nothing |

An action that updates the `selected` state of the store to cycle the day time period (meridiem) between AM and PM.

```js
picker.cycleMeridiem()
```
