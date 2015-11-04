// Basque

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {
Picker.defineDateLocale('eu_ES', {
    monthsFull: [ 'urtarrila', 'otsaila', 'martxoa', 'apirila', 'maiatza', 'ekaina', 'uztaila', 'abuztua', 'iraila', 'urria', 'azaroa', 'abendua' ],
    monthsShort: [ 'urt', 'ots', 'mar', 'api', 'mai', 'eka', 'uzt', 'abu', 'ira', 'urr', 'aza', 'abe' ],
    weekdaysFull: [ 'igandea', 'astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala', 'larunbata' ],
    weekdaysShort: [ 'ig.', 'al.', 'ar.', 'az.', 'og.', 'or.', 'lr.' ],
    today: 'gaur',
    clear: 'garbitu',
    firstDay: 1,
    format: 'dddd, yyyy(e)ko mmmmren da',
    formatSubmit: 'yyyy/mm/dd'
});

    Picker.defineTimeLocale('eu_ES', {
    clear: 'garbitu'
});
}));