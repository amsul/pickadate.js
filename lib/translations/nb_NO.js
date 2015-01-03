// Norwegian
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'i dag',
        clear: 'nullstill',
        close: 'lukk',
        firstDay: 1,
        format: 'dd. mmm. yyyy',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember'],
        monthsShort: ['jan','feb','mar','apr','mai','jun','jul','aug','sep','okt','nov','des'],
        weekdaysFull: ['søndag','mandag','tirsdag','onsdag','torsdag','fredag','lørdag'],
        weekdaysShort: ['søn','man','tir','ons','tor','fre','lør']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'nullstill'
    });
}
