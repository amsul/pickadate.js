@import jquery as $
@import shadow as shadow
@export Picker

'use strict';

var el = shadow._.el
var $document = $(document)

/**
 * Construct a picker shadow object.
 *
 * @static
 * @class Picker
 * @extends shadow.DataElement
 */
var Picker = {
    name: 'Picker'
}

@include attrs.js
@include classNames.js
@include create.js
@include open-close.js
@include template.js

Picker = shadow.DataElement.extend(Picker)

return Picker