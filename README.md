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

```
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
})

var Girl = proto(Person, function() { // inheritance
    this.haveBaby = function() {
        return Person(2,2)
    }
})

var g = Girl(2,2)        // instantiation
g.getCaughtInBearTrap()
console.log("Girl has "+g.limbs()+" limbs")
console.log(": (")

var newPerson = g.haveBaby()
console.log("New person has" +newPerson.limbs()+" limbs : )")
 ```


Install
=======

```
npm install proto
```


Usage
=====

Accessing proto:
```
var proto = require('proto') // node.js

define(['proto'], function(proto) { ... } // amd

proto; // proto.global.js defines proto globally if you really 
       //   want to shun module-based design
```

Using proto:
```
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

	var that = this // private functions don't have access to the correct 'this', so pass it in
    var privateFn = function(me, arg1, etc) {  
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
        this.r = 10
        return this
    }
	
	// create static methods just like instance methods - you can access them from the constructor
    this.staticMethod = function(x) {        
        return this.constructor(x+12)        // uses its own constructor to create a Child object
    }
})

var object = Child(1)                // instantiation
object.doSomething()                  // method call (as usual)
var object2 = Child.staticMethod(1)  // static method call

 ```


Limitations of `proto`
=============================================
* Inheriting from `Error` and other exception types doesn't automatically set a correct `name` property, so you need to set it in the contructor manually.
* Objects inheriting from `String` can't use the `toString` method. 
* Inheriting from `Array` doesn't work.
* Inheriting from `RegExp` doesn't work either (the results can't use the `test` or `match methods).
* You can't properly access any non-writable properties of a function from the returned proto-object factory though the properties will work correctly on instances. This includes: `name`, `length`, `arguments`, and `caller`.
 

Contributors
============
* Special thanks to [jayferd][jayferd], since I got most of the unit tests for `proto` from [his `pjs` project][pjs].


[jayferd]: https://github.com/jayferd
[pjs]: https://github.com/jayferd/pjs
