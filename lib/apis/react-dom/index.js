// @flow

import type { RenderOptions } from 'pickadate/apis/react-dom/types'
import type { DatePickerState, DatePickerCoreApi } from 'pickadate/types'
import * as React from 'react'
import * as Renderer from 'pickadate/renderers/react'
import * as jsUtil from 'pickadate/utils/jsUtil'
import * as classNameUtil from 'pickadate/utils/classNameUtil'
import { RENDER_OPTIONS } from 'pickadate/apis/react-dom/defaults'
import getValueFromMouseEvent from 'pickadate/renderers/dom/getValueFromMouseEvent'
import pickadate from 'pickadate/apis/dom/index'

import chevronLeft from 'pickadate/renderers/dom/icons/chevron-left.svg'
import chevronRight from 'pickadate/renderers/dom/icons/chevron-right.svg'
import chevronUp from 'pickadate/renderers/dom/icons/chevron-up.svg'
import chevronDown from 'pickadate/renderers/dom/icons/chevron-down.svg'
import bullsEye from 'pickadate/renderers/dom/icons/bulls-eye.svg'

const DatePickerContext = React.createContext<RenderOptions>(RENDER_OPTIONS)
const PickadateContext = React.createContext<?DatePickerCoreApi>(null)

const getClassName = ({ styleName, options }) => {
  const styleList = Array.isArray(styleName) ? styleName : [styleName]
  const classList = styleList.map(style =>
    style ? classNameUtil.join(options.className[style]) : ''
  )
  classList.unshift('pickadate--element')
  return classList.join(' ')
}

const getDataAttributes = ({ dataset }) => {
  if (!dataset) {
    return
  }
  return Object.keys(dataset).reduce((accumulator, key) => {
    accumulator[`data-${key}`] = dataset[key]
    return accumulator
  }, {})
}

type StyleName = $Keys<$ElementType<RenderOptions, 'className'>> | void

type ViewProps = {
  children: React.Node,
  styleName?: StyleName | StyleName[],
  isHidden?: boolean,
  dataset?: Object,
}
const ViewComponent = ({
  children,
  styleName,
  isHidden,
  dataset,
}: ViewProps) => (
  <DatePickerContext.Consumer>
    {options => (
      <div
        {...getDataAttributes({ dataset })}
        className={getClassName({ styleName, options })}
        hidden={isHidden}
      >
        {children}
      </div>
    )}
  </DatePickerContext.Consumer>
)

type ButtonProps = {
  ...$Exact<ViewProps>,
  onPress: Function,
  onKeyDown?: Function,
}
const ButtonComponent = ({
  children,
  styleName,
  onPress,
  onKeyDown,
}: ButtonProps) => (
  <DatePickerContext.Consumer>
    {options => (
      <button
        className={getClassName({ styleName, options })}
        onClick={onPress}
        onKeyDown={onKeyDown}
        // onMouseDown={event => event.preventDefault()}
      >
        {children}
      </button>
    )}
  </DatePickerContext.Consumer>
)

type InputProps = {
  ...$Diff<ViewProps, { children: any }>,
  value?: string,
  readOnly?: boolean,
}
const InputComponent = ({ styleName, value, readOnly }: InputProps) => (
  <DatePickerContext.Consumer>
    {options => (
      <input
        className={getClassName({ styleName, options })}
        value={value}
        readOnly={readOnly}
      />
    )}
  </DatePickerContext.Consumer>
)

Renderer.setComponents({ ButtonComponent, ViewComponent, InputComponent })

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
  options?: $Shape<RenderOptions>,
}

class DatePickerWithoutApi extends React.Component<DatePickerWithoutApiProps> {
  picker = pickadate.create({ initialState: this.props.initialState })
  render() {
    const { initialState, ...rest } = this.props
    return <DatePickerWithApi {...rest} picker={this.picker} />
  }
}

type DatePickerWithApiProps = {
  picker: DatePickerCoreApi,
  options?: $Shape<RenderOptions>,
}

class DatePickerWithApi extends React.Component<DatePickerWithApiProps> {
  unsubscribe = null

