Pickadate.attrs = {

    /**
        The min range.

        @attribute attrs.min
        @type Array|Date|String|Number|shadow.Date
        @default null
     */
    min: null,


    /**
        The max range.

        @attribute attrs.max
        @type Array|Date|String|Number|shadow.Date
        @default null
     */
    max: null,


    /**
        The date today.

        @protected
        @attribute attrs.today
        @type shadow.Date
        @default null
     */
    today: null,


    /**
        The 1st date of the month in view.

        @private
        @attribute attrs.view
        @type shadow.Date
        @default null
     */
    view: null,


    /**
        The highlighted date that acts as a visual cue of focus.

        @attribute attrs.highlight
        @type Array|Date|String|Number|shadow.Date
        @default null
     */
    highlight: null,


    /**
        The selected date that mirrors the value.

        @attribute attrs.select
        @type Array|Date|String|Number|shadow.Date
        @default null
     */
    select: null,


    /**
        The default formatting to use.

        @attribute attrs.format
        @type String
        @default 'd mmmm, yyyy'
     */
    format: 'd mmmm, yyyy',


    /**
        The first day of the week. Truth-y sets to Monday.

        @attribute attrs.firstDay
        @type Number
        @default null
     */
    firstDay: null,


    /**
        Show either the years, months, or dates grid.

        @attribute attrs.show
        @type String
        @default null
     */
    show: null

}