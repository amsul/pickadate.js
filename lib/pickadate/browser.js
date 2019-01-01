// @flow

import type { DatePickerStore, Weekdays, Months } from '../types'
import * as jsUtil from '../utils/jsUtil'
import * as calendarUtil from '../utils/calendarUtil'
import * as dateUtil from '../utils/dateUtil'
import * as dateStateSelector from '../selectors/dateStateSelector'
import createDateStore from '../createDateStore'

/////////////
// LAYOUTS //
/////////////

const createLayout = tagName => initialize => (...childLayouts) => (
  dateStore,
  options
) => {
  const element = createDocumentElement({ tagName })
  initialize(element, dateStore, options)

  const children = childLayouts.map(layout => layout(dateStore, options))
  appendChildren(element, children)

  return element
}

const createBoxLayout = createLayout('div')
const createButtonLayout = createLayout('button')

////////////////
// COMPONENTS //
////////////////

const createRootBox = createBoxLayout((element, dateStore, options) => {
  addAttributes(element, { className: options.className.root })
})

const createHeaderBox = createBoxLayout((element, dateStore, options) => {
  addAttributes(element, { className: options.className.header })
})

const createBodyBox = createBoxLayout((element, dateStore, options) => {
  addAttributes(element, { className: options.className.body })
})

const createFooterBox = createBoxLayout((element, dateStore, options) => {
  addAttributes(element, { className: options.className.footer })
})

const createTimeBox = createBoxLayout((element, dateStore, options) => {
  addAttributes(element, { className: options.className.time })
})

const createPreviousButton = createButtonLayout(
  (element, dateStore, options) => {
    const onClick = () => dateStore.viewPrevious()
    addAttributes(element, {
      className: options.className.button_previous,
      onClick,
    })
    appendChildren(element, 'Previous')
  }
)

const createTodayButton = createButtonLayout((element, dateStore, options) => {
  const onClick = () => dateStore.viewToday()
  addAttributes(element, {
    className: options.className.button_today,
    onClick,
  })
  appendChildren(element, 'Today')
})

const createNextButton = createButtonLayout((element, dateStore, options) => {
  const onClick = () => dateStore.viewNext()
  addAttributes(element, {
    className: options.className.button_next,
    onClick,
  })
  appendChildren(element, 'Next')
})

const createClearButton = createButtonLayout((element, dateStore, options) => {
  const onClick = () => dateStore.clear()
  addAttributes(element, {
    className: options.className.button_clear,
    onClick,
  })
  appendChildren(element, 'Clear')
})

const createGridButton = createButtonLayout((element, dateStore, options) => {
  const onClick = (event: Event) => {
    const value = getValueFromMouseEvent(event)
    if (!value) {
      return
    }
    dateStore.setSelected({ value })
  }

  addAttributes(element, {
    className: options.className.grid,
    onClick,
  })

  appendChildren(element, createGridCellElements(options, dateStore.getState()))

  dateStore.subscribe(() => {
    element.innerHTML = ''
    appendChildren(
      element,
      createGridCellElements(options, dateStore.getState())
    )
  })
})

const createMeridiemButton = createButtonLayout(
  (element, dateStore, options) => {
    const onClick = () => dateStore.toggleMeridiem()

    addAttributes(element, {
      className: options.className.button_meridiem,
      onClick,
    })

    const render = () => {
      const { selected } = dateStore.getState()
      element.innerHTML = ''
      appendChildren(
        element,
        selected ? (selected.getHours() < 11 ? 'AM' : 'PM') : 'AM'
      )
    }

    render()
    dateStore.subscribe(render)
  }
)

const createHourInput = createBoxLayout((element, dateStore, options) => {
  addAttributes(element, { className: options.className.time_hours })

  const cycleUp = () => dateStore.cycleHourUp()
  const cycleDown = () => dateStore.cycleHourDown()

  const hourInput = createTimeInputElement(options, {
    className: options.className.time_input__hours,
    onKeyCodeUp: cycleUp,
    onKeyCodeDown: cycleDown,
  })

  const setHourInputValue = () => {
    const state = dateStore.getState()
    const hours = state.selected
      ? dateUtil.format(state.selected, 'hh', options.wordMap)
      : ''
    hourInput.value = hours
  }

  setHourInputValue()
  dateStore.subscribe(setHourInputValue)

  appendChildren(element, [
    hourInput,
    ...createTimeCounterElements(options, {
      onClickUp: cycleUp,
      onClickDown: cycleDown,
    }),
  ])
})

