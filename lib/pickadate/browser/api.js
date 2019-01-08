// @flow

import type {
  DatePickerApi,
  RenderOptions,
} from 'pickadate/pickadate/browser/types'
import type { DatePickerState } from 'pickadate/types'
import type { EventName } from 'pickadate/pickadate/browser/event'
import * as jsUtil from 'pickadate/utils/jsUtil'
import * as dateUtil from 'pickadate/utils/dateUtil'
import * as renderer from 'pickadate/pickadate/browser/renderer'
import { RENDER_OPTIONS } from 'pickadate/pickadate/browser/defaults'
import { EVENT_NAME } from 'pickadate/pickadate/browser/event'
import createDateStore from 'pickadate/createDateStore'

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
  const dateStore = createDateStore(initialState)

  const getValue = () => {
    const { selected, template, templateHookWords } = dateStore.getState()
    return selected
      ? dateUtil.format(selected, template, templateHookWords)
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
    getValue,
    subscribeToValue,
    addEventListener,
    triggerEvent,
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
  return picker
}

export default {
  create,
}
