// @flow

import type { DatePickerCoreApi } from 'pickadate/types'
import type { ClassNameDynamic, RenderOptions } from 'pickadate/apis/dom/types'
import type { EventName } from 'pickadate/renderers/dom/constants'
import * as jsUtil from 'pickadate/utils/jsUtil'
import * as calendarUtil from 'pickadate/utils/calendarUtil'
import * as classNameUtil from 'pickadate/utils/classNameUtil'
import * as gridCellSelector from 'pickadate/selectors/gridCellSelector'
import createOnKeyDownCalendar from 'pickadate/renderers/dom/createOnKeyDownCalendar'
import getValueFromMouseEvent from 'pickadate/renderers/dom/getValueFromMouseEvent'
import { EVENT_NAME } from 'pickadate/renderers/dom/constants'
import { KEY_CODE } from 'pickadate/constants'

import chevronRight from 'pickadate/renderers/dom/icons/chevron-right.svg'
import chevronLeft from 'pickadate/renderers/dom/icons/chevron-left.svg'
import chevronUp from 'pickadate/renderers/dom/icons/chevron-up.svg'
import chevronDown from 'pickadate/renderers/dom/icons/chevron-down.svg'
import bullsEye from 'pickadate/renderers/dom/icons/bulls-eye.svg'

/////////////
// LAYOUTS //
/////////////

type CreateElement = (
  picker: DatePickerCoreApi,
  rootElement: HTMLElement
) => HTMLElement

type CreateLayout = CreateElement => Initialize => (...Array<Layout>) => Layout

type Initialize = (
  element: HTMLElement,
  picker: DatePickerCoreApi,
  options: RenderOptions,
  rootElement: HTMLElement
) => void

type Layout = (
  picker: DatePickerCoreApi,
  options: RenderOptions,
  rootElement: HTMLElement
) => HTMLElement

const createLayout: CreateLayout = createElement => initialize => (
  ...childLayouts
) => (picker, options, rootElement) => {
  const element = createElement(picker, rootElement)
  initialize(element, picker, options, rootElement)

  const children = childLayouts.map(layout =>
    layout(picker, options, rootElement)
  )
  appendChildren(element, children)

  return element
}

const createBoxLayout = createLayout(() =>
  createDocumentElement({ tagName: 'div' })
)

const createButtonLayout = createLayout((picker, rootElement) => {
  const buttonElement: HTMLButtonElement = (createDocumentElement({
    tagName: 'button',
  }): any)

  rootElement.addEventListener(EVENT_NAME.INPUT_OPEN, () => {
    buttonElement.disabled = false
  })
  rootElement.addEventListener(EVENT_NAME.INPUT_CLOSE, () => {
    buttonElement.disabled = true
  })

  return buttonElement
})

////////////////
// COMPONENTS //
////////////////

