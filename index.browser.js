require('index.css')

const inputValueAddon = require('addons/input-value')
// const ACTION          = require('constants/action')
const pickerObject    = require('objects/picker')
const vanillaRenderer = require('renderers/vanilla')



const parentNode      = document.getElementById('picker')
const inputNode       = document.getElementById('picker-input')
const hiddenInputNode = document.getElementById('picker-input-hidden')



const addons = [
  inputValueAddon(inputNode),
  inputValueAddon(hiddenInputNode, 'YYYY/MM/DD : x'),
]

const reducer = function(state, action) {
  return {
    ...state,
    toggle: !state.toggle,
  }
}

const payload = {
  disabled: { dates: [new Date(2014, 4, 20)] },
  firstDay: 8,
  minimum: new Date(2014, 3, 12),
  // scope: 'SCOPE_MONTHS',
  selected: '2014 April 20 @ 4:20 p.m.',
  // selected: new Date(2014, 3, 20, 16, 20, 34),
  template: 'YYYY MMMM DD @ h:mm a',
  today: 'lol'
}

const picker = window.picker = pickerObject.create({
  addons,
  payload,
  reducer,
})
vanillaRenderer.render(parentNode, picker)

console.log(picker)
