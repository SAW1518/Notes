'use client';



export function useStoredCurrency(){
 return localStorage.getItem('currency')
}

export function setStoredCurrency(currency: string) {
 localStorage.setItem('currency', currency)
}