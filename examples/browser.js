const pickerElement = document.getElementById('picker')
const pickerValueElement = document.getElementById('picker-value')

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
picker.render(pickerElement)
picker.renderValue(pickerValueElement, () => {
  pickerValueElement.innerHTML = 'None selected'
})
