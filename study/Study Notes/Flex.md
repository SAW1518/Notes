---
title: "display: flex"
tags:
  - study
  - css
  - flexbox
  - interview
parent: "[[CSS]]"
original: "[[Notion Import/display flex|Notion version]]"
---

# display: flex

Part of [[CSS]]. The other half of the layout is in [[Grid]].

> [!danger]- 3 things that were wrong in the original (read this first)
> 1. **The default of `flex-wrap` is `nowrap`, not `wrap`.** The note said `wrap`, but its own code in the same block said `nowrap`. It contradicted itself.
> 2. **`flex: 1` is NOT an abbreviation of the values above it.** Those values are `flex: initial` (`0 1 auto`). `flex: 1` is `1 1 0%` — the three numbers are different.
> 3. **`flex-basis: 0` is the key of everything** and it was not explained. It is the reason why with `flex: 1` all the items end with the same size, even if one has more text.

## Quick reference

| Property | Where | What it does |
|---|---|---|
| `display: flex` | **parent** | Turns the element into a flex container |
| `flex-direction` | **parent** | `row` (default) or `column` |
| `flex-wrap` | **parent** | `nowrap` (default) or `wrap` |
| `flex-flow` | **parent** | Shorthand of the two above |
| `flex-grow` | **item** | How much it grows. `0` by default |
| `flex-shrink` | **item** | How much it shrinks. `1` by default |
| `flex-basis` | **item** | The size it starts from. `auto` by default |
| `flex` | **item** | Shorthand of the three above |

---

## The container

`flex` should be set in the **parent**, and it provides a container that can be oriented vertical or horizontal using:

```css
flex-direction: column;
flex-direction: row;    /* ← default */
```

## flex-wrap

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <style>
        body {}
        .parent {
            display: flex;
            flex-direction: row; /* default row */
            flex-wrap: nowrap;
            border: 4px solid black;
            width: 200px;
        }
        .item {
            border: 1px solid;
            opacity: .9;
            width: 100px;
            height: 100px;
            background: #09f;
        }
        .item:first-child {
            background: yellow;
        }
        .item:last-child {
            background: red;
        }
    </style>
</head>

<body>
    <section class="parent">
        <div class="item">primero</div>
        <div class="item">2</div>
        <div class="item">3</div>
    </section>
</body>

</html>
```

![[flex-01.png]]
*With `nowrap`: the 3 items stay in one line and they get squeezed.*

In this example we can see the `flex-wrap: nowrap` ← **this is the default**.

In this way the flex container always maintains its width and height, and it **adjusts the children**. The 3 items want 100px each (300px in total) but the container only has 200px, so they shrink.

> [!danger] Correction: the default is `nowrap`
> The original said "*we can se the `flex-wrap: wrap` ← default*". It is **`nowrap`**. And the code of that same example was already written with `flex-wrap: nowrap`, so the note was contradicting itself.

If we change the property to `flex-wrap: wrap`, the children will do a line break:

![[flex-02.png]]
*With `wrap`: every item goes to its own line.*

> [!question] Why only 1 item per line, if 2 of 100px fit in 200px?
> Because of the **border**. By default `box-sizing` is `content-box`, so the real width of each item is `100px + 1px + 1px = 102px`.
> Two items would be `204px`, and the container only has `200px`. It is not enough for 2, so only 1 enters per line.
> With `box-sizing: border-box` the item would measure exactly 100px and **2 would fit** per line.

## flex-direction + flex-wrap

`flex-flow` is the shorthand of the two:

```css
.parent {
    display: flex;
    flex-flow: row wrap; /* flex-direction: row; flex-wrap: wrap; */
    border: 4px solid black;
    width: 200px;
}
```

---

## Properties of the items

These 3 go in the **children**, not in the parent.

### flex: initial (the default values)

```css
flex-grow: 0;      /* by default the elements do NOT grow */
flex-shrink: 1;    /* by default the elements CAN reduce their size */
flex-basis: auto;  /* the starting size is the width/height of the item */
```

Those 3 values together are `flex: initial`, which is the same as `flex: 0 1 auto`.

- **`flex-grow: 0`** → if there is free space, the item does **not** take it.
- **`flex-shrink: 1`** → if there is no space, the item **can** become smaller than its `flex-basis`.
- **`flex-basis: auto`** → the size it starts from is the `width` (in `row`) or the `height` (in `column`).

### flex: 1

```html
<html lang="en">

<head>
    <style>
        body {}
        .parent {
            display: flex;
            flex-flow: row nowrap;
            border: 4px solid black;
            width: 200px;
        }
        .item {
            border: 1px solid;
            opacity: .9;
            width: 100px;
            height: 200px;
            background: #09f;
            box-sizing: border-box;
            flex: 1;
        }
        .item:first-child {
            background: yellow;
        }
        .item:last-child {
            background: red;
        }
    </style>
