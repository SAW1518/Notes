---
title: "Utils"
source: https://www.notion.so/6513a04867dc4e3990f1bea15ca487cc
notion-id: 6513a048-67dc-4e39-90f1-bea15ca487cc
parent: "The Best Notes of the F Word"
tags: [notion-import]
---
# Utils

## Data:

```javascript
[12, 5, 8, 130, 44].every((element, index, array) => {
    //console.log(element);  -> 12
    //console.log(index); -> 0,1,2
    //console.log(array); -> [ 12, 5, 8, 130, 44 ]
    return true;
});

var fecha = new Date();

// Obtenemos las horas, minutos y segundos
var horas = fecha.getHours();
var minutos = fecha.getMinutes();
var segundos = fecha.getSeconds();

// Formateamos las horas, minutos y segundos para asegurarnos de que tengan dos dígitos

// Creamos una cadena con el formato deseado
var horaFormateada = horas + ':' + minutos + ':' + segundos;

console.log(horaFormateada) //'12:4:32'
```

## call api:

```javascript
const foo = async () => {
    return fetch("https://pokeapi.co/api/v2/pokemon/ditto")
        .then((res) => res.json())
        .then((dataInJson) => dataInJson)
        .catch((error) => {
            throw error;
        });
};

foo()
    .then((res) => {
        console.log("res", res);
    })
    .catch((error) => {
        console.error(error);
    });
```
