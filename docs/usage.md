---
id: usage
title: Usage
---

Pickadate.js can be used in a couple ways depending on your setup.

## Plain JavaScript

Below are the basics on setting up without using any JavaScript UI frameworks.

### Importing

```js
import pickadate from 'pickadate'
```

Or for the layman: `window.pickadate`

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
picker.render(element)
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/2vj4opzp9n?moduleview=1&hidenavigation=1" tabindex="-1" style="width:100%; height:500px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

> For a full reference, read the guide on the [Plain JavaScript binding](binding-javascript).

### Rendering: Input Picker

```html
<input id="pickadate" />
```

```js
const picker = pickadate.create()
const element = document.getElementById('pickadate')
picker.render(element)
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/ko4k4618ov?moduleview=1&hidenavigation=1" tabindex="-1" style="width:100%; height:500px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

## React DOM

Below are the basics on setting up with React DOM as the UI framework of choice.

### Importing

```js
import Pickadate from 'pickadate/builds/react-dom'
```

### Rendering: Picker

```jsx
<Pickadate.DatePicker />
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/q4nl091xwq?moduleview=1&hidenavigation=1" tabindex="-1" style="width:100%; height:500px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

### Rendering: Input Picker

```jsx
<Pickadate.InputPicker />
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/zkqvyypv53?moduleview=1&hidenavigation=1" tabindex="-1" style="width:100%; height:500px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

> For a full reference, read the guide on the [React DOM binding](binding-react-dom).

## React Native

Below are the basics on setting up with React Native as the UI framework of choice.

TODO

> For a full reference, read the guide on the [React Native binding](binding-react-native).
