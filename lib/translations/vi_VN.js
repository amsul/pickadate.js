// Vietnamese
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'Hôm Nay',
        clear: 'Xoá',
        firstDay: 1,
        monthsFull: ['Tháng Một','Tháng Hai','Tháng Ba','Tháng Tư','Tháng Năm','Tháng Sáu','Tháng Bảy','Tháng Tám','Tháng Chín','Tháng Mười','Tháng Mười Một','Tháng Mười Hai'],
        monthsShort: ['Một','Hai','Ba','Tư','Năm','Sáu','Bảy','Tám','Chín','Mưới','Mười Một','Mười Hai'],
        weekdaysFull: ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'],
        weekdaysShort: ['C.Nhật','T.Hai','T.Ba','T.Tư','T.Năm','T.Sáu','T.Bảy']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'Xoá'
    });
}
