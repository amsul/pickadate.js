// @flow

import type { Store, DatePickerState } from '../types'
import * as jsUtil from '../utils/jsUtil'
import createDateStore from '../createDateStore'

export default {
  createDateStore,
  renderDatePicker,
}

type Options = {
  className: {
    root: string,
  },
}

const defaultOptions = {
  className: {
    root: 'pickadate--root',
  },
}

function renderDatePicker(
  dateStore: Store<DatePickerState>,
  element: HTMLElement,
  options?: $Shape<Options> = defaultOptions
) {
  const container = createRootContainer()
  if (options !== defaultOptions) {
    options = jsUtil.mergeObjects(defaultOptions, options)
  }
  const pickerElement = container(dateStore, options)
  element.appendChild(pickerElement)
}

////////////////
// CONTAINERS //
////////////////

const createContainer = initialize => (...childContainers) => (
  dateStore,
  options
) => {
  const element = document.createElement('div')
  initialize(element, dateStore, options)

  const children = childContainers.map(container =>
    container(dateStore, options)
  )
  appendChildren(element, children)

  return element
}

const createRootContainer = createContainer((element, dateStore, options) => {
  const onClick = () => alert('hi!!')
  addAttributes(element, { className: options.className.root, onClick })
})

/////////////
// HELPERS //
/////////////

const appendChildren = (element, children) => {
  if (!children) {
    return
  }

  children = Array.isArray(children) ? children : [children]
  children.forEach(child => {
    if (!(child instanceof Node)) {
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
