// Italian
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'Oggi',
        clear: 'Cancella',
        close: 'Chiudi',
        firstDay: 1,
        format: 'dddd d mmmm yyyy',
        formatSubmit: 'yyyy/mm/dd',
        labelMonthNext: 'Mese successivo',
        labelMonthPrev: 'Mese precedente',
        labelMonthSelect: 'Seleziona un mese',
        labelYearSelect: 'Seleziona un anno',
        monthsFull: ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'],
        monthsShort: ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'],
        weekdaysFull: ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'],
        weekdaysShort: ['dom','lun','mar','mer','gio','ven','sab']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        format: 'HH:i',
        formatSubmit: 'HH:i',
        clear: 'Cancella'
    });
}
