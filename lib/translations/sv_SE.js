// Swedish
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'Idag',
        clear: 'Rensa',
        close: 'Stäng',
        firstDay: 1,
        format: 'yyyy-mm-dd',
        formatSubmit: 'yyyy/mm/dd',
        labelMonthNext: 'Nästa månad',
        labelMonthPrev: 'Föregående månad',
        labelMonthSelect: 'Välj månad',
        labelYearSelect: 'Välj år',
        monthsFull: ['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'],
        monthsShort: ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'],
        weekdaysFull: ['söndag','måndag','tisdag','onsdag','torsdag','fredag','lördag'],
        weekdaysShort: ['sön','mån','tis','ons','tor','fre','lör']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'Rensa'
    });
}
