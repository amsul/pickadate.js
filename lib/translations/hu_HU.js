// Hungarian

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {
Picker.defineDateLocale('hu_HU', {
    monthsFull: [ 'január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december' ],
    monthsShort: [ 'jan', 'febr', 'márc', 'ápr', 'máj', 'jún', 'júl', 'aug', 'szept', 'okt', 'nov', 'dec' ],
    weekdaysFull: [ 'vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat' ],
    weekdaysShort: [ 'V', 'H', 'K', 'SZe', 'CS', 'P', 'SZo' ],
    today: 'Ma',
    clear: 'Törlés',
    firstDay: 1,
    format: 'yyyy. mmmm dd.',
    formatSubmit: 'yyyy/mm/dd'
});

Picker.defineTimeLocale('hu_HU', {
    clear: 'Törlés'
});
}));