require('index.css')

let inputValueAddon = require('addons/input-value')
let ACTION          = require('constants/action')
let pickerObject    = require('objects/picker')
let vanillaRenderer = require('renderers/vanilla')



let parentNode      = document.getElementById('picker')
let inputNode       = document.getElementById('picker-input')
let hiddenInputNode = document.getElementById('picker-input-hidden')



let addons = [
  inputValueAddon(inputNode),
  inputValueAddon(hiddenInputNode, 'YYYY/MM/DD : x'),
]

let reducer = function(state, action) {
  return {
    ...state,
    toggle: !state.toggle
  }
}

let stateChanges = {
  // scope: 'SCOPE_MONTHS',
  selected: '2014 April 20 @ 4:20 p.m.',
  // selected: new Date(2014, 3, 20, 16, 20, 34),
  template: 'YYYY MMMM DD @ h:mm a',
}

let picker = window.picker = pickerObject.create(stateChanges, {
  addons,
  reducer,
})
vanillaRenderer.render(parentNode, picker)

console.log(picker)
