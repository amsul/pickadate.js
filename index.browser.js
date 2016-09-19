require('index.css')

let vanillaRenderer = require('renderers/vanilla')



let parentNode = document.getElementById('picker')
let inputNode  = document.getElementById('picker-input')

let picker = window.picker = vanillaRenderer.render(parentNode, inputNode, {
  // scope: 'SCOPE_MONTHS',
  // value: '4 April, 2014',
  // template: 'yyyy [yyyy yeaaah] [dd]'
})

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