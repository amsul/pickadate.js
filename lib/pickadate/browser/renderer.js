// @flow

import type { DatePickerApi, ClassNameDynamic } from './types'
import * as jsUtil from '../../utils/jsUtil'
import * as calendarUtil from '../../utils/calendarUtil'
import * as dateUtil from '../../utils/dateUtil'
import * as dateStateSelector from '../../selectors/dateStateSelector'
import createOnKeyDownCalendar from './createOnKeyDownCalendar'
import { KEY_CODE } from '../../constants'
import { EVENT_NAME } from './event'

import chevronRight from './icons/chevron-right.svg'
import chevronLeft from './icons/chevron-left.svg'
import chevronUp from './icons/chevron-up.svg'
import chevronDown from './icons/chevron-down.svg'
import bullsEye from './icons/bulls-eye.svg'

/////////////
// LAYOUTS //
/////////////

type CreateElement = DatePickerApi => HTMLElement
type CreateLayout = CreateElement => Initialize => (...Array<Layout>) => Layout
type Initialize = (HTMLElement, DatePickerApi, ?HTMLInputElement) => void
type Layout = (DatePickerApi, ?HTMLInputElement) => HTMLElement

const createLayout: CreateLayout = createElement => initialize => (
  ...childLayouts
) => (picker, inputElement) => {
  const element = createElement(picker)
  initialize(element, picker, inputElement)

  const children = childLayouts.map(layout => layout(picker, inputElement))
  appendChildren(element, children)

  return element
}

const createBoxLayout = createLayout(() =>
  createDocumentElement({ tagName: 'div' })
)

const createButtonLayout = createLayout(picker => {
  const buttonElement: HTMLButtonElement = (createDocumentElement({
    tagName: 'button',
  }): any)

  picker.addEventListener(EVENT_NAME.ACTIVE, () => {
    buttonElement.disabled = false
  })
  picker.addEventListener(EVENT_NAME.INACTIVE, () => {
    buttonElement.disabled = true
  })

  return buttonElement
})

////////////////
// COMPONENTS //
////////////////

export const createInputRootBox = createBoxLayout(
  (element, picker, inputElement) => {
    if (!(inputElement instanceof HTMLInputElement)) {
      throw new Error(
        'Cannot initialize an input root without the input element'
      )
    }

    initializeInput(inputElement, picker)

    element.className = picker.getConfig().className.inputRoot
    element.addEventListener('focusin', (event: UIEvent) =>
      event.stopPropagation()
    )
    element.addEventListener('click', (event: MouseEvent) =>
      event.stopPropagation()
    )
    element.addEventListener('mousedown', (event: MouseEvent) => {
      const { target } = event
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLButtonElement
      ) {
        return
      }
      event.preventDefault()
    })
  }
)

export const createRootBox = createBoxLayout((element, picker) => {
  picker.addEventListener(EVENT_NAME.ACTIVE, () => {
    element.classList.add(picker.getConfig().className.root__active)
  })
  picker.addEventListener(EVENT_NAME.INACTIVE, () => {
    element.classList.remove(picker.getConfig().className.root__active)
  })

  addAttributes(element, { className: picker.getConfig().className.root })
})

export const createHeaderBox = createBoxLayout((element, picker) => {
  addAttributes(element, { className: picker.getConfig().className.header })
})

export const createBodyBox = createBoxLayout((element, picker) => {
  addAttributes(element, { className: picker.getConfig().className.body })
})

export const createFooterBox = createBoxLayout((element, picker) => {
  addAttributes(element, { className: picker.getConfig().className.footer })
})

export const createTimeBox = createBoxLayout((element, picker) => {
  // $FlowFixMe
  const state = picker.store.getState()
  addAttributes(element, {
    className: picker.getConfig().className.time,
    hidden: !state.selected,
  })
  picker.store.subscribe(() => {
    const state = picker.store.getState()
    element.hidden = !state.selected
  })
})

export const createMonthAndYearBox = createBoxLayout((element, picker) => {
  addAttributes(element, {
    className: picker.getConfig().className.monthAndYear,
  })

  const render = () => {
    const state = picker.store.getState()
    element.innerHTML = ''
    appendChildren(element, [
      createDocumentElement({
        children: picker.getConfig().templateHookWords.MMMM[
          state.view.getMonth()
        ],
        className: picker.getConfig().className.monthAndYear_month,
      }),
      createDocumentElement({
        children: state.view.getFullYear(),
        className: picker.getConfig().className.monthAndYear_year,
      }),
    ])
  }

  render()
  picker.store.subscribe(render)
})

export const createPreviousButton = createButtonLayout((element, picker) => {
  const onMouseDown = (event: MouseEvent) => event.preventDefault()
  const onClick = () => picker.store.viewPrevious()
  addAttributes(element, {
    className: picker.getConfig().className.button_previous,
    onMouseDown,
    onClick,
  })
  element.innerHTML = chevronLeft
})

