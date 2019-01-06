---
id: usage
title: Usage
---

Pickadate.js can be used in a couple ways depending on your setup.

## Plain JavaScript

For a full reference, read the guide on the [Plain JavaScript interface](interface-javascript). Below are some of the basics on setting up.

### Importing

```js
import pickadate from 'pickadate'
```

Or for the layman: `window.pickadate`

### Importing without any styles

```js
import pickadate from 'pickadate/vanilla'
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

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/2vj4opzp9n?moduleview=1&hidenavigation=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

### Rendering: Input Picker

```html
<input id="pickadate" />
```

```js
const picker = pickadate.create()
const element = document.getElementById('pickadate')
picker.render(element)
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/ko4k4618ov?moduleview=1&hidenavigation=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

## React DOM

For a full reference, read the guide on the [React DOM interface](interface-react-dom). Below are some of the basics on setting up.

### Importing

```js
import Pickadate from 'pickadate/react'
```

### Rendering: Picker

```jsx
<Pickadate.DatePicker />
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/q4nl091xwq?moduleview=1&hidenavigation=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

### Rendering: Input Picker

```jsx
<Pickadate.InputPicker />
```

<div class="pickadate-demo"><iframe src="https://codesandbox.io/embed/zkqvyypv53?moduleview=1&hidenavigation=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></div>

## React Native

For a full reference, read the guide on the [React Native interface](interface-react-native). Below are some of the basics on setting up.

TODO
