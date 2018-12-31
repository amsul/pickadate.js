// @flow

import type { DatePickerStore } from '../types'
import * as jsUtil from '../utils/jsUtil'
import * as calendarUtil from '../utils/calendarUtil'
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
})

//////////////
// ELEMENTS //
//////////////

const createGridCellElements = (options, dateState) => {
  const datesInWeeks = calendarUtil.getDatesInWeeks(dateState.view)

  const elements = datesInWeeks.map(datesInWeek =>
    createDocumentElement({
      className: options.className.grid_row,
      children: datesInWeek.map(dateObject =>
        createGridCellElement(options, dateObject)
      ),
    })
  )

  elements.unshift(
    createDocumentElement({
      className: [
        options.className.grid_row,
        options.className.grid_row__label,
      ].join(' '),
      children: options.weekdays.map(weekday =>
        createDocumentElement({
          className: options.className.grid_label,
          children: weekday,
        })
      ),
    })
  )

  return elements
}

const createGridCellElement = (options, dateObject) => {
  const element = createDocumentElement({
    className: options.className.grid_cell,
    attributes: {
      dataset: { value: dateObject.getTime() },
    },
    children: dateObject.getDate(),
  })
  return element
}

/////////////
// HELPERS //
/////////////

type CreateDocumentElementArguments = {
  tagName?: string,
  className?: string,
  attributes?: Object,
  children?: any,
}

const createDocumentElement = ({
  tagName = 'div',
  className = '',
  attributes,
  children,
}: CreateDocumentElementArguments) => {
  const element = document.createElement(tagName)
  className = `pickadate--element ${className}`
  addAttributes(element, { ...attributes, className })
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

    if (typeof attributeValue === 'function') {
      element.addEventListener(
        attributeName.replace(/^on/, '').toLowerCase(),
        attributeValue
      )
      return
    }

    if (attributeName === 'className') {
      element.className += `${attributeValue}`
      return
    }

    if (attributeName === 'dataset' && typeof attributeValue === 'object') {
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

export default {
  createDateStore,
  renderDatePicker,
}

type Options = {
  className: {
    root: string,
    header: string,
    body: string,
    footer: string,

    grid: string,
    grid_row: string,
    grid_row__label: string,
    grid_cell: string,
    grid_label: string,

    button_previous: string,
    button_today: string,
    button_next: string,
    button_clear: string,
  },
  weekdays: [string, string, string, string, string, string, string],
}

const defaultOptions = {
  className: {
    root: 'pickadate--root',
    header: 'pickadate--header',
    body: 'pickadate--body',
    footer: 'pickadate--footer',

    grid: 'pickadate--grid',
    grid_row: 'pickadate--grid_row',
    grid_row__label: 'pickadate--grid_row__label',
    grid_cell: 'pickadate--grid_cell',
    grid_label: 'pickadate--grid_label',

    button_previous: 'pickadate--button pickadate--button_previous',
    button_today: 'pickadate--button pickadate--button_today',
    button_next: 'pickadate--button pickadate--button_next',
    button_clear: 'pickadate--button pickadate--button_clear',
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
  createFooterBox(createClearButton())
)

function renderDatePicker(
  dateStore: DatePickerStore,
  element: HTMLElement,
  options?: $Shape<Options> = defaultOptions
) {
  if (options !== defaultOptions) {
    options = jsUtil.mergeObjects(defaultOptions, options)
  }
  const pickerElement = container(dateStore, options)
  element.appendChild(pickerElement)
}
