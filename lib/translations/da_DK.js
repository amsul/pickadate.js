// Danish

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {

Picker.defineDateLocale('da_DK', {
    monthsFull: [ 'januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december' ],
    monthsShort: [ 'jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec' ],
    weekdaysFull: [ 'søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag' ],
    weekdaysShort: [ 'søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør' ],
    today: 'i dag',
    clear: 'slet',
    close: 'luk',
    firstDay: 1,
    format: 'd. mmmm yyyy',
    formatSubmit: 'yyyy/mm/dd'
});

Picker.defineTimeLocale('da_DK', {
    clear: 'slet'
});
}));