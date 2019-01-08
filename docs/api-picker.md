---
id: api-picker
title: The Picker Object
---

The `picker` object is what manages the UI. You can use this to extend and customize the functionality.

## Properties

### `store`

The `store` object is what manages the state of the picker.

For a full reference, read the API of [the Store Object](api-store).

## Methods

### `getConfig`

| Arguments | Returns            |
| --------- | ------------------ |
| none      | `DatePickerConfig` |

Gets the current configuration of the picker.

```js
const config = picker.getConfig()
console.log(config) // '[object Object]'
```

### `getValue`

| Arguments | Returns  |
| --------- | -------- |
| none      | `string` |

Gets the current selected value of the picker as a formatted string.

```js
const value = picker.getValue()
console.log(value) // 'Tue, January 01, 2019 @ 12:00 a.m.'
```

### `subscribeToValue`

| Arguments            | Returns                 |
| -------------------- | ----------------------- |
| `callback: Function` | `unsubscribe: Function` |

Subscribes to updates to the selected value of the picker.

The function returned can be called to unsubscribe to updates.

```js
const callback = formattedValue => {
  console.log(formattedValue) // 'Tue, January 01, 2019 @ 12:00 a.m.'
}
const unsubscribe = picker.subscribeToValue(callback)
```

### `addEventListener`

| Arguments                                 | Returns                    |
| ----------------------------------------- | -------------------------- |
| `eventName: string`, `listener: Function` | `removeListener: Function` |

Adds a listener for a specific UI event.

The function returned can be called to remove the listener.

```js
const listener = () => {
  console.log('The selected value was changed!')
}
const removeListener = picker.addEventListener('change', listener)
```

### `triggerEvent`

| Arguments           | Returns |
| ------------------- | ------- |
| `eventName: string` | nothing |

Triggers a specific UI event by name.

```js
picker.triggerEvent('change')
```

### `render`

| Arguments              | Returns |
| ---------------------- | ------- |
| `element: HTMLElement` | nothing |

Renders the UI for the picker into an HTML element.

If the element is an `input` element, a new `div` is created as a sibling and the UI is rendered into into it instead.

```js
const element = document.getElementById('date-picker')
picker.render(element)
```

### `unrender`

| Arguments              | Returns |
| ---------------------- | ------- |
| `element: HTMLElement` | nothing |

Unrenders the UI for the picker bound to an HTML element.

```js
const element = document.getElementById('date-picker')
picker.unrender(element)
```
