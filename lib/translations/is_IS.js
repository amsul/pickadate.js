// Icelandic
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'Í dag',
        clear: 'Hreinsa',
        firstDay: 1,
        format: 'dd. mmmm yyyy',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['janúar','febrúar','mars','apríl','maí','júní','júlí','ágúst','september','október','nóvember','desember'],
        monthsShort: ['jan','feb','mar','apr','maí','jún','júl','ágú','sep','okt','nóv','des'],
        weekdaysFull: ['sunnudagur','mánudagur','þriðjudagur','miðvikudagur','fimmtudagur','föstudagur','laugardagur'],
        weekdaysShort: ['sun','mán','þri','mið','fim','fös','lau']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'menghapus'
    });
}
