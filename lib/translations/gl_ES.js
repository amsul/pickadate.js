// Galician
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'hoxe',
        clear: 'borrar',
        firstDay: 1,
        format: 'dddd d !de mmmm !de yyyy',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['Xaneiro','Febreiro','Marzo','Abril','Maio','Xuño','Xullo','Agosto','Setembro','Outubro','Novembro','Decembro'],
        monthsShort: ['xan','feb','mar','abr','mai','xun','xul','ago','sep','out','nov','dec'],
        weekdaysFull: ['domingo','luns','martes','mércores','xoves','venres','sábado'],
        weekdaysShort: ['dom','lun','mar','mér','xov','ven','sab']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'borrar'
    });
}
