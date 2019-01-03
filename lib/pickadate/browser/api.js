// @flow

import type { CreateConfig, DatePickerApi } from './types'
import type { DatePickerState } from '../../types'
import * as jsUtil from '../../utils/jsUtil'
import * as dateUtil from '../../utils/dateUtil'
import * as renderer from './renderer'
import { CREATE_CONFIG } from './defaults'
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

const renderFormattedDate = (state, config) => {
  const { selected } = state
  if (!selected) {
    return
  }
  return dateUtil.format(selected, config.template, config.templateHookWords)
}

type CreateOptions = $Shape<{
  config: $Shape<CreateConfig>,
  initialState: $Shape<DatePickerState>,
}>

const create = ({
  config,
  initialState,
}: CreateOptions = {}): DatePickerApi => {
  const dateStore = createDateStore(initialState)
  config = config ? jsUtil.mergeUpdates(CREATE_CONFIG, config) : CREATE_CONFIG
  return {
    store: dateStore,
    render(element) {
      const pickerElement = container(dateStore, config)
      element.appendChild(pickerElement)
    },
    renderValue(element, renderFallback) {
      const render = () => {
        element.innerHTML = ''
        const formattedDate = renderFormattedDate(dateStore.getState(), config)
        if (formattedDate) {
          renderer.appendChildren(element, formattedDate)
        } else {
          renderFallback()
        }
      }

      render()
      dateStore.subscribe(render)
    },
  }
}

export default {
  create,
}
