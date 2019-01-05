// @flow

import createCycleHourActor from './createCycleHourActor'

const cycleHourDownActor = createCycleHourActor(hoursInMeridiem =>
  hoursInMeridiem === 0 ? 11 : hoursInMeridiem - 1
)

export default cycleHourDownActor