const createMinuteInput = createBoxLayout((element, dateStore, options) => {
  addAttributes(element, { className: options.className.time_minutes })

  const cycleUp = () => dateStore.cycleMinuteUp()
  const cycleDown = () => dateStore.cycleMinuteDown()

  const minuteInput = createTimeInputElement(options, {
    className: options.className.time_input__minutes,
    onKeyCodeUp: cycleUp,
    onKeyCodeDown: cycleDown,
  })

  const setMinuteInputValue = () => {
    const state = dateStore.getState()
    const minutes = state.selected
      ? dateUtil.format(state.selected, 'mm', options.wordMap)
      : ''
    minuteInput.value = minutes
  }

  setMinuteInputValue()
  dateStore.subscribe(setMinuteInputValue)

  appendChildren(element, [
    minuteInput,
    ...createTimeCounterElements(options, {
      onClickUp: cycleUp,
      onClickDown: cycleDown,
    }),
  ])
})

//////////////
// ELEMENTS //
//////////////

const createGridCellElements = (options, dateState) => {
  const datesInWeeks = calendarUtil.getDatesInWeeks(
    dateState.view,
    dateState.firstDayOfWeek
  )

  const elements = datesInWeeks.map(datesInWeek =>
    createDocumentElement({
      className: options.className.grid_row,
      children: datesInWeek.map(dateObject =>
        createGridCellElement(options, dateState, dateObject)
      ),
    })
  )

  elements.unshift(
    createDocumentElement({
      className: flattenClassNames([
        options.className.grid_row,
        options.className.grid_row__label,
      ]),
      children: calendarUtil
        .getWeekdayLabels(options.weekdays, dateState.firstDayOfWeek)
        .map(weekday =>
          createDocumentElement({
            className: options.className.grid_label,
            children: weekday,
          })
        ),
    })
  )

  return elements
}

const createGridCellElement = (options, dateState, dateObject) => {
  const isToday = dateUtil.isSameDate(new Date(), dateObject)
  const isSelected = dateUtil.isSameDate(dateState.selected, dateObject)
  const isSameMonth = dateUtil.isSameMonth(dateState.view, dateObject)
  const isDisabled = dateStateSelector.isDateDisabled(dateState, dateObject)

  return createDocumentElement({
    className: flattenClassNames([
      options.className.grid_cell,
      {
        [options.className.grid_cell__today]: isToday,
        [options.className.grid_cell__selected]: isSelected,
        [options.className.grid_cell__outOfView]: !isSameMonth,
        [options.className.grid_cell__disabled]: isDisabled,
      },
    ]),
    attributes: {
      dataset: isDisabled ? undefined : { value: dateObject.getTime() },
    },
    children: dateObject.getDate(),
  })
}

const createTimeInputElement = (
  options,
  { className, onKeyCodeUp, onKeyCodeDown }
): HTMLInputElement => {
  const KEY_CODE_UP = 38
  const KEY_CODE_DOWN = 40

  const onKeyDown = event => {
    if (event.keyCode === KEY_CODE_UP) {
      event.preventDefault()
      onKeyCodeUp()
    } else if (event.keyCode === KEY_CODE_DOWN) {
      event.preventDefault()
      onKeyCodeDown()
    }
  }

  return (createDocumentElement({
    tagName: 'input',
    className: [options.className.time_input, className],
    attributes: { onKeyDown, readOnly: true },
  }): any)
}

const createTimeCounterElements = (options, { onClickUp, onClickDown }) => {
  return [
    createDocumentElement({
      tagName: 'button',
      className: [
        options.className.time_counter,
        options.className.time_counter__up,
      ],
      attributes: { tabIndex: -1, onClick: onClickUp },
      children: 'up',
    }),
    createDocumentElement({
      tagName: 'button',
      className: [
        options.className.time_counter,
        options.className.time_counter__down,
      ],
      attributes: { tabIndex: -1, onClick: onClickDown },
      children: 'down',
    }),
  ]
}

/////////////
// HELPERS //
/////////////

