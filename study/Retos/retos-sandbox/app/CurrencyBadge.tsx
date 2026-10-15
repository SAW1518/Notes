'use client';


import { useSyncExternalStore } from "react";
import { setStoredCurrency, useStoredCurrency } from "./currency";


function subscribe (onChange: ()=> void) {
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
 return (
  <>
   <span>{currency}</span>
   <button onClick={() => setStoredCurrency('GBP')}>Set GBP</button>
   <button onClick={() => setStoredCurrency('USD')}>Set USD</button>
  </>
 )
 
}