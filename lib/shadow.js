
/*!
 * Shadow UI v0.6.1-0, 2014/08/08
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
        define('shadow', [global, 'jquery'], factory)

    // ...and basic `script` includes.
    else global.shadow = factory(global, global.jQuery)

}(this, function(window, $, undefined) {

'use strict';

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

var _ = shadow._ = {
    /**
     * A no-nop.
     */
    noop: function() {},
    /**
     * Define an enumerable property on an object.
     */
    define: function(object, item, value) {
        Object.defineProperty(object, item, {
            enumerable: true,
            value: value
        });
    },
    /**
     * Convert to camel-cased text.
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
        return wordChunks.join("");
    },
    /**
     * Convert to pascal-cased text.
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
                return "-" + word.toLowerCase();
            }
            newWord = true;
            return (index ? "-" : "") + word[0].toLowerCase() + word.slice(1);
        });
        return wordChunks.join("");
    },
    /**
     * Check what the type of a thing is.
     */
    isTypeOf: function(thing, type) {
        var thingType = {}.toString.call(thing).slice(8, -1).toLowerCase();
        return type ? type === thingType : thingType;
    },
    /**
     * Define aria attributes on an element.
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
     */
    isWithin: function(collection, unit, comparator) {
        return this.indexIn(collection, unit, comparator) > -1;
    }
};

function ariaSet(element, attribute, value) {
    element.setAttribute((attribute == "role" ? "" : "aria-") + attribute, value);
}

// Check if the super method was called within a wrapped method..
var checkForSuperCall = function(prototype, property) {
    var methodString = "" + prototype[property];
    var variableNameMatch = methodString.match(/(\w+) *= *this/);
    var variableName = variableNameMatch && variableNameMatch[1] + "|" || "";
    var invoker = "(\\.(call|apply))?\\(";
    var superRegex = new RegExp("(?:" + variableName + "this)\\._super(" + invoker + ")");
    if (!methodString.match(superRegex)) {
        console.warn("Overriding the base method `" + property + "` " + "without calling `this._super()` within the method might cause " + "unexpected results. Make sure this is the behavior you desire.\n", prototype);
    }
};

// Allow inheritence of super methods. Based on:
// http://ejohn.org/blog/simple-javascript-inheritance/
var superFun = function(Base, property, fn) {
    return function superWrapper() {
        var object = this;
        object._super = Base[property];
        var ret = fn.apply(object, arguments);
        delete object._super;
        return ret;
    };
};

/**
 * The core shadow object prototype.
 */
shadow.Object = Object.create({}, {
    // A name for the object (to help with debugging).
    name: {
        enumerable: true,
        value: "Object"
    },
    // Create an instance of the shadow object.
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
    // Extend the object using prototypes. Based on:
    // http://aaditmshah.github.io/why-prototypal-inheritance-matters/#inheriting_from_multiple_prototypes
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
                throw new TypeError('An object by the name of "' + Instance.name + '" already exists.');
            }
            shadow[Instance.name] = Instance;
            return Instance;
        }
    },
    //extend
    // Check if the object is a class.
    isClass: {
        enumerable: true,
        value: function() {
            var object = this;
            var Base = Object.getPrototypeOf(object);
            return object === shadow.Object || !Base.isPrototypeOf(object);
        }
    },
    // Check if the object inherits from the class of another.
    // http://aaditmshah.github.io/why-prototypal-inheritance-matters/#fixing_the_instanceof_operator
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
    // Check if the object is an instance of another.
    // http://aaditmshah.github.io/why-prototypal-inheritance-matters/#fixing_the_instanceof_operator
    isInstanceOf: {
        enumerable: true,
        value: function(Base) {
            return this.isClassOf.call(Base, this);
        }
    },
    // Check if the object is the prototype another.
    isPrototypeOf: {
        enumerable: true,
        value: function(object) {
            var Base = this;
            var Prototype = Object.getPrototypeOf(object);
            return Base === Prototype && object.name === _.caseCamel(Prototype.name);
        }
    },
    // Cast the object into a string representation.
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

/**
 * Construct a date object.
 */
shadow.Object.extend({
    name: "Date",
    value: null,
    year: null,
    month: null,
    date: null,
    setToTheFirst: false,
    /**
     * Create a date object.
     */
    create: function(value, options) {
        if (!value) {
            return this._super(options);
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
     * Compare the date’s value in various ways.
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
     * Compare a date with a range in various ways.
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
     * Simplify comparison.
     */
    valueOf: function() {
        return this.time;
    },
    /**
     * Simplify stringification.
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

// var docEl = document.documentElement,
//     HAS_SHADOW_ROOT = docEl.webkitCreateShadowRoot || docEl.createShadowRoot
/**
 * Construct an element object.
 */
shadow.Object.extend({
    name: "Element",
    $el: null,
    $host: null,
    // $root: null,
    // root: null,
    id: null,
    attrs: null,
    dict: null,
    classNames: null,
    classNamesPrefix: null,
    content: null,
    setup: null,
    template: null,
    /**
     * Create an element object.
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
     * After extending the element, build all in the DOM.
     */
    extend: function() {
        var ElementInstance = this._super.apply(this, arguments);
        shadow.buildAll(_.caseDash(ElementInstance.name));
        return ElementInstance;
    },
    /**
     * Bind/unbind events to fire.
     */
    on: function() {
        var element = this;
        if (element.isClass()) {
            throw new TypeError("To bind an event callback, " + "the element must first be constructed.");
        }
        $.fn.on.apply(element.$el, arguments);
    },
    off: function() {
        var element = this;
        if (element.isClass()) {
            throw new TypeError("To unbind an event callback, " + "the element must first be constructed.");
        }
        $.fn.off.apply(element.$el, arguments);
    },
    /**
     * Get an attribute of the shadow element.
     */
    get: function(name) {
        return this.attrs[name];
    },
    /**
     * Set an attribute of the shadow element.
     */
    set: function(name, value) {
        var element = this;
        if (!(name in element.attrs)) return;
        element.attrs[name] = value;
    },
    /**
     * Add a unit to an attribute of the shadow element.
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
 * Construct a data element object.
 */
shadow.Element.extend({
    name: "DataElement",
    $input: null,
    attrs: {
        select: null,
        value: null,
        hiddenInput: null,
        allowMultiple: null,
        allowRange: null,
        format: null,
        formatMultiple: null,
        formatRange: null
    },
    formats: null,
    classNames: {
        input: "input"
    },
    /**
     * Setup the attrs before everything gets sealed
     * and before getters and setters are made.
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
     * Create a data element object.
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
     * Get a data element’s attribute with certain options.
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
function formatRangeUnits(formatter, format, rangeUnit) {
    var matchRange = format.match(/(.*)\{(.*?)\}(.*)/);
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