type ClassName = string | Array<string>
type ClassNameDynamic = ClassName | { [string]: boolean }

type CreateDocumentElementArguments = {
  tagName?: string,
  className?: ClassNameDynamic,
  attributes?: Object,
  children?: any,
}

const createDocumentElement = ({
  tagName = 'div',
  className,
  attributes,
  children,
}: CreateDocumentElementArguments) => {
  const element = document.createElement(tagName)
  addAttributes(element, {
    ...attributes,
    className: flattenClassNames(['pickadate--element', className]),
  })
  appendChildren(element, children)
  return element
}

const appendChildren = (element, children) => {
  if (children == null) {
    return
  }

  children = Array.isArray(children) ? children : [children]
  children.forEach(child => {
    if (!(child instanceof Node)) {
      child = typeof child !== 'string' ? child.toString() : child
      child = document.createTextNode(child)
    }
    element.appendChild(child)
  })
}

const addAttributes = (element, attributes) => {
  if (!attributes) {
    return
  }

  Object.keys(attributes).forEach(attributeName => {
    // $FlowFixMe
    const attributeValue = attributes[attributeName]
    if (attributeValue == null) {
      return
    }

    if (typeof attributeValue === 'function') {
      element.addEventListener(
        attributeName.replace(/^on/, '').toLowerCase(),
        attributeValue
      )
      return
    }

    if (attributeName === 'className') {
      addClassName(element, attributeValue)
      return
    }

    if (attributeName === 'dataset') {
      // $FlowFixMe
      Object.keys(attributeValue).forEach(datasetName => {
        const fullDatasetName = `data-${jsUtil.caseDash(datasetName)}`
        element.setAttribute(fullDatasetName, attributeValue[datasetName])
      })
      return
    }

    // $FlowFixMe
    element[attributeName] = attributeValue
  })
}

const addClassName = (element: Element, className: ClassNameDynamic | void) => {
  if (!className) {
    return
  }

  // $FlowFixMe
  const list = Array.isArray(className) ? className : [className]

  list.forEach(item => {
    if (!item) {
      return
    }

    if (typeof item === 'string') {
      item = { [item]: true }
    }

    if (Array.isArray(item)) {
      item.forEach(className => {
        if (className && typeof className === 'string') {
          element.classList.add(className)
        }
      })
      return
    }

    Object.keys(item).forEach(className => {
      if (className && typeof className === 'string' && item[className]) {
        element.classList.add(className)
      }
    })
  })
}

const flattenClassNames = (
  classNames: Array<mixed | Array<mixed>>
): { [string]: boolean } =>
  classNames.reduce((accumulator, className) => {
    if (!className) {
      return accumulator
    }
    if (Array.isArray(className)) {
      className.forEach(className => {
        if (typeof className === 'string') {
          accumulator[className] = true
        }
      })
    } else if (typeof className === 'string') {
      accumulator[className] = true
    } else if (className.constructor === Object) {
      accumulator = { ...accumulator, ...className }
    }
    return accumulator
  }, {})

///////////////////
// EVENT HELPERS //
///////////////////

const getValueFromMouseEvent = event => {
  const eventPath = getEventPath(event)

  let value = getValueFromMouseEventPath(eventPath, event.currentTarget)
  if (value == null) {
    return
  }

  value = parseInt(value, 10)

  if (!Number.isFinite(value)) {
    console.error('Unable to get value from mouse event %o', event)
    return
  }

  return value
}

const getValueFromMouseEventPath = (path, rootNode) => {
  for (let i = 0; i < path.length; i += 1) {
    const node = path[i]

    if (node === rootNode) {
      return
    }

    // $FlowFixMe
    const { value } = node.dataset

    if (value != null) {
      return value
    }
  }
}

const getEventPath = event => {
  // $FlowFixMe
  if (event.path) {
    return event.path
  }

  const path = []
  let target = event.target

  // $FlowFixMe
  while (target.parentNode) {
    path.push(target)
    // $FlowFixMe
    target = target.parentNode
  }

  path.push(document, window)

  return path
}

////////////////
// PUBLIC API //
////////////////

