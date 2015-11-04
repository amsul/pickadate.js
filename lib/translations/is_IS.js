// Icelandic

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {
Picker.defineDateLocale('is_IS', {
    monthsFull: [ 'janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember' ],
    monthsShort: [ 'jan', 'feb', 'mar', 'apr', 'maí', 'jún', 'júl', 'ágú', 'sep', 'okt', 'nóv', 'des' ],
    weekdaysFull: [ 'sunnudagur', 'mánudagur', 'þriðjudagur', 'miðvikudagur', 'fimmtudagur', 'föstudagur', 'laugardagur' ],
    weekdaysShort: [ 'sun', 'mán', 'þri', 'mið', 'fim', 'fös', 'lau' ],
    today: 'Í dag',
    clear: 'Hreinsa',
    firstDay: 1,
    format: 'dd. mmmm yyyy',
    formatSubmit: 'yyyy/mm/dd'
});

Picker.defineTimeLocale('is_IS', {
    clear: 'Hreinsa'
});
}));