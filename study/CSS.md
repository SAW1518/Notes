---
title: CSS
tags:
  - study
  - css
  - flexbox
  - grid
  - interview
---

# CSS

Layout in two parts: **Flexbox** for one dimension, **Grid** for two.

## Quick reference

### Flexbox

| Property | Where | What it does |
|---|---|---|
| `display: flex` | **parent** | Turns the element into a flex container |
| `flex-direction` | **parent** | `row` (default) or `column` |
| `flex-wrap` | **parent** | `nowrap` (default) or `wrap` |
| `flex-flow` | **parent** | Shorthand of the two above |
| `justify-content` | **parent** | Aligns on the **main** axis |
| `align-items` | **parent** | Aligns on the **cross** axis |
| `gap` | **parent** | Space between the items |
| `flex-grow` | **item** | How much it grows. `0` by default |
| `flex-shrink` | **item** | How much it shrinks. `1` by default |
| `flex-basis` | **item** | The size it starts from. `auto` by default |
| `flex` | **item** | Shorthand of the three above |

### Grid

| Property | What it does |
|---|---|
| `display: grid` | Turns the element into a grid container |
| `grid-template-columns` | Defines the **columns** |
| `grid-template-rows` | Defines the **rows** |
| `grid-auto-rows` | Size of the rows created **automatically** |
| `grid-auto-flow` | Direction where new items are added |
| `gap` | Space **between** the cells |
| `repeat(n, value)` | Avoids repeating the same value n times |
| `minmax(min, max)` | A track with a minimum and a maximum size |
| `grid-column` / `grid-row` | **Where** an item is placed and how much it occupies |

---

# 1. Flexbox

## The container

`flex` is set on the **parent**, and it provides a container that can be oriented vertical or horizontal:

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

`flex-wrap: nowrap` is **the default**. With it the flex container always maintains its width and height, and it **adjusts the children**. The 3 items want 100px each (300px in total) but the container only has 200px, so they shrink.

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

## Properties of the items

These 3 go on the **children**, not on the parent.

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

`flex: 1` is **not** an abbreviation of the default values. It changes **two** of the three:

| Shorthand | grow | shrink | basis |
|---|---|---|---|
| `flex: initial` (the default) | 0 | 1 | `auto` |
| **`flex: 1`** | **1** | 1 | **`0%`** |
| `flex: auto` | 1 | 1 | `auto` |
| `flex: none` | 0 | 0 | `auto` |

With `flex: 1` the item now grows, and it starts from **zero**.

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

## Aligning the items

Distributing the items is only half of flexbox. Aligning them is the half that gets asked in interviews.

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

- **`justify-content`** → aligns on the **main** axis
- **`align-items`** → aligns on the **cross** axis

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

> [!question] Short answer for the interview
> "In flex I put `display: flex` on the parent, I choose the direction with `flex-direction`, and the children are distributed with `flex`, which is the shorthand of grow, shrink and basis. The detail that people miss is that `flex: 1` means `1 1 0%`: as the basis is zero, all the items end with the same size no matter their content. And to align, `justify-content` works on the main axis and `align-items` on the cross axis, and they swap when the direction is `column`."

---

# 2. Grid

## grid-template-columns

We can use the CSS property `grid-template-columns` to set the columns that we need:

```html
<html lang="en">
<head>
  <style>
    .content {
      background: lightcoral;
      border: 3px solid black;
      border-radius: 10px;
      display: grid;
      grid-template-columns: 50% 100px auto 10vw;
    }

    .content div {
      background: lightblue;
      border: 1px solid #09f;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <section class="content">
    <div>content</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
    <div>7</div>
  </section>
</body>
</html>
```

![[grid-01.png]]
*4 columns with different units. The items 5, 6 and 7 pass to a new row automatically.*

In grid we can use the usual measures that we use in flex:

```css
grid-template-columns: 50% 100px auto 10vw;
```

Each value creates **one column**. Here we have 4 columns, so every 4 items a new row starts.

---

## Fractions (`fr`)

The `fr` unit splits the **free space** between the tracks that use `fr` — not the total space. It splits what is **left** after the fixed sizes and the gaps.

