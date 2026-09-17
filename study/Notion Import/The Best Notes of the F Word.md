---
title: "The Best Notes of the F *Word"
source: https://www.notion.so/0adbfe8a0b154c1c9206d5bfba275041
notion-id: 0adbfe8a-0b15-4c1c-9206-d5bfba275041
tags: [notion-import]
---
# The Best Notes of the F *Word

## JS:

## CSS:

- [[CSS]]

- [[Array Notes]]

- [[Questions for interviews]]

- [[Utils]]

## Call stack:

the call stack has the task to execute the code of ous JS application is a fifo () this receive the Js task like conslo.log or a nornal js code the in some case the event loop sent things to the call stack from the microtask queue and the task queue ,  microtask queue having more prority like task queue  

### Task Queue:

is a special Queue in Js used to handle callback from browser apis like a fech api , geolocation api or setTimer when the apis are relverd that callback go to the Task Queue

### Microtask Queue:

is special Queue to handle things like a promises or Microtask 

### Event Loop:

is pies of js mechanism and has the reputability to get the task from the Task Queue and Microtask Queue and pased the call sack 

## Which methods replace UseEffect:

### Mounting phase (component creation)

- **Class Component** → `componentDidMount()`

- **Functional Component** → `useEffect(() => { ... }, [])` 

(empty dependency array = run once after initial render)

### Updating phase (when props/state change)

- **Class Component** → `componentDidUpdate(prevProps, prevState)`

- **Functional Component** → `useEffect(() => { ... }, [dependencies])`
  (runs whenever listed dependencies change)

### Unmounting phase (cleanup)

- **Class Component** → `componentWillUnmount()`

- **Functional Component** → `useEffect(() => { return () => { ... } }, [])`
  (cleanup function inside effect = runs before component unmounts)

how promises works ?

### hooks:

Hooks are introduction in react 16 and have 2 mayor proposals 1 is  the code reusability we can create a custom hooks to encapsulate reusable  of code and the 2 Is a special functions in React that allows to use React 

## UseEffect vs useLayoutEffect:

The UseEffect is executed after the browser render the component

useLayoutEffect is executed after React applies changes to the DOM, but before the browser paints to the screen.

useLayoutEffect is mostly used to make measurements an based in that make mico adjustments in a very specific complete like tooltips, popovers, modals 

### 

pros and contr of js vs ts

steps to improve peronmance React app

virtulitation in recat  

servise worker

asynchomus rendering

npm audit

manegate sensivie data 

js design patterns

- strategy pattern

- observer pattern

- pub-sub

- anti pattens

- futional patten

- recat compotion

js principals:

- dry

- Yagni

- kiss

- crete rules in linter to  keep readable manteinable gooal to limeted the line size parameter size, to keep the conventions in the proyects 

- solid

- depens inyection vs vertinal control 

- funtional and no funtional requriament

- why we need state managemnet

Work metodologis:

wonderfall

agail 

kamban

tipos de test unit test , integation test , regrciones test , ent to end test \

contunuis integration

contunuis delevery

contunuis deplayment

Debounce vs throttle

window vs global
