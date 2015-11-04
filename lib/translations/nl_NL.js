// Dutch

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)

}(this, function (Picker) {
Picker.defineDateLocale('nl_NL', {
    monthsFull: [ 'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december' ],
    monthsShort: [ 'jan', 'feb', 'maa', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec' ],
    weekdaysFull: [ 'zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag' ],
    weekdaysShort: [ 'zo', 'ma', 'di', 'wo', 'do', 'vr', 'za' ],
    today: 'vandaag',
    clear: 'verwijderen',
    close: 'sluiten',
    firstDay: 1,
    format: 'dddd d mmmm yyyy',
    formatSubmit: 'yyyy/mm/dd'
});
Picker.defineTimeLocale('nl_NL', {
    clear: 'verwijderen'
});
}));