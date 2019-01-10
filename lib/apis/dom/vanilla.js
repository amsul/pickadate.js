// @flow

import type { DatePickerCoreApi } from 'pickadate/types'
import type { RenderOptions } from 'pickadate/apis/dom/types'
import * as jsUtil from 'pickadate/utils/jsUtil'
import * as renderer from 'pickadate/renderers/dom'
import { RENDER_OPTIONS } from 'pickadate/apis/dom/defaults'
import createPicker from 'pickadate/createPicker'

const renderInputRootLayout = renderer.createInputRootBox()

const renderLayout = renderer.createRootBox(
  renderer.createHeaderBox(
    renderer.createMonthAndYearBox(),
    renderer.createPreviousButton(),
    renderer.createTodayButton(),
    renderer.createNextButton()
  ),
  renderer.createBodyBox(renderer.createGridButton()),
  renderer.createFooterBox(
    renderer.createTimeBox(
      renderer.createHourInput(),
      renderer.createTimeSeparator(),
      renderer.createMinuteInput(),
      renderer.createMeridiemButton()
    )
    // renderer.createClearButton()
  )
)

type Render = (
  element: HTMLElement,
  picker: DatePickerCoreApi,
  options: ?$Shape<RenderOptions>
) => void

const render: Render = (element, picker, options) => {
  options = options
    ? ((jsUtil.mergeUpdates(RENDER_OPTIONS, options): any): RenderOptions)
    : RENDER_OPTIONS

  const containerElement = renderLayout(picker, options)

  if (!(element instanceof HTMLInputElement)) {
    element.appendChild(containerElement)
    return
  }

  const rootElement = renderInputRootLayout(picker, options, element)
  rootElement.appendChild(containerElement)
  element.insertAdjacentElement('afterend', rootElement)
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
  if (!(element instanceof HTMLInputElement)) {
    removeFromDom(element)
    return
  }

  const rootElement = element.nextElementSibling
  removeFromDom(rootElement)
}

export default {
  create: createPicker,
  render,
  unrender,
}
