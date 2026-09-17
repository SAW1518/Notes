---
title: "Array Notes"
source: https://www.notion.so/1f11c0c2a6f4413ba1cb9d678fd857c2
notion-id: 1f11c0c2-a6f4-413b-a1cb-9d678fd857c2
parent: "The Best Notes of the F Word"
tags: [notion-import]
---
# Array Notes

# every:

`***Array.prototype.every()***`

NOT MODIFY THE ORIGINAL ARRAY ✅

When all the elements comply with the callback condition

### Args injected:

```json
[12, 5, 8, 130, 44].every((element, index, array) => {
    //console.log(element);  -> 12,5,8
    //console.log(index); -> 0,1,2
    //console.log(array); -> [ 12, 5, 8, 130, 44 ]
    return true;
});
```

### Example:

check is a one element has a subSet

```javascript
const isSubset = (array1, array2) => array2.every((element) => array1.includes(element));

console.log(isSubset([1, 2, 3, 4, 5, 6, 7], [5, 7, 6])); // true
console.log(isSubset([1, 2, 3, 4, 5, 6, 7], [5, 8, 7])); // false
```

The Array.prototype.every() method in JavaScript checks if all elements in an array satisfy a condition specified in a callback function. It does not modify the original array. The method can be used, for example, to check if one array is a subset of another.

# at:

 `***Array.prototype.at()***`

NOT MODIFY THE ORIGINAL ARRAY ✅

Is a method of Array that receives just 1 parameter of type integer and returns the value in that position in the Array

### Args:

```javascript
at(index)
```

### Example:

```javascript
[5, 12, 8, 130, 44].at(2) // -> 8
["apple", "banana", "pear"].at(0) // -> "apple"
```

### Extra Notes:

if a at receives negative args returns the last values of array

```javascript
[5, 12, 8, 130, 44].at(-1) // -> 44
[5, 12, 8, 130, 44].at(-2) // -> 130
```

# concat:

`***Array.prototype.concat()***`

NOT MODIFY THE ORIGINAL ARRAY ✅

Is a method of Array that to merge two or more arrays and returns a new array 

### Args:

```javascript
[....].concat(value1, value2, /* …, */ valueN) // -> [...., value1,value2, ..., valueN]
[....].concat([...], integer, valueN, valueN, [...[...]])
```

### Example:

```javascript
const num1 = [1, 2, 3];
const num2 = [4, 5, 6];
const num3 = [7, 8, 9];

const numbers = num1.concat(num2, num3); // results in [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

```javascript
const letters = ["a", "b", "c"];
const alphaNumeric = letters.concat(1, [2, 3]);
console.log(alphaNumeric);
// results in ['a', 'b', 'c', 1, 2, 3]
```

# fill:

`***Array.prototype.fill()***`

MODIFY THE ORIGINAL ARRAY ⚠️

Is a method of Array that change all the elements for a static value since a index `start`(default 0) until index `end `(default `array.length`)

### Args:

```javascript
arr.fill(value, start = 0, end = this.length)
```

### Example:

```javascript
const array1 = [1, 2, 3, 4, 3, 6];
console.log(array1.fill(0, 2, 4));
// Expected output: Array [ 1, 2, 0, 0, 3, 6 ]
const array1 = [1, 2, 3, 4, 3, 6];
console.log(array1.fill(10, 2));
// Expected output: Array [ 1, 2, 10, 10, 10, 10 ]
console.log(array1.fill(6));
// Expected output: Array [6, 6, 6, 6]
```
