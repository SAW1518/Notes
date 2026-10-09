---
title: Arrays
tags:
  - study
  - javascript
  - arrays
  - interview
---

# Arrays

Array methods, which ones mutate, and the traps that come up in interviews and in real bugs.

Shallow vs deep copying is in [[JavaScript#Shallow vs deep copy]].

---

# Mutates or not — the table to know cold

This is the single most useful thing on the page. In React, mutating in place means the reference does not change and **the re-render never happens** ([[React#The reference-identity table (the root of all of this)]]).

| Mutates the original ⚠️ | Returns a new array ✅ |
|---|---|
| `push` / `pop` | `concat` |
| `shift` / `unshift` | `slice` |
| `splice` | `map` / `filter` / `flat` / `flatMap` |
| `sort` | `toSorted` (ES2023) |
| `reverse` | `toReversed` (ES2023) |
| `fill` | `toSpliced` (ES2023) |
| `copyWithin` | `with` (ES2023) |

Neither group: `every`, `some`, `find`, `findIndex`, `findLast`, `includes`, `indexOf`, `join`, `at`, `reduce`, `forEach`.

> [!tip] The ES2023 immutable four
> `toSorted`, `toReversed`, `toSpliced` and `with` are the non-mutating twins of `sort`, `reverse`, `splice` and `arr[i] = x`. In a React codebase they delete most `[...arr]` boilerplate:
> ```js
> const sorted  = rows.toSorted((a, b) => a.age - b.age);  // instead of [...rows].sort(…)
> const updated = rows.with(2, newRow);                     // instead of a map with an index check
> ```

---

# Quick summary of the four documented here

| Method | Modifies the original? | Returns |
|---|---|---|
| [[#every]] | No ✅ | `true` or `false` |
| [[#at]] | No ✅ | the element, or `undefined` |
| [[#concat]] | No ✅ | a **new** array |
| [[#fill]] | **Yes** ⚠️ | the **same** array, modified |

---

## every

`Array.prototype.every()` — **does not modify the original array** ✅

Returns `true` when **all** the elements comply with the callback condition. If one single element does not comply, it returns `false`.

### The arguments injected into the callback

```javascript
[12, 5, 8, 130, 44].every((element, index, array) => {
  // console.log(element); -> 12, 5, 8, 130, 44
  // console.log(index);   -> 0, 1, 2, 3, 4
  // console.log(array);   -> [12, 5, 8, 130, 44]  (always the complete array)
  return true;
});
```

Because the callback returns `true` here, `every` visits **all five** elements. It would only stop early if the callback returned `false`.

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

Good for performance: it does not waste time once it knows the answer.

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

`Array.prototype.at(index)` — **does not modify the original array** ✅

Receives **1 parameter** of type integer and returns the value in that position.

```javascript
[5, 12, 8, 130, 44].at(2);        // -> 8
["apple", "banana", "pear"].at(0); // -> "apple"
```

With a **negative** index it counts **from the end**: `-1` is the last element, `-2` the second from the end.

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

`Array.prototype.concat()` — **does not modify the original array** ✅

Merges two or more arrays and returns a **new** array.

```javascript
[...].concat(value1, value2, /* …, */ valueN);
```

It accepts arrays **and** loose values, mixed.

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

`Array.prototype.fill(value, start, end)` — **MODIFIES the original array** ⚠️

Changes all the elements for a **static value**, from the index `start` (default `0`) until the index `end` (default `array.length`).

> [!warning] `end` is exclusive
> The element of the index `end` is **not** included. `fill(0, 2, 4)` changes the positions **2 and 3**, not the 4.

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
// [6, 6, 6, 6, 6, 6]   ← the complete array, all SIX elements
```

`fill` never changes the length of the array. All verified in Node ✅

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

---

# The traps that cost real time

## `sort` mutates, and it compares as strings

```javascript
[10, 9, 100, 1].sort();                    // [1, 10, 100, 9]  😱 lexicographic
[10, 9, 100, 1].sort((a, b) => a - b);     // [1, 9, 10, 100]  ✅
```

Default `sort` converts every element to a **string** and compares UTF-16 code units. For numbers it needs a comparator, always.

Two more things:

- It **mutates**, and it also **returns** the same array — so `const sorted = arr.sort(…)` silently reorders `arr` too. Use `arr.toSorted(…)` or `[...arr].sort(…)`.
- For text, a comparator with `-` is wrong and `a > b` ignores accents and locale. Use `Intl.Collator`:

```javascript
const collator = new Intl.Collator('es');
names.toSorted((a, b) => collator.compare(a, b));
```

## `slice` vs `splice`

| | `slice(start, end)` | `splice(start, deleteCount, ...items)` |
|---|---|---|
| Mutates | ❌ no | ✅ **yes** |
| Returns | the extracted part | the **removed** elements |
| `end` | exclusive | n/a |
| Negative index | ✅ counts from the end | ✅ for `start` |

```javascript
const arr = [1, 2, 3, 4, 5];
arr.slice(1, 3);        // [2, 3]        — arr unchanged
arr.slice(-2);          // [4, 5]
arr.splice(1, 2);       // [2, 3] returned, and arr is now [1, 4, 5]
```

One letter apart, opposite behaviour. `slice` with no arguments is also the old idiom for a shallow copy: `arr.slice()`.

## `includes` vs `indexOf` — and `NaN`

```javascript
[NaN].indexOf(NaN);     // -1    ❌ uses ===, and NaN !== NaN
[NaN].includes(NaN);    // true  ✅ uses SameValueZero
```

`includes` reads better and handles `NaN`. `indexOf` is only needed when the **position** matters.

## `reduce` — the accumulator and the missing initial value

```javascript
// group by a key — the most common real use
const byRole = users.reduce((acc, u) => {
  (acc[u.role] ??= []).push(u);
  return acc;
}, {});                                  // ← the initial value is not optional in practice

[].reduce((a, b) => a + b);              // ❌ TypeError: Reduce of empty array with no initial value
[].reduce((a, b) => a + b, 0);           // ✅ 0
```

Without an initial value, the first element becomes the accumulator and iteration starts at index 1 — which breaks on an empty array and makes the types inconsistent.

> [!tip] `Object.groupBy` replaced that idiom
> ```javascript
> const byRole = Object.groupBy(users, u => u.role);   // ES2024
> ```

## `forEach` cannot be stopped, and ignores `async`

```javascript
// ❌ break does not exist, return only skips one iteration
items.forEach(i => { if (i.bad) return; save(i); });

// ❌ the await is INSIDE the callback — forEach does not wait for anything
items.forEach(async i => { await save(i); });
console.log('done');   // prints before any save finished

// ✅
for (const i of items) { if (i.bad) break; await save(i); }
// ✅ or, with bounded concurrency — see JavaScript note
await Promise.all(items.map(i => save(i)));
```

`forEach` is the only iteration method with no way out: `some` and `every` short-circuit, `for…of` has `break`, and `find` stops on a match.

## `flat` and `flatMap`

```javascript
[1, [2, [3, [4]]]].flat();          // [1, 2, [3, [4]]]   — depth 1 by default
[1, [2, [3, [4]]]].flat(Infinity);  // [1, 2, 3, 4]

// flatMap = map then flat(1) — useful to map and filter in one pass
users.flatMap(u => u.active ? [u.name] : []);   // keeps and transforms, drops the rest
```

## Holes: sparse arrays

```javascript
const a = new Array(3);        // [ <3 empty items> ] — not [undefined, undefined, undefined]
a.map(x => 1);                 // [ <3 empty items> ]  😱 map SKIPS holes
Array.from({ length: 3 }, () => 1);  // [1, 1, 1] ✅

[1, , 3].forEach(x => console.log(x));  // logs 1 and 3 — the hole is skipped
```

`map`, `forEach`, `filter` and `reduce` skip holes; `Array.from`, `fill`, `join` and spread treat them as `undefined`. This is why `Array.from({ length: n }, fn)` is the correct way to build an array of n computed values.

## `length` is writable

```javascript
const arr = [1, 2, 3, 4, 5];
arr.length = 2;        // [1, 2]  — truncates, destructively
arr.length = 4;        // [1, 2, <2 empty items>]
```

## `find` vs `filter` vs `findLast`

```javascript
users.find(u => u.id === id);        // the element, or undefined — stops at the first match
users.filter(u => u.active);         // a new array, always walks everything
users.findLast(u => u.active);       // ES2023 — from the end
users.findLastIndex(u => u.active);  // ES2023
```

Using `filter(…)[0]` where `find` belongs walks the whole array and allocates one more.

---

# Recall triggers

| When I hear / say… | The words that must come out |
|---|---|
| "I sorted the array" | `sort` **mutates** and compares as **strings** — comparator, or `toSorted` |
| "the component did not re-render" | something **mutated in place** — the reference never changed |
| "`slice` or `splice`?" | `slice` copies, `splice` **cuts** and mutates |
| "`new Array(3).fill([])`" | **the same reference** three times — `Array.from({length:3},()=>[])` |
| "`every` on an empty array" | **`true`** — vacuous truth |
| "`indexOf(NaN)`" | `-1` — use `includes` |
| "`reduce`" | give it an **initial value** |
| "`await` inside `forEach`" | **it does not wait** — `for…of` or `Promise.all` |
| "`new Array(n).map(…)`" | **holes are skipped** — `Array.from({length:n}, fn)` |
| "the last element" | `at(-1)` |

---

# Drill — say these out loud

1. The mutating seven: `push`/`pop`, `shift`/`unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`.
2. `sort` with no comparator sorts **as strings**. `[10, 9].sort()` → `[10, 9]`.
3. `slice` copies. `splice` cuts and **mutates**. One letter.
4. `every` on `[]` is **`true`**.
5. `every` and `some` **short-circuit**; `forEach` cannot be stopped.
6. `fill` with an object shares **one reference** across every position.
7. `end` is **exclusive** in `fill`, `slice` and `splice`.
8. `concat` and spread are **shallow**, and flatten **one** level.
9. `at(-1)` is the last element; `arr[-1]` is `undefined`.
10. `includes` handles `NaN`; `indexOf` does not.
11. `map` **skips holes**; `Array.from({length:n}, fn)` does not.
12. ES2023 gave us the immutable four: `toSorted`, `toReversed`, `toSpliced`, `with`.

---

# Still to study

- [ ] `Array.prototype.group` / `Object.groupBy` and `Map.groupBy` — browser support today
- [ ] Typed arrays (`Uint8Array`, `Float32Array`) and when a frontend actually needs them
- [ ] Iterator helpers (`.map`, `.filter`, `.take` on iterators) — lazy sequences without intermediate arrays
- [ ] `structuredClone` on arrays of class instances: what survives and what does not
- [ ] Performance: when `for` beats `map`/`filter` chains, and how to measure it instead of guessing
