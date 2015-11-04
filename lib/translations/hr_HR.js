// Croatian

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {

Picker.defineDateLocale('hr_HR', {
    monthsFull: [ 'sijećanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj', 'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac' ],
    monthsShort: [ 'sij', 'velj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro' ],
    weekdaysFull: [ 'nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota' ],
    weekdaysShort: [ 'ned', 'pon', 'uto', 'sri', 'čet', 'pet', 'sub' ],
    today: 'danas',
    clear: 'izbrisati',
    firstDay: 1,
    format: 'd. mmmm yyyy.',
    formatSubmit: 'yyyy/mm/dd'
});

Picker.defineTimeLocale('hr_HR', {
    clear: 'izbrisati'
});
}));