
/*!
 * Shadow UI v0.6.1-0, 2014/08/17
 * By Amsul, http://amsul.ca
 * Hosted on http://amsul.github.io/shadow-ui
 * Licensed under MIT
 */

(function (global, factory) {

    // Setup the exports for Node module pattern...
    if ( typeof module == 'object' && typeof module.exports == 'object' )
        module.exports = factory(global, global.jQuery)

    // ...AMD...
    else if ( typeof define == 'function' && define.amd )
        define([global, 'jquery'], factory)

    // ...and basic `script` includes.
    else global.shadow = factory(global, global.jQuery)

}(this, function(window, $, undefined) {

'use strict';

/**
 * @module shadow
 */
/**
 * The main interface to register a shadow component.
 */
function shadow(shadowName, shadowOptions) {
    if (!shadowName) {
        throw new ReferenceError("The `shadowName` is required to register a UI interface.");
    }
    var extendingName = "Element";
    shadowOptions = $.extend(true, {}, shadowOptions);
    if (shadowOptions.extend) {
        extendingName = shadowOptions.extend;
        delete shadowOptions.extend;
    }
    extendingName = _.casePascal(extendingName);
    if (!_.isTypeOf(shadow[extendingName], "object") || extendingName != "Element" && !shadow.Element.isClassOf(shadow[extendingName])) {
        throw new ReferenceError("There is no shadow element named “" + _.caseDash(extendingName) + "”.");
    }
    if (shadowOptions.name) {
        throw new ReferenceError("The `name` property of the `shadowOptions` is reserved.");
    }
    shadowOptions.name = _.casePascal(shadowName);
    shadow[extendingName].extend(shadowOptions);
}

Object.defineProperty(shadow, "IS_DEBUGGING", {
    writable: true,
    value: true
});

/**
 * Build a shadow element.
 */
shadow.build = function($element, shadowName, shadowOptions) {
    shadowOptions = shadowOptions || {};
    shadowOptions.$el = $element;
    shadowName = _.casePascal(shadowName);
    if (!(shadowName in shadow) || !shadow.Object.isClassOf(shadow[shadowName])) {
        throw new ReferenceError("There is no shadow UI " + "registered by the name of `" + shadowName + "`.");
    }
    return shadow[shadowName].create(shadowOptions);
};

/**
 * Build all the named shadow elements.
 */
shadow.buildAll = function(shadowName, shadowOptions) {
    var $elements = $('[data-ui="' + shadowName + '"]');
    $elements.each(function() {
        shadow.build($(this), shadowName, shadowOptions);
    });
};

/**
 * Utility methods to simplify and share common functionality.
 *
 * @class shadow._
 * @static
 */
var _ = shadow._ = {
    /**
     * A no-op.
     *
     * @method noop
     * @static
     */
    noop: function() {},
    /**
     * Define an enumerable property on an object.
     *
     * @method define
     * @param {Object} object The object to receive the property definition.
     * @param {String} prop The property to define.
     * @param {String|Boolean|Number|Array|Object|Function} value The value of the definition.
     * @static
     */
    define: function(object, prop, value) {
        Object.defineProperty(object, prop, {
            enumerable: true,
            value: value
        });
    },
    /**
     * Convert to camel-cased text.
     *
     * ```javascript
     * shadow._.caseCamel('howdy-there stranger')
     * // returns 'howdyThere stranger'
     *
     * shadow._.caseCamel('HowdyThere-stranger')
     * // returns 'howdyThereStranger'
     * ```
     *
     * @method caseCamel
     * @param {String} words A string of words delimited by dashes, underscores, and case changes.
     * @return {String} The camelized string of words.
     * @static
     */
    caseCamel: function(words) {
        var newWord = true;
        var wordChunks = words.split(/(?=[A-Z])|-|_/).map(function(word, index) {
            if (!word) {
                return "";
            }
            if (word.length === 1) {
                if (!newWord) {
                    return word.toLowerCase();
                }
                newWord = false;
                return word;
            }
            newWord = true;
            return (index ? word[0].toUpperCase() : word[0].toLowerCase()) + word.slice(1);
        });
        var firstWord = wordChunks[0];
        if (wordChunks.length > 1 && firstWord[0].match(/[A-Z]/)) {
            wordChunks[0] = firstWord[0].toLowerCase() + firstWord.slice(1);
        }
        return wordChunks.join("");
    },
    /**
     * Convert to pascal-cased text.
     *
     * ```javascript
     * shadow._.casePascal('howdy-there stranger')
     * // returns 'HowdyThere stranger'
     *
     * shadow._.casePascal('HowdyThere-stranger')
     * // returns 'HowdyThereStranger'
     * ```
     *
     * @method casePascal
     * @param {String} words A string of words delimited by dashes, underscores, and case changes.
     * @return {String} The pascalized string of words.
     * @static
     */
    casePascal: function(words) {
        var newWord = true;
        var wordChunks = words.split(/(?=[A-Z])|-|_/).map(function(word) {
            if (!word) {
                return "";
            }
            if (word.length === 1) {
                if (!newWord) {
                    return word.toLowerCase();
                }
                newWord = false;
                return word;
            }
            newWord = true;
            return word[0].toUpperCase() + word.slice(1);
        });
        return wordChunks.join("");
    },
    /**
     * Convert to dash-cased text.
     *
     * ```javascript
     * shadow._.caseDash('howdy-there stranger')
     * // returns 'howdy-there stranger'
     *
     * shadow._.caseDash('HowdyThere-stranger')
     * // returns 'howdy-there-stranger'
     * ```
     *
     * @method caseDash
     * @param {String} words A string of words delimited by dashes, underscores, and case changes.
     * @return {String} The dasherized string of words.
     * @static
     */
    caseDash: function(words) {
        var newWord = true;
        var wordChunks = words.split(/(?=[A-Z])|-|_/).map(function(word, index) {
            if (!word) {
                return "";
            }
            if (word.length === 1) {
                if (!newWord) {
                    return word.toLowerCase();
                }
                newWord = false;
                return (index ? "-" : "") + word.toLowerCase();
            }
            newWord = true;
            return (index ? "-" : "") + word[0].toLowerCase() + word.slice(1);
        });
        return wordChunks.join("");
    },
    /**
     * Check what the internal type of a value is.
     *
     * ```javascript
     * shadow._.isTypeOf(new Date)
     * // returns 'date'
     *
     * shadow._.isTypeof(new Date, 'date')
     * // returns true
     * ```
     *
     * @method isTypeOf
     * @param value The value whose type is being checked.
     * @param {String} [type] A type to compare against.
     * @return {String|Boolean} If a `type` is passed, a boolean is returned. Otherwise the type is returned.
     * @static
     */
    isTypeOf: function(value, type) {
        var valueType = {}.toString.call(value).slice(8, -1).toLowerCase();
        return type ? type === valueType : valueType;
    },
    /**
     * Define aria attributes on an element.
     *
     * Given the following element:
     *
     * ```html
     * <div id="elem"></div>
     * ```
     *
     * ...and applying the following snippet:
     *
     * ```javascript
     * var el = document.getElementById('elem')
     * shadow._.aria(el, 'role', 'button')
     * shadow._.aria(el, 'controls', 'widget')
     * ```
     *
     * ...the element becomes:
     *
     * ```html
     * <div id="elem" role="button" aria-controls="widget"></div>
     * ```
     *
     * @method aria
     * @param {HTMLElement} element The HTML element whose attribute should be set.
     * @param {String} attribute The name of the aria attribute to set (minus the `aria-` part of the name).
     * @param {String|Boolean} value The value to set the attribute to.
     * @static
     */
    /**
     * An alternate way to set multiple aria attributes on an element.
     *
     * Given the following element:
     *
     * ```html
     * <div id="elem"></div>
     * ```
     *
     * And applying the following snippet:
     *
     * ```javascript
     * var el = document.getElementById('elem')
     * shadow._.aria(el, {
     *     role: 'button',
     *     controls: 'widget'
     * })
     * ```
     *
     * The element becomes:
     *
     * ```html
     * <div id="elem" role="button" aria-controls="widget"></div>
     * ```
     *
     * @method aria
     * @param {HTMLElement} element The HTML element whose attribute should be set.
     * @param {Hash} attributes A hash mapping of attribute names (minus the `aria-` part) to values.
     * @static
     */
    aria: function(element, attribute, value) {
        if ($.isPlainObject(attribute)) {
            for (var key in attribute) {
                ariaSet(element, key, attribute[key]);
            }
        } else {
            ariaSet(element, attribute, value);
        }
    },
    /**
     * Create an element node with optional children.
     *
     * @method el
     * @param {String|Hash} [options] Options to customize the creation. If it’s a string, the value is used as the class name.
     * @param {String} options.name The tag name for the element.
     * @param {String} options.klass The class name for the element.
     * @param {Hash} options.attrs A hash mapping of attributes for the element.
     * @param {Node|HTMLElement|DocumentFragment|Array} [childEls] The children to append to the element.
     * @return {HTMLElement} The newly created element.
     * @static
     */
    el: function(options, childEls) {
        var className;
        var attributes;
        var elName = "div";
        if (options) {
            if (typeof options == "string") {
                className = options;
            } else {
                if (options.name) {
                    elName = options.name;
                }
                if (options.klass) {
                    className = options.klass;
                }
                if (options.attrs) {
                    attributes = options.attrs;
                }
            }
        } else if (!(childEls instanceof Node)) {
            return document.createTextNode(childEls);
        }
        var el = document.createElement(elName);
        if (className) {
            el.className = className;
        }
        if (attributes) for (var attrName in attributes) {
            el.setAttribute(attrName, attributes[attrName]);
        }
        if (childEls != null) {
            if (!Array.isArray(childEls)) {
                childEls = [ childEls ];
            }
            childEls.forEach(function(childEl) {
                if (!(childEl instanceof Node)) {
                    childEl = document.createTextNode(childEl);
                }
                el.appendChild(childEl);
            });
        }
        return el;
    },
    /**
     * Get the index of a unit within a collection.
     *
     * @method indexIn
     * @param {Array} collection A collection of values with the same type.
     * @param {String|Boolean|Number|Array|Object} unit The unit to find.
     * @param {Function} [comparator] A function to use for the comparison of units.
     * @return {Number} The index the unit was found at. `-1` if it wasn’t found.
     * @static
     */
    indexIn: function(collection, unit, comparator) {
        if (!Array.isArray(collection)) {
            throw new TypeError("The collection to search in must be an array.");
        }
        comparator = comparator || function(unit, loopedUnit) {
            return loopedUnit === unit;
        };
        for (var i = 0; i < collection.length; i++) {
            var loopedUnit = collection[i];
            if (comparator(unit, loopedUnit)) {
                return i;
            }
        }
        return -1;
    },
    /**
     * Check if a unit is within a collection.
     *
     * @method isWithin
     * @param {Array} collection A collection of values with the same type.
     * @param {String|Boolean|Number|Array|Object} unit The unit to find.
     * @param {Function} [comparator] A function to use for the comparison of units.
     * @return {Boolean}
     * @static
     */
    isWithin: function(collection, unit, comparator) {
        return this.indexIn(collection, unit, comparator) > -1;
    }
};

function ariaSet(element, attribute, value) {
    element.setAttribute((attribute == "role" ? "" : "aria-") + attribute, value);
}

/**
 * The core shadow object prototype.
 *
 * @static
 * @class shadow.Object
 */
shadow.Object = Object.create({}, {
    /**
     * The name of the shadow object.
     *
     * Names of classes are `PascalCased` and objects are `camelCased`:
     *
     * ```javascript
     * shadow.Object.name == 'Object' // returns true
     * shadow.Object.create().name == 'object' // returns true
     * ```
     *
     * Values of `data-ui` attributes are `dash-cased`:
     *
     * ```html
     * <div data-ui="data-element"></div>
     * ```
     *
     * This initializes the shadow element on page load.
     *
     * @example
     *
     * The only time the `name` is writable is during extension:
     *
     * ```javascript
     * var MyExtension = shadow.Object.extend({
     *     name: 'MyExtension'
     * })
     * MyExtension.name == 'MyExtension' // returns true
     * MyExtension.create().name == 'myExtension' // returns true
     * ```
     *
     * This name is used to keep a reference of the classes under the `shadow` namespace.
     *
     * @writeOnce
     * @required
     * @property name
     * @type String
     */
    name: {
        enumerable: true,
        value: "Object"
    },
    /**
     * Create an instance of the shadow object.
     *
     * @example
     *
     * A plain shadow object:
     *
     * ```javascript
     * var object = shadow.Object.create()
     * object.isInstanceOf(shadow.Object) // returns true
     * object.name == 'object' // returns true
     * ```
     *
     * A custom shadow object with overriding properties:
     *
     * ```javascript
     * var MyObject = shadow.Object.extend({
     *     name: 'MyObject',
     *     someProperty: false
     * })
     * var myObject = MyObject.create({
     *     someProperty: true
     * })
     * myObject.isInstanceOf(MyObject) // returns true
     * myObject.someProperty === true // returns true
     * ```
     *
     * @static
     * @method create
     * @param {Object} [options] Options to extend the object’s prototype.
     * @return {shadow.Object} An instance of the shadow object.
     */
    create: {
        enumerable: true,
        value: function(options) {
            var Base = this;
            var object = Object.create(Base);
            Object.defineProperties(object, {
                name: {
                    value: _.caseCamel(Base.name),
                    enumerable: true
                },
                create: {
                    value: _.noop
                },
                extend: {
                    value: _.noop
                }
            });
            for (var item in options) {
                if (item in Base) {
                    var isBasePropertyFn = typeof Base[item] == "function";
                    if (shadow.IS_DEBUGGING && isBasePropertyFn) {
                        checkForSuperCall(options, item);
                    }
                    var value = options[item];
                    if (isBasePropertyFn && typeof value == "function") {
                        value = superFun(Base, item, value);
                    }
                    _.define(object, item, value);
                } else if (shadow.IS_DEBUGGING) {
                    throw new ReferenceError("The `" + item + "` property is not recognized by " + Base + ".");
                }
            }
            return object;
        }
    },
    /**
     * Extend the object using prototypes. Based on:
     * http://aaditmshah.github.io/why-prototypal-inheritance-matters/#inheriting_from_multiple_prototypes
     *
     * @todo Document an example.
     *
     * @static
     * @method extend
     * @param {Object} options Options to extend the object’s prototype.
     * @return {shadow.Object} An extension of the shadow object class.
     */
    extend: {
        enumerable: true,
        value: function(prototype) {
            var Base = this;
            if (!Base.isClass()) {
                console.debug(Base);
                throw new TypeError("Cannot extend a constructed object.");
            }
            var Instance = Object.create(Base);
            for (var property in prototype) {
                if (prototype.hasOwnProperty(property)) {
                    if (property == "_super") {
                        throw new Error("The `_super` property is reserved " + "to allow object method inheritance.");
                    }
                    var isBasePropertyFn = typeof Base[property] == "function" && Base[property] !== Object[property];
                    if (isBasePropertyFn) {
                        checkForSuperCall(prototype, property);
                    }
                    var value = isBasePropertyFn && typeof prototype[property] == "function" ? superFun(Base, property, prototype[property]) : $.isPlainObject(Base[property]) && $.isPlainObject(prototype[property]) ? $.extend({}, Base[property], prototype[property]) : prototype[property];
                    _.define(Instance, property, value);
                }
            }
            if (!Instance.name.match(/^[A-Z]/)) {
                throw new TypeError("An object’s name must be PascalCased.");
            }
            if (hasOwnProperty.call(shadow, Instance.name)) {
                throw new TypeError("An object by the name of “" + Instance.name + "” already exists.");
            }
            shadow[Instance.name] = Instance;
            return Instance;
        }
    },
    //extend
    /**
     * Check if the object is a class.
     *
     * @example
     *
     * ```javascript
     * shadow.Object.isClass() // returns true
     * shadow.Object.create().isClass() // returns false
     * ```
     *
     * @method isClass
     * @return {Boolean}
     */
    isClass: {
        enumerable: true,
        value: function() {
            var object = this;
            var Base = Object.getPrototypeOf(object);
            return object === shadow.Object || !Base.isPrototypeOf(object);
        }
    },
    /**
     * Check if the object inherits from the class of another. Inspiration from:
     * http://aaditmshah.github.io/why-prototypal-inheritance-matters/#fixing_the_instanceof_operator
     *
     * @method isClassOf
     * @param {shadow.Object} Instance The instance of a shadow object.
     * @return {Boolean}
     */
    isClassOf: {
        enumerable: true,
        value: function(Instance) {
            var Base = this;
            if (_.isTypeOf(Instance, "object")) do {
                Instance = Object.getPrototypeOf(Instance);
                if (Base === Instance) {
                    return true;
                }
            } while (Instance);
            return false;
        }
    },
    /**
     * Check if the object is an instance of another. Inspiration from:
     * http://aaditmshah.github.io/why-prototypal-inheritance-matters/#fixing_the_instanceof_operator
     *
     * @method isInstanceOf
     * @param {shadow.Object} Base The class of a shadow object.
     * @return {Boolean}
     */
    isInstanceOf: {
        enumerable: true,
        value: function(Base) {
            return this.isClassOf.call(Base, this);
        }
    },
    /**
     * Check if the object is the prototype of another.
     *
     * @method isPrototypeOf
     * @param {shadow.Object} object A shadow object.
     * @return {Boolean}
     */
    isPrototypeOf: {
        enumerable: true,
        value: function(object) {
            var Base = this;
            var Prototype = Object.getPrototypeOf(object);
            return Base === Prototype && object.name === _.caseCamel(Prototype.name);
        }
    },
    /**
     * Cast the object into a string representation.
     *
     * If `shadow.IS_DEBUGGING` is set to `true`, the
     * {{#cross-link to="shadow.Object#toFullString"}}
     * `toFullString`{{/cross-link}} response is returned instead.
     *
     * @example
     *
     * ```javascript
     * shadow.Object.toString()               // returns '{class Object}'
     * shadow.DataElement.toString()          // returns '{class DataElement}'
     * shadow.Object.create().toString()      // returns '{object Object}'
     * shadow.DataElement.create().toString() // returns '{object DataElement}'
     * ```
     *
     * This allows you to add easy debugging:
     *
     * ```javascript
     * console.debug('Creating: ' + shadow.DataElement)
     * // logs 'Creating: {class DataElement}'
     *
     * console.debug('Created: ' + shadow.Object.create())
     * // logs 'Created: {object Object}'
     * ```
     *
     * {{#block-note}}
     * This only works if the class or object does not have a `valueOf` method. Those
     * that do have a `valueOf` method will use that return value instead, such as `shadow.Date`.
     * {{/block-note}}
     *
     * @method toString
     * @return {String} A string representation of the shadow object.
     */
    toString: {
        enumerable: true,
        value: function() {
            if (shadow.IS_DEBUGGING) {
                return this.toFullString();
            }
            var object = this;
            var isClass = object.isClass();
            var type = isClass ? "class" : "object";
            var Base = isClass ? object : Object.getPrototypeOf(object);
            return "{" + type + " " + Base.name + "}";
        }
    },
    /**
     * Cast the object into a full string representation.
     *
     * @example
     *
     * ```javascript
     * shadow.Object.toFullString()               // returns '{class Object}'
     * shadow.DataElement.toFullString()          // returns '{class DataElement:Element:Object}'
     * shadow.Object.create().toFullString()      // returns '{object Object}'
     * shadow.DataElement.create().toFullString() // returns '{object DataElement:Element:Object}'
     * ```
     *
     * @private
     * @method toFullString
     * @return {String} A full trace string representation of the shadow object.
     */
    toFullString: {
        enumerable: true,
        value: function() {
            var object = this;
            var isClass = object.isClass();
            var type = isClass ? "class" : "object";
            var names = [];
            if (!isClass) {
                object = Object.getPrototypeOf(object);
            }
            do {
                names.push(object.name);
                object = Object.getPrototypeOf(object);
            } while (object && object.name);
            return "{" + type + " " + names.join(":") + "}";
        }
    }
});

//shadow.Object
// Check if the super method was called within a wrapped method..
function checkForSuperCall(prototype, property) {
    var methodString = "" + prototype[property];
    var variableNameMatch = methodString.match(/(\w+) *= *this/);
    var variableName = variableNameMatch && variableNameMatch[1] + "|" || "";
    var invoker = "(\\.(call|apply))?\\(";
    var superRegex = new RegExp("(?:" + variableName + "this)\\._super(" + invoker + ")");
    if (!methodString.match(superRegex)) {
        console.warn("Overriding the base method `" + property + "` " + "without calling `this._super()` within the method might cause " + "unexpected results. Make sure this is the behavior you desire.\n", prototype);
    }
}

// Allow inheritence of super methods. Based on:
// http://ejohn.org/blog/simple-javascript-inheritance/
function superFun(Base, property, fn) {
    return function superWrapper() {
        var object = this;
        object._super = Base[property];
        var ret = fn.apply(object, arguments);
        delete object._super;
        return ret;
    };
}

/**
 * Construct a shadow date object.
 *
 * @static
 * @class shadow.Date
 * @extends shadow.Object
 */
shadow.Object.extend({
    name: "Date",
    /**
     * The value of the date represented as an array.
     *
     * ```javascript
     * var date = shadow.Date.create(new Date(2013, 3, 20))
     * date.value
     * // returns [2013, 3, 20]
     * ```
     *
     * @readOnly
     * @property value
     * @type {Array}
     * @default null
     */
    value: null,
    /**
     * The year of the shadow date object.
     *
     * @readOnly
     * @property year
     * @type {Number}
     * @default null
     */
    year: null,
    /**
     * The month of the shadow date object.
     *
     * @readOnly
     * @property month
     * @type {Number}
     * @default null
     */
    month: null,
    /**
     * The date of the shadow date object.
     *
     * @readOnly
     * @property date
     * @type {Number}
     * @default null
     */
    date: null,
    /**
     * A flag to set the date to the first of the month upon creation.
     *
     * ```javascript
     * shadow.Date.create([2013, 3, 20], {
     *     setToTheFirst: true
     * })
     * // returns { year: 2013, month: 3, date: 1, ... }
     * ```
     *
     * @writeOnce
     * @property setToTheFirst
     * @type {Boolean}
     * @default false
     */
    setToTheFirst: false,
    /**
     * Create an instance of a shadow date by passing a date value representation.
     *
     * @example
     *
     * The value as an array:
     *
     * ```javascript
     * shadow.Date.create([2014, 3, 20])
     * // returns { year: 2014, month: 3, date: 20, ... }
     * ```
     *
     * The value as a JavaScript date object:
     *
     * ```javascript
     * shadow.Date.create(new Date(2014, 3, 20))
     * // returns { year: 2014, month: 3, date: 20, ... }
     * ```
     *
     * The value as a UNIX time stamp:
     *
     * ```javascript
     * shadow.Date.create(1397966400000)
     * // returns { year: 2014, month: 3, date: 20, ... }
     * ```
     *
     * The value as an ISO string:
     *
     * ```javascript
     * shadow.Date.create('2014-04-20T16:20:00.000Z')
     * // returns { year: 2014, month: 3, date: 20, ... }
     * ```
     *
     * @static
     * @method create
     * @param {Array|String|Number|Date|shadow.Date} value The value of the date to create.
     * @param {Object} [options] Options for the date’s prototype.
     * @return {shadow.Date} An instance of the shadow date.
     */
    create: function(value, options) {
        if (!value) {
            return this._super();
        }
        if (value === true) {
            value = new Date();
        } else if (_.isTypeOf(value, "object") && this.isPrototypeOf(value)) {
            value = value.value;
        }
        var shadowDate = this._super(options);
        value = toDate(value, shadowDate.setToTheFirst);
        var year = value.getFullYear();
        var month = value.getMonth();
        var date = value.getDate();
        var time = value.getTime();
        _.define(shadowDate, "value", [ year, month, date ]);
        _.define(shadowDate, "decade", getDecade(year));
        _.define(shadowDate, "year", year);
        _.define(shadowDate, "month", month);
        _.define(shadowDate, "date", date);
        _.define(shadowDate, "time", time);
        return shadowDate;
    },
    /**
     * Compare the shadow date’s value with another date.
     *
     * @example
     *
     * Given the following two dates:
     *
     * ```javascript
     * var one = shadow.Date.create([2013, 3, 20])
     * var two = new Date(2014, 3, 20)
     * ```
     *
     * ...we can compare them in various ways (all the following conditions resolve to `true`):
     *
     * ```javascript
     * // Compare the two for equality
     * one.compare(two) == false
     *
     * // Compare the first as being greater than the second
     * one.compare('greater', two) == false
     *
     * // Compare the first as being lesser than the second
     * one.compare('lesser', two) == true
     * ```
     *
     * ...or we can scope the comparison to time units:
     *
     * ```javascript
     * // Compare the months
     * one.compare('month', two) == false
     * one.compare('month greater', two) == false
     * one.compare('month lesser', two) == true
     *
     * // Compare the years
     * one.compare('year', two) == false
     * one.compare('year greater', two) == false
     * one.compare('year lesser', two) == true
     *
     * // Compare the decade
     * one.compare('decade', two) == true
     * one.compare('decade greater', two) == false
     * one.compare('decade lesser', two) == false
     * ```
     *
     * @method compare
     * @param {String} [comparison='time'] A comparison scope. Valid values are:
     *
     * - `date`
     * - `date greater`
     * - `date lesser`
     * - `date greater equal`
     * - `date lesser equal`
     * - `month`
     * - `month greater`
     * - `month lesser`
     * - `month greater equal`
     * - `month lesser equal`
     * - `year`
     * - `year greater`
     * - `year lesser`
     * - `year greater equal`
     * - `year lesser equal`
     * - `decade`
     * - `decade greater`
     * - `decade lesser`
     * - `decade greater equal`
     * - `decade lesser equal`
     *
     * @param {Array|String|Number|Date|shadow.Date} date The value of the date to compare against.
     * @return {Boolean}
     */
    compare: function(comparison, date) {
        if (arguments.length < 2) {
            date = comparison;
            comparison = "";
        }
        comparison = comparison || "time";
        if (!this.value || !date) {
            return false;
        }
        if (!shadow.Date.isClassOf(date)) {
            date = shadow.Date.create(date);
        }
        var one = this;
        var two = date;
        if (comparison.match(/^decade ?/)) {
            one = one.decade.start;
            two = two.decade.start;
        } else if (comparison.match(/^year ?/)) {
            one = one.year;
            two = two.year;
        } else if (comparison.match(/^month ?/)) {
            one = new Date(one.year, one.month, 1).getTime();
            two = new Date(two.year, two.month, 1).getTime();
        } else if (comparison.match(/^date ?/)) {
            one = new Date(one.year, one.month, one.date).getTime();
            two = new Date(two.year, two.month, two.date).getTime();
        } else {
            one = one.time;
            two = two.time;
        }
        if (comparison.match(/ ?greater equal$/)) {
            return one >= two;
        }
        if (comparison.match(/ ?lesser equal$/)) {
            return one <= two;
        }
        if (comparison.match(/ ?greater$/)) {
            return one > two;
        }
        if (comparison.match(/ ?lesser$/)) {
            return one < two;
        }
        return one === two;
    },
    /**
     * Compare a date with a range to see if it falls within the bounds
     * of the range in various different comparison scopes.
     *
     * @example
     *
     * Given the following date and range:
     *
     * ```javascript
     * var date = shadow.Date.create([2014, 3, 20])
     * var range = [new Date(2014, 4, 27), [2015, 2, 4]]
     * ```
     *
     * ...we can compare them in various ways (all the following conditions resolve to `true`):
     *
     * ```javascript
     * date.compareRange(range) == false
     * date.compareRange('month', range) == false
     * date.compareRange('year', range) == true
     * date.compareRange('decade', range) == true
     * ```
     *
     * @method compareRange
     * @param {String} [comparison='date'] A comparison scope. Valid values are:
     *
     * - `date`
     * - `month`
     * - `year`
     * - `decade`
     *
     * @param {Array} range The range to compare against.
     * @return {Boolean}
     */
    compareRange: function(comparison, range) {
        if (arguments.length < 2) {
            range = comparison;
            comparison = "";
        }
        var shadowDate = this;
        if (!range.length || !shadowDate.value) {
            return false;
        }
        comparison = comparison || "date";
        if (range.length === 1) {
            return shadowDate.compare(comparison, range[0]);
        }
        if (range.length > 2) {
            throw new Error("A range cannot have more than 2 dates.");
        }
        var lowerBound = range[0];
        var upperBound = range[1];
        return shadowDate.compare(comparison + " greater equal", lowerBound) && shadowDate.compare(comparison + " lesser equal", upperBound);
    },
    /**
     * Get the date’s time value.
     *
     * @example
     *
     * ```javascript
     * shadow.Date.create([2013, 3, 20]).valueOf()
     * // returns 1366430400000
     * ```
     *
     * This allows for easy comparison of dates.
     *
     * ```javascript
     * shadow.Date.create([2013, 3, 20]) > shadow.Date.create([2014, 8, 14])
     * // returns false
     *
     * shadow.Date.create([2013, 3, 20]) < shadow.Date.create([2014, 8, 14])
     * // returns true
     * ```
     *
     * @method valueOf
     * @return {Number} The time of the date.
     */
    valueOf: function() {
        return this.time;
    },
    /**
     * Simplify stringification of the shadow date.
     *
     * ```javascript
     * var date = shadow.Date.create([2013, 3, 20])
     * JSON.stringify(date)
     * // returns "[2013,3,20]"
     * ```
     *
     * @method toJSON
     * @return {Array} The value of the date.
     */
    toJSON: function() {
        return this.value;
    }
});

/**
 * Convert a date representation into a date.
 */
function toDate(val, setToTheFirst) {
    if (Array.isArray(val)) {
        val = new Date(val[0], val[1], val[2]);
    }
    if (!_.isTypeOf(val, "date")) {
        val = new Date(val);
    }
    if (setToTheFirst) {
        val.setDate(1);
    }
    val.setHours(0, 0, 0, 0);
    return val;
}

/**
 * Get the decade a year belongs to.
 */
function getDecade(year) {
    var offset = year % 10;
    year -= offset;
    return Object.freeze({
        start: year,
        end: year + (10 - 1),
        toString: function() {
            return this.start + " - " + this.end;
        }
    });
}

/**
 * Construct a shadow element object.
 *
 * @static
 * @class shadow.Element
 * @extends shadow.Object
 */
shadow.Object.extend({
    name: "Element",
    /**
     * The source element to bind the shadow data to.
     *
     * If it is a string, the value will be used as a jQuery selector.
     *
     * @example
     *
     * ```javascript
     * var $target = $('#target')
     * var shadowEl = shadow.Element.create({
     *     $el: $target
     * })
     * shadowEl.$el[0] === $target[0] // returns true
     * ```
     *
     * @required
     * @property $el
     * @type jQuery|HTMLElement|String
     * @default null
     */
    $el: null,
    /**
     * The host element that contains the shadow element and content within.
     *
     * If it is a string, the value will be used as a jQuery selector.
     *
     * @example
     *
     * With a source element that can contain DOM nodes, the host remains the same:
     *
     * ```javascript
     * var $target = $('<div id="target"></div>')
     * var shadowEl = shadow.Element.create({
     *     $el: $target
     * })
     * shadowEl.$el[0] === shadowEl.$host[0] // returns true
     * ```
     *
     * For a source element that cannot contain DOM nodes, the host is generated
     * (unless if specified):
     *
     * ```javascript
     * var $target = $('<input id="target">')
     * var shadowEl = shadow.Element.create({
     *     $el: $target
     * })
     * shadowEl.$el[0] === shadowEl.$host[0] // returns false
     * ```
     *
     * @property $host
     * @type jQuery|HTMLElement|String
     * @default null
     */
    $host: null,
    // $root: null,
    // root: null,
    /**
     * A unique ID for the element; constructed when the element is created.
     *
     * @readOnly
     * @property id
     * @type String
     * @default null
     */
    id: null,
    /**
     * A hash mapping of an element’s attributes.
     *
     * {{#block-note}}
     * Each attribute is wrapped with a getter/setter when the object
     * is created. This allows the attributes to be observed using the
     * {{#cross-link to="shadow.Element#on(events-selector-data-handler)"}}
     * `on`{{/cross-link}} method.
     * {{/block-note}}
     *
     * @example
     *
     * The `attrs` object gets populated with any `data-ui-*` attributes
     * on the source element as well as the shadow object’s own `attrs`.
     *
     * With the following markup:
     *
     * ```html
     * <div data-ui="attrs-component"
     *      data-ui-prop="false"
     *      data-ui-another-prop="[1,3,4]">
     * </div>
     * ```
     *
     * ...and the following scripts:
     *
     * ```javascript
     * var AttrsComponent = shadow.Element.extend({
     *     name: 'AttrsComponent',
     *     attrs: {
     *         prop: null,
     *         anotherProp: null,
     *         aThirdProp: 'some value'
     *     }
     * })
     * ```
     *
     * The resulting shadow object looks like this:
     *
     * ```javascript
     * {
     *     name: 'attrsComponent',
     *     attrs: {
     *         prop: false,
     *         anotherProp: [1,3,4],
     *         aThirdProp: 'some value'
     *     }
     * }
     * ```
     *
     * @attribute attrs
     * @type Hash
     * @default null
     */
    attrs: null,
    /**
     * An hash mapping of an element’s dictionary to be used in templating.
     *
     * @property dict
     * @type Hash
     * @default null
     */
    dict: null,
    /**
     * An hash mapping of an element’s class names to be used in templating.
     *
     * @property classNames
     * @type Hash
     * @default null
     */
    classNames: null,
    /**
     * A prefix to use on all the class names of an element.
     *
     * @example
     *
     * When creating an element with a prefix:
     *
     * ```javascript
     * var shadowEl = shadow.Element.create({
     *     $el: $('<div>'),
     *     classNames: {
     *         root: ' --root',
     *         box: 'box',
     *         button: 'button'
     *     },
     *     classNamesPrefix: 'my-prefix'
     * })
     * ```
     *
     * ...the `shadowEl.classNames` hash becomes:
     *
     * ```javascript
     * {
     *     root: 'my-prefix my-prefix--root',
     *     box: 'my-prefix__box',
     *     button: 'my-prefix__button'
     * }
     * ```
     *
     * @property classNamesPrefix
     * @type String
     * @default null
     */
    classNamesPrefix: null,
    /**
     * The contents to put within the shadow element during templating.
     *
     * This default to using anything within the source element as the `content`.
     *
     * @property content
     * @type Node|DocumentFragment
     * @default null
     */
    content: null,
    /**
     * Set up any element listeners, configurations, attributes, etc. before
     * they all are frozen and getters/setters are bound to the attributes.
     *
     * For an instance-specific setup, safely override the method:
     *
     * ```javascript
     * var shaowEl = shadow.Element.create({
     *     setup: function() {
     *         this._super()
     *         // carry on with any setup here
     *     }
     * })
     * ```
     *
     * @protected
     * @method setup
     */
    setup: null,
    /**
     * Create a template for the shadow element.
     *
     * If it’s a function, the return value must be one of the other valid types.
     *
     * @property template
     * @type Function|String|Node|DocumentFragment|jQuery
     * @default null
     */
    template: null,
    /**
     * Create an instance of a shadow element.
     *
     * @static
     * @method create
     * @param {Object} options Options for the element’s prototype.
     * @param {jQuery|HTMLElement|String} options.$el
     *        The source element of the shadow element. If it is a string,
     *        the value will be used as a jQuery selector.
     * @param [options.(...)] Any other attributes, properties, or methods of
     *                        the element can be passed to be overwritten.
     * @return {shadow.Element} An instance of the shadow element.
     */
    create: function(options) {
        // Make sure the $el is a jQuery DOM element.
        var $element = options.$el = options.$el instanceof jQuery ? options.$el : $(options.$el);
        if (!$element.length) {
            throw new ReferenceError("No `$el` element found for “" + this.name + "”.");
        }
        // Make sure the element hasn’t already been bound.
        if ($element.data("shadow.isBound")) {
            return $element.data("shadow.ui");
        }
        // Now set it as having been bound.
        $element.data("shadow.isBound", true);
        // Get and merge the attributes from the source element.
        options.attrs = $.extend({}, this.attrs, options.attrs, getShadowAttributes($element));
        // Make sure we have a dict hash.
        options.dict = $.extend({}, this.dict, options.dict);
        // Make sure we have a class names hash.
        options.classNames = $.extend({}, this.classNames, options.classNames);
        // Now we instantiate the shadow object.
        var element = this._super(options);
        // Keep a reference to the shadow.
        $element.data("shadow.ui", element);
        // Create an ID.
        _.define(element, "id", element.name + Math.abs(~~(1 + Math.random() * new Date() * 1e4)));
        // Set the ui name if needed.
        if (element.$el.attr("data-ui") != element.name) {
            element.$el.attr("data-ui", _.caseDash(element.name));
        }
        // Set the content using the element’s initial content.
        var contents = element.$el.contents().toArray();
        var frag = document.createDocumentFragment();
        contents.forEach(function(content) {
            frag.appendChild(content);
        });
        _.define(element, "content", frag);
        // Prefix and seal the class names.
        _.define(element, "classNames", prefixifyClassNames(element.classNames, element.classNamesPrefix));
        Object.seal(element.classNames);
        // Setup the starting attributes before everything gets sealed.
        if (element.setup) {
            element.setup();
        }
        // Freeze any changes to dict terms.
        Object.freeze(element.dict);
        // Copy attributes to the source element and
        // convert them into getters & setters.
        copyShadowAttributes(element.$el, $element[0].attributes, element.attrs);
        // Now seal the attributes.
        Object.seal(element.attrs);
        // Attach the relevant shadow element nodes.
        attachShadowNodes(element);
        // Build the template content.
        buildTemplate(element);
        // Define the relationship between the element and the host.
        defineHostOwnership($element[0], element.$host && element.$host[0], $element[0].id || element.id);
        // Return the new element object.
        return element;
    },
    //create
    /**
     * After extending the shadow element class, build all the occurrences
     * of the element in the DOM.
     *
     * @static
     * @method extend
     * @param {Object} options Options to extend the element’s prototype.
     * @return {shadow.Object} An extension of the shadow element class.
     */
    extend: function() {
        var ElementInstance = this._super.apply(this, arguments);
        shadow.buildAll(_.caseDash(ElementInstance.name));
        return ElementInstance;
    },
    /**
     * Bind events to fire as the user interacts with the shadow element.
     *
     * This method is basically a wrapper for jQuery’s `$.fn.on` method
     * and uses the source element (`$el`) as the target.
     *
     * Check out the [method’s documentation here](http://api.jquery.com/on/#on-events-selector-data).
     *
     * @method on
     * @param {String|Object} events Unlike with jQuery, each event’s namespace is **required**.
     * @param {String} [selector]
     * @param {Object} [data]
     * @param {Function} handler
     */
    on: function() {
        var element = this;
        if (element.isClass()) {
            throw new TypeError("To bind an event callback, " + "the element must first be constructed.");
        }
        $.fn.on.apply(element.$el, arguments);
    },
    /**
     * Unbind events from firing during the element’s lifecycle.
     *
     * This method is basically a wrapper for jQuery’s `$.fn.off` method
     * and uses the source element (`$el`) as the target.
     *
     * Check out the [documentation here](http://api.jquery.com/on/#on-events-selector-data).
     *
     * @method off
     * @param {String|Object} events Unlike with jQuery, each event’s namespace is **required**.
     * @param {String} [selector]
     * @param {Function} [handler]
     */
    off: function() {
        var element = this;
        if (element.isClass()) {
            throw new TypeError("To unbind an event callback, " + "the element must first be constructed.");
        }
        $.fn.off.apply(element.$el, arguments);
    },
    /**
     * Get the value of an attribute of the shadow element.
     *
     * ```javascript
     * var element = shadow.Element.create({
     *     //...
     *     attrs: {
     *         myAttr: true,
     *         myOtherAttr: { niceness: 10 }
     *     }
     * })
     * ```
     *
     * We can use the `get` method:
     *
     * ```javascript
     * element.get('myAttr')
     * // returns true
     *
     * element.get('myOtherAttr')
     * // returns { niceness: 10 }
     * ```
     *
     * Or, we can directly access the `attrs` object:
     *
     * ```javascript
     * element.attrs.myAttr
     * // returns true
     *
     * element.attrs.myOtherAttr
     * // returns { niceness: 10 }
     * ```
     *
     * @method get
     * @param {String} name The name of the attribute to get.
     * @return {String|Boolean|Number|Array|Hash} The value of the attribute.
     */
    get: function(name) {
        return this.attrs[name];
    },
    /**
     * Set the value of an attribute of the shadow element.
     *
     * @method set
     * @param {String} name The name of the attribute to set.
     * @param {String|Boolean|Number|Array|Hash} value The value of the attribute to set.
     */
    set: function(name, value) {
        var element = this;
        if (!(name in element.attrs)) return;
        element.attrs[name] = value;
    },
    /**
     * Add a unit to an attribute of the shadow element.
     *
     * The attribute **must** be an array containing the same types of units.
     *
     * ```js
     * var element = shadow.Element.create({
     *     //...
     *     attrs: {
     *         myCollection: [{ value: 6 }, { value: 14 }, { value: 19 }]
     *     }
     * })
     * ```
     *
     * To add a value, we’d do something like this:
     *
     * ```js
     * element.get('myCollection')
     * // returns [{ value: 6 }, { value: 14 }, { value: 19 }]
     *
     * element.add('myCollection', { value: 24 }, function(unit, loopedUnit) {
     *     return unit.value === loopedUnit.value
     * })
     *
     * element.get('myCollection')
     * // returns [{ value: 6 }, { value: 14 }, { value: 19 }, { value: 24 }]
     * ```
     *
     * @method add
     * @param {String} name The name of the attribute to add to.
     * @param {String|Boolean|Number|Array|Hash} unit The unit of the value to add.
     * @param {Function} [comparator] A function to use to compare the units to avoid duplicates.
     */
    add: function(name, unit, comparator) {
        var element = this;
        var value = element.attrs[name];
        if (_.isWithin(value, unit, comparator)) {
            return;
        }
        var insertAt = value.length;
        value.splice(insertAt, 0, unit);
        var eventAdd = $.Event("add:" + name, {
            value: value,
            unit: unit,
            name: name
        });
        element.$el.trigger(eventAdd);
    },
    /**
     * Remove a unit from an attribute of the shadow element.
     *
     * The attribute **must** be an array containing the same types of units.
     *
     * @method remove
     * @param {String} name The name of the attribute to remove from.
     * @param {String|Boolean|Number|Array|Hash} unit The unit of the value to remove.
     * @param {Function} [comparator] A function to use to find the unit to remove.
     */
    remove: function(name, unit, comparator) {
        var element = this;
        var value = element.attrs[name];
        var index = _.indexIn(value, unit, comparator);
        if (index < 0) {
            return;
        }
        value.splice(index, 1);
        var eventRemove = $.Event("remove:" + name, {
            value: value,
            unit: unit,
            name: name
        });
        element.$el.trigger(eventRemove);
    }
});

//shadow.Object.extend
/**
 * Get the shadow ui attributes from an element.
 */
function getShadowAttributes($element) {
    var elementNode = $element[0];
    var attributes = {};
    [].slice.call(elementNode.attributes).forEach(function(attr) {
        var attrName = attr.name;
        if (attrName.match(/^data-ui-/)) {
            var attrValue = $element.data(attrName.replace(/^data-/, ""));
            attrName = attrName.replace(/^data-ui-/, "");
            attrName = _.caseCamel(attrName);
            attributes[attrName] = attrValue;
        }
    });
    return attributes;
}

/**
 * Attach nodes relevant to the shadow element.
 */
function attachShadowNodes(element) {
    var nodeName = element.$el[0].nodeName;
    // Setup the source as the host if none is given.
    if (!element.$host && !nodeName.match(/^INPUT$/)) {
        _.define(element, "$host", element.$el);
    }
    if (!element.$host) {
        _.define(element, "$host", $("<div>"));
        element.$el.after(element.$host);
    }
}

/**
 * Build out the template contents.
 */
function buildTemplate(element) {
    var template = element.template;
    // Insert the template if there is one.
    if (template) {
        if (typeof template == "function") {
            template = element.template();
        }
        element.$host.html(template);
    }
}

/**
 * Define the relationship between the element and the host.
 */
function defineHostOwnership(elementNode, hostNode, id) {
    if (hostNode && hostNode !== elementNode) {
        if (!hostNode.id) {
            hostNode.id = "host_" + id;
        }
        _.aria(elementNode, "owns", hostNode.id);
    }
}

/**
 * Copy shadow ui attributes to the source element.
 */
function copyShadowAttributes($element, elementAttrs, shadowAttrs) {
    for (var prop in shadowAttrs) {
        var propAttr = "data-ui-" + _.caseDash(prop);
        var propValue = shadowAttrs[prop];
        if (propValue != null && !elementAttrs.getNamedItem(propAttr)) {
            if (typeof propValue == "object") {
                propValue = JSON.stringify(propValue);
            }
            $element.attr(propAttr, propValue);
        }
        decorateShadowAttribute($element, shadowAttrs, prop);
    }
}

/**
 * Decorate a shadow attribute with a getter and setter.
 */
function decorateShadowAttribute($element, shadowAttrs, prop) {
    var currValue = shadowAttrs[prop];
    Object.defineProperty(shadowAttrs, prop, {
        get: function() {
            return currValue;
        },
        set: function(value) {
            var previousValue = currValue;
            var eventAssign = $.Event("assign:" + prop, {
                value: value,
                name: prop
            });
            $element.trigger(eventAssign);
            var isPrevented = eventAssign.isDefaultPrevented();
            if (!isPrevented) {
                currValue = eventAssign.value;
                updateShadowAttribute($element, prop, currValue);
            }
            var eventSet = $.Event("set:" + prop, {
                value: isPrevented ? value : currValue,
                previousValue: previousValue,
                name: prop
            });
            $element.trigger(eventSet);
        }
    });
}

/**
 * Update a shadow attribute on an element.
 */
function updateShadowAttribute($element, prop, value) {
    prop = "data-ui-" + _.caseDash(prop);
    if (value == null) {
        $element.removeAttr(prop);
    } else {
        $element.attr(prop, typeof value == "object" ? JSON.stringify(value) : value);
    }
}

/**
 * Prefix each class name in a hash of class names with a prefix.
 */
function prefixifyClassNames(classNames, prefix) {
    if (!prefix && !classNames) {
        return {};
    }
    prefix = prefix || "";
    if (!classNames) {
        throw new ReferenceError("No `classNames` were given to prefix.");
    }
    var prefixClassName = function(className) {
        var classNameDelimiter = !prefix || !className || className.match(/^-/) ? "" : "__";
        return prefix + classNameDelimiter + className;
    };
    for (var name in classNames) {
        var classList = classNames[name];
        if (typeof classList == "string") {
            classNames[name] = classList.split(" ").map(prefixClassName).join(" ");
        }
    }
    return classNames;
}

/**
 * Construct a shadow data element object.
 *
 * @static
 * @class shadow.DataElement
 * @extends shadow.Element
 * @since 0.6.0
 */
shadow.Element.extend({
    name: "DataElement",
    /**
     * An optional `input` element that holds the `attrs.value` as it's `value`
     *
     * If it is a string, the value will be used as a jQuery selector.
     *
     * @property $input
     * @type jQuery|HTMLInputElement|HTMLTextAreaElement|String
     * @default null
     */
    $input: null,
    attrs: {
        /**
         * The raw active “selection” of the data element's `attrs.value`.
         *
         * @attribute attrs.select
         * @type Array|Date|String|Number
         * @default null
         */
        select: null,
        /**
         * The stringified “selection” of the data element's `attrs.select`.
         *
         * @writeOnce
         * @attribute attrs.value
         * @type String
         * @default null
         */
        value: null,
        /**
         * A flag to automatically generate a hidden `input` if one is missing.
         *
         * @attribute attrs.hiddenInput
         * @type Boolean
         * @default null
         */
        hiddenInput: null,
        /**
         * A flag to allow multiple selections in `attrs.select`.
         *
         * @attribute attrs.allowMultiple
         * @type Boolean
         * @default null
         */
        allowMultiple: null,
        /**
         * A flag to allow range selections in `attrs.select`.
         *
         * @attribute attrs.allowRange
         * @type Boolean
         * @default null
         */
        allowRange: null,
        /**
         * Formatting to use when stringifying `attrs.select` into `attrs.value`.
         *
         * This has to be used in conjunction with the data element's
         * {{#cross-link to="shadow.DataElement#formats"}}`formats`{{/cross-link}} hash.
         *
         * @attribute attrs.format
         * @type String
         * @default null
         */
        format: null,
        /**
         * Formatting to use when stringifying `attrs.select` into `attrs.value`
         * with `attrs.allowMultiple` set to `true`.
         *
         * If `attrs.allowMultiple` is `false`, this defaults to `null`.
         *
         * @attribute attrs.formatMultiple
         * @type String
         * @default '{, |, }'
         */
        formatMultiple: null,
        /**
         * Formatting to use when stringifying `attrs.select` into `attrs.value`
         * with `attrs.allowRange` set to `true`.
         *
         * If `attrs.allowRange` is `false`, this defaults to `null`.
         *
         * @attribute attrs.formatRange
         * @type String
         * @default '{ - }'
         */
        formatRange: null
    },
    /**
     * A formatting is used to stringify and parse values. It is used in conjunction with the
     * {{#cross-link to="shadow.DataElement#attrs.format"}}`attrs.format`{{/cross-link}} attribute.
     *
     * @property formats
     * @type Hash
     * @default null
     */
    formats: null,
    classNames: {
        /**
         * @property classNames.input
         * @type {String}
         * @default 'input'
         */
        input: "input"
    },
    /**
     * @method setup
     */
    setup: function() {
        var dataElement = this;
        var attrs = dataElement.attrs;
        // If a format is expected, there must be formats available for parsing/formatting.
        if (attrs.format && !dataElement.formats) {
            throw new TypeError("The `formats` hash map is required.");
        }
        if (attrs.allowMultiple && !attrs.formatMultiple) {
            attrs.formatMultiple = "{, |, }";
        }
        if (attrs.allowRange && !attrs.formatRange) {
            attrs.formatRange = "{ - }";
        }
        // Bind updating the formats when a range or multiple values are allowed.
        dataElement.on("assign:allowMultiple." + dataElement.id, function(event) {
            if (event.value) {
                if (!attrs.formatMultiple) {
                    attrs.formatMultiple = "{, |, }";
                }
                if (attrs.select && !attrs.allowRange) {
                    attrs.select = [ attrs.select ];
                }
            } else {
                if (attrs.select && !attrs.allowRange) {
                    attrs.select = attrs.select[attrs.select.length - 1];
                }
            }
        });
        dataElement.on("assign:allowRange." + dataElement.id, function(event) {
            if (event.value) {
                if (!attrs.formatRange) {
                    attrs.formatRange = "{ - }";
                }
                if (attrs.select && !attrs.allowMultiple) {
                    attrs.select = [ attrs.select ];
                }
            } else {
                if (attrs.select && !attrs.allowMultiple) {
                    attrs.select = attrs.select[attrs.select.length - 1];
                }
            }
        });
        // Bind updating the value when select is set.
        dataElement.on("set:select." + dataElement.id, function(event) {
            var value = event.value;
            attrs.value = value ? dataElement.format(value) : "";
        });
        // Bind updating the value when the format is updated.
        dataElement.on("set:format." + dataElement.id + " set:formatRange." + dataElement.id + " set:formatMultiple." + dataElement.id, function() {
            if (attrs.select) {
                attrs.value = dataElement.format(attrs.select);
            }
        });
    },
    /**
     * Create an instance of a data element object.
     *
     * @static
     * @method create
     * @param {Object} options Options for the data element’s prototype.
     * @return {shadow.DataElement} An instance of the shadow element.
     */
    create: function(options) {
        // Create the shadow object.
        var dataElement = this._super(options);
        var attrs = dataElement.attrs;
        // When there are formats, make sure it is format-able.
        if (dataElement.formats) {
            if (!attrs.format) {
                throw new TypeError("The `format` attribute is required.");
            }
            Object.seal(dataElement.formats);
        }
        // Set the data element input.
        if (!dataElement.$input) {
            if (dataElement.$el[0].nodeName == "INPUT") {
                shadow._.define(dataElement, "$input", dataElement.$el);
            } else if (attrs.hiddenInput) {
                shadow._.define(dataElement, "$input", $("<input type=hidden>"));
                dataElement.$el.after(dataElement.$input);
            }
        }
        if (dataElement.$input) {
            // Make sure we have a valid input element.
            if (dataElement.$input[0].nodeName != "INPUT") {
                throw new TypeError("To create a shadow input, " + "the `$el` must be an input element.");
            }
            dataElement.$input.addClass(dataElement.classNames.input);
            // Set the starting element value.
            if (attrs.value) {
                dataElement.$input.val(attrs.value);
            }
            // Set the starting select.
            var value = dataElement.$input.val();
            if (!attrs.value && value) {
                attrs.select = dataElement.parse(value);
            }
            // Bind updating the element’s value when value is set.
            dataElement.on("set:value." + dataElement.id, function(event) {
                dataElement.$input[0].value = event.value;
            });
        }
        // Set the starting select.
        if (attrs.value) {
            var selection = dataElement.parse(attrs.value);
            if (selection) {
                attrs.select = selection;
            }
        } else if (attrs.select) {
            attrs.value = dataElement.format(attrs.select);
        }
        // Return the new data element object.
        return dataElement;
    },
    //create
    /**
     * Convert a value into a formatted string.
     *
     * @todo Implement the `options` argument.
     * @method format
     * @param {String|Boolean|Number|Array|Hash} value The value to format.
     * @param {Hash} [options] Options to customize the formatting.
     * @return {String} The formatted string.
     */
    format: function(value, options) {
        var dataElement = this;
        var formatsHash = dataElement.formats;
        var attrs = dataElement.attrs;
        var formatValueUnit = function(valueUnit) {
            if (formatsHash) {
                return toFormattingArray(attrs.format, formatsHash).map(function(chunk) {
                    return chunk.f ? formatsHash[chunk.f].call(dataElement, valueUnit) : chunk;
                }).join("");
            }
            return typeof valueUnit == "object" ? JSON.stringify(valueUnit) : "" + valueUnit;
        };
        // If multiple values are allowed, setup the combo formatter.
        if (attrs.allowMultiple === true) {
            return formatMultipleUnits(formatValueUnit, attrs.formatMultiple, attrs.formatRange, value);
        }
        // If range values are allowed, setup the range formatter.
        if (attrs.allowRange === true) {
            return formatRangeUnits(formatValueUnit, attrs.formatRange, value);
        }
        // Otherwise just format it as a single unit.
        return formatValueUnit(value);
    },
    //format
    // /**
    //  * Convert a parsed unit hash into a formatted string.
    //  */
    // formatUnit: function(unitHash) {
    //     return unitHash
    // },
    /**
     * Convert a formatted string into a parsed value.
     *
     * @method parse
     * @param {String} string The string value to parse.
     * @return {Hash} The parsed formatting-value hash.
     */
    parse: function(string) {
        if (typeof string != "string") {
            throw new TypeError("The parser expects a string.");
        }
        if (!string) {
            return null;
        }
        var dataElement = this;
        var attrs = dataElement.attrs;
        var parseValueUnit = function(valueUnit) {
            // If there are formats, decorate the unit as needed.
            if (dataElement.formats) {
                // Create a parsed unit hash from the string.
                var parsedHash = dataElement.parseUnit(valueUnit);
                // Convert the unit hash into a value unit.
                valueUnit = /*dataElement.formatUnit(*/ parsedHash;
            }
            // Try to evaluate it as JSON.
            try {
                valueUnit = JSON.parse(valueUnit);
            } catch (e) {}
            return valueUnit;
        };
        // If multiple values are allowed, setup the combo parser.
        if (attrs.allowMultiple === true) {
            return parseMultipleUnits(parseValueUnit, attrs.formatMultiple, attrs.formatRange, string);
        }
        // If range values are allowed, setup the range parser.
        if (attrs.allowRange === true) {
            return parseRangeUnits(parseValueUnit, attrs.formatRange, string);
        }
        // Otherwise just parse it as a single unit.
        return parseValueUnit(string);
    },
    //parse
    /**
     * Convert a formatted unit string into a parsed unit hash.
     *
     * @private
     * @method parseUnit
     * @param {String} stringUnit The string value’s unit to parse.
     * @return {Hash} The parsed formatting-unit hash.
     */
    parseUnit: function(stringUnit) {
        var dataElement = this;
        var formatsHash = dataElement.formats;
        var parsedHash = {};
        // If there are formats, parse the unit.
        if (formatsHash) {
            toFormattingArray(dataElement.attrs.format, formatsHash).forEach(function(chunk) {
                if (chunk.f) {
                    var chunkValue = formatsHash[chunk.f].call(dataElement, stringUnit, true);
                    if (!stringUnit.match(new RegExp("^" + chunkValue))) {
                        throw new SyntaxError("The value parsed by the " + "`" + chunk.f + "` formatting rule did not " + "match the value being parsed.\n" + "Value being parsed: “" + stringUnit + "”.\n" + "Value parsed by rule: “" + chunkValue + "”.");
                    }
                    stringUnit = stringUnit.slice(chunkValue.length);
                    parsedHash[chunk.f] = chunkValue;
                } else {
                    var regex = new RegExp("^" + chunk);
                    if (!stringUnit.match(regex)) {
                        throw new SyntaxError("The formatting unit “" + chunk + "” " + "did not match in the string “" + stringUnit + "”.");
                    }
                    stringUnit = stringUnit.replace(regex, "");
                }
            });
        }
        return parsedHash;
    },
    //parseUnit
    /**
     * Get a data element’s attribute value.
     *
     * @method get
     * @param {String} name The name of the attribute to get.
     * @param {Hash} [options] Options to customize the return value.
     * @param {Boolean} options.format A truthy value will return a formatted value.
     */
    get: function(name, options) {
        var dataElement = this;
        var value = dataElement._super(name);
        options = options || {};
        if (options.format) {
            value = dataElement.format(value, options);
        }
        return value;
    }
});

//shadow('data-element')
/**
 * Format multiple units of value.
 */
function formatMultipleUnits(formatter, formatMultiple, formatRange, value) {
    if (!Array.isArray(value)) {
        throw new TypeError("A data element with multiple values " + "expects it’s attribute value to be a collection.");
    }
    var matchPlaceholders = formatMultiple.match(/.*(\{).*?(\|).*?(\}).*/);
    if (!matchPlaceholders || matchPlaceholders.length < 3) {
        throw new SyntaxError("The `formatMultiple` option is invalid.");
    }
    var matchCombo = formatMultiple.match(/(.*)\{(.*?)\|(.*?)\}(.*)/);
    var beforeFirst = matchCombo[1];
    var beforeMiddle = matchCombo[2];
    var beforeLast = matchCombo[3];
    var afterLast = matchCombo[4];
    value = value.map(function(unit, index) {
        var before = index === 0 ? beforeFirst : index === value.length - 1 ? beforeLast : beforeMiddle;
        var after = index === value.length - 1 ? afterLast : "";
        if (formatRange && Array.isArray(unit)) {
            unit = formatRangeUnits(formatter, formatRange, unit);
        } else {
            unit = formatter(unit);
        }
        return before + unit + after;
    });
    return value.join("");
}

/**
 * Format a range’s units.
 */
function formatRangeUnits(formatter, formatRange, rangeUnit) {
    var matchPlaceholders = formatRange.match(/.*(\{).*?(\}).*/);
    if (!matchPlaceholders || matchPlaceholders.length < 2) {
        throw new SyntaxError("The `formatRange` option is invalid.");
    }
    var matchRange = formatRange.match(/(.*)\{(.*?)\}(.*)/);
    var beforeLower = matchRange[1];
    var beforeUpper = matchRange[2];
    var afterUpper = matchRange[3];
    rangeUnit = rangeUnit.map(function(subItem, subIndex) {
        var subBefore = subIndex === 0 ? beforeLower : beforeUpper;
        var subAfter = subIndex === rangeUnit.length - 1 ? afterUpper : "";
        return subBefore + formatter(subItem) + subAfter;
    });
    return rangeUnit.join("");
}

/**
 * Convert a formatting string into a formatting array.
 */
function toFormattingArray(formattingString, formatsHash) {
    // Define a format’s matching regular expression.
    var formatsRegex = new RegExp(// Match any [escaped] characters.
    "(\\[[^\\[]*\\])" + // Match any formatting characters.
    "|(" + Object.keys(formatsHash).sort(function(a, b) {
        return b > a ? 1 : -1;
    }).join("|") + ")" + // Match all other characters.
    "|(.)", "g");
    return (formattingString || "").split(formatsRegex).reduce(function(array, chunk) {
        if (chunk) {
            if (chunk in formatsHash) {
                array.push({
                    f: chunk
                });
            } else if (chunk.match(/^\[.*]$/)) {
                array.push(chunk.replace(/^\[(.*)]$/, "$1"));
            } else {
                var lastItem = array[array.length - 1];
                if (typeof lastItem == "string") {
                    array[array.length - 1] = lastItem + chunk;
                } else {
                    array.push(chunk);
                }
            }
        }
        return array;
    }, []);
}

/**
 * Parse multiple units of value.
 */
function parseMultipleUnits(parser, formatMultiple, formatRange, value) {
    var values = [];
    // If there’s no value, stop right here.
    if (!value) {
        return values;
    }
    var addToCollection = function(string, stringBefore, stringAfter) {
        var originalString = string;
        string = sliceUptoUnit(string, stringBefore);
        var unit = sliceUnit(string, stringAfter);
        if (unit) {
            string = string.replace(unit, "");
            if (formatRange) {
                unit = parseRangeUnits(parser, formatRange, unit);
            }
            if (typeof unit == "string") {
                unit = parser(unit);
            }
            values.push(unit);
            return string;
        }
        return originalString;
    };
    var matchCombo = formatMultiple.match(/(.*)\{(.*?)\|(.*?)\}(.*)/);
    var regStrBeforeFirst = matchCombo[1];
    var regStrBeforeMiddle = matchCombo[2];
    var regStrBeforeLast = matchCombo[3];
    var regStrAfterLast = matchCombo[4];
    var safety = 100;
    value = addToCollection(value, regStrBeforeFirst, regStrBeforeMiddle);
    while (safety && value) {
        if (!--safety) {
            throw "Fell into an infinite loop..";
        }
        var originalValue = value;
        value = addToCollection(value, regStrBeforeMiddle, regStrBeforeMiddle);
        if (value === originalValue) {
            value = addToCollection(value, regStrBeforeMiddle, regStrBeforeLast);
        }
        if (value === originalValue) {
            value = addToCollection(value, regStrBeforeLast, regStrAfterLast);
            break;
        }
    }
    value = addToCollection(value, regStrBeforeLast, regStrAfterLast);
    return values;
}

/**
 * Parse a range’s units.
 */
function parseRangeUnits(parser, format, value) {
    var range = [];
    // If there’s no value, stop right here.
    if (!value) {
        return range;
    }
    var addToCollection = function(rangeUnit) {
        var originalValueUnit = rangeUnit;
        rangeUnit = parser(rangeUnit);
        range.push(rangeUnit);
        if (typeof rangeUnit == "string") originalValueUnit = rangeUnit;
        value = value.replace(originalValueUnit, "");
    };
    var matchRange = format.match(/(.*)\{(.*?)\}(.*)/);
    var regStrBeforeStart = matchRange[1];
    var regStrBeforeEnd = matchRange[2];
    var regStrAfterEnd = matchRange[3];
    value = sliceUptoUnit(value, regStrBeforeStart);
    var valueUnit = sliceUnit(value, regStrBeforeEnd);
    // If there’s no unit value, stop right here.
    if (!valueUnit) {
        return value;
    }
    addToCollection(valueUnit);
    value = sliceUptoUnit(value, regStrBeforeEnd);
    valueUnit = sliceUnit(value, regStrAfterEnd);
    if (valueUnit) {
        addToCollection(valueUnit);
    }
    return range;
}

/**
 * Escape any regular expression special characters.
 */
function escapeRegString(string) {
    return string.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * Slice a string up to a string marked as a starting point.
 */
function sliceUptoUnit(string, beforeString) {
    var valueMatch = string.match(new RegExp("^" + escapeRegString(beforeString)));
    if (valueMatch) {
        string = string.replace(valueMatch[0], "");
    }
    return string;
}

/**
 * Slice a string up to a string marked as the ending point.
 */
function sliceUnit(string, afterString) {
    var valueMatch = string.match(new RegExp("(.*?)" + (escapeRegString(afterString) || "$")));
    return valueMatch && valueMatch[1];
}

return shadow
}));
