---
title: Grid
tags:
  - study
  - css
  - grid
  - interview
parent: "[[CSS]]"
original: "[[Notion Import/Grid|Notion version]]"
---

# Grid

Part of [[CSS]].

> [!warning]- 4 things that were wrong in the original (read this first)
> 1. **`span` is not a property.** It is a **keyword** that we use inside `grid-row-start`, `grid-column-start`, etc.
> 2. **The breakpoints were inverted.** It said "> 430px → 1 column" and "< 430px → 2 columns". It is the opposite: less space = less columns.
> 3. **`grid-row-end: 1` does not work.** The `end` line has to be **bigger** than the `start` line. To occupy the row 1 it is `grid-row-end: 2`.
> 4. **`fr` does not split "the 100% of the space".** It splits the space that is **free**, after the fixed sizes and the `gap`.

## Quick reference

| Property | What it does |
|---|---|
| `display: grid` | Turns the element into a grid container |
| `grid-template-columns` | Defines the **columns** |
| `grid-template-rows` | Defines the **rows** |
| `grid-auto-rows` | Size of the rows created **automatically** |
| `gap` | Space **between** the cells |
| `repeat(n, value)` | Avoids repeating the same value n times |
| `minmax(min, max)` | A track with a minimum and a maximum size |
| `grid-column` / `grid-row` | **Where** an item is placed and how much it occupies |

---

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

The `fr` unit splits the **free space** between the tracks that use `fr`.

```css
grid-template-columns: 1fr;          /* 1 column, 100% of the space */
grid-template-columns: 1fr 1fr;      /* each 1fr is 50% */
grid-template-columns: 1fr 1fr 1fr;  /* each 1fr is 33% */
grid-template-columns: 2fr 1fr;      /* 2fr is 66%, 1fr is 33% */
```

The maths is easy: we sum all the `fr` and each track receives its part. In `2fr 1fr` the total is `3fr`, so `1fr` = 1/3 = 33%.

> [!warning] Correction: it is the FREE space, not the total
> The original said that `fr` splits "the 100% of the space". It splits what is **left** after the fixed sizes and the gaps:
> ```css
> grid-template-columns: 100px 1fr 1fr;
> gap: 20px;
> ```
> In a container of 500px: the `1fr` do **not** split 500px. They split `500 - 100 - 40 (2 gaps) = 360px`, so each one is 180px.

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

> [!danger] Correction: the original had them inverted
> The original note said "> 430px → 1 column" and "< 430px → 2 columns". It is the opposite: **less space = less columns**.

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

This was not in the original note and it is a **classic interview question**. They look the same until the screen is very wide:

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

> [!danger] Correction: `grid-row-end: 1` does not work
> The original had `grid-row-start: 1; grid-row-end: 1;`. The `end` line has to be **bigger** than the `start` one, if not the browser ignores it and uses `span 1`. To occupy the row 1 it is `grid-row-end: 2`. I already fixed it in the code above.

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

> [!warning] Correction: `span` is not a property
> The original said "the property `span`". `span` is a **keyword** (a value) that we write **inside** the properties `grid-row-start`, `grid-column-start`, `grid-row-end`, `grid-column-end`, `grid-row` and `grid-column`.

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
