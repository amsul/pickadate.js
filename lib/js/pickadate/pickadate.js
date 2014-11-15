@import jquery as $
@import shadow as shadow
@import picker as Picker
@export Pickadate

'use strict';

var _ = shadow._
var el = _.el
var $document = $(document)
var ShadowDate = shadow.Date.create.bind(shadow.Date)

/**
    Construct a pickadate shadow object.

    @static
    @class Pickadate
    @extends Picker
 */
var Pickadate = {
    name: 'Pickadate'
}

@include add.js
@include attrs.js
@include classNames.js
@include cloneLastSelection.js
@include cloneSelection.js
@include create.js
@include dict.js
@include formats.js
@include getNewAssignment.js
@include getNewMultipleAssignment.js
@include getNewMultipleSelection.js
@include getNewRangeAssignment.js
@include getNewRangeSelection.js
@include getNewSelection.js
@include isSelected.js
@include isDisabled.js
@include nextEnabledDate.js
@include parse.js
@include remove.js
@include setup.js
@include template.js

Pickadate = Picker.extend(Pickadate)

return Pickadate