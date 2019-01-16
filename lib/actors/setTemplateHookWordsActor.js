// @flow

import type {
  DatePickerActor,
  SetTemplateHookWordsPayload,
} from 'pickadate/types'

const setTemplateHookWordsActor: DatePickerActor<SetTemplateHookWordsPayload> = (
  state,
  payload
) => {
  const MMM = getValidMonths(payload.MMM, state.templateHookWords.MMM)
  const MMMM = getValidMonths(payload.MMMM, state.templateHookWords.MMMM)
  const DDD = getValidDays(payload.DDD, state.templateHookWords.DDD)
  const DDDD = getValidDays(payload.DDDD, state.templateHookWords.DDDD)
  return {
    templateHookWords: {
      MMM,
      MMMM,
      DDD,
      DDDD,
    },
  }
}

const getValidMonths = (payloadMonths, stateMonths) => {
  if (
    Array.isArray(payloadMonths) &&
    payloadMonths.length === 12 &&
    payloadMonths.every(month => typeof month === 'string')
  ) {
    return payloadMonths
  }
  return stateMonths
}

const getValidDays = (payloadDays, stateDays) => {
  if (
    Array.isArray(payloadDays) &&
    payloadDays.length === 7 &&
    payloadDays.every(day => typeof day === 'string')
  ) {
    return payloadDays
  }
  return stateDays
}

export default setTemplateHookWordsActor
