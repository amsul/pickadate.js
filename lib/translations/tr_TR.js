// Turkish

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)

}(this, function (Picker) {
Picker.defineDateLocale('tr_TR', {
    monthsFull: [ 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık' ],
    monthsShort: [ 'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara' ],
    weekdaysFull: [ 'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi' ],
    weekdaysShort: [ 'Pzr', 'Pzt', 'Sal', 'Çrş', 'Prş', 'Cum', 'Cmt' ],
    today: 'Bugün',
    clear: 'Sil',
    close: 'Kapat',
    firstDay: 1,
    format: 'dd mmmm yyyy dddd',
    formatSubmit: 'yyyy/mm/dd'
});
Picker.defineTimeLocale('tr_TR', {
    clear: 'sil'
});
}));