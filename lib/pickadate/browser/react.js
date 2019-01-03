// @flow

import type { DatePickerApi } from './types'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import pickadate from './index'

type PickerProps = {
  picker: DatePickerApi,
}

class DatePicker extends React.Component<PickerProps> {
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

type ValueProps = {
  picker: DatePickerApi,
  renderFallback: () => React.Element<*>,
}

class DatePickerValue extends React.Component<ValueProps> {
  element = React.createRef<HTMLDivElement>()

  render() {
    return <div ref={this.element} />
  }

  componentDidMount() {
    const { current } = this.element
    if (!current) {
      throw new Error('No element found to render into')
    }
    const { renderFallback } = this.props
    this.props.picker.renderValue(current, () => {
      ReactDOM.render(renderFallback(), current)
    })
  }
}

export default {
  ...pickadate,
  DatePicker,
  DatePickerValue,
}
