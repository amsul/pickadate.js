// Ukrainian

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)

}(this, function (Picker) {
Picker.defineDateLocale('uk_UA', {
    monthsFull: [ 'січень', 'лютий', 'березень', 'квітень', 'травень', 'червень', 'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень' ],
    monthsShort: [ 'січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру' ],
    weekdaysFull: [ 'неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п‘ятниця', 'субота' ],
    weekdaysShort: [ 'нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб' ],
    today: 'сьогодні',
    clear: 'викреслити',
    firstDay: 1,
    format: 'dd mmmm yyyy p.',
    formatSubmit: 'yyyy/mm/dd'
});
Picker.defineTimeLocale('uk_UA', {
    clear: 'викреслити'
});
}));