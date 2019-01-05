// @flow

import type { DatePickerConfig, DatePickerApi } from './types'
import type { DatePickerState } from '../../types'
import * as React from 'react'
import pickadate from './index'

const PickadateContext = React.createContext<?DatePickerApi>(null)

///////////////
// DATE TEXT //
///////////////

type DateTextProps = {
  renderFallback: () => React.Node,
}

const DateText = (props: DateTextProps) => (
  <PickadateContext.Consumer>
    {picker => {
      if (!picker) {
        console.error(
          'Cannot render the date text outside a <Pickadate> component'
        )
        return null
      }
      return <DateTextWithApi {...props} picker={picker} />
    }}
  </PickadateContext.Consumer>
)

type DateTextWithApiProps = {
  ...$Exact<DateTextProps>,
  picker: DatePickerApi,
}

type DateTextState = {
  text: ?React.Node,
}

class DateTextWithApi extends React.Component<
  DateTextWithApiProps,
  DateTextState
> {
  state = {
    text: undefined,
  }
  render() {
    return <div>{this.state.text}</div>
  }
  componentDidMount() {
    const { picker } = this.props
    picker.subscribeToValue(formattedValue => {
      const { renderFallback } = this.props
      this.setState({ text: formattedValue || renderFallback() })
    })
  }
}

/////////////////
// DATE PICKER //
/////////////////

const DatePicker = () => (
  <PickadateContext.Consumer>
    {picker =>
      picker ? <DatePickerWithApi picker={picker} /> : <DatePickerWithoutApi />
    }
  </PickadateContext.Consumer>
)

type DatePickerWithoutApiProps = {
  config?: $Shape<DatePickerConfig>,
  initialState?: $Shape<DatePickerState>,
}

class DatePickerWithoutApi extends React.Component<DatePickerWithoutApiProps> {
  picker = pickadate.create({
    config: this.props.config,
    initialState: this.props.initialState,
  })
  render() {
    return <DatePickerWithApi picker={this.picker} />
  }
}

type DatePickerWithApiProps = {
  picker: DatePickerApi,
}

class DatePickerWithApi extends React.Component<DatePickerWithApiProps> {
  element = React.createRef<HTMLDivElement>()
  render() {
    return <div ref={this.element} />
  }
  componentDidMount() {
    const { current } = this.element
    if (!current) {
      throw new Error('No element found to render into')
    }
    this.props.picker.render(current)
  }
}

///////////
// INPUT //
///////////

const Input = (props: Object) => (
  <PickadateContext.Consumer>
    {picker => {
      if (!picker) {
        console.error(
          'Cannot render the date input outside a <Pickadate> component'
        )
        return null
      }
      return <InputWithApi {...props} picker={picker} />
    }}
  </PickadateContext.Consumer>
)

type InputWithApiProps = {
  picker: DatePickerApi,
}

type InputState = {
  value: string,
}

class InputWithApi extends React.Component<InputWithApiProps, InputState> {
  state = {
    value: this.props.picker.getValue(),
  }
  render() {
    const { picker, ...rest } = this.props
    return <input {...rest} value={this.state.value} readOnly={true} />
  }
  componentDidMount() {
    const { picker } = this.props
    picker.subscribeToValue(formattedValue =>
      this.setState({ value: formattedValue })
    )
  }
}

//////////////////
// INPUT PICKER //
//////////////////

const InputPicker = () => (
  <PickadateContext.Consumer>
    {picker =>
      picker ? (
        <InputPickerWithApi picker={picker} />
      ) : (
        <InputPickerWithoutApi />
      )
    }
  </PickadateContext.Consumer>
)

type InputPickerWithoutApiProps = {
  config?: $Shape<DatePickerConfig>,
  initialState?: $Shape<DatePickerState>,
}

class InputPickerWithoutApi extends React.Component<InputPickerWithoutApiProps> {
  picker = pickadate.create({
    config: this.props.config,
    initialState: this.props.initialState,
  })
  render() {
    return <InputPickerWithApi picker={this.picker} />
  }
}

type InputPickerWithApiProps = {
  picker: DatePickerApi,
}

class InputPickerWithApi extends React.Component<InputPickerWithApiProps> {
  element = React.createRef<HTMLInputElement>()
  render() {
    return <input ref={this.element} />
  }
  componentDidMount() {
    const { current } = this.element
    if (!current) {
      throw new Error('No element found to render into')
    }
    this.props.picker.render(current)
  }
}

///////////////
// PICKADATE //
///////////////

type PickadateProps = {
  children: React.Node,
  config?: $Shape<DatePickerConfig>,
  initialState?: $Shape<DatePickerState>,
}

class Pickadate extends React.Component<PickadateProps> {
  static DatePicker = DatePicker
  static DateText = DateText
  static Input = Input
  static InputPicker = InputPicker

  picker = pickadate.create({
    config: this.props.config,
    initialState: this.props.initialState,
  })

  render() {
    const { children } = this.props
    return (
      <PickadateContext.Provider value={this.picker}>
        {children}
      </PickadateContext.Provider>
    )
  }
}

export default Pickadate
