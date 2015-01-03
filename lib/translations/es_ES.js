// Spanish
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'hoy',
        clear: 'borrar',
        close: 'cerrar',
        firstDay: 1,
        format: 'dddd d !de mmmm !de yyyy',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
        monthsShort: ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],
        weekdaysFull: ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
        weekdaysShort: ['dom','lun','mar','mié','jue','vie','sáb']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'borrar'
    });
}
