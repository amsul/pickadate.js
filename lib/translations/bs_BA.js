// Bosnian

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {

Picker.defineDateLocale('bs_BA', {
    monthsFull: [ 'januar', 'februar', 'mart', 'april', 'maj', 'juni', 'juli', 'august', 'septembar', 'oktobar', 'novembar', 'decembar' ],
    monthsShort: [ 'jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec' ],
    weekdaysFull: [ 'nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'cetvrtak', 'petak', 'subota' ],
    weekdaysShort: [ 'ne', 'po', 'ut', 'sr', 'če', 'pe', 'su' ],
    today: 'danas',
    clear: 'izbrisati',
    firstDay: 1,
    format: 'dd. mmmm yyyy.',
    formatSubmit: 'yyyy/mm/dd'
});

Picker.defineTimeLocale('bs_BA', {
    clear: 'izbrisati'
});

}));