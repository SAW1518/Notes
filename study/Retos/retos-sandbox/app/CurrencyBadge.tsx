'use client';


import { useSyncExternalStore } from "react";
import { useStoredCurrency } from "./currency";


function subscribe (onChange: ()=> void) {
console.log('A subscribe')
window.addEventListener('storage', onChange)
return () => window.removeEventListener('storage', onChange)
}

function getServerSnapshot(){
 console.log('C render')
 return 'USD'
}

export function CurrencyBadge() {
 console.log('D render')
 const currency = useSyncExternalStore(subscribe, useStoredCurrency, getServerSnapshot)
 return <span>{currency}</span>
}