</head>

<body>
    <section class="parent">
        <div class="item">primero</div>
        <div class="item">2</div>
        <div class="item">3</div>
    </section>
</body>

</html>
```

![[flex-03.png]]
*With `flex: 1` the 3 items end with exactly the same width.*

> [!danger] Correction: `flex: 1` is not the abbreviation of the values above
> The original said "*`flex: 1` is an abbreviation of the above*". It is **not**. Look at the numbers:
>
> | Shorthand | grow | shrink | basis |
> |---|---|---|---|
> | `flex: initial` (the default) | 0 | 1 | `auto` |
> | **`flex: 1`** | **1** | 1 | **`0%`** |
> | `flex: auto` | 1 | 1 | `auto` |
> | `flex: none` | 0 | 0 | `auto` |
>
> `flex: 1` changes **two** of the three values: the item now grows, and it starts from **zero**.

> [!important] Why is `flex-basis: 0` so important?
> Because the `width: 100px` of the item **stops counting**. Every item starts at 0 and then they split the space in equal parts.
> - With `flex: 1` (basis `0`) → all the items end **equal**, even if one has more text.
> - With `flex: auto` (basis `auto`) → the one with more content ends **bigger**.
>
> This is why in the screenshot "primero" measures the same as "2" and "3", even if its text is longer.

### flex: 1, 2, 3

It distributes the **weight** of the elements. If in general we have `flex: 1` and one has a bigger one like `flex: 2`, that one will take twice as much as the rest.

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>
        body {}
        .parent {
            display: flex;
            flex-flow: row nowrap;
            border: 4px solid black;
            width: 200px;
        }
        .item {
            border: 1px solid;
            opacity: .9;
            width: 100px;
            height: 200px;
            background: #09f;
            box-sizing: border-box;
            flex: 1;
        }
        .item:first-child {
            background: yellow;
            flex: 2;
        }
        .item:last-child {
            background: red;
        }
    </style>
</head>

<body>
    <section class="parent">
        <div class="item">primero</div>
        <div class="item">2</div>
        <div class="item">3</div>
    </section>
</body>

</html>
```

![[flex-04.png]]
*`flex: 2` + `flex: 1` + `flex: 1` → the first one is the double.*

The maths: we sum all the flex (`2 + 1 + 1 = 4`) and each item takes its part. In a container of 200px → **100px, 50px, 50px**.

> [!warning] This only works exactly because the basis is 0
> With `flex: 2` the basis is `0%`, so the `2` applies to the **total** space.
> If the basis were `auto`, the `2` would only apply to the **free space** that is left after the content, and the result would not be a clean double.

---

## What the original was missing

The note explains how to **distribute** the items, but not how to **align** them. In a real interview they ask this a lot.

### The two axes

Everything in flexbox depends on the `flex-direction`:

```
flex-direction: row  (default)      flex-direction: column

  main axis  →→→→→→                   cross axis →→→→→→
  ┌──────────────────┐                ┌──────────────────┐
  │  [1]  [2]  [3]   │ ↓ cross        │  [1]             │ ↓ main
  │                  │   axis         │  [2]             │   axis
  └──────────────────┘                │  [3]             │
                                      └──────────────────┘
```

- **`justify-content`** → aligns in the **main** axis
- **`align-items`** → aligns in the **cross** axis

When we change to `column`, the two swap. This is the part that confuses everybody.

### justify-content and align-items

```css
.parent {
  display: flex;
  justify-content: center;     /* flex-start | flex-end | center |
                                  space-between | space-around | space-evenly */
  align-items: center;         /* stretch (default) | flex-start | flex-end | center | baseline */
  gap: 16px;                   /* space between the items */
}
```

> [!tip] To center something in the middle of the screen
> ```css
> .parent {
>   display: flex;
>   justify-content: center;
>   align-items: center;
>   height: 100vh;
> }
> ```
> These 4 lines are the classic answer to "how do you center a div".

> [!note] `gap` also works in flex
> For a long time `gap` was only for grid, but today it works in flexbox in all the modern browsers. It is much better than putting `margin` on the children.

---

## flex vs grid

| | Flexbox | [[Grid]] |
|---|---|---|
| Dimensions | **1** (a row **or** a column) | **2** (rows **and** columns at the same time) |
| Who decides | The **content** | The **container** |
| Good for | Navbars, toolbars, groups of buttons, cards in a line | Full page layouts, galleries, bento |

> [!question] Short answer for the interview
> "Flexbox is one dimension and grid is two. In flex I put `display: flex` in the parent, I choose the direction with `flex-direction`, and the children are distributed with `flex`, which is the shorthand of grow, shrink and basis. The detail that people miss is that `flex: 1` means `1 1 0%`: as the basis is zero, all the items end with the same size no matter their content. And to align, `justify-content` works on the main axis and `align-items` on the cross axis, and they swap when the direction is `column`."
