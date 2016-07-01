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
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
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
    'Dim',
    'Lun',
    'Mar',
    'Mer',
    'Jeu',
    'Ven',
    'Sam',
  ],


}





/////////////
// EXPORTS //
/////////////



module.exports = {
  FULL,
  SHORT,
}