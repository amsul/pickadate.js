// @flow

import createCycleMinuteActor from 'pickadate/actors/createCycleMinuteActor'

const cycleMinuteUpActor = createCycleMinuteActor((minutes, interval) =>
  minutes + interval >= 60 ? 0 : minutes + interval
)

export default cycleMinuteUpActor
