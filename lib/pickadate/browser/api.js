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

const unrender = element => {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element)
  }
}

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

  const subscribeToValue = listener =>
    dateStore.subscribe(() => {
      const formattedValue = getValue()
      listener(formattedValue)
    })

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
    unrender(element) {
      if (!(element instanceof HTMLInputElement)) {
        unrender(element)
        return
      }

      const rootElement = element.nextElementSibling
      unrender(rootElement)
    },
  }
  return picker
}

export default {
  create,
}
