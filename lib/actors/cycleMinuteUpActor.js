// @flow

import createCycleMinuteActor from './createCycleMinuteActor'

const cycleMinuteUpActor = createCycleMinuteActor((minutes, interval) =>
  minutes + interval >= 60 ? 0 : minutes + interval
)

export default cycleMinuteUpActor
