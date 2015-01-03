// Bosnian
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'danas',
        clear: 'izbrisati',
        firstDay: 1,
        format: 'dd. mmmm yyyy.',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['januar','februar','mart','april','maj','juni','juli','august','septembar','oktobar','novembar','decembar'],
        monthsShort: ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'],
        weekdaysFull: ['nedjelja','ponedjeljak','utorak','srijeda','cetvrtak','petak','subota'],
        weekdaysShort: ['ne','po','ut','sr','če','pe','su']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'izbrisati'
    });
}
