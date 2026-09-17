---
title: "display: flex"
source: https://www.notion.so/1042ca354f904c17b45e1d8b120c25ff
notion-id: 1042ca35-4f90-4c17-b45e-1d8b120c25ff
parent: "CSS"
tags: [notion-import]
---
# display: flex

flex should to seted in the parent and provides a container that can be oriented vertical or horizontal using:

flex-direction:column

flex-direction:row ←defalut

## flex-wrap:

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <style>
        body {}
        .parent {
            display: flex;
            flex-direction: row; /* defect row */
            flex-wrap: nowrap;
            border: 4px solid black ;
            width: 200px;

        }
        .item {
            border: 1px solid ;
            opacity: .9;
            width: 100px;
            height: 100px;
            background: #09f;
        }
        .item:first-child {
            background: yellow;
        }

        .item:last-child {
            background:red;
        }
    </style>

</head>

<body>

    <section class="parent" >
        <div class="item">primero</div>
        <div class="item">2</div>
        <div class="item">3</div>
    </section>
</body>

</html>
```

![[attachments/flex-01.png]]
*Untitled*

in this example we can se the flex-wrap: wrap ←default

of this in this way the flex container always maintains the widthand height adjusting the children

if change the property flex-wrap: wrap the children’s will do a line break:

![[attachments/flex-02.png]]
*Untitled*

## flex-direction + flex-wrap :

flex-flow: row wrap;

```css
.parent {
    display: flex;
    flex-flow: row wrap; /* flex-direction: row; flex-wrap: wrap;*/
    border: 4px solid black ;
    width: 200px;

}
```

## More tags for item of flex:

Flex initial

flex-grow: 0; 0 by default the elemnts not grow

flex-shrink: 1; 1 by default the elemnts can reduce the size more that flex-basis

flex-basis: auto; auto flex-basis is the width and height when is auto

### flex: 1:

is an abbreviation of the above

```html
<html lang="en">

<head>
    <style>
        body {}
        .parent {
            display: flex;
            flex-flow: row nowrap; /* flex-direction: row; flex-wrap: wrap;*/
            border: 4px solid black ;
            width: 200px;

        }
        .item {
            border: 1px solid ;
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
            background:red;
        }
    </style>

</head>

<body>

    <section class="parent" >
        <div class="item">primero</div>
        <div class="item">2</div>
        <div class="item">3</div>
    </section>
</body>

</html>
```

![[attachments/flex-03.png]]
*Untitled*

flex :1 , 2 ,3 :

Distribute the weight of the elements if in general we have a flex 1 and some have a greater flex like flex: 2 that 2 will take twice as much as the rest

![[attachments/flex-04.png]]
*Untitled*

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>
        body {}
        .parent {
            display: flex;
            flex-flow: row nowrap; /* flex-direction: row; flex-wrap: wrap;*/
            border: 4px solid black ;
            width: 200px;

        }
        .item {
            border: 1px solid ;
            opacity: .9;
            width: 100px;
            height: 200px;
            background: #09f;
            box-sizing: border-box;
            flex: 1;
        }
        .item:first-child {
            background: yellow;
            flex: 2
        }

        .item:last-child {
            background:red;
        }
    </style>

</head>

<body>

    <section class="parent" >
        <div class="item">primero</div>
        <div class="item">2</div>
        <div class="item">3</div>
    </section>
</body>

</html>
```
