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
          onChange={() => console.log('pickadate value changed')}
        >
          <Pickadate.Input placeholder='select a date' />
          <br />
          <br />
          <Pickadate.DateText renderFallback={() => <div>None selected</div>} />
          <br />
          <Pickadate.DatePicker
            options={{
              weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            }}
          />
        </Pickadate>
        <br />
        <hr />
        <br />
        <Pickadate.InputPicker
          onChange={() => console.log('input picker value changed')}
        />
        <br />
        <hr />
        <br />
        <Pickadate.DatePicker
          onChange={() => console.log('date picker value changed')}
        />
      </div>
    )
  }
}

window.ReactDOM.render(<App />, document.getElementById('root'))