  componentDidMount() {
    this.unsubscribe = this.props.picker.store.subscribe(() =>
      this.forceUpdate()
    )
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  render() {
    const { picker } = this.props

    let { options } = this.props
    options = options
      ? ((jsUtil.mergeUpdates(RENDER_OPTIONS, options): any): RenderOptions)
      : RENDER_OPTIONS

    const onPressGrid = (event: MouseEvent) => {
      const value = getValueFromMouseEvent(event)
      if (value) {
        picker.store.setSelected({ value })
      }
    }

    return (
      <DatePickerContext.Provider value={options}>
        <Renderer.RootBox picker={picker}>
          <Renderer.HeaderBox>
            <Renderer.MonthAndYearBox store={picker.store} />
            <Renderer.PreviousButton
              store={picker.store}
              renderIcon={() => (
                <div dangerouslySetInnerHTML={{ __html: chevronLeft }} />
              )}
            />
            <Renderer.TodayButton
              store={picker.store}
              renderIcon={() => (
                <div dangerouslySetInnerHTML={{ __html: bullsEye }} />
              )}
            />
            <Renderer.NextButton
              store={picker.store}
              renderIcon={() => (
                <div dangerouslySetInnerHTML={{ __html: chevronRight }} />
              )}
            />
          </Renderer.HeaderBox>
          <Renderer.BodyBox>
            <Renderer.GridButton
              picker={picker}
              weekdays={options.weekdays}
              onPress={onPressGrid}
              renderCell={options.renderCell}
            />
          </Renderer.BodyBox>
          <Renderer.FooterBox>
            <Renderer.TimeBox store={picker.store}>
              <Renderer.HourInput
                store={picker.store}
                renderIconUp={() => (
                  <div dangerouslySetInnerHTML={{ __html: chevronUp }} />
                )}
                renderIconDown={() => (
                  <div dangerouslySetInnerHTML={{ __html: chevronDown }} />
                )}
              />
              <Renderer.TimeSeparator />
              <Renderer.MinuteInput
                store={picker.store}
                renderIconUp={() => (
                  <div dangerouslySetInnerHTML={{ __html: chevronUp }} />
                )}
                renderIconDown={() => (
                  <div dangerouslySetInnerHTML={{ __html: chevronDown }} />
                )}
              />
              <Renderer.MeridiemButton store={picker.store} />
            </Renderer.TimeBox>
          </Renderer.FooterBox>
        </Renderer.RootBox>
      </DatePickerContext.Provider>
    )
  }
}

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
  renderFallback: () => React.Node,
  picker: DatePickerCoreApi,
}

class DateTextWithApi extends React.Component<DateTextWithApiProps> {
  unsubscribe = null

  componentDidMount() {
    this.unsubscribe = this.props.picker.store.subscribe(() =>
      this.forceUpdate()
    )
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  render() {
    const { picker, renderFallback } = this.props
    return <div>{picker.getValue() || renderFallback()}</div>
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
  picker: DatePickerCoreApi,
}

class InputWithApi extends React.Component<InputWithApiProps> {
  unsubscribe = null

  componentDidMount() {
    this.unsubscribe = this.props.picker.store.subscribe(() =>
      this.forceUpdate()
    )
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  render() {
    const { picker, ...rest } = this.props
    return <input readOnly={true} {...rest} value={picker.getValue()} />
  }
}

//////////////////
// INPUT PICKER //
//////////////////

const InputPicker = (props: Object) => (
  <PickadateContext.Consumer>
    {picker => {
      if (picker) {
        console.error(
          'Cannot render the input picker within a <Pickadate> component'
        )
        return null
      }
      return <InputPickerWithoutApi {...props} />
    }}
  </PickadateContext.Consumer>
)

type InputPickerWithoutApiProps = {
  initialState?: $Shape<DatePickerState>,
  options?: $Shape<RenderOptions>,
}

class InputPickerWithoutApi extends React.Component<InputPickerWithoutApiProps> {
  render() {
    const { initialState, options, ...rest } = this.props
    return (
      <Pickadate initialState={initialState}>
        <Input {...rest} />
        <DatePicker options={options} />
      </Pickadate>
    )
  }
}

///////////////
// PICKADATE //
///////////////

type PickadateProps = {
  children: React.Node,
  initialState?: $Shape<DatePickerState>,
}

export default class Pickadate extends React.Component<PickadateProps> {
  static DatePicker = DatePicker
  static DateText = DateText
  static Input = Input
  static InputPicker = InputPicker

  picker = pickadate.create({ initialState: this.props.initialState })

  render() {
    const { children } = this.props
    return (
      <PickadateContext.Provider value={this.picker}>
        {children}
      </PickadateContext.Provider>
    )
  }
}
