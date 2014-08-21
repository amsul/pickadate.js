define(function(require) {

    'use strict';

    var Em = require('ember')

    Em.LOG_VERSION = false
    // Em.LOG_BINDINGS = true // logging of any object bindings.
    Em.LOG_STACKTRACE_ON_DEPRECATION = true
    Em.ENV.RAISE_ON_DEPRECATION = true

    /**
     * The application namespace.
     *
     * @module App
     */
    return window.App = Em.Application.create({
        // LOG_TRANSITIONS: true, // basic logging of successful transitions
        // LOG_TRANSITIONS_INTERNAL: true, // detailed logging of all routing steps
        // LOG_VIEW_LOOKUPS: true, // logging of view and template lookups
        // LOG_ACTIVE_GENERATION: true, // logging of generated routes and controllers
        // LOG_MODULE_RESOLVER: true,
    })
})