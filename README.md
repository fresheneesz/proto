proto
=====

A prototype-based inheritance library that makes it easy to create objects and inheritance hierarchies without losing the
power of javascript's prototype system. `proto` also properly inherits from native objects - even all the `Error` types.

Install
=======

```
npm install git+https://git@github.com/fresheneesz/proto.git
```

Example
=======

Usage
=====

```
var Parent = proto(function() {
        this.init = function(v) {   // sets constructor
            if(v) {
                this.x = v                // you can normally access the object with this inside methods
                return this               // you have to return yourself from the constructor
            } else {
                return undefined          // ^ this allows you to return anything you want from a constructor!
            }
        }
                  }
        // this.constructor      // is set automatically to the proto object itself (so you can reference it from the instance)
        this.anythingElse = 5   // sets class methods/properties (on the prototype and the constructor object)

        var privateFn = function(me, arg1, etc) {  // private functions don't have access to the correct 'this', so pass it in
            me.x = arg1 + etc
        }
        this.usePrivate = function() {
            privateFn(this, this.x, 1)
        }
    })

    // you can inherit from any object!
    // the resulting object factory will generate instances inheriting from:
        // [if you inherit from]
            // [a function]: that function's prototype
            // [anything else]: that object itself
    var Child = proto(Parent, function(sclass) {
        this.init = function() {
            sclass.init.call(this, arguments) // super-class method call
            this.r = 10
            return this
        }

        this.staticMethod = function(x) {        // create static methods just like instance methods - you can access them from the constructor
            return this.constructor(x+12)        // uses its own constructor to create a Child object
        }
    })

    var object = Child(1)                // instantiation
    object.usePrivate()                  // method call (as usual)
    var object2 = Child.staticMethod(1)  // static method call


    //
 ```

 note: you can't propertly access any non-writable properties of a function from the returned proto-object factory
 though the name property will work correctly on instances. This includes: `name`, `length`, `arguments`, and `caller`.