export const createInputRootBox = createBoxLayout(
  (element, picker, options, rootElement) => {
    if (!(rootElement instanceof HTMLInputElement)) {
      throw new Error(
        'Cannot initialize an input root without the input element'
      )
    }

    initializeInput(rootElement, picker)

    element.className = options.className.inputRoot
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

export const createRootBox = createBoxLayout(
  (element, picker, options, rootElement) => {
    addAttributes(element, { className: options.className.root })

    rootElement.addEventListener(EVENT_NAME.INPUT_OPEN, () => {
      element.classList.add(options.className.root__active)
    })
    rootElement.addEventListener(EVENT_NAME.INPUT_CLOSE, () => {
      element.classList.remove(options.className.root__active)
    })

    picker.subscribeToSelection(() =>
      dispatchEvent(rootElement, EVENT_NAME.CHANGE)
    )
  }
)

export const createHeaderBox = createBoxLayout((element, picker, options) => {
  addAttributes(element, { className: options.className.header })
})

export const createBodyBox = createBoxLayout((element, picker, options) => {
  addAttributes(element, { className: options.className.body })
})

export const createFooterBox = createBoxLayout((element, picker, options) => {
  addAttributes(element, { className: options.className.footer })
})

export const createTimeBox = createBoxLayout((element, picker, options) => {
  // $FlowFixMe
  const state = picker.store.getState()
  addAttributes(element, {
    className: options.className.time,
    hidden: !state.selected,
  })
  picker.store.subscribe(() => {
    const state = picker.store.getState()
    element.hidden = !state.selected
  })
})

export const createMonthAndYearBox = createBoxLayout(
  (element, picker, options) => {
    addAttributes(element, {
      className: options.className.monthAndYear,
    })

    const render = () => {
      const state = picker.store.getState()
      element.innerHTML = ''
      appendChildren(element, [
        createDocumentElement({
          children: state.templateHookWords.MMMM[state.view.getMonth()],
          className: options.className.monthAndYear_month,
        }),
        createDocumentElement({
          children: state.view.getFullYear(),
          className: options.className.monthAndYear_year,
        }),
      ])
    }

    render()
    picker.store.subscribe(render)
  }
)

export const createPreviousButton = createButtonLayout(
  (element, picker, options) => {
    const onMouseDown = (event: MouseEvent) => event.preventDefault()
    const onClick = () => picker.viewPrevious()
    addAttributes(element, {
      className: options.className.button_previous,
      onMouseDown,
      onClick,
    })
    element.innerHTML = chevronLeft
  }
)

export const createTodayButton = createButtonLayout(
  (element, picker, options) => {
    const onMouseDown = (event: MouseEvent) => event.preventDefault()
    const onClick = () => picker.viewToday()
    addAttributes(element, {
      className: options.className.button_today,
      onMouseDown,
      onClick,
    })
    element.innerHTML = bullsEye
  }
)

export const createNextButton = createButtonLayout(
  (element, picker, options) => {
    const onMouseDown = (event: MouseEvent) => event.preventDefault()
    const onClick = () => picker.viewNext()
    addAttributes(element, {
      className: options.className.button_next,
      onMouseDown,
      onClick,
    })
    element.innerHTML = chevronRight
  }
)

export const createClearButton = createButtonLayout(
  (element, picker, options) => {
    const onMouseDown = (event: MouseEvent) => event.preventDefault()
    const onClick = () => picker.clear()
    addAttributes(element, {
      className: options.className.button_clear,
      onMouseDown,
      onClick,
    })
    appendChildren(element, 'Clear')
  }
)

export const createGridButton = createButtonLayout(
  (element, picker, options, rootElement) => {
    rootElement.addEventListener(EVENT_NAME.INPUT_ACTIVE, () => {
      element.classList.add(options.className.grid__focused)
    })
    rootElement.addEventListener(EVENT_NAME.INPUT_INACTIVE, () => {
      element.classList.remove(options.className.grid__focused)
    })

    const onClick = (event: MouseEvent) => {
      const value = getValueFromMouseEvent(event)
      if (value) {
        picker.setSelected({ value })
      }
    }

    addAttributes(element, {
      className: options.className.grid,
      onClick,
      onKeyDown: createOnKeyDownCalendar(picker),
    })

    const render = () => {
      element.innerHTML = ''
      appendChildren(
        element,
        createGridCellElements(options, picker.store.getState())
      )
    }

    render()
    picker.store.subscribe(render)
  }
)

export const createMeridiemButton = createButtonLayout(
  (element, picker, options) => {
    const onMouseDown = (event: Event) => event.preventDefault()
    const onClick = () => picker.cycleMeridiem()

    addAttributes(element, {
      className: options.className.button_meridiem,
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
  }
)

export const createHourInput = createBoxLayout((element, picker, options) => {
  addAttributes(element, { className: options.className.time_hours })

  const cycleUp = () => picker.cycleHourUp()
  const cycleDown = () => picker.cycleHourDown()

  const hourInput = createTimeInputElement(options, {
    className: options.className.time_input__hours,
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
    ...createTimeCounterElements(options, {
      onClickUp: cycleUp,
      onClickDown: cycleDown,
    }),
  ])
})

export const createMinuteInput = createBoxLayout((element, picker, options) => {
  addAttributes(element, {
    className: options.className.time_minutes,
  })

  const cycleUp = () => picker.cycleMinuteUp()
  const cycleDown = () => picker.cycleMinuteDown()

  const minuteInput = createTimeInputElement(options, {
    className: options.className.time_input__minutes,
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
    ...createTimeCounterElements(options, {
      onClickUp: cycleUp,
      onClickDown: cycleDown,
    }),
  ])
})

export const createTimeSeparator = createBoxLayout(
  (element, picker, options) => {
    addAttributes(element, {
      className: options.className.time_separator,
    })
    element.innerHTML = ':'
  }
)

//////////////
// ELEMENTS //
//////////////

const createGridCellElements = (options, state) => {
  const datesInWeeks = calendarUtil.getDatesInWeeks(
    state.view,
    state.firstDayOfWeek
  )

  const elements = datesInWeeks.map(datesInWeek =>
    createDocumentElement({
      className: options.className.grid_row,
      children: datesInWeek.map(dateObject =>
        createGridCellElement(options, state, dateObject)
      ),
    })
  )

  elements.unshift(
    createDocumentElement({
      className: classNameUtil.flatten([
        options.className.grid_row,
        options.className.grid_row__label,
      ]),
      children: calendarUtil
        .getWeekdayLabels(state.templateHookWords.DDD, state.firstDayOfWeek)
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

const createGridCellElement = (options, state, dateObject) => {
  const cellInfo = gridCellSelector.computeInfo(state, dateObject)

  const parent = createDocumentElement({
    className: classNameUtil.flatten([
      options.className.grid_cell,
      {
        [options.className.grid_cell__today]: cellInfo.isToday,
        [options.className.grid_cell__highlighted]: cellInfo.isHighlighted,
        [options.className.grid_cell__selected]: cellInfo.isSelected,
        [options.className.grid_cell__outOfView]: !cellInfo.isSameMonth,
        [options.className.grid_cell__disabled]: cellInfo.isDisabled,
      },
    ]),
    attributes: {
      dataset: cellInfo.isDisabled
        ? undefined
        : { value: dateObject.getTime() },
    },
  })

  const children = createDocumentElement({ children: dateObject.getDate() })
  const content = options.renderCell({ dateObject, children }) || children
  appendChildren(parent, content)

  return parent
}

const createTimeInputElement = (
  options,
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
    className: [options.className.time_input, className],
    attributes: { onKeyDown, onFocus, readOnly: true },
  }): any)
  return inputElement
}

const createTimeCounterElements = (options, { onClickUp, onClickDown }) => {
  const onMouseDown = (event: MouseEvent) => event.preventDefault()
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

//////////////////
// INITIALIZERS //
//////////////////

const initializeInput = (inputElement, picker) => {
  inputElement.readOnly = true
  inputElement.value = picker.getValue()
  inputElement.addEventListener('focus', () => {
    dispatchEvent(inputElement, EVENT_NAME.INPUT_OPEN)
    dispatchEvent(inputElement, EVENT_NAME.INPUT_ACTIVE)
  })
  inputElement.addEventListener('blur', () => {
    dispatchEvent(inputElement, EVENT_NAME.INPUT_INACTIVE)
  })
  inputElement.addEventListener('keydown', createOnKeyDownCalendar(picker))

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
      dispatchEvent(inputElement, EVENT_NAME.INPUT_CLOSE)
    }
  }
  document.addEventListener('focusin', onDocumentEvent)
  document.addEventListener('click', onDocumentEvent)

  inputElement.addEventListener(EVENT_NAME.UNMOUNT, () => {
    document.removeEventListener('focusin', onDocumentEvent)
    document.removeEventListener('click', onDocumentEvent)
  })

  dispatchEvent(inputElement, EVENT_NAME.INPUT_CLOSE)
  picker.subscribeToSelection(({ value }) => {
    if (value === inputElement.value) {
      return
    }
    inputElement.value = value
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
    className: classNameUtil.flatten(['pickadate--element', className]),
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
      // $FlowFixMe
      addClassName(element, attributeValue)
      return
    }

    if (attributeName === 'dataset') {
      // $FlowFixMe
      Object.keys(attributeValue).forEach(datasetName => {
        const fullDatasetName = `data-${jsUtil.caseDash(datasetName)}`
        // $FlowFixMe
        element.setAttribute(fullDatasetName, attributeValue[datasetName])
      })
      return
    }

    // $FlowFixMe
    element.setAttribute(attributeName, attributeValue)
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

export const dispatchEvent = (element: HTMLElement, eventName: EventName) => {
  const customEvent = new CustomEvent(eventName)
  element.dispatchEvent(customEvent)
}
