
// Create myObject. It has a value an an increment method. The increment method takes an optional
// parameter. If the argument is not a number, then 1 is used as the default.
var myObject = {
	value: 0,
	increment: function(inc) {
		this.value += typeof  inc === 'number' ? inc : 1;
	}
};

myObject.increment();
console.log(myObject.value);

var add = function(first, second) {
	return first + second;
}

// *** Function invocation pattern ***
myObject.double = function() {
	var that = this;
	var helper = function() {
		that.value = add(that.value, that.value);
	};
	helper();
};

// Invoke double as a method.
myObject.double();
console.log(myObject.value);

// Constructor invocation pattern.

var Quo = function(string) {
	this.status = string;
};

Quo.prototype.get_status = function() {
	return this.status;
}

var myQuo = new Quo("confused");
console.log(myQuo.get_status());

// *** Apply invocation pattern ***
var array = [3, 4];
var sum = add.apply(null, array); // Sum is 7.


// *** Arguments ***
sum = function() {
	var i, sum = 0;
	for (i = 0; i < arguments.length; i+= 1) {
		sum += arguments[i];
	}
	return sum;
}

console.log(sum(4, 8, 15, 16, 23, 42));

//  *** Augmenting types ***

// 1. By augmenting Function.prototype, we can make a method available to all functions.
Function.prototype.method = function(name, func) {
	this.prototype[name] = func;
	return this;
};

Number.method('integer', function() {
	return Math[this < 0 ? 'ceil' : 'floor'](this);
});

console.log(Math['floor'](4.2))
console.log((5.1).integer());

// *** Closures ***

// Instead of initializing myObject with an object literal, initialize by calling a function that returns
// an object literal. The function will define a value variable, which is always available to the increment()
// and getValue() methods, but the function's scope keeps it hidden from the rest of the program.

// We are not assigning a function to myObject, but the result of invoking the function. The () on the last line
// calls the function.
var myObject = (function()  {
	var value = 0;

	return {
		increment: function(inc) {
			value += typeof inc === 'number' ? 'inc' : 1;
		},
		getValue: function() {
			return value;
		}
	};
}());

// Create a maker function called quo. It makes an object with a get_status() method and a private status property.
var quo = function(status) {
	return {
		get_status: function() {
			return status;
		}
	};
};

var person = function(firstName, lastName) {
	var name = firstName + ' ' + lastName;
	return {
		getName: function() {
			return name;
		},
		setName: function(newName) {
			name = newName;
		}
	};
};

// Make an instance of quo.
var myQuo = quo("amazed");
console.log(myQuo.get_status());

// Make an instance of person.
var myPerson = person("John", "Doe");
console.log(myPerson.getName());
myPerson.setName("Jane Doe");
console.log(myPerson.getName());


function getTimeStamp() {
	var now = new Date();
	return (
		now.getMonth() + 1 + '/' +
		now.getDate() + '/' +
		now.getFullYear() + ' ' +
		now.getHours() + ':' +
		((now.getMinutes() < 10) ? '0' + now.getMinutes() : now.getMinutes()) + ':' +
		((now.getSeconds() < 10) ? '0' + now.getSeconds() : now.getSeconds()));
};

console.log('Date: ' + getTimeStamp());