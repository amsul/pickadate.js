// Czech
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'dnes',
        clear: 'vymazat',
        firstDay: 1,
        format: 'd. mmmm yyyy',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'],
        monthsShort: ['led','úno','bře','dub','kvě','čer','čvc','srp','zář','říj','lis','pro'],
        weekdaysFull: ['neděle','pondělí','úterý','středa','čtvrtek','pátek','sobota'],
        weekdaysShort: ['ne','po','út','st','čt','pá','so']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'vymazat'
    });
}
