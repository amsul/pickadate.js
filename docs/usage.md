---
id: usage
title: Usage
---

Pickadate.js can be used in a couple ways depending on your setup:

- [Plain JavaScript](#plain-javascript)
- [React DOM](#react-dom)
- [React Native](#react-native)

## Plain JavaScript

Below are the basics on setting up without using any JavaScript UI frameworks.

### Importing

```js
import pickadate from 'pickadate'
```

Or if you're loading it from a `<script>` tag: `window.pickadate`

### Importing without any styles

```js
import pickadate from 'pickadate/builds/vanilla'
```

### Rendering: Picker

```html
<div id="pickadate"></div>
```

```js
const picker = pickadate.create()
const element = document.getElementById('pickadate')
pickadate.render(element, picker)
```

### Rendering: Input Picker

```html
<input id="pickadate" />
```

```js
const picker = pickadate.create()
const element = document.getElementById('pickadate')
pickadate.render(element, picker)
```

> For a full reference, read the guide on the [Plain JavaScript binding](binding-javascript).

## React DOM

Below are the basics on setting up with React DOM as the UI framework of choice.

### Importing

```js
import Pickadate from 'pickadate/builds/react-dom'
```

Or if you're loading it from a `<script>` tag: `window.Pickadate`

### Rendering: Picker

```jsx
<Pickadate.DatePicker />
```

### Rendering: Input Picker

```jsx
<Pickadate.InputPicker />
```

> For a full reference, read the guide on the [React DOM binding](binding-react-dom).

## React Native

Below are the basics on setting up with React Native as the UI framework of choice.

TODO

> For a full reference, read the guide on the [React Native binding](binding-react-native).
