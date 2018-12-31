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
    const onClick = () => alert('select previous')
    addAttributes(element, {
      className: options.className.button_previous,
      onClick,
    })
    appendChildren(element, 'Previous')
  }
)

const createTodayButton = createButtonLayout((element, dateStore, options) => {
  const onClick = () => alert('select today')
  addAttributes(element, {
    className: options.className.button_today,
    onClick,
  })
  appendChildren(element, 'Today')
})

const createNextButton = createButtonLayout((element, dateStore, options) => {
  const onClick = () => alert('select next')
  addAttributes(element, {
    className: options.className.button_next,
    onClick,
  })
  appendChildren(element, 'Next')
})

const createGridButton = createButtonLayout((element, dateStore, options) => {
  const onClick = () => {
    // const value = getValueFromMouseEvent(event)
    const value = new Date(2019, Math.round(Math.random() * 11), 1)
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
  const datesInWeeks = calendarUtil.getDatesInWeeks(new Date())

  const elements = datesInWeeks.map(datesInWeek =>
    createDocumentElement({
      className: options.className.grid_row,
      children: datesInWeek.map(dateObject =>
        createGridCellElement(options, dateObject)
      ),
    })
  )

  return elements
}

const createGridCellElement = (options, dateObject) => {
  const element = createDocumentElement({
    className: options.className.grid_cell,
    children: dateObject.getDate(),
  })
  return element
}

/////////////
// HELPERS //
/////////////

type CreateDocumentElementArguments = {
  className?: string,
  children?: any,
  tagName?: string,
}

const createDocumentElement = ({
  className = '',
  children,
  tagName = 'div',
}: CreateDocumentElementArguments) => {
  const element = document.createElement(tagName)
  className = `pickadate--element ${className}`
  addAttributes(element, { className })
  appendChildren(element, children)
  return element
}

const appendChildren = (element, children) => {
  if (!children) {
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

    if (attributeName !== 'dataset' || typeof attributeValue !== 'object') {
      // $FlowFixMe
      element[attributeName] = attributeValue
      return
    }

    Object.keys(attributeValue).forEach(datasetName => {
      const fullDatasetName = `data-${jsUtil.caseDash(datasetName)}`
      element.setAttribute(fullDatasetName, attributeValue[datasetName])
    })
  })
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
    grid_cell: string,

    button_previous: string,
    button_today: string,
    button_next: string,
  },
}

const defaultOptions = {
  className: {
    root: 'pickadate--root',
    header: 'pickadate--header',
    body: 'pickadate--body',
    footer: 'pickadate--footer',

    grid: 'pickadate--grid',
    grid_row: 'pickadate--grid_row',
    grid_cell: 'pickadate--grid_cell',

    button_previous: 'pickadate--button pickadate--button_previous',
    button_today: 'pickadate--button pickadate--button_today',
    button_next: 'pickadate--button pickadate--button_next',
  },
}

const container = createRootBox(
  createHeaderBox(
    createPreviousButton(),
    createTodayButton(),
    createNextButton()
  ),
  createBodyBox(createGridButton()),
  createFooterBox()
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
