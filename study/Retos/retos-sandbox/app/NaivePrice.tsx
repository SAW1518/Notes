'use client';

export function NaivePrice () {
 const curency = typeof window !== 'undefined' ? localStorage.getItem('currency') ?? 'USD' : 'USD'

 return <p>Prece in {curency}</p>
}