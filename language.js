const LANGUAGE = require('constants/language')



let currentLanguage = LANGUAGE.ENGLISH



module.exports = {
  get current() {
    return currentLanguage
  },
  set current(language) {
    currentLanguage = language
  },
}