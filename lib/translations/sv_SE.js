// Swedish

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)

}(this, function (Picker) {
Picker.defineDateLocale('sv_SE', {
    monthsFull: [ 'januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december' ],
    monthsShort: [ 'jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec' ],
    weekdaysFull: [ 'söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag' ],
    weekdaysShort: [ 'sön', 'mån', 'tis', 'ons', 'tor', 'fre', 'lör' ],
    today: 'Idag',
    clear: 'Rensa',
    close: 'Stäng',
    firstDay: 1,
    format: 'yyyy-mm-dd',
    formatSubmit: 'yyyy/mm/dd',
    labelMonthNext: 'Nästa månad',
    labelMonthPrev: 'Föregående månad',
    labelMonthSelect: 'Välj månad',
    labelYearSelect: 'Välj år'
});
Picker.defineTimeLocale('sv_SE', {
    clear: 'Rensa'
});
}));