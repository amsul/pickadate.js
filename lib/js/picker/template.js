/**
 * Build out the templating for the picker.
 */
Picker.template = function() {

    var picker = this
    var classes = picker.classNames

    // Create the nodes that contain the content.
    var pickerHolder = el(classes.holder,
        el(classes.frame,
            el(classes.wrap,
                el(classes.box,
                    picker.content)
                )
            )
        )

    var frag = document.createDocumentFragment()
    frag.appendChild(pickerHolder)
    return frag
}