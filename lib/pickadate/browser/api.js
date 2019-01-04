// @flow

import type {
  DatePickerOptions,
  DatePickerConfig,
  DatePickerApi,
} from './types'
import * as jsUtil from '../../utils/jsUtil'
import * as dateUtil from '../../utils/dateUtil'
import * as renderer from './renderer'
import { DATE_PICKER_CONFIG } from './defaults'
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

const create = ({
  config,
  initialState,
}: DatePickerOptions = {}): DatePickerApi => {
  const dateStore = createDateStore(initialState)

  config = config
    ? ((jsUtil.mergeUpdates(DATE_PICKER_CONFIG, config): any): DatePickerConfig)
    : DATE_PICKER_CONFIG

  const getValue = () => {
    const { selected } = dateStore.getState()
    return selected
      ? dateUtil.format(selected, config.template, config.templateHookWords)
      : ''
  }

  return {
    store: dateStore,
    getValue,
    getConfig: () => config,
    render(element) {
      const pickerElement = container(dateStore, config)
      element.appendChild(pickerElement)
    },
    subscribeToValue(callback) {
      const onUpdate = () => {
        const formattedValue = getValue()
        callback(formattedValue)
      }
      onUpdate()
      dateStore.subscribe(onUpdate)
    },
  }
}

export default {
  create,
}
