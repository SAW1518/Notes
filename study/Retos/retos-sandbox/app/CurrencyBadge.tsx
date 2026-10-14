'use client';


import { useSyncExternalStore } from "react";


function subscribe (onChange: ()=> void) {
console.log('A subscribe')
window.addEventListener('storage', onChange)
return () => window.removeEventListener('storage', onChange)
}

function getSnapshot(){
 console.log('B getSnapshot')
 return localStorage.getItem('currency') ?? 'USD'
}

function getServerSnapshot(){
 console.log('C render')
 return 'USD'
}

export function CurrencyBadge() {
 console.log('D render')
 const currency = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
 return <span>{currency}</span>
}