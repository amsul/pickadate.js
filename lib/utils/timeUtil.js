// @flow

export const getFromDate = (dateObject: Date) => ({
  hours: dateObject.getHours(),
  minutes: dateObject.getMinutes(),
})
