require('index.css')

let actions       = require('actions')
let vanillaEngine = require('engines/vanilla')



window.actions = actions



function render(id) {

  let parentNode = document.body.querySelector(`#${id}`)

  let picker = vanillaEngine.render(parentNode, {
    // scope: 'SCOPE_MONTHS',
    value: '4 April, 2014',
    // template: 'yyyy [yyyy yeaaah] [dd]'
  })

  let valueNode = document.createElement('div')
  valueNode.style.margin     = '2em'
  valueNode.style.padding    = '0.5em 1em'
  valueNode.style.borderLeft = '5px solid'
  parentNode.appendChild(valueNode)

  valueNode.textContent = getTextContent(picker.state)

  picker.addStateListener(nextState => {
    valueNode.textContent = getTextContent(nextState)
  })

  return picker

}

function getTextContent({ value }) {
  return `The value is: "${value}"`
}



let picker = window.picker = render('picker-1')

console.log(picker)

// let picker2 = render('picker-2')
// picker2.setState({
//   selected: new Date(2016, Math.random() * 11, Math.random() * 28),
// })


// let i = 100
// while (i) {
//   i--
//   picker.dispatch(actions.select(
//     new Date(2016, Math.random() * 11, Math.random() * 28)
//   ))
// }


// setTimeout(() => {

//   picker.setState({
//     selected: new Date(1988, 7, 14)
//   })

//   picker2.setState({
//     selected: new Date(1992, 0, 8)
//   })

//   picker2.setState({
//     view: new Date(1991, 11, 8)
//   })

// }, 1000)