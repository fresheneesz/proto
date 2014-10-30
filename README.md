
`proto`
=====

A prototype-based inheritance/class library that makes it easy to create objects and inheritance hierarchies without losing the
power of javascript's prototype system.

Why Use proto?
==============
* `instanceof` works with `proto` classes
* constructors are inheritable
* non-objects can be returned from a constructor (even `undefined`)!
* easy access to an object's superclass
* you don't hafta use the `new` operator
* native objects work with `proto`. `proto` properly* creates classes that inherit from native objects - even all the `Error` types. *_Inheriting javascript objects has some limitations (see below)_
* [`prototype` and `constructor` properties][javascriptFunctionProperties] are propertly set
* `proto` doesn't use `Object.create` so it should work with older browsers ( *testers welcome!* )
* `proto` is small: ( __896 bytes minified and in AMD format__ )
* `proto` is lightweight. It doesn't attempt to emulate class-based languages or create any fancy features you probably don't actually need (interfaces, abstract classes, etc)

[javascriptFunctionProperties]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/prototype

Example
=======

```javascript
var Person = proto(function() {       // prototype builder
    this.init = function(legs, arms) {      // constructor
        this.legs = legs
        this.arms = arms
    }

    this.getCaughtInBearTrap = function() { // instance method
        this.legs -= 1
    }
    this.limbs = function() {
        return this.arms + this.legs
    }
    Object.defineProperty(this, 'limbs', { // getters (and setters, etc) can be set right on the prototype!
        get: function() {
            return this.arms + this.legs
        }
    })

})

var Girl = proto(Person, function() {       // inheritance
    this.haveBaby = function() {
        return Person(2,2)
    }
})

var g = Girl(2,2)                          // instantiation
g.getCaughtInBearTrap()
console.log("Girl has "+g.limbs+" limbs")
console.log(": (")

var newPerson = g.haveBaby()
console.log("New person has" +newPerson.limbs+" limbs : )")
 ```


Install
=======

```
npm install proto
```


Usage
=====

Accessing proto:
```javascript
var proto = require('proto') // node.js

define(['proto'], function(proto) { ... } // amd

proto; // proto.global.js defines proto globally if you really
       //   want to shun module-based design
```

Using proto:
```javascript
var Parent = proto(function() {
    this.init = function(v) {   // constructor
        if(v > 0) {
            this.x = v                // you can normally access the object with this inside methods
        } else if(v !== undefined) {
			return true	              // you can return non-object values
		} else {
			return proto.undefined    // return undefined by using a special constructor return value
		}
    }

    this.anythingElse = 5   // static properties can be accessed by the class and the instance

    // getters and setters (enumerable makes it available statically too! Ie)
    Object.defineProperty(this, 'moose', {
        enumerable: true,
        get: function() {
            return 5
        },
        set: function() {
            console.log("just kidding, i'm not setting anything!")
        }
    })

	// private functions don't have access to the correct 'this', so pass it in
    var privateFn = function(that, arg1, etc) {
        that.x = arg1 + etc
    }

    this.doSomething = function() {
        privateFn(this, this.x, 1)
    }
})

// you can inherit from any object!
// the resulting object factory will generate instances inheriting from:
    // [if you inherit from]
        // [a function]: that function's prototype
        // [anything else]: that object itself
var Child = proto(Parent, function(superclass) {
    this.init = function() {
        superclass.init.call(this, arguments) // super-class method call
        // superclass.prototype.init.call(this, arguments) // remember that you probably need to access superclass.prototype for parents that aren't proto objects
        this.r = 10
    }

	// create static methods just like instance methods - you can access them from the constructor
    this.staticMethod = function(x) {
        return this.constructor(x+12)        // uses its own constructor to create a Child object
    }
})

var object = Child(1)                // instantiation
object.doSomething()                 // method call (as usual)
var object2 = Child.staticMethod(1)  // static method call

 ```

Creating a custom Error object:
```javascript
var CustomError = proto(Error, function(superclass) {
    this.name = 'CustomError'

    this.init = function(msg, properties) {
        superclass.call(this, msg)
        for(var n in properties) {
            this[n] = properties[n]
        }
    }
})
```

Limitations of `proto`
=============================================
* Inheriting from `Error` and other exception types doesn't automatically set a correct `name` property, so you need to set it as a static properly "manually".
* Objects inheriting from `String` can't use the `toString` method. 
* Inheriting from `Array` doesn't work.
* Inheriting from `RegExp` doesn't work either (the results can't use the `test` or `match methods).
* You can't properly access any non-writable properties of a function from the returned proto-object factory though the properties will work correctly on instances. This includes: `name`, `length`, `arguments`, and `caller`.
* Some properties are read-only and so can't be reset on the prototype object. An example is `name` on firefox.

Todo
====
* Browser testing
 * Chrome [ ]
 * Firefox [ ]
 * IE10 [ ]
 * IE9 [ ]
 * IE8 [ ]
 * Opera [ ]

How to Contribute!
============

Anything helps:

* Creating issues (aka tickets/bugs/etc). Please feel free to use issues to report bugs, request features, and discuss changes
* Updating the documentation: ie this readme file. Be bold! Help create amazing documentation!
* Submitting pull requests.

How to submit pull requests:

1. Please create an issue and get my input before spending too much time creating a feature. Work with me to ensure your feature or addition is optimal and fits with the purpose of the project.
2. Fork the repository
3. clone your forked repo onto your machine and run `npm install` at its root
4. If you're gonna work on multiple separate things, its best to create a separate branch for each of them
5. edit!
6. If it's a code change, please add to the unit tests (at test/protoTest.js) to verify that your change
7. When you're done, run the unit tests and ensure they all pass
8. Commit and push your changes
9. Submit a pull request: https://help.github.com/articles/creating-a-pull-request

Contributors
============
* Special thanks to [jayferd][jayferd], since I got most of the unit tests for `proto` from [his `pjs` project][pjs].


[jayferd]: https://github.com/jayferd
[pjs]: https://github.com/jayferd/pjs

Change Log
=========

* 1.0.11 - adding the ability to access getters and setters correctly statically
* 1.0.10 - making the stack property a getter (like it is in native error objects)
* 1.0.8 - if a static property can't be written (because it's read only or for some other reason throws an exception when being set), it will now silently not set, instead of throwing an exception
* 1.0.7 - getting rid of useless line in stack trace
* 1.0.6 - fixing custom error name in stacktraces
* 1.0.5 - fixing github dependencies

License
=======
Released under the MIT license: http://opensource.org/licenses/MIT