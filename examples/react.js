/*eslint-disable react/react-in-jsx-scope*/

const DatePicker = window.pickadate.DatePicker
const DatePickerValue = window.pickadate.DatePickerValue

class App extends window.React.Component {
  picker = window.pickadate.create({
    config: {
      weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    },
    initialState: {
      disabled: [3],
    },
  })
  render() {
    return (
      <div>
        <input
        // value={DatePicker.format({ value: selected })}
        />
        <br />
        <br />
        <br />
        <DatePicker picker={this.picker} />
        <br />
        <br />
        <br />
        <DatePickerValue
          picker={this.picker}
          renderFallback={() => <div>None selected</div>}
        />
      </div>
    )
  }
}

window.ReactDOM.render(<App />, document.getElementById('root'))
