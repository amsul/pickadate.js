/**
 * Open & close the picker.
 */
Picker.open = function() {
    if ( !this.attrs.opened ) this.attrs.opened = true
}
Picker.close = function() {
    if ( this.attrs.opened ) this.attrs.opened = false
}
Picker.toggle = function() {
    this.attrs.opened = !this.attrs.opened
}