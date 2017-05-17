///////////
// COUNT //
///////////



const DAYS_IN_WEEK    = 7
const MONTHS_IN_YEAR  = 12
const YEARS_IN_DECADE = 10





//////////
// GRID //
//////////


const ROW = {
  DATES  : 6,
  MONTHS : 3,
  YEARS  : 2,
}



const COLUMN = {
  DATES  : DAYS_IN_WEEK,
  MONTHS : MONTHS_IN_YEAR / ROW.MONTHS,
  YEARS  : YEARS_IN_DECADE / ROW.YEARS,
}





////////////////
// GRID INDEX //
////////////////



const ROW_INDEX = {
  DATE  : { START: 0, END: ROW.DATES - 1 },
  MONTH : { START: 0, END: ROW.MONTHS - 1 },
  YEAR  : { START: 0, END: ROW.YEARS - 1 },
}



const COLUMN_INDEX = {
  DAY   : { START: 0, END: COLUMN.DATES - 1 },
  DATE  : { START: 1, END: COLUMN.DATES },
  MONTH : { START: 0, END: COLUMN.MONTHS - 1 },
  YEAR  : { START: 0, END: COLUMN.YEARS - 1 },
}





/////////////
// EXPORTS //
/////////////



module.exports = {

  // Count
  DAYS_IN_WEEK,
  MONTHS_IN_YEAR,
  YEARS_IN_DECADE,

  // Grid
  COLUMN,
  ROW,

  // Grid index
  ROW_INDEX,
  COLUMN_INDEX,

}
