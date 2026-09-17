---
title: "Grid:"
source: https://www.notion.so/6e686c0cd23a4c349c76ba08e18d637b
notion-id: 6e686c0c-d23a-4c34-9c76-ba08e18d637b
parent: "CSS"
tags: [notion-import]
---
# Grid:

## grid-template-columns

we can use the property CSS `grid-template-columns` to set columns that we need:

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

 

![[attachments/grid-01.png]]
*Untitled*

in grid we can use the usual measures that we used in flex :

`50% 100px auto 10vw;`

```css
.content {
            background: lightcoral;
            border: 3px solid black;
            border-radius: 10px;
            display: grid;
            grid-template-columns: 50% 100px auto 10vw;
        }
```

## Fractions Fr’s:

the fr split the 100% of space between the fr’s seeted:

`grid-template-columns: 1fr;` ← 1fr is 100% of space

`grid-template-columns: 1fr 1fr;` ← 1fr is 50% of space

`grid-template-columns: 1fr 1fr 1fr;` ← 1fr is 33% of space

`grid-template-columns: 2fr 1fr;` ← 1fr is 33% of space

### grid-template-columns: 1fr; 

```css
.content {
            background: lightcoral;
            border: 3px solid black;
            border-radius: 10px;
            display: grid;
            grid-template-columns: 1fr;
        }
```

![[attachments/grid-02.png]]
*Untitled*

### grid-template-columns: 1fr 1fr:

```css
.content {
            background: lightcoral;
            border: 3px solid black;
            border-radius: 10px;
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
```

![[attachments/grid-03.png]]
*Untitled*

### grid-template-columns: 1fr 1fr 1fr:

```css
.content {
            background: lightcoral;
            border: 3px solid black;
            border-radius: 10px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
        }
```

![[attachments/grid-04.png]]
*Untitled*

### grid-template-columns: 2fr 1fr; ← 1fr is 33% of space:

![[attachments/grid-05.png]]
*Untitled*

## grid-template-rows:

also we can use the `grid-template-rows` to set the row size 

```css
.content {
            background: lightcoral;
            border: 3px solid black;
            border-radius: 10px;
            display: grid;
            grid-template-columns: 2fr 1fr;
            grid-template-rows: 100px 50px 30px 100px;
        }
```

![[attachments/grid-06.png]]
*Untitled*

## Set size of auto generate rows:

we can use CSS property  `grid-auto-rows` to set size of rows auto genarated

```css
.content {
            background: lightcoral;
            border: 3px solid black;
            border-radius: 10px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-auto-rows: 100px;
        }
```

![[attachments/grid-07.png]]
*Untitled*

## Repeat:

some time we need put a lot times the values for example:

```css
.content {
            background: lightcoral;
            border: 3px solid black;
            border-radius: 10px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 100px 100px 100px;
        }
```

![[attachments/grid-08.png]]
*Untitled*

in that case to avoid repeat  `1fr 1fr 1fr ……` we can use repeat functions:

`grid-template-columns: repeat(3, 1fr);`
`grid-template-rows: repeat(3, 100px);`

```css
.content {
            background: lightcoral;
            border: 3px solid black;
            border-radius: 10px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(3, 100px);
        }
```

![[attachments/grid-09.png]]
*Untitled*

we can use the repeat even if no in the first position:

`grid-template-columns: 25px 1fr 1fr 1fr;` == `grid-template-columns: 25px repeat(3, 1fr);`

even  we can repeat more that one value example:

`grid-template-columns: 25px 50px 25px 50px 25px 50px` == `grid-template-columns: repeat(3, 25px 50px);`

## Minmax in Grid:

some time we want that one row keep a minimal size for example we have the HTML:

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
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

![[attachments/grid-10.png]]
*Untitled*

when the size for view port is reduced get the a same size but some time we want that one fragment keep a min size we can se the Minmax 

example:

```css
.content {
            background: lightcoral;
            border: 3px solid black;
            border-radius: 10px;
            display: grid;
            grid-template-columns: minmax(100px , 1fr) repeat(2, 1fr);
        }

        .content div {
            background: lightblue;
            border: 1px solid #09f;
            border-radius: 6px;
        }
```

![[attachments/grid-11.png]]
*Untitled*

## Grid with responsive behavior:

some time we have this type of Interface:

![[attachments/grid-12.png]]
*Untitled*

when the  view port is reduced we need  columns change of 3 and 2 and 1 usually `@media` query is used for that:

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
        <img
             src="https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/91Npx-joNmL._AC_UF1000,1000_QL80_.jpg" />
        <img
             src="https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/91Npx-joNmL._AC_UF1000,1000_QL80_.jpg" />
        <img
             src="https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/91Npx-joNmL._AC_UF1000,1000_QL80_.jpg" />
        <img
             src="https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/91Npx-joNmL._AC_UF1000,1000_QL80_.jpg" />
        <img
             src="https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/91Npx-joNmL._AC_UF1000,1000_QL80_.jpg" />
        <img
             src="https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/91Npx-joNmL._AC_UF1000,1000_QL80_.jpg" />
        <img
             src="https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/91Npx-joNmL._AC_UF1000,1000_QL80_.jpg" />
        <img
             src="https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/91Npx-joNmL._AC_UF1000,1000_QL80_.jpg" />
        <img
             src="https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/91Npx-joNmL._AC_UF1000,1000_QL80_.jpg" />
    </div>
</body>

</html>
```

![[attachments/grid-13.png]]
*Untitled*

![[attachments/grid-14.png]]
*Untitled*

![[attachments/grid-15.png]]
*Untitled*

but this a incorrect way of use grid, the correct way of use grid to do this behavior is this:

```css
div {
            display: grid;
            grid-template-columns: repeat(
                auto-fill,
                minmax(200px, 1fr)
            );
            gap: 16px;
        }
```

![[attachments/grid-16.png]]
*Untitled*

![[attachments/grid-17.png]]
*Untitled*

with the line 

`grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));`

when the view port is incremented automatically fill the size with columns:

> 430px  1 columns :

![[attachments/grid-18.png]]
*Untitled*

<430px 2 columns :

![[attachments/grid-19.png]]
*Untitled*

<660px 3 columns :

![[attachments/grid-20.png]]
*Untitled*

## bento grids:

some time we need create interfaces like :

![[attachments/grid-21.png]]
*Untitled*

![[attachments/grid-22.png]]
*Untitled*

and grid has the possibility to change the position of each item using:

`grid-column-start
 grid-column-end`

`grid-row-start`
`grid-row-end`

example we have this grid:

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
            grid-template-columns: minmax(100px , 1fr) repeat(2, 1fr);
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
            grid-row-end: 1;
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

![[attachments/grid-23.png]]
*Untitled*

and we need the the first element is empty:

```css
.content div:first-child {
            background: lightgreen;
            border: 2px solid green;
            grid-column-start: 2;
            grid-column-end: 3;
        }
```

![[attachments/grid-24.png]]
*Untitled*

and also we can change the size of fist elenent:

```css
.content div:first-child {
            background: lightgreen;
            border: 2px solid green;
            grid-column-start: 2;
            grid-column-end: 4;
        }
```

![[attachments/grid-25.png]]
*Untitled*

if we want replicate this bento:

![[attachments/grid-26.png]]
*Untitled*

we can to something like that:

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

![[attachments/grid-27.png]]
*Untitled*

this for of resize the elements can be weird we can use the property `span` to indicate how many spaces do you have to fill

```css
.content div:first-child {
            background: lightgreen;
            border: 2px solid green;
            grid-row-start: span 2;
        }

```

![[attachments/grid-28.png]]
*Untitled*

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
