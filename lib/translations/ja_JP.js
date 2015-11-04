// Japanese

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)

}(this, function (Picker) {
Picker.defineDateLocale('ja_JP', {
    monthsFull: [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月' ],
    monthsShort: [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月' ],
    weekdaysFull: [ '日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日' ],
    weekdaysShort: [ '日', '月', '火', '水', '木', '金', '土' ],
    today: '今日',
    clear: '消去',
    firstDay: 1,
    format: 'yyyy mm dd',
    formatSubmit: 'yyyy/mm/dd'
});
Picker.defineTimeLocale('ja_JP', {
    clear: '消去'
});
}));