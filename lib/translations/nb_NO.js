// Norwegian

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {
Picker.defineDateLocale('nb_NO', {
    monthsFull: [ 'januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember' ],
    monthsShort: [ 'jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des' ],
    weekdaysFull: [ 'søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag' ],
    weekdaysShort: [ 'søn','man','tir', 'ons', 'tor', 'fre', 'lør' ],
    today: 'i dag',
    clear: 'nullstill',
    close: 'lukk',
    firstDay: 1,
    format: 'dd. mmm. yyyy',
    formatSubmit: 'yyyy/mm/dd'
});
Picker.defineTimeLocale('nb_NO', {
    clear: 'nullstill'
});
}));