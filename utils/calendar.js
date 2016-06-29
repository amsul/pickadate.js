const SCOPE  = require('constants/scope')

let dateUtil = require('utils/date')
let jsUtil   = require('utils/js')



/////////////////////////////
// HEADER CELL COLLECTIONS //
/////////////////////////////



function getCollectionOfHeaderRowCells(state) {

  let { scope, view } = state

  if (scope !== SCOPE.DAYS) {
    return [getRangeLabel(view, scope)]
  }

  return jsUtil.createRange(0, 6).map(dayIndex => (
    dateUtil.getShortDayName(dayIndex)
  ))

}





//////////////////////
// DATE COLLECTIONS //
//////////////////////



function getCollectionOfRowsCellsDates(state) {

  let { scope, view } = state

  let year  = view.getFullYear()
  let month = view.getMonth()

  if (scope === SCOPE.YEARS) {
    return getCollectionOfDecadeQuartersYears(year, month)
  }

  if (scope === SCOPE.MONTHS) {
    return getCollectionOfYearQuartersMonths(year)
  }

  return getCollectionOfMonthWeeksDates(year, month)

}



function getCollectionOfDecadeQuartersYears(year, month) {

  year -= year % 10

  return jsUtil.createRange(0, 1).map(row => (
    jsUtil.createRange(0, 4).map(column => (
      new Date(year + column + (row * 5), month, 1)
    ))
  ))

}



function getCollectionOfYearQuartersMonths(year) {
  return jsUtil.createRange(0, 2).map(row => (
    jsUtil.createRange(0, 3).map(column => (
      new Date(year, column + (row * 4), 1)
    ))
  ))
}



/**
 * Gets a list of the dates of a month in lists of weeks.
 * @param  {Number} year
 * @param  {Number} month
 * @return {Array[]}
 */
function getCollectionOfMonthWeeksDates(year, month) {
  return jsUtil.createRange(0, 5).map(
    weekIndex => getCollectionOfWeekDates(year, month, weekIndex)
  )
}



/**
 * Gets a list of the dates of a week.
 * @param  {Number} year
 * @param  {Number} month
 * @param  {Number} weekIndex
 * @return {Date[]}
 */
function getCollectionOfWeekDates(year, month, weekIndex) {

  let startDateOfMonth = new Date(year, month, 1)
  let startDayOfMonth  = startDateOfMonth.getDay()

  return jsUtil.createRange(1, 7).map(dayNumber => {
    let day = (weekIndex * 7) + dayNumber - startDayOfMonth
    return new Date(year, month, day)
  })

}





///////////////////////////////////////
// PREVIOUS & NEXT SCOPE START DATES //
///////////////////////////////////////



function getStartDateOfScope(dateObject, scope) {

  let dateGetter = (
    scope === SCOPE.YEARS ? getStartDateOfDecade :
    scope === SCOPE.MONTHS ? getStartDateOfYear :
    getStartDateOfMonth
  )

  return dateGetter(dateObject)

}



function getStartDateOfPreviousScope(dateObject, scope) {

  let dateGetter = (
    scope === SCOPE.YEARS ? getStartDateOfPreviousDecade :
    scope === SCOPE.MONTHS ? getStartDateOfPreviousYear :
    getStartDateOfPreviousMonth
  )

  return dateGetter(dateObject)

}



function getStartDateOfNextScope(dateObject, scope) {

  let dateGetter = (
    scope === SCOPE.YEARS ? getStartDateOfNextDecade :
    scope === SCOPE.MONTHS ? getStartDateOfNextYear :
    getStartDateOfNextMonth
  )

  return dateGetter(dateObject)

}





////////////////////////
// DECADE START DATES //
////////////////////////



function getStartDateOfDecade(dateObject) {
  return getStartDateRelativeToDecade(dateObject, 0)
}



function getStartDateOfPreviousDecade(dateObject) {
  return getStartDateRelativeToDecade(dateObject, -1)
}



function getStartDateOfNextDecade(dateObject) {
  return getStartDateRelativeToDecade(dateObject, 1)
}



function getStartDateRelativeToDecade(dateObject, change) {
  dateObject = dateUtil.create(dateObject)
  let year   = dateObject.getFullYear()
  let month  = dateObject.getMonth()
  return new Date(year + (change * 10), month, 1)
}





//////////////////////
// YEAR START DATES //
//////////////////////



function getStartDateOfYear(dateObject) {
  return getStartDateRelativeToYear(dateObject, 0)
}



function getStartDateOfPreviousYear(dateObject) {
  return getStartDateRelativeToYear(dateObject, -1)
}



function getStartDateOfNextYear(dateObject) {
  return getStartDateRelativeToYear(dateObject, 1)
}



function getStartDateRelativeToYear(dateObject, change) {
  dateObject = dateUtil.create(dateObject)
  let year   = dateObject.getFullYear()
  let month  = dateObject.getMonth()
  return new Date(year + change, month, 1)
}





///////////////////////
// MONTH START DATES //
///////////////////////



function getStartDateOfMonth(dateObject) {
  return getStartDateRelativeToMonth(dateObject, 0)
}



function getStartDateOfNextMonth(dateObject) {
  return getStartDateRelativeToMonth(dateObject, 1)
}



function getStartDateOfPreviousMonth(dateObject) {
  return getStartDateRelativeToMonth(dateObject, -1)
}



function getStartDateRelativeToMonth(dateObject, change) {
  dateObject = dateUtil.create(dateObject)
  let year   = dateObject.getFullYear()
  let month  = dateObject.getMonth()
  return new Date(year, month + change, 1)
}





////////////
// LABELS //
////////////



function getLabel(dateObject, scope) {

  if (scope === SCOPE.YEARS) {
    return dateObject.getFullYear()
  }

  if (scope === SCOPE.MONTHS) {
    return dateUtil.getShortMonthName(dateObject.getMonth())
  }

  return dateObject.getDate()

}



function getRangeLabel(dateObject, scope) {

  let year  = dateObject.getFullYear()
  let month = dateObject.getMonth()

  if (scope === SCOPE.YEARS) {
    let decadeStartYear = year - year % 10
    let decadeEndYear   = decadeStartYear + 9
    return `${decadeStartYear} - ${decadeEndYear}`
  }

  if (scope === SCOPE.MONTHS) {
    return year
  }

  return `${dateUtil.getFullMonthName(month)} ${year}`

}





/////////////
// EXPORTS //
/////////////



module.exports = {

  // Date collections
  getCollectionOfHeaderRowCells,
  getCollectionOfMonthWeeksDates,
  getCollectionOfRowsCellsDates,
  getCollectionOfWeekDates,
  getCollectionOfYearQuartersMonths,

  // Previous & next scope start dates
  getStartDateOfNextScope,
  getStartDateOfPreviousScope,
  getStartDateOfScope,

  // Decade start dates
  getStartDateOfDecade,

  // Year start dates
  getStartDateOfYear,

  // Month start dates
  getStartDateOfMonth,
  getStartDateOfNextMonth,
  getStartDateOfPreviousMonth,

  // Labels
  getLabel,
  getRangeLabel,

}