// Basque
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'gaur',
        clear: 'garbitu',
        firstDay: 1,
        format: 'dddd, yyyy(e)ko mmmmren da',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['urtarrila','otsaila','martxoa','apirila','maiatza','ekaina','uztaila','abuztua','iraila','urria','azaroa','abendua'],
        monthsShort: ['urt','ots','mar','api','mai','eka','uzt','abu','ira','urr','aza','abe'],
        weekdaysFull: ['igandea','astelehena','asteartea','asteazkena','osteguna','ostirala','larunbata'],
        weekdaysShort: ['ig.','al.','ar.','az.','og.','or.','lr.']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'garbitu'
    });
}
