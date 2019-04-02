// @flow

const React = window.React
const Pickadate = window.pickadate
const frenchTranslation = window.pickadate.translations.fr_FR

class App extends window.React.Component {
  initialState = {
    disabled: [3],
    templateHookWords: {
      DDD: ['1', '2', '3', '4', '5', '6', '7'],
    },
  }
  render() {
    return (
      <div>
        <Pickadate
          initialTranslation={frenchTranslation}
          initialState={this.initialState}
          onChangeValue={({ value, date }) =>
            console.log('pickadate value changed: %o', value)
          }
        >
          <Pickadate.Input placeholder='select a date' />
          <br />
          <br />
          <Pickadate.DateText renderFallback={() => <div>None selected</div>} />
          <br />
          <Pickadate.DatePicker
            options={{
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
          onChangeValue={({ value, date }) =>
            console.log('input picker value changed: %o', value)
          }
        />
        <br />
        <hr />
        <br />
        <Pickadate.DatePicker
          options={{ mode: 'date-time' }}
          initialTranslation={frenchTranslation}
          initialState={{ template: 'YYYY MMMM DD hh:mm a' }}
          onChangeValue={({ value, date }) =>
            console.log('date picker value changed: %o', value)
          }
        />
      </div>
    )
  }
}

window.ReactDOM.render(<App />, document.getElementById('root'))
