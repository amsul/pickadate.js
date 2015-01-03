// Bulgarian
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'днес',
        clear: 'изтривам',
        firstDay: 1,
        format: 'd mmmm yyyy г.',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['януари','февруари','март','април','май','юни','юли','август','септември','октомври','ноември','декември'],
        monthsShort: ['янр','фев','мар','апр','май','юни','юли','авг','сеп','окт','ное','дек'],
        weekdaysFull: ['неделя','понеделник','вторник','сряда','четвъртък','петък','събота'],
        weekdaysShort: ['нд','пн','вт','ср','чт','пт','сб']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'изтривам'
    });
}