export const createTodayButton = createButtonLayout((element, picker) => {
  const onMouseDown = (event: MouseEvent) => event.preventDefault()
  const onClick = () => picker.store.viewToday()
  addAttributes(element, {
    className: picker.getConfig().className.button_today,
    onMouseDown,
    onClick,
  })
  element.innerHTML = bullsEye
})

export const createNextButton = createButtonLayout((element, picker) => {
  const onMouseDown = (event: MouseEvent) => event.preventDefault()
  const onClick = () => picker.store.viewNext()
  addAttributes(element, {
    className: picker.getConfig().className.button_next,
    onMouseDown,
    onClick,
  })
  element.innerHTML = chevronRight
})

export const createClearButton = createButtonLayout((element, picker) => {
  const onMouseDown = (event: MouseEvent) => event.preventDefault()
  const onClick = () => picker.store.clear()
  addAttributes(element, {
    className: picker.getConfig().className.button_clear,
    onMouseDown,
    onClick,
  })
  appendChildren(element, 'Clear')
})

export const createGridButton = createButtonLayout((element, picker) => {
  picker.addEventListener(EVENT_NAME.GRID.REMOTE_ACTIVE, () => {
    element.classList.add(picker.getConfig().className.grid__focused)
  })
  picker.addEventListener(EVENT_NAME.GRID.REMOTE_INACTIVE, () => {
    element.classList.remove(picker.getConfig().className.grid__focused)
  })

  const onClick = (event: MouseEvent) => {
    const value = getValueFromMouseEvent(event)
    if (!value) {
      return
    }
    picker.store.setSelected({ value })
  }

  addAttributes(element, {
    className: picker.getConfig().className.grid,
    onClick,
    onMouseUp: onClick,
    onKeyDown: createOnKeyDownCalendar(picker.store),
  })

  const render = () => {
    element.innerHTML = ''
    appendChildren(
      element,
      createGridCellElements(picker.getConfig(), picker.store.getState())
    )
  }

  render()
  picker.store.subscribe(render)
})

export const createMeridiemButton = createButtonLayout((element, picker) => {
  const onMouseDown = (event: Event) => event.preventDefault()
  const onClick = () => picker.store.cycleMeridiem()

  addAttributes(element, {
    className: picker.getConfig().className.button_meridiem,
    onMouseDown,
    onClick,
  })

  const updateButton = () => {
    const { selected } = picker.store.getState()
    element.innerHTML = ''
    appendChildren(
      element,
      selected ? (selected.getHours() < 12 ? 'AM' : 'PM') : 'AM'
    )
    element.tabIndex = selected ? 0 : -1
  }

  updateButton()
  picker.store.subscribe(updateButton)
})

export const createHourInput = createBoxLayout((element, picker) => {
  addAttributes(element, { className: picker.getConfig().className.time_hours })

  const cycleUp = () => picker.store.cycleHourUp()
  const cycleDown = () => picker.store.cycleHourDown()

  const hourInput = createTimeInputElement(picker.getConfig(), {
    className: picker.getConfig().className.time_input__hours,
    onKeyCodeUp: cycleUp,
    onKeyCodeDown: cycleDown,
  })

  const updateHourInput = () => {
    const state = picker.store.getState()
    const hours = state.selected
      ? jsUtil.padZero(state.selected.getHours() % 12 || 12, 2)
      : ''
    hourInput.value = hours
    hourInput.tabIndex = state.selected ? 0 : -1
  }

  updateHourInput()
  picker.store.subscribe(updateHourInput)

  appendChildren(element, [
    hourInput,
    ...createTimeCounterElements(picker.getConfig(), {
      onClickUp: cycleUp,
      onClickDown: cycleDown,
    }),
  ])
})

export const createMinuteInput = createBoxLayout((element, picker) => {
  addAttributes(element, {
    className: picker.getConfig().className.time_minutes,
  })

  const cycleUp = () => picker.store.cycleMinuteUp()
  const cycleDown = () => picker.store.cycleMinuteDown()

  const minuteInput = createTimeInputElement(picker.getConfig(), {
    className: picker.getConfig().className.time_input__minutes,
    onKeyCodeUp: cycleUp,
    onKeyCodeDown: cycleDown,
  })

  const updateMinuteInput = () => {
    const state = picker.store.getState()
    const minutes = state.selected
      ? jsUtil.padZero(state.selected.getMinutes(), 2)
      : ''
    minuteInput.value = minutes
    minuteInput.tabIndex = state.selected ? 0 : -1
  }

  updateMinuteInput()
  picker.store.subscribe(updateMinuteInput)

  appendChildren(element, [
    minuteInput,
    ...createTimeCounterElements(picker.getConfig(), {
      onClickUp: cycleUp,
      onClickDown: cycleDown,
    }),
  ])
})

