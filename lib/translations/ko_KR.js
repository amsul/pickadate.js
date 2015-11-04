// Korean

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)

}(this, function (Picker) {
Picker.defineDateLocale( 'ko_KR', {
    monthsFull: [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ],
    monthsShort: [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ],
    weekdaysFull: [ '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일' ],
    weekdaysShort: [ '일', '월', '화', '수', '목', '금', '토' ],
    today: '오늘',
    clear: '취소',
    firstDay: 1,
    format: 'yyyy 년 mm 월 dd 일',
    formatSubmit: 'yyyy/mm/dd'
});
Picker.defineTimeLocale('ko_KR', {
    clear: '취소'
});
}));