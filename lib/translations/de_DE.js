// German
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'Heute',
        clear: 'Löschen',
        close: 'Schließen',
        firstDay: 1,
        format: 'dddd, dd. mmmm yyyy',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
        monthsShort: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
        weekdaysFull: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
        weekdaysShort: ['So','Mo','Di','Mi','Do','Fr','Sa']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'Löschen'
    });
}
