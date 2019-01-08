// @flow

import createCycleMinuteActor from 'pickadate/actors/createCycleMinuteActor'

const cycleMinuteDownActor = createCycleMinuteActor((minutes, interval) =>
  minutes - interval < 0 ? 60 - interval : minutes - interval
)

export default cycleMinuteDownActor
