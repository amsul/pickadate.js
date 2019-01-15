// @flow

import type { DatePickerCoreApi } from 'pickadate/types'
import type { RenderOptions } from 'pickadate/apis/dom/types'
import * as jsUtil from 'pickadate/utils/jsUtil'
import * as renderer from 'pickadate/renderers/dom'
import { EVENT_NAME } from 'pickadate/renderers/dom/constants'
import { RENDER_OPTIONS } from 'pickadate/apis/dom/defaults'
import createPicker from 'pickadate/createPicker'

const renderInputRootLayout = renderer.createInputRootBox()
const renderRootLayout = renderer.createRootBox()
const renderHeaderLayout = renderer.createHeaderBox(
  renderer.createMonthAndYearBox(),
  renderer.createPreviousButton(),
  renderer.createTodayButton(),
  renderer.createNextButton()
)
const renderBodyLayout = renderer.createBodyBox(renderer.createGridButton())
const renderFooterLayout = renderer.createFooterBox(
  renderer.createTimeBox(
    renderer.createHourInput(),
    renderer.createTimeSeparator(),
    renderer.createMinuteInput(),
    renderer.createMeridiemButton()
  )
  // renderer.createClearButton()
)

const renderContainerLayout = (picker, options, element) => {
  const rootElement = renderRootLayout(picker, options, element)
  const headerElement = renderHeaderLayout(picker, options, element)
  const bodyElement = renderBodyLayout(picker, options, element)
  renderer.appendChildren(rootElement, [headerElement, bodyElement])

  if (options.mode === 'date-time') {
    const footerElement = renderFooterLayout(picker, options, element)
    renderer.appendChildren(rootElement, footerElement)
  }

  return rootElement
}

const pickadateSymbol = Symbol('pickadate')

type Render = (
  element: HTMLElement,
  picker: DatePickerCoreApi,
  options: ?$Shape<RenderOptions>
) => void

const render: Render = (element, picker, options) => {
  // $FlowFixMe
  const existingPicker = element[pickadateSymbol]
  if (existingPicker) {
    throw new Error('A picker is already rendered to this element')
  }

  options = options
    ? jsUtil.mergeUpdates<RenderOptions>(RENDER_OPTIONS, options)
    : RENDER_OPTIONS

  const containerElement = renderContainerLayout(picker, options, element)

  if (element instanceof HTMLInputElement) {
    const rootElement = renderInputRootLayout(picker, options, element)
    rootElement.appendChild(containerElement)
    element.insertAdjacentElement('afterend', rootElement)
  } else {
    element.appendChild(containerElement)
  }

  Object.defineProperty(element, pickadateSymbol, { value: picker })
  renderer.dispatchEvent(element, EVENT_NAME.MOUNT)
}

//////////////
// UNRENDER //
//////////////

const removeFromDom = element => {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element)
  }
}

type Unrender = (element: HTMLElement) => void

const unrender: Unrender = element => {
  // $FlowFixMe
  const elementProp = element[pickadateSymbol]
  const picker: ?DatePickerCoreApi = (elementProp: any)
  if (!picker) {
    return
  }

  if (element instanceof HTMLInputElement) {
    const rootElement = element.nextElementSibling
    removeFromDom(rootElement)
  } else {
    removeFromDom(element)
  }

  // $FlowFixMe
  delete element[pickadateSymbol]
  renderer.dispatchEvent(element, EVENT_NAME.UNMOUNT)
}

export default {
  create: createPicker,
  render,
  unrender,
}