```css
grid-template-columns: 1fr;          /* 1 column, 100% of the space */
grid-template-columns: 1fr 1fr;      /* each 1fr is 50% */
grid-template-columns: 1fr 1fr 1fr;  /* each 1fr is 33% */
grid-template-columns: 2fr 1fr;      /* 2fr is 66%, 1fr is 33% */
```

The maths is easy: we sum all the `fr` and each track receives its part. In `2fr 1fr` the total is `3fr`, so `1fr` = 1/3 = 33%.

Mixed with fixed tracks the difference shows up:

```css
grid-template-columns: 100px 1fr 1fr;
gap: 20px;
```

In a container of 500px: the `1fr` do **not** split 500px. They split `500 - 100 - 40 (2 gaps) = 360px`, so each one is 180px.

### grid-template-columns: 1fr

```css
.content {
  display: grid;
  grid-template-columns: 1fr;
}
```

![[grid-02.png]]
*1 column: every item occupies the complete width.*

### grid-template-columns: 1fr 1fr

```css
.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
```

![[grid-03.png]]
*2 columns of the same size.*

### grid-template-columns: 1fr 1fr 1fr

```css
.content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
```

![[grid-04.png]]
*3 columns of the same size.*

### grid-template-columns: 2fr 1fr

![[grid-05.png]]
*The first column is the double of the second one: 66% and 33%.*

> [!danger] The trap of `1fr` with long content
> `1fr` is really `minmax(auto, 1fr)`. The `auto` means that the track **can not be smaller than its content**, so a long text or a big image can break the layout and make the column grow.
> The fix is to force the minimum to zero:
> ```css
> grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
> ```
> This is one of the most common bugs with grid and with flex.

---

## grid-template-rows

We can also use `grid-template-rows` to set the size of the rows:

```css
.content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 100px 50px 30px 100px;
}
```

![[grid-06.png]]
*Each row has its own height: 100px, 50px, 30px and 100px.*

---

## Size of the rows generated automatically

If we have more items than the rows we defined, grid creates the extra rows alone. We can use `grid-auto-rows` to set the size of those automatic rows:

```css
.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 100px;
}
```

![[grid-07.png]]
*All the automatic rows measure 100px.*

> [!tip] The family of "auto"
> - `grid-auto-rows` → size of the automatic **rows**
> - `grid-auto-columns` → size of the automatic **columns**
> - `grid-auto-flow: row | column | dense` → the **direction** where grid adds the new items. `dense` fills the holes that are left.

---

## repeat()

Sometimes we need to put the same value a lot of times, for example:

```css
.content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 100px 100px 100px;
}
```

![[grid-08.png]]
*A 3x3 grid written by hand.*

In that case, to avoid repeating `1fr 1fr 1fr ...`, we can use the `repeat()` function:

```css
.content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 100px);
}
```

![[grid-09.png]]
*Exactly the same result, but shorter.*

We can use `repeat` even if it is not in the first position:

```css
grid-template-columns: 25px 1fr 1fr 1fr;
/* is the same as */
grid-template-columns: 25px repeat(3, 1fr);
```

And we can even repeat **more than one value**:

```css
grid-template-columns: 25px 50px 25px 50px 25px 50px;
/* is the same as */
grid-template-columns: repeat(3, 25px 50px);
```

---

## minmax()

