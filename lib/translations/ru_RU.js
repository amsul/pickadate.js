// Russian
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'сегодня',
        clear: 'удалить',
        close: 'закрыть',
        firstDay: 1,
        format: 'd mmmm yyyy г.',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
        monthsShort: ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'],
        weekdaysFull: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
        weekdaysShort: ['вс','пн','вт','ср','чт','пт','сб']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'удалить'
    });
}
