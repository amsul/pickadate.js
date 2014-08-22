/**
 * Remove a unit from a named attribute collection.
 */
Pickadate.remove = function(name, value, collection) {
    this._super(name, value, function(unit, loopedUnit) {
        return loopedUnit.compare(unit)
    }, collection)
}