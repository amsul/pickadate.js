// Slovenian
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'danes',
        clear: 'izbriši',
        firstDay: 1,
        format: 'd. mmmm yyyy',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['januar','februar','marec','april','maj','junij','julij','avgust','september','oktober','november','december'],
        monthsShort: ['jan','feb','mar','apr','maj','jun','jul','avg','sep','okt','nov','dec'],
        weekdaysFull: ['nedelja','ponedeljek','torek','sreda','četrtek','petek','sobota'],
        weekdaysShort: ['ned','pon','tor','sre','čet','pet','sob']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'izbriši'
    });
}
