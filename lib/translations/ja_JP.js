// Japanese
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: '今日',
        clear: '消去',
        firstDay: 1,
        format: 'yyyy mm dd',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        monthsShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        weekdaysFull: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
        weekdaysShort: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: '消去'
    });
}
