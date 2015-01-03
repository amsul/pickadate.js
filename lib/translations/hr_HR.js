// Croatian
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'danas',
        clear: 'izbrisati',
        firstDay: 1,
        format: 'd. mmmm yyyy.',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['sijećanj','veljača','ožujak','travanj','svibanj','lipanj','srpanj','kolovoz','rujan','listopad','studeni','prosinac'],
        monthsShort: ['sij','velj','ožu','tra','svi','lip','srp','kol','ruj','lis','stu','pro'],
        weekdaysFull: ['nedjelja','ponedjeljak','utorak','srijeda','četvrtak','petak','subota'],
        weekdaysShort: ['ned','pon','uto','sri','čet','pet','sub']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'izbrisati'
    });
}
