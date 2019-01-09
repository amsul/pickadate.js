// @flow

import type { RenderOptions } from 'pickadate/apis/react-dom/types'
import type { DatePickerState, DatePickerCoreApi } from 'pickadate/types'
import * as React from 'react'
import * as Renderer from 'pickadate/renderers/react'
import * as jsUtil from 'pickadate/utils/jsUtil'
import * as classNameUtil from 'pickadate/utils/classNameUtil'
import { RENDER_OPTIONS } from 'pickadate/apis/react-dom/defaults'
import { EVENT_NAME } from 'pickadate/constants'
import getValueFromMouseEvent from 'pickadate/renderers/dom/getValueFromMouseEvent'
import createOnKeyDownCalendar from 'pickadate/renderers/dom/createOnKeyDownCalendar'
import pickadate from 'pickadate/apis/dom/index'

import chevronLeft from 'pickadate/renderers/dom/icons/chevron-left.svg'
import chevronRight from 'pickadate/renderers/dom/icons/chevron-right.svg'
import chevronUp from 'pickadate/renderers/dom/icons/chevron-up.svg'
import chevronDown from 'pickadate/renderers/dom/icons/chevron-down.svg'
import bullsEye from 'pickadate/renderers/dom/icons/bulls-eye.svg'

const DatePickerContext = React.createContext<RenderOptions>(RENDER_OPTIONS)
const PickadateContext = React.createContext<?DatePickerCoreApi>(null)
const InputPickerContext = React.createContext<?boolean>(null)

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

const getEventTarget = event => {
  let currentTarget: Node = (event.target: any)
  while (currentTarget.parentNode) {
    if (
      currentTarget instanceof HTMLInputElement ||
      currentTarget instanceof HTMLButtonElement
    ) {
      return currentTarget
    }
    currentTarget = currentTarget.parentNode
  }
  return currentTarget
}

type StyleName = $Keys<$ElementType<RenderOptions, 'className'>> | void

