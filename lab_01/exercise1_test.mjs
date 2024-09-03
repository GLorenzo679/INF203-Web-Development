"use strict";

import {fibonaIt,fiboRec,fibonaArr,fibMap} from "./exercise1.mjs";

// do more that one test per function
console.log("\nFibonacci Iterative");
console.log(fibonaIt(7)); 
console.log(fibonaIt(8));
console.log(fibonaIt(5));
console.log(fibonaIt(0));

console.log("\nFibonacci Recursive");
console.log(fiboRec(7)); 
console.log(fiboRec(8));
console.log(fiboRec(5));
console.log(fiboRec(0));

console.log("\nFibonacci Array");
console.log(fibonaArr([3,5]));
console.log(fibonaArr([4,6]));
console.log(fibonaArr([1,2]));
console.log(fibonaArr([0,1]));

console.log("\nFibonacci Map");
console.log(fibMap([3,5]));
console.log(fibMap([4,6]));
console.log(fibMap([1,2]));
console.log(fibMap([0,1]));