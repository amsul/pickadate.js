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
          options={{ mode: 'date-time' }}
          initialTranslation={frenchTranslation}
          initialState={{ template: 'YYYY MMMM DD hh:mm a' }}
          onChangeValue={formattedValue =>
            console.log('date picker value changed: %o', formattedValue)
          }
        />
      </div>
    )
  }
}

window.ReactDOM.render(<App />, document.getElementById('root'))
