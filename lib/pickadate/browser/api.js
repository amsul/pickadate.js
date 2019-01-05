// @flow

import type {
  DatePickerOptions,
  DatePickerConfig,
  DatePickerApi,
} from './types'
import type { EventName } from './event'
import * as jsUtil from '../../utils/jsUtil'
import * as dateUtil from '../../utils/dateUtil'
import * as renderer from './renderer'
import { DATE_PICKER_CONFIG } from './defaults'
import { EVENT_NAME } from './event'
import createDateStore from '../../createDateStore'

const renderInputRootContainer = renderer.createInputRootBox()

const renderContainer = renderer.createRootBox(
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

  const subscribeToValue = callback => {
    const onUpdate = () => {
      const formattedValue = getValue()
      callback(formattedValue)
    }
    onUpdate()
    dateStore.subscribe(onUpdate)
  }

  const listenersMap = {}
  const addEventListener = (eventName, listener) => {
    listenersMap[eventName] = listenersMap[eventName] || []
    listenersMap[eventName].push(listener)
    return () => {
      const listeners = listenersMap[eventName] || []
      const indexOfListener = listeners.indexOf(listener)
      if (indexOfListener > -1) {
        listeners.splice(indexOfListener, 1)
      }
    }
  }
  const triggerEvent = (eventName: EventName) => {
    const listeners = listenersMap[eventName] || []
    listeners.forEach(listener => listener())
  }

  dateStore.subscribe(() => triggerEvent(EVENT_NAME.CHANGE))

  const picker = {
    store: dateStore,
    getConfig: () => config,
    getValue,
    subscribeToValue,
    addEventListener,
    triggerEvent,
    render(element) {
      const containerElement = renderContainer(picker)

      if (!(element instanceof HTMLInputElement)) {
        element.appendChild(containerElement)
        return
      }

      const rootElement = renderInputRootContainer(picker, element)
      rootElement.appendChild(containerElement)
      element.insertAdjacentElement('afterend', rootElement)
    },
  }
  return picker
}

export default {
  create,
}
