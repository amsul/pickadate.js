// Romanian

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)

}(this, function (Picker) {
Picker.defineDateLocale('ro_RO', {
    monthsFull: [ 'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie' ],
    monthsShort: [ 'ian', 'feb', 'mar', 'apr', 'mai', 'iun', 'iul', 'aug', 'sep', 'oct', 'noi', 'dec' ],
    weekdaysFull: [ 'duminică', 'luni', 'marţi', 'miercuri', 'joi', 'vineri', 'sâmbătă' ],
    weekdaysShort: [ 'D', 'L', 'Ma', 'Mi', 'J', 'V', 'S' ],
    today: 'azi',
    clear: 'șterge',
    firstDay: 1,
    format: 'dd mmmm yyyy',
    formatSubmit: 'yyyy/mm/dd'
});
Picker.defineTimeLocale('ro_RO', {
    clear: 'șterge'
});
}));