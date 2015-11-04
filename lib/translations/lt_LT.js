// Lietuviškai

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)

}(this, function (Picker) {

Picker.defineDateLocale('lt_LT', {
    labelMonthNext: 'Sekantis mėnuo',
    labelMonthPrev: 'Ankstesnis mėnuo',
    labelMonthSelect: 'Pasirinkite mėnesį',
    labelYearSelect: 'Pasirinkite metus',
    monthsFull: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
    monthsShort: ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir', 'Lie', 'Rgp', 'Rgs', 'Spa', 'Lap', 'Grd'],
    weekdaysFull: ['Sekmadienis', 'Pirmadienis', 'Antradienis', 'Trečiadienis', 'Ketvirtadienis', 'Penktadienis', 'Šeštadienis'],
    weekdaysShort: ['Sk', 'Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št'],
    today: 'Šiandien',
    clear: 'Išvalyti',
    close: 'Uždaryti',
    firstDay: 1,
    //format: 'yyyy !m. mmmm d !d.', // need to have diffrent case of full months name
    format: 'yyyy-mm-dd',
    formatSubmit: 'yyyy/mm/dd'
});
Picker.defineTimeLocale('lt_LT', {
    clear: 'Išvalyti',
    format: 'HH:i'
});

}));