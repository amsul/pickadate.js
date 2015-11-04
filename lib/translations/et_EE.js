// Estonian

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {

Picker.defineDateLocale('et_EE', {
    monthsFull: [ 'jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember' ],
    monthsShort: [ 'jaan', 'veebr', 'märts', 'apr', 'mai', 'juuni', 'juuli', 'aug', 'sept', 'okt', 'nov', 'dets' ],
    weekdaysFull: [ 'pühapäev', 'esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev' ],
    weekdaysShort: [ 'püh', 'esm', 'tei', 'kol', 'nel', 'ree', 'lau' ],
    today: 'täna',
    clear: 'kustutama',
    firstDay: 1,
    format: 'd. mmmm yyyy. a',
    formatSubmit: 'yyyy/mm/dd'
});

Picker.defineTimeLocale('et_EE', {
    clear: 'kustutama'
});
}));