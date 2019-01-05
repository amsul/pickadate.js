const pickadateElement = document.getElementById('pickadate')
const pickadateValueElement = document.getElementById('pickadate-value')
const pickadateInputElement = document.getElementById('pickadate-input')
const pickadateInputPickerElement = document.getElementById(
  'pickadate-input-picker'
)

const inputPicker = window.pickadate.create()
inputPicker.render(pickadateInputPickerElement)
pickadateInputPickerElement.addEventListener('change', () => {
  console.log(inputPicker.store.getState())
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
picker.render(pickadateElement)
picker.subscribeToValue(formattedValue => {
  pickadateValueElement.innerHTML = formattedValue || 'None selected'
  pickadateInputElement.value = formattedValue
})
