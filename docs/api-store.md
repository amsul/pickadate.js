---
id: api-store
title: The Store Object
---

The `store` object provides methods to manage some state. You can trigger actions on the store to update the state as needed.

> For a full reference on the state of the picker, read the API of [the State Object](api-state).

## Methods

### `addActor`

| Arguments | Returns  |
| --------- | -------- |
| `Actor`   | `Action` |

Adds an actor to generate an action with the ability to update the store's state.

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

With `myStringAction` above, it can be triggered it like this:

```js
myStringAction({ value: 'cool' })
```

...to update the state's `someStateKey` value to `'cool'`.

### `subscribe`

| Arguments            | Returns                 |
| -------------------- | ----------------------- |
| `callback: Function` | `unsubscribe: Function` |

Subscribes to updates to the state.

The function returned can be called to unsubscribe to the updates.

```js
const callback = () => {
  console.log('The state was changed!')
}
const unsubscribe = store.subscribe(callback)
```

### `getState`

| Arguments | Returns  |
| --------- | -------- |
| none      | `Object` |

Gets the current state of the picker.

```js
const state = picker.getState()
console.log(state) // '[object Object]'
```
