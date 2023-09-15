// //the file is a function itself wrapped
// console.log(arguments);
// console.log(require('module').wrapper);

//module.exports
const C = require('./test-module-1');
const calc1 = new C();
console.log(calc1.add(2, 5));

//exports
const calc2 = require('./test-moule-2');
console.log(calc2.add(2, 5));

//another way
const { add, multiply, divide } = require('./test-moule-2');
console.log(add(2, 5));

//caching - code executed only once so rest of the time it is in cache
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
