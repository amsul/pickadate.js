// Greek
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'σήμερα',
        clear: 'Διαγραφή',
        firstDay: 1,
        format: 'd mmmm yyyy',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μάιος','Ιούνιος','Ιούλιος','Αύγουστος','Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος'],
        monthsShort: ['Ιαν','Φεβ','Μαρ','Απρ','Μαι','Ιουν','Ιουλ','Αυγ','Σεπ','Οκτ','Νοε','Δεκ'],
        weekdaysFull: ['Κυριακή','Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο'],
        weekdaysShort: ['Κυρ','Δευ','Τρι','Τετ','Πεμ','Παρ','Σαβ']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'Διαγραφή'
    });
}
