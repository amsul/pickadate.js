// @flow

import type { DatePickerStore } from '../../types'
import type { CreateOptions, ClassNameDynamic } from './types'
import * as jsUtil from '../../utils/jsUtil'
import * as calendarUtil from '../../utils/calendarUtil'
import * as dateUtil from '../../utils/dateUtil'
import * as dateStateSelector from '../../selectors/dateStateSelector'

import chevronRight from './icons/chevron-right.svg'
import chevronLeft from './icons/chevron-left.svg'
import chevronUp from './icons/chevron-up.svg'
import chevronDown from './icons/chevron-down.svg'
import bullsEye from './icons/bulls-eye.svg'

/////////////
// LAYOUTS //
/////////////

type CreateLayout = string => Initialize => (...Array<Layout>) => Layout
type Initialize = (HTMLElement, DatePickerStore, CreateOptions) => void
type Layout = (DatePickerStore, CreateOptions) => HTMLElement

const createLayout: CreateLayout = tagName => initialize => (
  ...childLayouts
) => (dateStore, options) => {
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

export const createRootBox = createBoxLayout((element, dateStore, options) => {
  addAttributes(element, { className: options.className.root })
})

export const createHeaderBox = createBoxLayout(
  (element, dateStore, options) => {
    addAttributes(element, { className: options.className.header })
  }
)

export const createBodyBox = createBoxLayout((element, dateStore, options) => {
  addAttributes(element, { className: options.className.body })
})

export const createFooterBox = createBoxLayout(
  (element, dateStore, options) => {
    addAttributes(element, { className: options.className.footer })
  }
)

export const createTimeBox = createBoxLayout((element, dateStore, options) => {
  // $FlowFixMe
  const state = dateStore.getState()
  addAttributes(element, {
    className: options.className.time,
    hidden: !state.selected,
  })
  dateStore.subscribe(() => {
    const state = dateStore.getState()
    element.hidden = !state.selected
  })
})

export const createPreviousButton = createButtonLayout(
  (element, dateStore, options) => {
    const onClick = () => dateStore.viewPrevious()
    addAttributes(element, {
      className: options.className.button_previous,
      onClick,
    })
    element.innerHTML = chevronLeft
  }
)

export const createTodayButton = createButtonLayout(
  (element, dateStore, options) => {
    const onClick = () => dateStore.viewToday()
    addAttributes(element, {
      className: options.className.button_today,
      onClick,
    })
    element.innerHTML = bullsEye
  }
)

export const createNextButton = createButtonLayout(
  (element, dateStore, options) => {
    const onClick = () => dateStore.viewNext()
    addAttributes(element, {
      className: options.className.button_next,
      onClick,
    })
    element.innerHTML = chevronRight
  }
)

export const createClearButton = createButtonLayout(
  (element, dateStore, options) => {
    const onClick = () => dateStore.clear()
    addAttributes(element, {
      className: options.className.button_clear,
      onClick,
    })
    appendChildren(element, 'Clear')
  }
)

export const createGridButton = createButtonLayout(
  (element, dateStore, options) => {
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

    appendChildren(
      element,
      createGridCellElements(options, dateStore.getState())
    )

    dateStore.subscribe(() => {
      element.innerHTML = ''
      appendChildren(
        element,
        createGridCellElements(options, dateStore.getState())
      )
    })
  }
)

export const createMeridiemButton = createButtonLayout(
  (element, dateStore, options) => {
    const onMouseDown = (event: Event) => event.preventDefault()
    const onClick = () => dateStore.cycleMeridiem()

    addAttributes(element, {
      className: options.className.button_meridiem,
      onMouseDown,
      onClick,
    })

    const updateButton = () => {
      const { selected } = dateStore.getState()
      element.innerHTML = ''
      appendChildren(
        element,
        selected ? (selected.getHours() < 11 ? 'AM' : 'PM') : 'AM'
      )
      element.tabIndex = selected ? 0 : -1
    }

    updateButton()
    dateStore.subscribe(updateButton)
  }
)

export const createHourInput = createBoxLayout(
  (element, dateStore, options) => {
    addAttributes(element, { className: options.className.time_hours })

    const cycleUp = () => dateStore.cycleHourUp()
    const cycleDown = () => dateStore.cycleHourDown()

    const hourInput = createTimeInputElement(options, {
      className: options.className.time_input__hours,
      onKeyCodeUp: cycleUp,
      onKeyCodeDown: cycleDown,
    })

    const updateHourInput = () => {
      const state = dateStore.getState()
      const hours = state.selected
        ? jsUtil.padZero(state.selected.getHours() % 12 || 12, 2)
        : ''
      hourInput.value = hours
      hourInput.tabIndex = state.selected ? 0 : -1
    }

    updateHourInput()
    dateStore.subscribe(updateHourInput)

    appendChildren(element, [
      hourInput,
      ...createTimeCounterElements(options, {
        onClickUp: cycleUp,
        onClickDown: cycleDown,
      }),
    ])
  }
)

export const createMinuteInput = createBoxLayout(
  (element, dateStore, options) => {
    addAttributes(element, { className: options.className.time_minutes })

    const cycleUp = () => dateStore.cycleMinuteUp()
    const cycleDown = () => dateStore.cycleMinuteDown()

    const minuteInput = createTimeInputElement(options, {
      className: options.className.time_input__minutes,
      onKeyCodeUp: cycleUp,
      onKeyCodeDown: cycleDown,
    })

    const updateMinuteInput = () => {
      const state = dateStore.getState()
      const minutes = state.selected
        ? jsUtil.padZero(state.selected.getMinutes(), 2)
        : ''
      minuteInput.value = minutes
      minuteInput.tabIndex = state.selected ? 0 : -1
    }

    updateMinuteInput()
    dateStore.subscribe(updateMinuteInput)

    appendChildren(element, [
      minuteInput,
      ...createTimeCounterElements(options, {
        onClickUp: cycleUp,
        onClickDown: cycleDown,
      }),
    ])
  }
)

export const createTimeSeparator = createBoxLayout(
  (element, dateStore, options) => {
    addAttributes(element, { className: options.className.time_separator })
    element.innerHTML = ':'
  }
)

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
  const isHighlighted = dateUtil.isSameDate(dateState.highlighted, dateObject)
  const isSameMonth = dateUtil.isSameMonth(dateState.view, dateObject)
  const isDisabled = dateStateSelector.isDateDisabled(dateState, dateObject)

  return createDocumentElement({
    className: flattenClassNames([
      options.className.grid_cell,
      {
        [options.className.grid_cell__today]: isToday,
        [options.className.grid_cell__highlighted]: isHighlighted,
        [options.className.grid_cell__selected]: isSelected,
        [options.className.grid_cell__outOfView]: !isSameMonth,
        [options.className.grid_cell__disabled]: isDisabled,
      },
    ]),
    attributes: {
      dataset: isDisabled ? undefined : { value: dateObject.getTime() },
    },
    children: createDocumentElement({
      children: dateObject.getDate(),
    }),
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
  const onFocus = () => inputElement.setSelectionRange(0, 0)

  const inputElement: HTMLInputElement = (createDocumentElement({
    tagName: 'input',
    className: [options.className.time_input, className],
    attributes: { onKeyDown, onFocus, readOnly: true },
  }): any)
  return inputElement
}

const createTimeCounterElements = (options, { onClickUp, onClickDown }) => {
  const onMouseDown = event => event.preventDefault()
  const upElement = createDocumentElement({
    tagName: 'button',
    className: [
      options.className.time_counter,
      options.className.time_counter__up,
    ],
    attributes: { tabIndex: -1, onMouseDown, onClick: onClickUp },
  })
  upElement.innerHTML = chevronUp
  const downElement = createDocumentElement({
    tagName: 'button',
    className: [
      options.className.time_counter,
      options.className.time_counter__down,
    ],
    attributes: { tabIndex: -1, onMouseDown, onClick: onClickDown },
  })
  downElement.innerHTML = chevronDown
  return [upElement, downElement]
}

/////////////
// HELPERS //
/////////////

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

export const appendChildren = (element: HTMLElement, children: any) => {
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
      // $FlowFixMe
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
