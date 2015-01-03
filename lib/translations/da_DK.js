// Danish
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'i dag',
        clear: 'slet',
        close: 'luk',
        firstDay: 1,
        format: 'd. mmmm yyyy',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december'],
        monthsShort: ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'],
        weekdaysFull: ['søndag','mandag','tirsdag','onsdag','torsdag','fredag','lørdag'],
        weekdaysShort: ['søn','man','tir','ons','tor','fre','lør']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'slet'
    });
}
