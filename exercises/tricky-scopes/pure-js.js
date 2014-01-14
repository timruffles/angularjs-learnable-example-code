var parentScope = {counter: {value:0}};
var childScope = Object.create(parentScope); // {} -> parentScope

console.log("childScope.count initially %d",childScope.counter.value) // 0
childScope.counter.value += 1 //
console.log("childScope.count now %d",childScope.counter.value) // 1
console.log("parentScope.count now %d",parentScope.counter.value) // 1

