// Latvian

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)

}(this, function (Picker) {

Picker.defineDateLocale('lv_LV', {
    monthsFull: [ 'Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs', 'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris' ],
    monthsShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jūn', 'Jūl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec' ],
    weekdaysFull: [ 'Svētdiena', 'Pirmdiena', 'Otrdiena', 'Trešdiena', 'Ceturtdiena', 'Piektdiena', 'Sestdiena' ],
    weekdaysShort: [ 'Sv', 'P', 'O', 'T', 'C', 'Pk', 'S' ],
    today: 'Šodiena',
    clear: 'Atcelt',
    firstDay: 1,
    format: 'yyyy.mm.dd. dddd',
    formatSubmit: 'yyyy/mm/dd'
});

}));