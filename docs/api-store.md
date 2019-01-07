---
id: api-store
title: The Store Object
---

The `store` object is what manages the state of the picker. You can trigger actions on the store to update the state as needed.

For a full reference on the state of the picker, read the [List of State Options](api-state-options).

## Methods

### `addActor`

| Arguments | Returns  |
| --------- | -------- |
| `Actor`   | `Action` |

Adds an actor to generate an action with the ability to update a store's state.

An "actor" is a method that receives the current state and a payload and then returns the next partial state to be applied.

An "action" is the method invoked with the payload which then triggers the "actor" with the current state.

```js
const myStringActor = (state, payload) => {
  if (typeof payload.value === 'string') {
    return {
      someStateKey: payload.value,
    }
  }
}
const myStringAction = store.addActor(myStringActor)
```

Triggering `myStringAction` with the payload of `{ value: 'cool' }` will update the state's `someStateKey` value to `'cool'`.

### `subscribe`

| Arguments            | Returns                 |
| -------------------- | ----------------------- |
| `callback: Function` | `unsubscribe: Function` |

Subscribes to updates to the state.

The function returned can be called to unsubscribe to updates.

```js
const callback = () => {
  console.log('The state was changed!')
}
const unsubscribe = store.subscribe(callback)
```

### `getState`

| Arguments | Returns           |
| --------- | ----------------- |
| none      | `DatePickerState` |

Gets the current state of the picker.

```js
const state = picker.getState()
console.log(state) // '[object Object]'
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
