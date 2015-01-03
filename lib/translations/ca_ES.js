// Catalan
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'avui',
        clear: 'esborrar',
        close: 'tancar',
        firstDay: 1,
        format: 'dddd d !de mmmm !de yyyy',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['Gener','Febrer','Març','Abril','Maig','Juny','Juliol','Agost','Setembre','Octubre','Novembre','Desembre'],
        monthsShort: ['Gen','Feb','Mar','Abr','Mai','Jun','Jul','Ago','Set','Oct','Nov','Des'],
        weekdaysFull: ['diumenge','dilluns','dimarts','dimecres','dijous','divendres','dissabte'],
        weekdaysShort: ['diu','dil','dim','dmc','dij','div','dis']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'esborrar'
    });
}
