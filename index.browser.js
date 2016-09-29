require('index.css')

let vanillaRenderer = require('renderers/vanilla')



let parentNode = document.getElementById('picker')
let inputNode  = document.getElementById('picker-input')

let picker = window.picker = vanillaRenderer.render(
  parentNode,
  {
    inputNode,
    stateChanges: {
      // scope: 'SCOPE_MONTHS',
      selected: '2014 April 20 @ 4:20 p.m.',
      // selected: new Date(2014, 3, 20, 16, 20, 34),
      template: 'YYYY MMMM DD @ h:mm a',
    }
  },
)

console.log(picker)

// let valueNode = document.createElement('div')
// valueNode.style.margin     = '2em'
// valueNode.style.padding    = '0.5em 1em'
// valueNode.style.borderLeft = '5px solid'
// parentNode.appendChild(valueNode)

// valueNode.textContent = getTextContent(picker.state)

// picker.addStateListener(nextState => {
//   valueNode.textContent = getTextContent(nextState)
// })



// function getTextContent({ value }) {
//   return `The value is: "${value}"`
// }