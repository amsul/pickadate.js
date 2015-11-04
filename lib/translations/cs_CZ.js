// Czech

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {

Picker.defineDateLocale('cs_CZ', {
    monthsFull: [ 'leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec' ],
    monthsShort: [ 'led', 'úno', 'bře', 'dub', 'kvě', 'čer', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro' ],
    weekdaysFull: [ 'neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota' ],
    weekdaysShort: [ 'ne', 'po', 'út', 'st', 'čt', 'pá', 'so' ],
    today: 'dnes',
    clear: 'vymazat',
    firstDay: 1,
    format: 'd. mmmm yyyy',
    formatSubmit: 'yyyy/mm/dd'
});

Picker.defineTimeLocale('cs_CZ', {
    clear: 'vymazat'
});
}));