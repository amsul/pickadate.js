let LANGUAGE = require('constants/language')



//////////
// FULL //
//////////



const FULL = {


  /////////////
  // ENGLISH //
  /////////////



  [LANGUAGE.ENGLISH]: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],



  ////////////
  // FRENCH //
  ////////////



  [LANGUAGE.FRENCH]: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
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
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],



  ////////////
  // FRENCH //
  ////////////



  [LANGUAGE.FRENCH]: [
    'Jan',
    'Fev',
    'Mar',
    'Avr',
    'Mai',
    'Juin',
    'Juil',
    'Aou',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],


}





/////////////
// EXPORTS //
/////////////



module.exports = {
  FULL,
  SHORT,
}