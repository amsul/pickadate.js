// Dutch
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'vandaag',
        clear: 'verwijderen',
        firstDay: 1,
        format: 'dddd d mmmm yyyy',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'],
        monthsShort: ['jan','feb','maa','apr','mei','jun','jul','aug','sep','okt','nov','dec'],
        weekdaysFull: ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'],
        weekdaysShort: ['zo','ma','di','wo','do','vr','za']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'verwijderen'
    });
}
