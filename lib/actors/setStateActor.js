// @flow

import type { DatePickerActor, SetStatePayload } from 'pickadate/types'

import setFirstDayOfWeekActor from 'pickadate/actors/setFirstDayOfWeekActor'
import setSelectedActor from 'pickadate/actors/setSelectedActor'
import setViewActor from 'pickadate/actors/setViewActor'
import setMinimumActor from 'pickadate/actors/setMinimumActor'
import setMaximumActor from 'pickadate/actors/setMaximumActor'
import setDisabledActor from 'pickadate/actors/setDisabledActor'
import setTemplateActor from 'pickadate/actors/setTemplateActor'
import setTemplateHookWordsActor from 'pickadate/actors/setTemplateHookWordsActor'

const setStateActor: DatePickerActor<SetStatePayload> = (state, payload) => {
  if (payload.firstDayOfWeek) {
    state = {
      ...state,
      ...setFirstDayOfWeekActor(state, { value: payload.firstDayOfWeek }),
    }
  }

  if (payload.selected) {
    state = {
      ...state,
      ...setSelectedActor(state, { value: payload.selected }),
    }
  }

  if (payload.view) {
    state = {
      ...state,
      ...setViewActor(state, { value: payload.view }),
    }
  }

  if (payload.minimum) {
    state = {
      ...state,
      ...setMinimumActor(state, { value: payload.minimum }),
    }
  }

  if (payload.maximum) {
    state = {
      ...state,
      ...setMaximumActor(state, { value: payload.maximum }),
    }
  }

  if (payload.disabled) {
    state = {
      ...state,
      ...setDisabledActor(state, { value: payload.disabled }),
    }
  }

  if (payload.template) {
    state = {
      ...state,
      ...setTemplateActor(state, { value: payload.template }),
    }
  }

  if (payload.templateHookWords) {
    state = {
      ...state,
      ...setTemplateHookWordsActor(state, payload.templateHookWords),
    }
  }

  return state
}

export default setStateActor
