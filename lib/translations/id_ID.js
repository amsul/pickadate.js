// Indonesian

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {
Picker.defineDateLocale('id_ID', {
    monthsFull: [ 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember' ],
    monthsShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des' ],
    weekdaysFull: [ 'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu' ],
    weekdaysShort: [ 'Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab' ],
    today: 'hari ini',
    clear: 'menghapus',
    firstDay: 1,
    format: 'd mmmm yyyy',
    formatSubmit: 'yyyy/mm/dd'
});

Picker.defineTimeLocale('id_ID', {
    clear: 'menghapus'
});
}));