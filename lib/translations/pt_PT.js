// Portuguese
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'hoje',
        clear: 'excluir',
        format: 'd !de mmmm !de yyyy',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],
        monthsShort: ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'],
        weekdaysFull: ['domingo','segunda','terça','quarta','quinta','sexta','sábado'],
        weekdaysShort: ['dom','seg','ter','qua','qui','sex','sab']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'excluir'
    });
}
