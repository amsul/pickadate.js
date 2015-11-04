// Bulgarian

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {
Picker.defineDateLocale('bg_BG', {
    monthsFull: [ 'януари','февруари','март','април','май','юни','юли','август','септември','октомври','ноември','декември' ],
    monthsShort: [ 'янр','фев','мар','апр','май','юни','юли','авг','сеп','окт','ное','дек' ],
    weekdaysFull: [ 'неделя', 'понеделник', 'вторник', 'сряда', 'четвъртък', 'петък', 'събота' ],
    weekdaysShort: [ 'нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб' ],
    today: 'днес',
    clear: 'изтривам',
    firstDay: 1,
    format: 'd mmmm yyyy г.',
    formatSubmit: 'yyyy/mm/dd'
});

Picker.defineTimeLocale('bg_BG', {
    clear: 'изтривам'
});
}));