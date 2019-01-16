// @flow

import type { DatePickerActor, SetTemplatePayload } from 'pickadate/types'

const setTemplateActor: DatePickerActor<SetTemplatePayload> = (
  state,
  payload
) => {
  if (payload.value && typeof payload.value === 'string') {
    return {
      template: payload.value,
    }
  }
}

export default setTemplateActor
