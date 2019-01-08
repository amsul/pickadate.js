// @flow

import type { DatePickerApi, RenderOptions } from './types'
import type { DatePickerState } from '../../types'
import * as React from 'react'
import pickadate from './index'
import { EVENT_NAME } from './event'

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
    text: this.props.picker.getValue() || this.props.renderFallback(),
  }

  unsubscribe = this.props.picker.subscribeToValue(formattedValue => {
    const { renderFallback } = this.props
    this.setState({ text: formattedValue || renderFallback() })
  })

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    return <div>{this.state.text}</div>
  }
}

/////////////////
// DATE PICKER //
/////////////////

const DatePicker = (props: Object) => (
  <PickadateContext.Consumer>
    {picker =>
      picker ? (
        <DatePickerWithApi {...props} picker={picker} />
      ) : (
        <DatePickerWithoutApi {...props} />
      )
    }
  </PickadateContext.Consumer>
)

type DatePickerWithoutApiProps = {
  initialState?: $Shape<DatePickerState>,
}

class DatePickerWithoutApi extends React.Component<DatePickerWithoutApiProps> {
  picker = pickadate.create({
    initialState: this.props.initialState,
  })
  render() {
    const { initialState, ...rest } = this.props
    return <DatePickerWithApi {...rest} picker={this.picker} />
  }
}

type DatePickerWithApiProps = {
  onChange?: Function,
  picker: DatePickerApi,
  options?: $Shape<RenderOptions>,
}

class DatePickerWithApi extends React.Component<DatePickerWithApiProps> {
  element = React.createRef<HTMLDivElement>()
  unsubscribeOnChange = null

  componentDidMount() {
    const { current } = this.element
    if (!current) {
      throw new Error('No element found to render into')
    }

    const { onChange, picker, options } = this.props
    if (onChange) {
      this.unsubscribeOnChange = picker.addEventListener(
        EVENT_NAME.CHANGE,
        onChange
      )
    }
    picker.render(current, options)
  }

  componentWillUnmount() {
    if (this.unsubscribeOnChange) {
      this.unsubscribeOnChange()
    }

    const { current } = this.element
    if (!current) {
      throw new Error('No element found to unrender')
    }
    this.props.picker.unrender(current)
  }

  render() {
    return <div ref={this.element} />
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

  unsubscribe = this.props.picker.subscribeToValue(formattedValue =>
    this.setState({ value: formattedValue })
  )

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { picker, ...rest } = this.props
    return <input readOnly={true} {...rest} value={this.state.value} />
  }
}

//////////////////
// INPUT PICKER //
//////////////////

const InputPicker = (props: Object) => (
  <PickadateContext.Consumer>
    {picker =>
      picker ? (
        <InputPickerWithApi {...props} picker={picker} />
      ) : (
        <InputPickerWithoutApi {...props} />
      )
    }
  </PickadateContext.Consumer>
)

type InputPickerWithoutApiProps = {
  initialState?: $Shape<DatePickerState>,
}

class InputPickerWithoutApi extends React.Component<InputPickerWithoutApiProps> {
  picker = pickadate.create({
    initialState: this.props.initialState,
  })
  render() {
    const { initialState, ...rest } = this.props
    return <InputPickerWithApi {...rest} picker={this.picker} />
  }
}

type InputPickerWithApiProps = {
  onChange?: Function,
  picker: DatePickerApi,
  options?: $Shape<RenderOptions>,
}

class InputPickerWithApi extends React.Component<InputPickerWithApiProps> {
  element = React.createRef<HTMLInputElement>()
  unsubscribeOnChange = null

  componentDidMount() {
    const { current } = this.element
    if (!current) {
      throw new Error('No element found to render into')
    }

    const { onChange, picker, options } = this.props
    if (onChange) {
      this.unsubscribeOnChange = picker.addEventListener(
        EVENT_NAME.CHANGE,
        onChange
      )
    }
    picker.render(current, options)
  }

  componentWillUnmount() {
    if (this.unsubscribeOnChange) {
      this.unsubscribeOnChange()
    }

    const { current } = this.element
    if (!current) {
      throw new Error('No element found to unrender')
    }
    this.props.picker.unrender(current)
  }

  render() {
    const { picker, ...rest } = this.props
    return <input {...rest} ref={this.element} />
  }
}

///////////////
// PICKADATE //
///////////////

type PickadateProps = {
  children: React.Node,
  initialState?: $Shape<DatePickerState>,
  onChange?: Function,
}

class Pickadate extends React.Component<PickadateProps> {
  static DatePicker = DatePicker
  static DateText = DateText
  static Input = Input
  static InputPicker = InputPicker

  picker = pickadate.create({
    initialState: this.props.initialState,
  })

  unsubscribeOnChange = (() => {
    const { onChange } = this.props
    if (onChange) {
      return this.picker.addEventListener(EVENT_NAME.CHANGE, onChange)
    }
  })()

  componentWillUnmount() {
    if (this.unsubscribeOnChange) {
      this.unsubscribeOnChange()
    }
  }

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