Sometimes we want that one track keeps a minimum size. For example we have this HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .content {
      background: lightcoral;
      border: 3px solid black;
      border-radius: 10px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }

    .content div {
      background: lightblue;
      border: 1px solid #09f;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <section class="content">
    <div>content</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
    <div>7</div>
  </section>
</body>
</html>
```

![[grid-10.png]]
*With `repeat(3, 1fr)` the 3 columns always have the same size.*

When the size of the viewport is reduced they keep the same size, but sometimes we want that one track keeps a **minimum**. For that we use `minmax()`:

```css
.content {
  display: grid;
  grid-template-columns: minmax(100px, 1fr) repeat(2, 1fr);
}
```

![[grid-11.png]]
*The first column never goes below 100px, even if the screen is very small.*

> [!note] How to read `minmax(100px, 1fr)`
> "Never smaller than 100px, and if there is free space, grow like a `1fr`."

---

## Grid with responsive behavior

Sometimes we have this type of interface:

![[grid-12.png]]
*A gallery of cards.*

When the viewport is reduced we need the columns to change from 3 to 2 and to 1. Usually a `@media` query is used for that:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    div {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    img {
      width: 100%;
      height: auto;
      border-radius: 8px;
    }

    @media (width > 300px) {
      div {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (width > 600px) {
      div {
        grid-template-columns: 1fr 1fr 1fr;
      }
    }
  </style>
</head>
<body>
  <div>
    <img src="https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/91Npx-joNmL._AC_UF1000,1000_QL80_.jpg" />
    <!-- ... 8 more images ... -->
  </div>
</body>
</html>
```

![[grid-13.png]]
*1 column on a small screen.*

![[grid-14.png]]
*2 columns after the first breakpoint.*

![[grid-15.png]]
*3 columns after the second breakpoint.*

This is **not wrong**, but it is not the best way to use grid. The problems are that we have to write every breakpoint by hand, we choose the numbers by guessing, and if tomorrow we want 4 columns we have to touch the CSS again.

Grid can do it **alone**:

```css
div {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
```

![[grid-16.png]]
*The same result...*

![[grid-17.png]]
*...but with 3 lines of CSS and no media queries.*

With the line:

```css
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
```

when the viewport grows, grid fills the space with columns automatically. We are not saying "3 columns", we are saying **"as many columns of at least 200px as you can fit"**.

### The breakpoints

Less space = less columns:

| Width of the screen | Columns |
|---|---|
| **less** than 430px | 1 column |
| between 430px and 660px | 2 columns |
| **more** than 660px | 3 columns |

The maths of where those numbers come from: 2 columns need `200 + 200 + 16 (gap) = 416px`, and 3 columns need `200 × 3 + 16 × 2 = 632px`. Adding the margin of the body we get more or less the 430px and 660px of the screenshots.

![[grid-18.png]]
*Less than 430px → 1 column.*

![[grid-19.png]]
*More than 430px → 2 columns.*

![[grid-20.png]]
*More than 660px → 3 columns.*

### auto-fill vs auto-fit

A **classic interview question**. They look the same until the screen is very wide:

```css
repeat(auto-fill, minmax(200px, 1fr))  /* creates EMPTY columns */
repeat(auto-fit,  minmax(200px, 1fr))  /* collapses the empty columns */
```

With 3 items in a very wide container:

```
auto-fill →  [item] [item] [item] [  ] [  ]   ← the empty tracks still exist
auto-fit  →  [ item ] [ item ] [ item ]       ← the items grow and fill everything
```

> [!tip] Which one do I use?
> **`auto-fit`** almost always, because we usually want the items to fill the space.
> **`auto-fill`** when we want to keep the columns aligned with something else, or when we do not want a single item to become gigantic.

---

## Bento grids

Sometimes we need to create interfaces like these:

![[grid-21.png]]
*Bento layout: items with different sizes.*

![[grid-22.png]]
*Another example of bento.*

Grid has the possibility to change the position of each item using:

```css
grid-column-start
grid-column-end
grid-row-start
grid-row-end
```

> [!important] They are LINES, not columns
> This is the part that confuses everybody. The numbers are the **lines** that separate the tracks, not the tracks. In a grid of 3 columns there are **4** lines:
> ```
> 1     2     3     4     ← the lines
> |     |     |     |
> |  A  |  B  |  C  |     ← the columns
> ```
> So to occupy only the first column it is `grid-column-start: 1` and `grid-column-end: 2`.

For example we have this grid:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    .content {
      background: lightcoral;
      border: 3px solid black;
      border-radius: 10px;
      display: grid;
      grid-template-columns: minmax(100px, 1fr) repeat(2, 1fr);
      grid-auto-rows: 50px;
      gap: 4px;
    }

    .content div {
      background: lightblue;
      border: 2px solid #09f;
      border-radius: 6px;
    }

    .content div:first-child {
      background: lightgreen;
      border: 2px solid green;
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 1;
      grid-row-end: 2;
    }

    .content div:nth-child(2) {
      background: #09f;
      border: 2px solid purple;
    }
  </style>
</head>
<body>
  <section class="content">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
    <div>5</div>
    <div>6</div>
    <div>7</div>
    <div>8</div>
  </section>
</body>
</html>
```

![[grid-23.png]]
*The base grid, before moving anything.*

> [!warning] The `end` line must be bigger than the `start` line
> `grid-row-start: 1; grid-row-end: 1;` does not work — the browser ignores it and falls back to `span 1`. To occupy the row 1 it is `grid-row-end: 2`.

And if we need the first cell to be empty, we move the first element to the column 2:

```css
.content div:first-child {
  background: lightgreen;
  border: 2px solid green;
  grid-column-start: 2;
  grid-column-end: 3;
}
```

![[grid-24.png]]
*The green item jumps to the second column and leaves the first one empty.*

And we can also change the **size** of the first element:

```css
.content div:first-child {
  background: lightgreen;
  border: 2px solid green;
  grid-column-start: 2;
  grid-column-end: 4;
}
```

![[grid-25.png]]
*From the line 2 to the line 4 = it occupies 2 columns.*

If we want to replicate this bento:

![[grid-26.png]]
*The target: the first item is tall.*

We can do something like this:

```css
.content div:first-child {
  background: lightgreen;
  border: 2px solid green;
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 3;
}
```

![[grid-27.png]]
*From the row line 1 to the 3 = it occupies 2 rows.*

### The `span` keyword

This way of resizing the elements can be weird, because we have to think in absolute lines. We can use `span` to say **how many tracks** the item has to fill:

```css
.content div:first-child {
  background: lightgreen;
  border: 2px solid green;
  grid-row-start: span 2;
}
```

![[grid-28.png]]
*The same result, but easier to read: "occupy 2 rows".*

`span` is a **keyword** (a value), not a property. We write it **inside** `grid-row-start`, `grid-column-start`, `grid-row-end`, `grid-column-end`, `grid-row` and `grid-column`.

```css
.content div:first-child {
  background: lightgreen;
  border: 2px solid green;
  grid-row-start: span 2;
  grid-column-start: span 2;
}

.content div:nth-child(2) {
  background: #09f;
  border: 2px solid purple;
  grid-column-start: span 3;
  grid-row-start: span 2;
}
```

> [!tip] The shorthand is cleaner
> Instead of writing `start` and `end` separated, we can use `grid-column` and `grid-row` with a `/`:
> ```css
> grid-column: 2 / 4;      /* from the line 2 to the line 4 */
> grid-row: 1 / 3;         /* from the line 1 to the line 3 */
> grid-column: span 2;     /* occupy 2 columns */
> grid-row: 1 / -1;        /* from the first line to the LAST one */
> ```
> `-1` is very useful: it is always the last line, so we do not need to count.

> [!question] Short answer for the interview
> "Grid is 2 dimensions, rows and columns at the same time, and flex is only 1. In grid the container defines the tracks with `grid-template-columns` and `grid-template-rows`, and the items are placed with `grid-column` and `grid-row`, which work with the **lines** of the grid, not with the tracks. For responsive layouts the best tool is `repeat(auto-fit, minmax(200px, 1fr))`, because it adapts the number of columns alone, without media queries."

---

# 3. flex vs grid

| | Flexbox | Grid |
|---|---|---|
| Dimensions | **1** (a row **or** a column) | **2** (rows **and** columns at the same time) |
| Who decides | The **content** | The **container** |
| Good for | Navbars, toolbars, groups of buttons, cards in a line | Full page layouts, galleries, bento |

> [!question] Short answer for the interview
> "Flexbox is one dimension and grid is two. I reach for flex when the content decides the sizes — a navbar, a toolbar, a row of buttons — and for grid when the container decides them: a page layout, a gallery, a bento. They compose: a grid for the page, flex inside each cell."

---

# Still to fill

- [ ] Box model and `box-sizing: border-box`
- [ ] Specificity and the cascade
- [ ] Units: `rem` vs `em` vs `px` vs `%` vs `vw`/`vh` vs `ch`
- [ ] Positioning: `static`, `relative`, `absolute`, `fixed`, `sticky`
- [ ] Stacking context and `z-index`
- [ ] Container queries (`@container`) — the replacement for most media queries
- [ ] Logical properties (`inline-start`, `block-end`) and why they beat `left`/`right`
- [ ] Custom properties (CSS variables) and theming
