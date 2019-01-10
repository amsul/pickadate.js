// @flow

import type { DatePickerApi, RenderOptions } from 'pickadate/apis/dom/types'
import type { DatePickerState } from 'pickadate/types'
import * as jsUtil from 'pickadate/utils/jsUtil'
import * as renderer from 'pickadate/renderers/dom'
import { RENDER_OPTIONS } from 'pickadate/apis/dom/defaults'
import pickadate from 'pickadate/core'

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

const unrender = element => {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element)
  }
}

type DatePickerOptions = $Shape<{
  initialState: $Shape<DatePickerState>,
}>

const create = ({ initialState }: DatePickerOptions = {}): DatePickerApi => {
  const picker = pickadate.create(initialState)
  return {
    ...picker,
    render(element, options) {
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
    },
    unrender(element) {
      if (!(element instanceof HTMLInputElement)) {
        unrender(element)
        return
      }

      const rootElement = element.nextElementSibling
      unrender(rootElement)
    },
  }
}

export default {
  create,
}
