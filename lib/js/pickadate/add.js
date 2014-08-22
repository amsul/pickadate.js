/**
 * Add a unit to a named attribute collection.
 */
Pickadate.add = function(name, value, collection) {
    this._super(name, value, function(unit, loopedUnit) {
        return loopedUnit.compare(unit)
    }, collection)
}