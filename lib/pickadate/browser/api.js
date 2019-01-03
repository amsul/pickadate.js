// @flow

import type { CreateOptions } from './types'
import * as jsUtil from '../../utils/jsUtil'
import * as dateUtil from '../../utils/dateUtil'
import * as renderer from './renderer'
import { CREATE_OPTIONS } from './defaults'
import createDateStore from '../../createDateStore'

const container = renderer.createRootBox(
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

const renderFormattedDate = (state, options) => {
  const { selected } = state
  if (!selected) {
    return
  }
  return dateUtil.format(selected, options.template, options.templateHookWords)
}

const create = (options?: $Shape<CreateOptions> = CREATE_OPTIONS) => {
  if (options !== CREATE_OPTIONS) {
    options = jsUtil.mergeObjects(CREATE_OPTIONS, options)
  }

  const dateStore = createDateStore()
  return {
    store: dateStore,
    render(element: HTMLElement) {
      const pickerElement = container(dateStore, options)
      element.appendChild(pickerElement)
    },
    renderValue(element: HTMLElement, renderFallback: Function) {
      const render = () => {
        element.innerHTML = ''
        const formattedDate = renderFormattedDate(dateStore.getState(), options)
        renderer.appendChildren(element, formattedDate || renderFallback())
      }

      render()
      dateStore.subscribe(render)
    },
  }
}

export default {
  create,
}
