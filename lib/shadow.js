
/*!
 * Shadow UI v0.6.0, 2014/07/05
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
    if (!_.isTypeOf(shadow[extendingName], "object") || extendingName != "Element" && !shadow.Element.is("classOf", shadow[extendingName])) {
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
    if (!(shadowName in shadow) || !shadow.Object.is("classOf", shadow[shadowName])) {
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
    }
};

function ariaSet(element, attribute, value) {
    element.setAttribute((attribute == "role" ? "" : "aria-") + attribute, value);
}

var CHECKS = {
    // Check if a shadow object inherits from the class of another.
    // http://aaditmshah.github.io/why-prototypal-inheritance-matters/#fixing_the_instanceof_operator
    classOf: function(Instance) {
        var Base = this;
        do {
            Instance = Object.getPrototypeOf(Instance);
            if (Base === Instance) {
                return true;
            }
        } while (Instance);
        return false;
    },
    // Check if a shadow object is an instance of another.
    // http://aaditmshah.github.io/why-prototypal-inheritance-matters/#fixing_the_instanceof_operator
    instanceOf: function(Base) {
        var Instance = this;
        do {
            Instance = Object.getPrototypeOf(Instance);
            if (Instance === Base) {
                return true;
            }
        } while (Instance);
        return false;
    },
    // Check if a shadow object is the prototype of another.
    prototypeOf: function(object) {
        var Base = this;
        var Prototype = Object.getPrototypeOf(object);
        return Base === Prototype && object.name === _.caseCamel(Prototype.name) && object.create === undefined && object.extend === undefined;
    },
    // Check if a shadow object has been constructed.
    constructed: function() {
        var object = this;
        var Base = Object.getPrototypeOf(object);
        return object !== shadow.Object && Base.is("prototypeOf", object);
    }
};

//CHECKS
var checkForSuperCall = function(prototype, property) {
    var methodString = "" + prototype[property];
    var variableNameMatch = methodString.match(/(\w+) *= *this/);
    var variableName = variableNameMatch && variableNameMatch[1] + "|" || "";
    var invoker = "(\\.(call|apply))?\\(";
    var superRegex = new RegExp("(?:" + variableName + "this)\\._super(" + invoker + ")");
    if (shadow.IS_DEBUGGING && !methodString.match(superRegex)) {
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
                    value: undefined
                },
                extend: {
                    value: undefined
                }
            });
            for (var item in options) {
                if (item in Base) {
                    var isBasePropertyFn = typeof Base[item] == "function";
                    if (isBasePropertyFn) {
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
            if (Base.is("constructed") && Base.is("constructed")) {
                console.debug(Base);
                throw new TypeError("Cannot extend a constructed object.");
            }
            var Instance = Object.create(Base);
            for (var property in prototype) {
                if (prototype.hasOwnProperty(property)) {
                    if (property == "_super") {
                        throw new TypeError("The `_super` property is reserved " + "to allow object method inheritance.");
                    }
                    var isBasePropertyFn = typeof Base[property] == "function";
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
    // Check if a thing is a certain value.
    is: {
        enumerable: true,
        value: function(thing, value) {
            var object = this;
            return typeof CHECKS[thing] == "function" && CHECKS[thing].call(object, value);
        }
    },
    // Cast the object into a string representation.
    toString: {
        enumerable: true,
        value: function() {
            if (shadow.IS_DEBUGGING) {
                return this.toLocaleString();
            }
            var object = this;
            var isConstructed = object.is("constructed");
            var type = isConstructed ? "object" : "class";
            var Base = isConstructed ? Object.getPrototypeOf(object) : object;
            return "{" + type + " " + Base.name + "}";
        }
    },
    toLocaleString: {
        enumerable: true,
        value: function() {
            var object = this;
            var isConstructed = object.is("constructed");
            var type = isConstructed ? "object" : "class";
            var names = [];
            if (isConstructed) {
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
            throw new TypeError("No `$el` element found for “" + this.name + "”.");
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
        if (!element.is("constructed")) {
            throw new TypeError("To bind an event callback, " + "the element must first be constructed.");
        }
        $.fn.on.apply(element.$el, arguments);
    },
    off: function() {
        var element = this;
        if (!element.is("constructed")) {
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
    set: function(name, value, options) {
        var element = this;
        if (!(name in element.attrs)) return;
        element.attrs[name] = value;
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
        if (typeof template != "string" && !(template instanceof Node) && !(template instanceof jQuery)) try {
            template = JSON.stringify(template);
        } catch (e) {}
        element.$host.empty().html(template);
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
            var eventSet = $.Event("assign:" + prop, {
                value: value,
                name: prop
            });
            $element.trigger(eventSet);
            var isPrevented = eventSet.isDefaultPrevented();
            if (!isPrevented) {
                currValue = eventSet.value;
                updateShadowAttribute($element, prop, currValue);
            }
            var eventUpdate = $.Event("set:" + prop, {
                value: isPrevented ? value : currValue,
                previousValue: previousValue,
                name: prop
            });
            $element.trigger(eventUpdate);
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
        throw new TypeError("No `classNames` were given to prefix.");
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
 * Construct a data field object.
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
        var dataField = this;
        var attrs = dataField.attrs;
        // If a format is expected, there must be formatters available.
        if (attrs.format && !dataField.formats) {
            throw new TypeError("The `formats` hash map is required.");
        }
        if (attrs.allowMultiple && !attrs.formatMultiple) {
            attrs.formatMultiple = "{, |, }";
        }
        if (attrs.allowRange && !attrs.formatRange) {
            attrs.formatRange = "{ - }";
        }
        // Set the starting select.
        if (attrs.value) {
            var selection = dataField.parse(attrs.value);
            if (selection) {
                attrs.select = selection;
            }
        } else if (attrs.select) {
            attrs.value = dataField.format(attrs.select);
        }
        // Bind updating the value when select is set.
        dataField.on("set:select." + dataField.id, function(event) {
            var value = event.value;
            attrs.value = value ? dataField.format(value) : "";
        });
    },
    /**
     * Create a data field object.
     */
    create: function(options) {
        // Create the shadow object.
        var dataField = this._super(options);
        var attrs = dataField.attrs;
        // When there are formats, make sure it is format-able.
        if (dataField.formats) {
            if (!attrs.format) {
                throw new TypeError("The `format` attribute is required.");
            }
            Object.seal(dataField.formats);
        }
        // Set the data field input.
        if (!dataField.$input) {
            if (dataField.$el[0].nodeName == "INPUT") {
                shadow._.define(dataField, "$input", dataField.$el);
            } else if (attrs.hiddenInput) {
                shadow._.define(dataField, "$input", $("<input type=hidden>"));
                dataField.$el.after(dataField.$input);
            }
        }
        if (dataField.$input) {
            // Make sure we have a valid input element.
            if (dataField.$input[0].nodeName != "INPUT") {
                throw new TypeError("To create a shadow input, " + "the `$el` must be an input element.");
            }
            dataField.$input.addClass(dataField.classNames.input);
            // Set the starting element value.
            if (attrs.value) {
                dataField.$input.val(attrs.value);
            }
            // Set the starting select.
            var value = dataField.$input.val();
            if (!attrs.value && value) {
                attrs.select = dataField.parse(value);
            }
            // Bind updating the element’s value when value is set.
            dataField.on("set:value." + dataField.id, function(event) {
                dataField.$input[0].value = event.value;
            });
        }
        // Whenever the format is updated, the value should be re-formatted.
        dataField.on("set:format." + dataField.id + " set:formatRange." + dataField.id, function() {
            if (attrs.select) {
                attrs.value = dataField.format(attrs.select);
            }
        });
        // Return the new data field object.
        return dataField;
    },
    //create
    /**
     * Convert a value into a formatted string.
     */
    format: function(value) {
        var dataField = this;
        var formatsHash = dataField.formats;
        var formatValueUnit = function(valueUnit) {
            if (formatsHash) {
                return toFormattingArray(dataField.attrs.format, formatsHash).map(function(chunk) {
                    return chunk.f ? formatsHash[chunk.f].call(dataField, valueUnit) : chunk;
                }).join("");
            }
            return typeof valueUnit == "object" ? JSON.stringify(valueUnit) : "" + valueUnit;
        };
        // If multiple values are allowed, setup the combo formatter.
        if (dataField.attrs.allowMultiple === true) {
            return formatMultipleUnits(formatValueUnit, dataField.attrs.formatMultiple, dataField.attrs.formatRange, value);
        }
        // If range values are allowed, setup the range formatter.
        if (dataField.attrs.allowRange === true) {
            return formatRangeUnits(formatValueUnit, dataField.attrs.formatRange, value);
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
        var dataField = this;
        var parseValueUnit = function(valueUnit) {
            // If there are formats, decorate the unit as needed.
            if (dataField.formats) {
                // Create a parsed unit hash from the string.
                var parsedHash = dataField.parseUnit(valueUnit);
                // Convert the unit hash into a value unit.
                valueUnit = /*dataField.formatUnit(*/ parsedHash;
            }
            // Try to evaluate it as JSON.
            try {
                valueUnit = JSON.parse(valueUnit);
            } catch (e) {}
            return valueUnit;
        };
        // If multiple values are allowed, setup the combo parser.
        if (dataField.attrs.allowMultiple === true) {
            return parseMultipleUnits(parseValueUnit, dataField.attrs.formatMultiple, dataField.attrs.formatRange, string);
        }
        // If range values are allowed, setup the range parser.
        if (dataField.attrs.allowRange === true) {
            return parseRangeUnits(parseValueUnit, dataField.attrs.formatRange, string);
        }
        // Otherwise just parse it as a single unit.
        return parseValueUnit(string);
    },
    //parse
    /**
     * Convert a formatted unit string into a parsed unit hash.
     */
    parseUnit: function(stringUnit) {
        var dataField = this;
        var formatsHash = dataField.formats;
        var parsedHash = {};
        // If there are formats, parse the unit.
        if (formatsHash) {
            toFormattingArray(dataField.attrs.format, formatsHash).forEach(function(chunk) {
                if (chunk.f) {
                    var chunkValue = formatsHash[chunk.f].call(dataField, stringUnit, true);
                    if (!stringUnit.match(new RegExp("^" + chunkValue))) {
                        throw new SyntaxError("The value parsed by the " + "`" + chunk.f + "` formatting rule did not " + "match the value being parsed.\n" + "Value being parsed: “" + stringUnit + "”.\n" + "Value parsed by rule: “" + chunkValue + "”.");
                    }
                    stringUnit = stringUnit.slice(chunkValue.length);
                    parsedHash[chunk.f] = chunkValue;
                } else {
                    stringUnit = stringUnit.replace(new RegExp("^" + chunk), "");
                }
            });
        }
        return parsedHash;
    },
    //parseUnit
    /**
     * Get a data field’s attribute with certain options.
     */
    get: function(name, options) {
        var dataField = this;
        var value = dataField._super(name);
        options = options || {};
        if (options.format) {
            value = dataField.format(value);
        }
        return value;
    }
});

//shadow('data-field')
/**
 * Format multiple units of value.
 */
function formatMultipleUnits(formatter, formatMultiple, formatRange, value) {
    if (!Array.isArray(value)) {
        throw new TypeError("An input with multiple values " + "expects it’s attribute value to be a collection.");
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
        var originalvalueUnit = rangeUnit;
        rangeUnit = parser(rangeUnit);
        range.push(rangeUnit);
        if (typeof rangeUnit == "string") originalvalueUnit = rangeUnit;
        value = value.replace(originalvalueUnit, "");
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
//# sourceMappingURL=shadow.map
return shadow
}));
