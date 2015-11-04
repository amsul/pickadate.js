// Arabic

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {
    'use strict';
Picker.defineDateLocale('ar', {
    monthsFull: [ 'يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر' ],
    monthsShort: [ 'يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر' ],
    weekdaysFull: [ 'الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'الجمعة', 'السبت' ],
    weekdaysShort: [ 'الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'الجمعة', 'السبت' ],
    today: 'اليوم',
    clear: 'مسح',
    format: 'yyyy mmmm dd',
    formatSubmit: 'yyyy/mm/dd'
});

Picker.defineTimeLocale('ar', {
    clear: 'مسح'
});

}));