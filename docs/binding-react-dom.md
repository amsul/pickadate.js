---
id: binding-react-dom
title: React DOM
---

The React DOM binding uses actual [React.js](https://reactjs.org/) components to render the UI and keep it in sync with the state of the picker.

It comes with the following components:

- [`Pickadate`](#pickadate)
- [`Pickadate.DatePicker`](#pickadatedatepicker)
- [`Pickadate.InputPicker`](#pickadateinputpicker)
- [`Pickadate.DateText`](#pickadatedatetext)
- [`Pickadate.Input`](#pickadateinput)

## Overview

There are two ways you can render the components:

1. A solo component with **unique** picker state.
1. Multiple components with **shared** picker state.

To share picker state, an ancestor [`<Pickadate>`](#pickadate) component is used.

> [`<Pickadate.DatePicker>`](#pickadatedatepicker) can be used with or without an ancestor `<Pickadate>` component.

> [`<Pickadate.InputPicker>`](#pickadateinputpicker) cannot be used with an ancestor `<Pickadate>` component.

## `Pickadate`

Holds the state and picker logic that will be shared across any nested components.

```jsx
<Pickadate>
  <Pickadate.Input placeholder='Select a date' />
  <Pickadate.DatePicker />
</Pickadate>
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/74m4qv75o6?fontsize=14&hidenavigation=1&view=split" tabindex="-1" style="width:100%; height:500px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

### `initialState`

The optional [`state`](api-state) object to initialize the components with.

### `initialTranslation`

The optional [`translation`](api-translation) object to localize the state to use within the components.

### `onChangeValue`

The optional callback handler that is triggered when the selected value changes. It is passed a selection object with the properties:

- `value`: the selected state as a string.
- `date`: the selected state as a date object.

```jsx
<Pickadate
  onChangeValue={({ value, date }) => {
    console.log(value, date)
  }}
>
  ...
</Pickadate>
```

## `Pickadate.DatePicker`

Renders the date picker UI.

```jsx
<Pickadate.DatePicker />
```

Or optionally, when sharing state:

```jsx
<Pickadate>
  <Pickadate.DatePicker />
</Pickadate>
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/xrlom9v6nq?fontsize=14&hidenavigation=1&view=split" tabindex="-1" style="width:100%; height:500px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

### `initialState`

> Only valid when used without an ancestor `<Pickadate>`.

The optional [`state`](api-state) object to initialize the date picker with.

### `initialTranslation`

The optional [`translation`](api-translation) object to localize the state to use for the date picker.

### `options`

The optional rendering customizations for the date picker.

#### `options.mode`

The mode of the date picker to include time or not: `date` or `date-time`. Defaults to `date-time`.

#### `options.className`

The HTML class names used within the date picker.

These are the same ones used in the Plain JavaScript binding: [`options.className` details](binding-javascript#optionsclassname).

#### `options.renderCell`

The render method to customize the appearance of individual dates.

```jsx
<Pickadate.DatePicker
  options={{
    renderCell: ({ dateObject, children }) => (
      <div
        style={{
          color: dateObject.getDay() === 2 ? 'red' : undefined,
        }}
      >
        {children}
      </div>
    ),
  }}
/>
```

### `isInputActive`

TODO

### `isInputOpen`

TODO

### `onChangeValue`

The optional callback handler that is triggered when the selected value changes. It is passed a selection object with the properties:

- `value`: the selected state as a string.
- `date`: the selected state as a date object.

```jsx
<Pickadate.DatePicker
  onChangeValue={({ value, date }) => {
    console.log(value, date)
  }}
/>
```

## `Pickadate.InputPicker`

Renders the date picker UI bound to an `input` element.

```jsx
<Pickadate.InputPicker />
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/18zzj59prq?fontsize=14&hidenavigation=1&view=split" tabindex="-1" style="width:100%; height:500px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

### `initialState`

The optional [`state`](api-state) object to initialize the input picker with.

### `initialTranslation`

The optional [`translation`](api-translation) object to localize the state to use for the input picker.

### `options`

The optional rendering customizations for the input picker.

#### `options.mode`

The mode of the input picker to include time or not: `date` or `date-time`. Defaults to `date-time`.

#### `options.className`

The HTML class names used within the input picker.

These are the same ones used in the Plain JavaScript binding: [`options.className` details](binding-javascript#optionsclassname).

#### `options.renderCell`

The render method to customize the appearance of individual dates.

```jsx
<Pickadate.InputPicker
  options={{
    renderCell: ({ dateObject, children }) => (
      <div
        style={{
          color: dateObject.getDay() === 2 ? 'red' : undefined,
        }}
      >
        {children}
      </div>
    ),
  }}
/>
```

### `onChangeValue`

The optional callback handler that is triggered when the selected value changes. It is passed a selection object with the properties:

- `value`: the selected state as a string.
- `date`: the selected state as a date object.

```jsx
<Pickadate.InputPicker
  onChangeValue={({ value, date }) => {
    console.log(value, date)
  }}
/>
```

### `onFocus`

TODO

### `onBlur`

TODO

### `onKeyDown`

TODO

## `Pickadate.DateText`

> Only valid when used with an ancestor `<Pickadate>`.

Renders the date picker's selected date as text.

```jsx
<Pickadate>
  <Pickadate.DateText renderFallback={() => <div>Nothing selected</div>} />
</Pickadate>
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/6w023onyv3?fontsize=14&hidenavigation=1&view=split" tabindex="-1" style="width:100%; height:500px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

## `Pickadate.Input`

> Only valid when used with an ancestor `<Pickadate>`.

Renders the date picker's selected date in an `input` element.

```jsx
<Pickadate>
  <Pickadate.Input />
</Pickadate>
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/r4rww76vqq?fontsize=14&hidenavigation=1&view=split" tabindex="-1" style="width:100%; height:500px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>
