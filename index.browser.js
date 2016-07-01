require('index.css')

let actions       = require('actions')
let vanillaEngine = require('engines/vanilla')



function render(id) {
  let parentNode = document.body.querySelector(`#${id}`)
  return vanillaEngine.render(parentNode, {
    // scope: 'SCOPE_MONTHS'
  })
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