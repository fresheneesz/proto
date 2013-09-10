/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/
"use strict";
/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

/*  usage:


*/

var prototypeName='prototype', undefined, protoUndefined='undefined', init='init', ownProperty=({}).hasOwnProperty; // minifiable variables
function proto() {
    var args = arguments // minifiable variables

    if(args.length == 1) {
        var parent = {}
        var prototypeBuilder = args[0]

    } else { // length == 2
        var parent = args[0]
        var prototypeBuilder = args[1]
    }

    // special handling for Error objects
    if([Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError].indexOf(parent) !== -1) {
        parent = normalizeErrorObject(parent)
    }

    // set up the parent into the prototype chain if a parent is passed
    var parentIsFunction = typeof(parent) === "function"
    if(parentIsFunction) {
        prototypeBuilder[prototypeName] = parent[prototypeName]
    } else {
        prototypeBuilder[prototypeName] = parent
    }

    // the prototype that will be used to make instances
    var prototype = new prototypeBuilder(parent)
    prototype.constructor = ProtoObjectFactory;    // set the constructor property on the prototype

    // if there's no init, assume its inheriting a non-proto class, so default to applying the superclass's constructor.
    if(!prototype[init] && parentIsFunction) {
        prototype[init] = function() {
            parent.apply(this, arguments)
        }
    }

    // constructor for empty object which will be populated via the constructor
    var F = function() {}
        F[prototypeName] = prototype    // set the prototype for created instances

    function ProtoObjectFactory() {     // result object factory
        var x = new F()                 // empty object

        if(prototype[init]) {
            var result = prototype[init].apply(x, arguments)    // populate object via the constructor
            if(result === proto[protoUndefined])
                return undefined
            else if(result !== undefined)
                return result
            else
                return x
        } else {
            return x
        }
    }

    // add all the prototype properties onto the static class as well (so you can access that class when you want to reference superclass properties)
    for(var n in prototype) {
        ProtoObjectFactory[n] = prototype[n]
    }

    ProtoObjectFactory[prototypeName] = prototype  // set the prototype on the object factory

    return ProtoObjectFactory;
}

proto[protoUndefined] = {} // a special marker for when you want to return undefined from a constructor

module.exports = proto

function normalizeErrorObject(ErrorObject) {
    function NormalizedError() {
        var tmp = ErrorObject.apply(this, arguments);

        this.stack = tmp.stack
        this.message = tmp.message

        return this
    }
        var IntermediateInheritor = function() {}
            IntermediateInheritor.prototype = ErrorObject.prototype
        NormalizedError.prototype = new IntermediateInheritor()
    return NormalizedError
}