let LANGUAGE = require('constants/language')



//////////
// FULL //
//////////



const FULL = {


  /////////////
  // ENGLISH //
  /////////////



  [LANGUAGE.ENGLISH]: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],



  ////////////
  // FRENCH //
  ////////////



  [LANGUAGE.FRENCH]: [
    'TODO'
  ],

}





///////////
// SHORT //
///////////



const SHORT = {


  /////////////
  // ENGLISH //
  /////////////


  [LANGUAGE.ENGLISH]: [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ],



  ////////////
  // FRENCH //
  ////////////



  [LANGUAGE.FRENCH]: [
    'TODO',
  ],


}





/////////////
// EXPORTS //
/////////////



module.exports = {
  FULL,
  SHORT,
}