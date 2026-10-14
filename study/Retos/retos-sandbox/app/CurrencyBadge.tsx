'use client';


import { WindSong } from "next/font/google";
import { useSyncExternalStore } from "react";

function subscribe (onChange: ()=> void) {
console.log('A subscribe')
window.addEventListener('storage', onChange)
return () => window.removeEventListener('storage', onChange)
}

function getServerSnapshot(){
 console.log('B getServerSnapshot')
 return localStorage.getItem('currency') ?? 'USD'
}

function getServer(){
 console.log('C render')
 return 'USD'
}

export function CurrencyBadge() {
 console.log('D render')
 const currency 
}