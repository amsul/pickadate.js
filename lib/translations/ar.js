// Arabic
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'اليوم',
        clear: 'مسح',
        format: 'yyyy mmmm dd',
        formatSubmit: 'yyyy/mm/dd',
        monthsFull: ['يناير','فبراير','مارس','ابريل','مايو','يونيو','يوليو','اغسطس','سبتمبر','اكتوبر','نوفمبر','ديسمبر'],
        monthsShort: ['يناير','فبراير','مارس','ابريل','مايو','يونيو','يوليو','اغسطس','سبتمبر','اكتوبر','نوفمبر','ديسمبر'],
        weekdaysFull: ['الاحد','الاثنين','الثلاثاء','الاربعاء','الخميس','الجمعة','السبت'],
        weekdaysShort: ['الاحد','الاثنين','الثلاثاء','الاربعاء','الخميس','الجمعة','السبت']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'مسح'
    });
}
