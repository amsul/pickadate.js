// Hebrew

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {
Picker.defineDateLocale('he_IL', {
    monthsFull: [ 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר' ],
    monthsShort: [ 'ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ' ],
    weekdaysFull: [ 'יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום ששי', 'יום שבת' ],
    weekdaysShort: [ 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש' ],
    today: 'היום',
    clear: 'למחוק',
    format: 'yyyy mmmmב d dddd',
    formatSubmit: 'yyyy/mm/dd'
});

Picker.defineTimeLocale('he_IL', {
    clear: 'למחוק'
});
}));