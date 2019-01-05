const pickadateElement = document.getElementById('pickadate')
const pickadateValueElement = document.getElementById('pickadate-value')
const pickadateInputElement = document.getElementById('pickadate-input')
const pickadateInputPickerElement = document.getElementById(
  'pickadate-input-picker'
)

const inputPicker = window.pickadate.create()
inputPicker.render(pickadateInputPickerElement)
pickadateInputPickerElement.addEventListener('change', () => {
  console.log('input value changed')
})

const today = new Date()
const yy = today.getFullYear()
const mm = today.getMonth()

const minimum = new Date(today)
const maximum = new Date(today)
maximum.setDate(maximum.getDate() + 40)

const picker = window.pickadate.create({
  config: {
    weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  },
  initialState: {
    minimum,
    maximum,
    disabled: [
      3,
      new Date(yy, mm, 21),
      [new Date(yy, mm, 26), new Date(yy, mm, 28)],
    ],
  },
})
picker.addEventListener('change', () => {
  console.log('picker value changed')
})
picker.render(pickadateElement)
picker.subscribeToValue(formattedValue => {
  pickadateValueElement.innerHTML = formattedValue || 'None selected'
  pickadateInputElement.value = formattedValue
})