type PickerOptions = {
  className: {
    root: ClassName,
    header: ClassName,
    body: ClassName,
    footer: ClassName,

    grid: ClassName,
    grid_row: ClassName,
    grid_row__label: string,
    grid_label: ClassName,
    grid_cell: ClassName,
    grid_cell__today: string,
    grid_cell__selected: string,
    grid_cell__outOfView: string,
    grid_cell__disabled: string,

    button_previous: ClassName,
    button_today: ClassName,
    button_next: ClassName,
    button_clear: ClassName,
    button_meridiem: ClassName,

    time: ClassName,
    time_hours: ClassName,
    time_minutes: ClassName,
    time_input: string,
    time_input__hours: string,
    time_input__minutes: string,
    time_counter: string,
    time_counter__up: string,
    time_counter__down: string,
  },
  weekdays: Weekdays,
}

const defaultPickerOptions = {
  className: {
    root: 'pickadate--root',
    header: 'pickadate--header',
    body: 'pickadate--body',
    footer: 'pickadate--footer',

    grid: 'pickadate--grid',
    grid_row: 'pickadate--grid_row',
    grid_row__label: 'pickadate--grid_row__label',
    grid_label: 'pickadate--grid_label',
    grid_cell: 'pickadate--grid_cell',
    grid_cell__today: 'pickadate--grid_cell__today',
    grid_cell__selected: 'pickadate--grid_cell__selected',
    grid_cell__outOfView: 'pickadate--grid_cell__outOfView',
    grid_cell__disabled: 'pickadate--grid_cell__disabled',

    button_previous: ['pickadate--button', 'pickadate--button_previous'],
    button_today: ['pickadate--button', 'pickadate--button_today'],
    button_next: ['pickadate--button', 'pickadate--button_next'],
    button_clear: ['pickadate--button', 'pickadate--button_clear'],
    button_meridiem: ['pickadate--button', 'pickadate--button_meridiem'],

    time: 'pickadate--time',
    time_hours: ['pickadate--time_unit', 'pickadate--time_unit__hours'],
    time_minutes: ['pickadate--time_unit', 'pickadate--time_unit__minutes'],
    time_input: 'pickadate--time_input',
    time_input__hours: 'pickadate--time_input__hours',
    time_input__minutes: 'pickadate--time_input__minutes',
    time_counter: 'pickadate--time_counter',
    time_counter__up: 'pickadate--time_counter__up',
    time_counter__down: 'pickadate--time_counter__down',
  },
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
}

const container = createRootBox(
  createHeaderBox(
    createPreviousButton(),
    createTodayButton(),
    createNextButton()
  ),
  createBodyBox(createGridButton()),
  createFooterBox(
    createTimeBox(
      createHourInput(),
      createMinuteInput(),
      createMeridiemButton()
    ),
    createClearButton()
  )
)

const renderDatePicker = (
  dateStore: DatePickerStore,
  element: HTMLElement,
  options?: $Shape<PickerOptions> = defaultPickerOptions
) => {
  if (options !== defaultPickerOptions) {
    options = jsUtil.mergeObjects(defaultPickerOptions, options)
  }
  const pickerElement = container(dateStore, options)
  element.appendChild(pickerElement)
}

type DateOptions = {
  template: string,
  wordMap: {
    monthShort: Months,
    monthFull: Months,
    dayShort: Weekdays,
    dayFull: Weekdays,
  },
}

const defaultDateOptions = {
  template: 'DDD, MMMM DD, YYYY @ h:mm a',
  wordMap: {
    monthShort: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    monthFull: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    dayShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayFull: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
  },
}

const renderDate = (
  dateStore: DatePickerStore,
  element: HTMLElement,
  options?: $Shape<DateOptions> = defaultDateOptions
) => {
  if (options !== defaultDateOptions) {
    options = jsUtil.mergeObjects(defaultDateOptions, options)
  }

  const getFormattedDate = () => {
    const state = dateStore.getState()
    const { selected } = state

    if (!selected) {
      return 'None selected'
    }

    return dateUtil.format(selected, options.template, options.wordMap)
  }

  const render = () => {
    const selectedElement = createDocumentElement({
      children: getFormattedDate(),
    })
    element.innerHTML = ''
    element.appendChild(selectedElement)
  }

  render()
  dateStore.subscribe(render)
}

export default {
  createDateStore,
  renderDatePicker,
  renderDate,
}