type ViewComponentProps = {
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
}: ViewComponentProps) => (
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

type ButtonComponentProps = {
  ...$Exact<ViewComponentProps>,
  onPress: Function,
  onKeyDown?: Function,
  tabIndex?: number,
}
const ButtonComponent = ({
  children,
  styleName,
  onPress,
  onKeyDown,
  tabIndex,
}: ButtonComponentProps) => (
  <DatePickerContext.Consumer>
    {options => (
      <InputPickerContext.Consumer>
        {isActive => (
          <button
            className={getClassName({ styleName, options })}
            onClick={onPress}
            onKeyDown={onKeyDown}
            disabled={isActive === false}
            tabIndex={tabIndex}
          >
            {children}
          </button>
        )}
      </InputPickerContext.Consumer>
    )}
  </DatePickerContext.Consumer>
)

type InputComponentProps = {
  ...$Diff<ViewComponentProps, { children: any }>,
  value?: string,
  readOnly?: boolean,
}
const InputComponent = ({
  styleName,
  value,
  readOnly,
}: InputComponentProps) => (
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
              picker={picker}
              renderIcon={() => (
                <div dangerouslySetInnerHTML={{ __html: chevronLeft }} />
              )}
            />
            <Renderer.TodayButton
              picker={picker}
              renderIcon={() => (
                <div dangerouslySetInnerHTML={{ __html: bullsEye }} />
              )}
            />
            <Renderer.NextButton
              picker={picker}
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
                picker={picker}
                renderIconUp={() => (
                  <div dangerouslySetInnerHTML={{ __html: chevronUp }} />
                )}
                renderIconDown={() => (
                  <div dangerouslySetInnerHTML={{ __html: chevronDown }} />
                )}
              />
              <Renderer.TimeSeparator />
              <Renderer.MinuteInput
                picker={picker}
                renderIconUp={() => (
                  <div dangerouslySetInnerHTML={{ __html: chevronUp }} />
                )}
                renderIconDown={() => (
                  <div dangerouslySetInnerHTML={{ __html: chevronDown }} />
                )}
              />
              <Renderer.MeridiemButton picker={picker} />
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
  inputRef?: React.Ref<*>,
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
    const { picker, inputRef, ...rest } = this.props
    return (
      <input
        readOnly={true}
        {...rest}
        ref={inputRef}
        value={picker.getValue()}
      />
    )
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
  onFocus?: (event: KeyboardEvent) => any,
  onBlur?: (event: KeyboardEvent) => any,
  onKeyDown?: (event: KeyboardEvent) => any,
}

type InputPickerState = {
  isActive: boolean,
}

class InputPickerWithoutApi extends React.Component<
  InputPickerWithoutApiProps,
  InputPickerState
> {
  state = {
    isActive: false,
  }

  picker = pickadate.create({ initialState: this.props.initialState })

  unsubscribeEnabled = this.picker.addEventListener(EVENT_NAME.ACTIVE, () =>
    this.setState({ isActive: true })
  )
  unsubscribeDisabled = this.picker.addEventListener(EVENT_NAME.INACTIVE, () =>
    this.setState({ isActive: false })
  )

  inputRef = React.createRef<HTMLInputElement>()
  viewRef = React.createRef<HTMLDivElement>()

  onKeyDown = createOnKeyDownCalendar(this.picker.store)

  onDocumentEvent = (event: UIEvent) => {
    const { current: inputElement } = this.inputRef
    const { current: wrapperElement } = this.viewRef
    if (!inputElement || !wrapperElement) {
      console.error(
        'Cannot handle document events without a mounted input picker'
      )
      return
    }

    if (
      event.target !== inputElement &&
      !wrapperElement.contains((event.target: any)) &&
      // $FlowFixMe: In Chrome 62+, password auto-fill simulates focusin
      !event.isSimulated &&
      // In Firefox, a click on an `option` element bubbles up directly
      // to the document.
      event.target !== document &&
      // In Firefox stopPropagation() doesn’t prevent right-click events
      // from bubbling. So make sure the event wasn’t a right-click.
      // $FlowFixMe
      event.which !== 3
    ) {
      this.picker.triggerEvent(EVENT_NAME.INACTIVE)
    }
  }

  componentDidMount() {
    this.picker.triggerEvent(EVENT_NAME.INACTIVE)
    document.addEventListener('focusin', this.onDocumentEvent)
    document.addEventListener('click', this.onDocumentEvent)
  }

  componentWillUnmount() {
    this.unsubscribeEnabled()
    this.unsubscribeDisabled()
    document.removeEventListener('focusin', this.onDocumentEvent)
    document.removeEventListener('click', this.onDocumentEvent)
  }

  render() {
    const {
      initialState,
      options,
      onFocus: propsOnFocus,
      onBlur: propsOnBlur,
      onKeyDown: propsOnKeyDown,
      ...rest
    } = this.props
    const { picker } = this

    const onFocus = event => {
      picker.triggerEvent(EVENT_NAME.ACTIVE)
      picker.triggerEvent(EVENT_NAME.GRID.REMOTE_ACTIVE)
      if (propsOnFocus) {
        propsOnFocus(event)
      }
    }

    const onBlur = event => {
      picker.triggerEvent(EVENT_NAME.GRID.REMOTE_INACTIVE)
      if (propsOnBlur) {
        propsOnBlur(event)
      }
    }

    const onKeyDown = event => {
      this.onKeyDown(event)
      if (propsOnKeyDown) {
        propsOnKeyDown(event)
      }
    }

    const onMouseDown = (event: MouseEvent) => {
      const target = getEventTarget(event)
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLButtonElement
      ) {
        return
      }
      event.preventDefault()
    }

    return (
      <PickadateContext.Provider value={picker}>
        <Input
          {...rest}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          inputRef={this.inputRef}
        />
        <InputPickerContext.Provider value={this.state.isActive}>
          <ViewComponent styleName='inputRoot'>
            <div ref={this.viewRef} onMouseDown={onMouseDown}>
              <DatePicker options={options} />
            </div>
          </ViewComponent>
        </InputPickerContext.Provider>
      </PickadateContext.Provider>
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
