/*eslint-disable react/react-in-jsx-scope*/

const Pickadate = window.pickadate

class App extends window.React.Component {
  config = {
    weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  }
  initialState = {
    disabled: [3],
  }
  render() {
    return (
      <div>
        <Pickadate config={this.config} initialState={this.initialState}>
          <Pickadate.Input placeholder='select a date' />
          <br />
          <br />
          <Pickadate.DateText renderFallback={() => <div>None selected</div>} />
          <br />
          <Pickadate.DatePicker />
        </Pickadate>
        <br />
        <hr />
        <br />
        <Pickadate.DatePicker />
      </div>
    )
  }
}

window.ReactDOM.render(<App />, document.getElementById('root'))
