// Simplified Chinese
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: '今日',
        clear: '删',
        firstDay: 1,
        format: 'yyyy 年 mm 月 dd 日',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        monthsShort: ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
        weekdaysFull: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
        weekdaysShort: ['日','一','二','三','四','五','六']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: '删'
    });
}
