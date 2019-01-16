const pickadateElement = document.getElementById('pickadate')
const pickadateValueElement = document.getElementById('pickadate-value')
const pickadateInputElement = document.getElementById('pickadate-input')
const pickadateInputPickerElement = document.getElementById(
  'pickadate-input-picker'
)
const pickadateTranslatedElement = document.getElementById(
  'pickadate-translated'
)

const inputPicker = window.pickadate.create()
window.pickadate.render(pickadateInputPickerElement, inputPicker)
pickadateInputPickerElement.addEventListener('change', () => {
  console.log('input value changed')
})
pickadateInputPickerElement.addEventListener('pickadate:change', () => {
  console.log('input value pickadate:changed')
})

const today = new Date()
const yy = today.getFullYear()
const mm = today.getMonth()

const minimum = new Date(today)
const maximum = new Date(today)
maximum.setDate(maximum.getDate() + 40)

const picker = window.pickadate.create({
  selected: new Date(),
  minimum,
  maximum,
  disabled: [
    3,
    new Date(yy, mm, 21),
    [new Date(yy, mm, 26), new Date(yy, mm, 28)],
  ],
  templateHookWords: {
    DDD: ['Sa', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  },
})
pickadateElement.addEventListener('pickadate:change', () => {
  console.log('picker value changed')
})
window.pickadate.render(pickadateElement, picker, {
  renderCell: ({ dateObject, children }) => {
    if (dateObject.getDate() === 10) {
      children.style.color = 'red'
      return
    }
    children.innerHTML = `(${dateObject.getDate()})`
  },
})

const renderValue = value => {
  pickadateValueElement.innerHTML = value || 'None selected'
  pickadateInputElement.value = value
}

renderValue(picker.getValue())
picker.subscribeToValue(renderValue)

const frenchTranslation = window.pickadate.translations.fr_FR
const frenchPicker = window.pickadate.create(
  {
    templateHookWords: {
      MMMM: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    },
  },
  frenchTranslation
)
window.pickadate.render(pickadateTranslatedElement, frenchPicker, {
  mode: 'date-time',
})