export const createTimeSeparator = createBoxLayout((element, picker) => {
  addAttributes(element, {
    className: picker.getConfig().className.time_separator,
  })
  element.innerHTML = ':'
})

//////////////
// ELEMENTS //
//////////////

const createGridCellElements = (config, dateState) => {
  const datesInWeeks = calendarUtil.getDatesInWeeks(
    dateState.view,
    dateState.firstDayOfWeek
  )

  const elements = datesInWeeks.map(datesInWeek =>
    createDocumentElement({
      className: config.className.grid_row,
      children: datesInWeek.map(dateObject =>
        createGridCellElement(config, dateState, dateObject)
      ),
    })
  )

  elements.unshift(
    createDocumentElement({
      className: flattenClassNames([
        config.className.grid_row,
        config.className.grid_row__label,
      ]),
      children: calendarUtil
        .getWeekdayLabels(config.weekdays, dateState.firstDayOfWeek)
        .map(weekday =>
          createDocumentElement({
            className: config.className.grid_label,
            children: weekday,
          })
        ),
    })
  )

  return elements
}

const createGridCellElement = (config, dateState, dateObject) => {
  const isToday = dateUtil.isSameDate(new Date(), dateObject)
  const isSelected = dateUtil.isSameDate(dateState.selected, dateObject)
  const isHighlighted = dateUtil.isSameDate(dateState.highlighted, dateObject)
  const isSameMonth = dateUtil.isSameMonth(dateState.view, dateObject)
  const isDisabled = dateStateSelector.isDateDisabled(dateState, dateObject)

  return createDocumentElement({
    className: flattenClassNames([
      config.className.grid_cell,
      {
        [config.className.grid_cell__today]: isToday,
        [config.className.grid_cell__highlighted]: isHighlighted,
        [config.className.grid_cell__selected]: isSelected,
        [config.className.grid_cell__outOfView]: !isSameMonth,
        [config.className.grid_cell__disabled]: isDisabled,
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
  config,
  { className, onKeyCodeUp, onKeyCodeDown }
): HTMLInputElement => {
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === KEY_CODE.UP) {
      event.preventDefault()
      onKeyCodeUp()
    } else if (event.keyCode === KEY_CODE.DOWN) {
      event.preventDefault()
      onKeyCodeDown()
    }
  }
  const onFocus = () => inputElement.setSelectionRange(0, 0)

  const inputElement: HTMLInputElement = (createDocumentElement({
    tagName: 'input',
    className: [config.className.time_input, className],
    attributes: { onKeyDown, onFocus, readOnly: true },
  }): any)
  return inputElement
}

const createTimeCounterElements = (config, { onClickUp, onClickDown }) => {
  const onMouseDown = (event: MouseEvent) => event.preventDefault()
  const upElement = createDocumentElement({
    tagName: 'button',
    className: [
      config.className.time_counter,
      config.className.time_counter__up,
    ],
    attributes: { tabIndex: -1, onMouseDown, onClick: onClickUp },
  })
  upElement.innerHTML = chevronUp
  const downElement = createDocumentElement({
    tagName: 'button',
    className: [
      config.className.time_counter,
      config.className.time_counter__down,
    ],
    attributes: { tabIndex: -1, onMouseDown, onClick: onClickDown },
  })
  downElement.innerHTML = chevronDown
  return [upElement, downElement]
}

//////////////////
// INITIALIZERS //
//////////////////

const initializeInput = (inputElement, picker) => {
  inputElement.readOnly = true
  inputElement.addEventListener('focus', () => {
    picker.triggerEvent(EVENT_NAME.ACTIVE)
    picker.triggerEvent(EVENT_NAME.GRID.REMOTE_ACTIVE)
  })
  inputElement.addEventListener('blur', () => {
    picker.triggerEvent(EVENT_NAME.GRID.REMOTE_INACTIVE)
  })
  inputElement.addEventListener(
    'keydown',
    createOnKeyDownCalendar(picker.store)
  )

  const onDocumentEvent = (event: UIEvent) => {
    if (
      event.target !== inputElement &&
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
      picker.triggerEvent(EVENT_NAME.INACTIVE)
    }
  }
  document.addEventListener('focusin', onDocumentEvent)
  document.addEventListener('click', onDocumentEvent)

  picker.triggerEvent(EVENT_NAME.INACTIVE)
  picker.subscribeToValue(formattedValue => {
    if (formattedValue === inputElement.value) {
      return
    }
    inputElement.value = formattedValue
    const event = new CustomEvent('change')
    inputElement.dispatchEvent(event)
  })
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
        (attributeValue: any)
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

const getValueFromMouseEvent = (event: MouseEvent) => {
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

const getEventPath = (event: Event) => {
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
