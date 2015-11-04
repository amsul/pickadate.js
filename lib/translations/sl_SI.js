// Slovenian

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)

}(this, function (Picker) {
Picker.defineDateLocale('sl_SI', {
    monthsFull: [ 'januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december' ],
    monthsShort: [ 'jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec' ],
    weekdaysFull: [ 'nedelja', 'ponedeljek', 'torek', 'sreda', 'četrtek', 'petek', 'sobota' ],
    weekdaysShort: [ 'ned', 'pon', 'tor', 'sre', 'čet', 'pet', 'sob' ],
    today: 'danes',
    clear: 'izbriši',
    close: 'zapri',
    firstDay: 1,
    format: 'd. mmmm yyyy',
    formatSubmit: 'yyyy/mm/dd'
});
Picker.defineTimeLocale('sl_SI', {
    clear: 'izbriši'
});
}));