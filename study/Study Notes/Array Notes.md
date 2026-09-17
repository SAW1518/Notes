---
title: Array Notes
tags:
  - study
  - javascript
  - arrays
  - interview
parent: "[[The Best Notes of the F Word]]"
original: "[[Notion Import/Array Notes|Notion version]]"
---

# Array Notes

Part of [[The Best Notes of the F Word]].

> [!warning]- 4 things that were wrong in the original (read this first)
> 1. In the `every()` example, the callback returns `true`, so it visits **all 5** elements, not only `12, 5, 8`.
> 2. The `fill()` example declares `const array1` **twice** in the same block → that is a `SyntaxError`, the code does not run.
> 3. `array1.fill(6)` gives `[6, 6, 6, 6, 6, 6]` (**6** elements), not `[6, 6, 6, 6]`.
> 4. `fill()` and `at()` were missing that `end` is **exclusive** and that `concat()` makes a **shallow** copy.
> I checked all of them in Node before writing this. ✅

## Quick summary

| Method | Modifies the original? | Returns |
|---|---|---|
| [[#every]] | No ✅ | `true` or `false` |
| [[#at]] | No ✅ | the element, or `undefined` |
| [[#concat]] | No ✅ | a **new** array |
| [[#fill]] | **Yes** ⚠️ | the **same** array, modified |

---

## every

`Array.prototype.every()`

**NOT MODIFY THE ORIGINAL ARRAY ✅**

It returns `true` when **all** the elements comply with the callback condition. If one single element does not comply, it returns `false`.

### Args injected

```javascript
[12, 5, 8, 130, 44].every((element, index, array) => {
  // console.log(element); -> 12, 5, 8, 130, 44
  // console.log(index);   -> 0, 1, 2, 3, 4
  // console.log(array);   -> [12, 5, 8, 130, 44]  (always the complete array)
  return true;
});
```

> [!danger] Correction of the original
> The original note said that it only logs `12, 5, 8`. That is **not** true: the callback here returns `true` always, so `every` visits **all** the elements. It would only stop early if the callback returned `false`.

### It stops at the first `false` (short-circuit)

```javascript
const numbers = [2, 4, 5, 6, 8];
numbers.every((n) => {
  console.log("checking", n);
  return n % 2 === 0;
});
// checking 2
// checking 4
// checking 5   ← here it returns false and it STOPS
// it never checks 6 and 8
```

This is good for the performance: it does not waste time when it already knows the answer.

### Example

Check if one array is a subset of another one:

```javascript
const isSubset = (array1, array2) => array2.every((element) => array1.includes(element));

console.log(isSubset([1, 2, 3, 4, 5, 6, 7], [5, 7, 6])); // true
console.log(isSubset([1, 2, 3, 4, 5, 6, 7], [5, 8, 7])); // false
```

> [!warning] The classic trap: the empty array
> ```javascript
> [].every((x) => false);  // true 😱
> ```
> An empty array **always** returns `true`, even with a condition that is impossible. In maths this is called *vacuous truth*: "all the elements comply" is true when there are no elements. If this can break our logic, we have to check the `length` first.

> [!question] Short answer for the interview
> "`every` returns `true` if all the elements pass the condition of the callback. It does not modify the original array and it short-circuits: it stops and returns `false` at the first element that fails. Careful with the empty array, because it returns `true`."

---

## at

`Array.prototype.at()`

**NOT MODIFY THE ORIGINAL ARRAY ✅**

It is a method that receives **1 parameter** of type integer and returns the value in that position of the array.

### Args

```javascript
at(index)
```

### Example

```javascript
[5, 12, 8, 130, 44].at(2);        // -> 8
["apple", "banana", "pear"].at(0); // -> "apple"
```

### Extra notes

If `at()` receives a **negative** index, it counts **from the end**: `-1` is the last element, `-2` the second from the end, and so on.

```javascript
[5, 12, 8, 130, 44].at(-1);  // -> 44  (the last one)
[5, 12, 8, 130, 44].at(-2);  // -> 130
[5, 12, 8, 130, 44].at(99);  // -> undefined  (out of range)
```

> [!tip] Why does `at()` exist?
> Because the brackets do **not** work with negative numbers:
> ```javascript
> const arr = [5, 12];
> arr[-1];   // undefined ❌  (JS looks for a property called "-1")
> arr.at(-1); // 12 ✅
> ```
> Before `at()` we had to write `arr[arr.length - 1]`. It also works on **strings**: `"hello".at(-1)` → `"o"`.

> [!question] Short answer for the interview
> "`at()` returns the element of a position, and its advantage is that it accepts negative indexes to count from the end, something that the brackets cannot do. `at(-1)` is the clean way to get the last element."

---

## concat

`Array.prototype.concat()`

**NOT MODIFY THE ORIGINAL ARRAY ✅**

It is a method to merge two or more arrays and it returns a **new** array.

### Args

```javascript
[...].concat(value1, value2, /* …, */ valueN);
```

It accepts arrays **and** loose values, mixed.

### Example

```javascript
const num1 = [1, 2, 3];
const num2 = [4, 5, 6];
const num3 = [7, 8, 9];

const numbers = num1.concat(num2, num3);
// [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

```javascript
const letters = ["a", "b", "c"];
const alphaNumeric = letters.concat(1, [2, 3]);
console.log(alphaNumeric);
// ['a', 'b', 'c', 1, 2, 3]
```

### It only flattens 1 level

```javascript
[1, 2].concat([3, [4, 5]]);
// [1, 2, 3, [4, 5]]  ← the inner array stays as an array
```

> [!danger] It is a shallow copy
> `concat` does not modify the original array, but the objects and arrays **inside** are shared by **reference**:
> ```javascript
> const inner = [9];
> const result = [inner].concat([[7]]);
> inner.push(99);
> console.log(result);  // [[9, 99], [7]]  ← the copy changed too!
> ```
> "It does not modify the original" is only true for the **first level**. Verified in Node ✅

> [!tip] The modern way
> Today the spread operator is more used because it reads better:
> ```javascript
> const numbers = [...num1, ...num2, ...num3];
> ```
> It does exactly the same, and it also makes a shallow copy.

> [!question] Short answer for the interview
> "`concat` joins arrays and values and returns a new array, without touching the originals. It flattens only one level and the copy is shallow, so the nested objects are still shared. Today we normally use the spread operator for the same thing."

---

## fill

`Array.prototype.fill()`

**MODIFY THE ORIGINAL ARRAY ⚠️**

It is a method that changes all the elements for a **static value**, from the index `start` (default `0`) until the index `end` (default `array.length`).

### Args

```javascript
arr.fill(value, start, end);
```

> [!warning] `end` is exclusive
> The element of the index `end` is **not** included. `fill(0, 2, 4)` changes the positions **2 and 3**, not the 4.

### Example

```javascript
const array1 = [1, 2, 3, 4, 3, 6];

array1.fill(0, 2, 4);
console.log(array1);
// [1, 2, 0, 0, 3, 6]   ← positions 2 and 3 only

array1.fill(10, 2);
console.log(array1);
// [1, 2, 10, 10, 10, 10]   ← from position 2 to the end

array1.fill(6);
console.log(array1);
// [6, 6, 6, 6, 6, 6]   ← the complete array
```

> [!danger] Two errors in the original example
> 1. It declared `const array1` **twice** in the same block. That is a `SyntaxError` and **nothing** runs.
> 2. It said that `array1.fill(6)` gives `[6, 6, 6, 6]`. The array has **6** elements, so it gives `[6, 6, 6, 6, 6, 6]`. `fill` never changes the length of the array.
> Verified in Node ✅

### The most common use: create an array with values

```javascript
new Array(5).fill(0);     // [0, 0, 0, 0, 0]
new Array(3).fill("-");   // ['-', '-', '-']
```

> [!danger] The big trap: the same reference
> If we fill with an **object** or an **array**, all the positions point to the **same** one:
> ```javascript
> const rows = new Array(3).fill([]);
> rows[0].push("x");
> console.log(rows);  // [["x"], ["x"], ["x"]] 😱
> ```
> The 3 positions are the **same** array. To create independent ones we use `Array.from`:
> ```javascript
> const rows = Array.from({ length: 3 }, () => []);
> rows[0].push("x");
> console.log(rows);  // [["x"], [], []] ✅
> ```
> This bug appears a lot when we build grids or matrices.

> [!question] Short answer for the interview
> "`fill` replaces the elements of an array with a static value, between a start and an end, and the end is exclusive. It **does** mutate the original array and it returns that same array. The typical use is `new Array(n).fill(0)`, but careful: if we fill with an object or an array, all the positions share the same reference."
