// Slovak

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)

}(this, function (Picker) {
Picker.defineDateLocale('sk_SK', {
    monthsFull: [ 'január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december' ],
    monthsShort: [ 'jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec' ],
    weekdaysFull: [ 'nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota' ],
    weekdaysShort: [ 'Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So' ],
    today: 'dnes',
    clear: 'vymazať',
    close: 'zavrieť',
    firstDay: 1,
    format: 'd. mmmm yyyy',
    formatSubmit: 'yyyy/mm/dd'
});
Picker.defineTimeLocale('sk_SK', {
    clear: 'vymazať'
});
}));