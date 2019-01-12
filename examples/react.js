/*eslint-disable react/react-in-jsx-scope*/

const Pickadate = window.pickadate

class App extends window.React.Component {
  initialState = {
    disabled: [3],
  }
  render() {
    return (
      <div>
        <Pickadate
          initialState={this.initialState}
          onChangeValue={formattedValue =>
            console.log('pickadate value changed: %o', formattedValue)
          }
        >
          <Pickadate.Input placeholder='select a date' />
          <br />
          <br />
          <Pickadate.DateText renderFallback={() => <div>None selected</div>} />
          <br />
          <Pickadate.DatePicker
            options={{
              weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
              renderCell: ({ dateObject, children }) => (
                <div
                  style={{
                    color: dateObject.getDate() === 10 ? 'red' : undefined,
                  }}
                >
                  ({dateObject.getDate()})
                </div>
              ),
            }}
          />
        </Pickadate>
        <br />
        <hr />
        <br />
        <Pickadate.InputPicker
          onChangeValue={formattedValue =>
            console.log('input picker value changed: %o', formattedValue)
          }
        />
        <br />
        <hr />
        <br />
        <Pickadate.DatePicker
          onChangeValue={formattedValue =>
            console.log('date picker value changed: %o', formattedValue)
          }
        />
      </div>
    )
  }
}

window.ReactDOM.render(<App />, document.getElementById('root'))
