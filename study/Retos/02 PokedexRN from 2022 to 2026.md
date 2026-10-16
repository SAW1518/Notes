---
title: "Reto 02 — PokedexRN, from 2022 to 2026"
tags:
  - challenge
  - react-native
  - expo
positions:
  - OXXO
status: todo
---

# Reto 02 — PokedexRN, from 2022 to 2026

**Goal:** rebuild my last React Native app, written in January 2022, the way it would be written today — and be able to explain **every** change: what the 2022 code did wrong, which part of the platform changed underneath it, and what replaced it.

**Why it matters:** OXXO asks for React Native, and I left it in 2022, on the bridge. "What changed in four years?" is a guaranteed question, and the strongest answer is a concrete one: *"I rebuilt my own 2022 app on Expo SDK 57, and here is what I had to change and why."*

The original: [SAW1518/PokedexRN](https://github.com/SAW1518/PokedexRN) — React Native 0.66.4, React 17, CLI (`react-native init`), React Navigation 6 (tabs with a native stack per tab), axios + `retry-axios`, AsyncStorage, Flow, Jest 26. It lists Pokémon from the [PokeAPI](https://pokeapi.co), shows a detail screen, and has an unfinished Favorites tab.

Background: [[Vacantes/OXXO]] (the 2022 → 2026 table) · [[01 useSyncExternalStore and hydration]] (Level 2 reuses its pattern) · [[JavaScript]] (error layers — why `try/catch` around a `.then` catches nothing).

> [!warning] Do each level before opening its solution
> The solutions are folded. Write your answer first — on paper for level 0, in the sandbox for the rest — then open the fold and compare.

---

## Setup — the Expo sandbox

The code lives in `Retos/retos-expo/`, separate from the Next.js `retos-sandbox`. Its source is committed and syncs to the other Mac; `node_modules/`, `.expo/`, `ios/` and `android/` are git-ignored, so run `npm install` there first.

To create it from scratch:

```bash
cd Retos
npx create-expo-app@latest retos-expo
cd retos-expo
npx expo install @tanstack/react-query expo-sqlite expo-image expo-network
npx expo start
```

The default template ships example screens. If `package.json` has a `reset-project` script, run `npm run reset-project`; otherwise delete the example routes in `app/` yourself.

`npx expo install` (not `npm install`) picks the versions that match the project's SDK. Everything in this reto runs in **Expo Go** — no native module outside the Expo SDK — so there is no development build to make.

Where to run it, from the `npx expo start` terminal:

- **Phone:** scan the QR with Expo Go (same Wi-Fi as the Mac). Expo Go only runs the current SDK, which is what `create-expo-app@latest` gives you.
- **iOS Simulator:** press `i` (needs Xcode).
- **Android emulator:** press `a` (needs Android Studio and a running emulator).

Two places to watch:

- **The terminal** where Metro runs → `console.log` output and bundling errors.
- **React Native DevTools** → press `j` in the terminal. It replaced Flipper and Chrome's remote debugging.

---

## Level 0 — Read your 2022 code and predict

No running anything. These are excerpts of the original, unchanged.

**A. `src/hooks/useLocal.js`** — meant to persist favourites:

```js
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from "react";

export default function UseLocal(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = AsyncStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (e) {
            return initialValue
        }
    })

    const setValue = value => {
        try {
            setStoredValue(value)
            AsyncStorage.setItem(key, JSON.stringify(value))
        } catch (e) {
            console.error(e)
        }
    }
    return [storedValue, setValue]
}
```

**B. `src/screens/ListOfPokemon.js`** — the list and its infinite scroll (styles cut):

```js
export default function ListOfPokemon() {
    const [listPokes, setListPokes] = useState([]);
    const [nextUrl, setNextUrl] = useState('');
    useEffect(() => {
        getData()
    }, [])

    const getData = (url) => {
        let pkArray = []
        GetPokemonList(url).then(async (res) => {
            setNextUrl(res.nexUrl)
            for await (const pk of res.results) {
                const {url} = pk
                GetPokemonDetailByUrl({url}).then((pkD) => {
                    pkArray.push({
                        id: pkD.id,
                        name: pkD.name,
                        types: pkD.types,
                        order: pkD.order,
                        image: pkD.sprites.other['official-artwork'].front_default
                    })
                    setListPokes([...listPokes, ...pkArray])
                })
            }
        })
    }

    const loadMore = () => getData(nextUrl)

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                keyExtractor={(pk) => String(pk.id)}
                data={listPokes}
                renderItem={({item}) => <PokemonItem pokemon={item}/>}
                onEndReached={nextUrl && loadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={nextUrl && <ActivityIndicator size={"large"} />}
            />
        </SafeAreaView>
    )
}
```

with `GetPokemonList`:

```js
export default async function GetPokemonList(url = '/pokemon?limit=20offset=0') {
   return  await JSServeAxios.get(url).then(response => {
       const { data } = response
       if(Array.isArray(data.results)) {
           const {results , next, previous} = data
           const nexUrl = next.replace(BASE_URL,'')
           return {results , nexUrl, previous}
       }
    })
}
```

**C. `src/screens/PokemonDetail/PokemonDetail.js`** — the detail screen's effect:

```js
useEffect(() => {
    try {
        GetPokemonDetailById(route.params.id).then(res => {
            setPokemon(res)
        })
    } catch (e) {
        navigation.goBack()
    }
}, [])
```

and in the item and detail components: `#{`${pokemon.order}`.padStart(3, 0)}` and `` `${weight}  KG` ``.

**Answer on paper:**

1. (A) You favourite three Pokémon with `setValue`, kill the app and open it again. What is `storedValue` on the first render? Trace it line by line.
2. (A) Why was AsyncStorage's API asynchronous in the first place? What in the 2022 architecture forced it?
3. (B) On the first load, in what **order** do the 20 Pokémon appear, and how many times is `setListPokes` called?
4. (B) You fling the list to the bottom while page 2's detail requests are still arriving, so page 3 starts loading. What can happen to page 2? Find the line responsible.
5. (B) You scroll all the way to the last page. What happens?
6. (B) The default URL is `'/pokemon?limit=20offset=0'`. What is wrong with it, and why did the app work anyway?
7. (C) The PokeAPI is down. Does the detail screen go back?
8. (C) Pikachu's detail says `#035` and `60 KG`. Pikachu is #025 and weighs 6 kg. Why?

> [!success]- Solution — Level 0
> 1. **Always `initialValue`.** `AsyncStorage.getItem` returns a **Promise**, not the string. A Promise is truthy, so `JSON.parse(item)` runs; `JSON.parse` turns its argument into a string first, `"[object Promise]"`, which is not JSON → `SyntaxError` → the `catch` returns `initialValue`. The favourites are written but never read back. And `setItem` is not awaited, so if it rejects, the `try/catch` doesn't see it either.
> 2. **The bridge.** In the old architecture JS and native lived on separate threads and talked only through the bridge: every call was serialised to JSON, queued, batched and handled on the native side, and the answer came back as another async message. Native module calls were async by design — synchronous methods existed as an escape hatch, but they blocked the JS thread and broke Chrome remote debugging (the JS ran inside Chrome, not on the device). Today, with **JSI**, JS holds direct references to C++ objects and calls them synchronously — which is why MMKV and `expo-sqlite/kv-store` can offer `getItemSync`.
> 3. **In the order the responses arrive**, not in Pokédex order. `for await` over a plain array doesn't wait for anything — the elements aren't promises — so all 20 detail requests fire at once, and each `.then` pushes whatever came back first. `setListPokes` runs **20 times**, once per response. Under React 17 these updates happened outside an event handler, so they weren't batched: up to 20 renders of the whole list.
> 4. **Page 2 can vanish.** `setListPokes([...listPokes, ...pkArray])` reads `listPokes` from the closure of the render that created that `getData`. Page 2 and page 3 were started from renders that both saw the same old list, so each writes `[...oldList, ...itsOwnPage]`, and whichever page finishes last overwrites the other. The fix is the functional updater, `setListPokes(prev => [...prev, ...page])` — or not owning this state at all (Level 2). `onEndReached` can also fire more than once for the same position, which loads the same page twice and gives duplicate keys.
> 5. **It crashes the promise and spins forever.** On the last page the PokeAPI returns `next: null`, so `next.replace(...)` throws a `TypeError` inside `.then`. Nothing catches it: an unhandled rejection, `nextUrl` never changes, and the footer spinner stays.
> 6. **The `&` is missing**, so the query string has a single parameter, `limit=20offset=0`. The PokeAPI ignores the invalid `limit` and falls back to its default page size, which happens to be 20 — the bug was invisible.
> 7. **No.** `try/catch` only catches what is thrown **synchronously** inside it. The request fails later, as a rejected promise, after the `try` block has finished. The rejection goes unhandled and the spinner stays forever. It needs `.catch(...)`, or `await` inside an async function with `try/catch` around the `await`.
> 8. **Two field misreadings.** `order` is the PokeAPI's *sorting* order (evolution families grouped together), not the National Pokédex number — that is `id`. And `weight` is in **hectograms** (`height` in **decimetres**), so 60 means 6.0 kg. Neither is a React Native problem: it is reading an API contract without checking units. Worth having one such story ready — see [[TypeScript Boundary]].

---

## Level 1 — Break it on purpose, in 2026

Reproduce two of the 2022 bugs inside the new Expo project, so you have seen them, not just read about them.

1. Create `legacy/useLocal.js` as a copy of snippet A, changing **only** the import to the AsyncStorage-compatible store that ships with `expo-sqlite`:

   ```js
   import AsyncStorage from 'expo-sqlite/kv-store';
   ```

   In `app/index.tsx` — the blank screen the reset left — add a counter: `const [count, setCount] = useLocal('count', 0)`, a `<Text>` showing it and a `<Pressable>` that does `setCount(count + 1)`. Add a `console.log('item is', typeof item, item)` inside the initialiser.

   Press it three times, then reload the app (`r` in the terminal). What does the counter show? What does the log print?

2. In the same screen, run this on mount and look at the terminal:

   ```ts
   useEffect(() => {
     const ids: number[] = [];
     for (const id of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
       fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
         .then(r => r.json())
         .then(p => { ids.push(p.id); console.log('arrived', ids.join(',')); });
     }
   }, []);
   ```

   Reload a few times. Is the order ever 1 to 10?

> [!success]- Solution — Level 1
> 1. The counter goes back to **0** after the reload, and the log prints `item is object [object Promise]` (or `{"_h":0,…}`-style internals, depending on the Promise implementation). The value **is** stored — `setItem` worked — it is the read that was always broken. Same API, same bug, four years later: the store changed, the code didn't.
> 2. The order changes between reloads. Ten requests in flight in parallel finish in whatever order the network decides. Code that renders in arrival order renders a different list every time. `Promise.all` keeps the order of its **input**, not of completion — that is the Level 2 fix.
>
> Delete `legacy/` and the blank `app/index.tsx` once you've seen both — in Level 2, `app/(tabs)/index.tsx` becomes the home route, and two `index` routes at the same URL conflict.

---

## Level 2 — Rebuild it the 2026 way

Same features as the 2022 app, in TypeScript.

**Routes (Expo Router):**

```
app/
  _layout.tsx           ← root Stack, QueryClientProvider
  (tabs)/
    _layout.tsx         ← Tabs: Pokédex, Favorites, About
    index.tsx           ← the list
    favorites.tsx
    about.tsx
  pokemon/[id].tsx      ← detail, pushed above the tabs
lib/
  pokeapi.ts            ← fetch functions and types
  favorites.ts          ← the favourites store
components/
  PokemonCard.tsx
```

**Requirements:**

1. **List** with `useInfiniteQuery`: Pokédex order, no duplicates, no overwritten pages, stops cleanly at the last page, a footer spinner only while a page is loading.
2. **Detail** with `useQuery`: an error state with a Retry button — never a spinner forever. Show the right number (`id`) and the weight in kg.
3. **Favourites** survive a reload, using `expo-sqlite/kv-store`'s **synchronous** API read through `useSyncExternalStore`. Toggling in the detail screen updates the Favorites tab immediately.
4. **2026 components:** `Pressable` (not `TouchableWithoutFeedback`), `expo-image`, `SafeAreaView` from `react-native-safe-area-context` where a screen has no header, `Link` / `useLocalSearchParams` for navigation.
5. No `React.FC`, no `forwardRef`, no navigator created inside a component body.

> [!info]- Hint for requirement 3 (open only if stuck)
> It is [[01 useSyncExternalStore and hydration]] Level 2 again, with two differences: the read is `Storage.getItemSync(KEY)`, and you need a cache — `getSnapshot` must return the **same array** while nothing changed.

> [!success]- Solution — Level 2
> **`lib/pokeapi.ts`**
>
> ```ts
> const BASE_URL = 'https://pokeapi.co/api/v2';
> const PAGE_SIZE = 20;
>
> export type Pokemon = {
>   id: number;
>   name: string;
>   height: number; // decimetres
>   weight: number; // hectograms
>   types: { type: { name: string } }[];
>   stats: { base_stat: number; stat: { name: string } }[];
>   sprites: { other: { 'official-artwork': { front_default: string | null } } };
> };
>
> export type PokemonSummary = { id: number; name: string; image: string | null; types: string[] };
> export type Page = { items: PokemonSummary[]; nextOffset: number | null };
>
> async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
>   const res = await fetch(url, { signal });
>   if (!res.ok) throw new Error(`${res.status} on ${url}`);
>   return res.json() as Promise<T>;
> }
>
> export function getPokemon(id: string, signal?: AbortSignal) {
>   return getJson<Pokemon>(`${BASE_URL}/pokemon/${id}`, signal);
> }
>
> export async function getPage(offset: number, signal?: AbortSignal): Promise<Page> {
>   const list = await getJson<{ next: string | null; results: { name: string }[] }>(
>     `${BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`,
>     signal,
>   );
>   // Promise.all keeps input order, so the page is in Pokédex order whatever arrives first.
>   const details = await Promise.all(list.results.map(r => getPokemon(r.name, signal)));
>   return {
>     items: details.map(p => ({
>       id: p.id,
>       name: p.name,
>       image: p.sprites.other['official-artwork'].front_default,
>       types: p.types.map(t => t.type.name),
>     })),
>     nextOffset: list.next ? offset + PAGE_SIZE : null,
>   };
> }
> ```
>
> **`lib/favorites.ts`**
>
> ```ts
> import { useSyncExternalStore } from 'react';
> import Storage from 'expo-sqlite/kv-store';
>
> const KEY = 'favorites';
> const listeners = new Set<() => void>();
> let cached: number[] | null = null;
>
> function getSnapshot(): number[] {
>   if (cached === null) {
>     const raw = Storage.getItemSync(KEY);
>     cached = raw ? (JSON.parse(raw) as number[]) : [];
>   }
>   return cached; // same reference until toggleFavorite replaces it
> }
>
> function subscribe(onChange: () => void) {
>   listeners.add(onChange);
>   return () => {
>     listeners.delete(onChange);
>   };
> }
>
> export function useFavorites() {
>   return useSyncExternalStore(subscribe, getSnapshot);
> }
>
> export function toggleFavorite(id: number) {
>   const current = getSnapshot();
>   cached = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
>   Storage.setItemSync(KEY, JSON.stringify(cached));
>   listeners.forEach(notify => notify());
> }
> ```
>
> **`app/_layout.tsx`**
>
> ```tsx
> import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
> import { Stack } from 'expo-router';
>
> const queryClient = new QueryClient();
>
> export default function RootLayout() {
>   return (
>     <QueryClientProvider client={queryClient}>
>       <Stack>
>         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
>         <Stack.Screen name="pokemon/[id]" options={{ title: '' }} />
>       </Stack>
>     </QueryClientProvider>
>   );
> }
> ```
>
> **`app/(tabs)/_layout.tsx`**
>
> ```tsx
> import { Tabs } from 'expo-router';
>
> export default function TabsLayout() {
>   return (
>     <Tabs>
>       <Tabs.Screen name="index" options={{ title: 'Pokédex' }} />
>       <Tabs.Screen name="favorites" options={{ title: 'Favorites' }} />
>       <Tabs.Screen name="about" options={{ title: 'About', headerShown: false }} />
>     </Tabs>
>   );
> }
> ```
>
> **`app/(tabs)/index.tsx`**
>
> ```tsx
> import { useInfiniteQuery } from '@tanstack/react-query';
> import { ActivityIndicator, Button, FlatList, Text, View } from 'react-native';
> import { PokemonCard } from '../../components/PokemonCard';
> import { getPage } from '../../lib/pokeapi';
>
> export default function PokedexScreen() {
>   const query = useInfiniteQuery({
>     queryKey: ['pokedex'],
>     queryFn: ({ pageParam, signal }) => getPage(pageParam, signal),
>     initialPageParam: 0,
>     getNextPageParam: lastPage => lastPage.nextOffset, // null → hasNextPage is false
>   });
>
>   if (query.isPending) return <ActivityIndicator style={{ flex: 1 }} />;
>   if (query.isError) {
>     return (
>       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
>         <Text>Could not load the Pokédex.</Text>
>         <Button title="Retry" onPress={() => query.refetch()} />
>       </View>
>     );
>   }
>
>   const pokemon = query.data.pages.flatMap(page => page.items);
>
>   return (
>     <FlatList
>       data={pokemon}
>       keyExtractor={p => String(p.id)}
>       renderItem={({ item }) => <PokemonCard pokemon={item} />}
>       onEndReached={() => {
>         if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
>       }}
>       onEndReachedThreshold={0.5}
>       ListFooterComponent={query.isFetchingNextPage ? <ActivityIndicator /> : null}
>     />
>   );
> }
> ```
>
> **`components/PokemonCard.tsx`**
>
> ```tsx
> import { Image } from 'expo-image';
> import { Link } from 'expo-router';
> import { Pressable, StyleSheet, Text, View } from 'react-native';
> import type { PokemonSummary } from '../lib/pokeapi';
>
> export function PokemonCard({ pokemon }: { pokemon: PokemonSummary }) {
>   const number = String(pokemon.id).padStart(3, '0');
>   return (
>     <Link href={`/pokemon/${pokemon.id}`} asChild>
>       <Pressable
>         accessibilityLabel={`${pokemon.name}, number ${number}`}
>         style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
>       >
>         <View style={{ flex: 1 }}>
>           <Text>#{number}</Text>
>           <Text style={styles.name}>{pokemon.name}</Text>
>           <Text>{pokemon.types.join(' · ')}</Text>
>         </View>
>         <Image source={pokemon.image} style={styles.image} contentFit="contain" />
>       </Pressable>
>     </Link>
>   );
> }
>
> const styles = StyleSheet.create({
>   card: { flexDirection: 'row', padding: 16, margin: 6, borderRadius: 24, backgroundColor: '#eef' },
>   name: { fontSize: 20, textTransform: 'capitalize' },
>   image: { width: 96, height: 96 },
> });
> ```
>
> **`app/pokemon/[id].tsx`**
>
> ```tsx
> import { useQuery } from '@tanstack/react-query';
> import { Image } from 'expo-image';
> import { Stack, useLocalSearchParams } from 'expo-router';
> import { ActivityIndicator, Button, ScrollView, Text, View } from 'react-native';
> import { toggleFavorite, useFavorites } from '../../lib/favorites';
> import { getPokemon } from '../../lib/pokeapi';
>
> export default function PokemonDetail() {
>   const { id } = useLocalSearchParams<{ id: string }>(); // route params are always strings
>   const query = useQuery({
>     queryKey: ['pokemon', id],
>     queryFn: ({ signal }) => getPokemon(id, signal),
>   });
>   const favorites = useFavorites();
>
>   if (query.isPending) return <ActivityIndicator style={{ flex: 1 }} />;
>   if (query.isError) {
>     return (
>       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
>         <Text>Could not load this Pokémon.</Text>
>         <Button title="Retry" onPress={() => query.refetch()} />
>       </View>
>     );
>   }
>
>   const p = query.data;
>   const isFavorite = favorites.includes(p.id);
>
>   return (
>     <ScrollView contentContainerStyle={{ padding: 16 }}>
>       <Stack.Screen options={{ title: `#${String(p.id).padStart(3, '0')}` }} />
>       <Image
>         source={p.sprites.other['official-artwork'].front_default}
>         style={{ width: '100%', aspectRatio: 1 }}
>         contentFit="contain"
>       />
>       <Text style={{ fontSize: 32, textTransform: 'capitalize' }}>{p.name}</Text>
>       <Text>{p.types.map(t => t.type.name).join(' · ')}</Text>
>       <Text>
>         {p.weight / 10} kg · {p.height / 10} m
>       </Text>
>       {p.stats.map(s => (
>         <Text key={s.stat.name}>
>           {s.stat.name}: {s.base_stat}
>         </Text>
>       ))}
>       <Button
>         title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
>         onPress={() => toggleFavorite(p.id)}
>       />
>     </ScrollView>
>   );
> }
> ```
>
> **`app/(tabs)/favorites.tsx`**
>
> ```tsx
> import { useQuery } from '@tanstack/react-query';
> import { FlatList, Text } from 'react-native';
> import { PokemonCard } from '../../components/PokemonCard';
> import { useFavorites } from '../../lib/favorites';
> import { getPokemon } from '../../lib/pokeapi';
>
> function FavoriteRow({ id }: { id: number }) {
>   const key = String(id); // same key as the detail screen → shared cache entry
>   const { data } = useQuery({
>     queryKey: ['pokemon', key],
>     queryFn: ({ signal }) => getPokemon(key, signal),
>   });
>   if (!data) return null;
>   return (
>     <PokemonCard
>       pokemon={{
>         id: data.id,
>         name: data.name,
>         image: data.sprites.other['official-artwork'].front_default,
>         types: data.types.map(t => t.type.name),
>       }}
>     />
>   );
> }
>
> export default function FavoritesScreen() {
>   const favorites = useFavorites();
>   return (
>     <FlatList
>       data={favorites}
>       keyExtractor={String}
>       renderItem={({ item }) => <FavoriteRow id={item} />}
>       ListEmptyComponent={<Text style={{ padding: 16 }}>No favourites yet.</Text>}
>     />
>   );
> }
> ```
>
> **`app/(tabs)/about.tsx`** — the one screen without a header, so it owns its safe area:
>
> ```tsx
> import { Linking, Pressable, Text } from 'react-native';
> import { SafeAreaView } from 'react-native-safe-area-context';
>
> export default function AboutScreen() {
>   return (
>     <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
>       <Text style={{ fontSize: 40, fontWeight: '900' }}>Pokédex</Text>
>       <Pressable accessibilityRole="link" onPress={() => Linking.openURL('https://pokeapi.co')}>
>         <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>pokeapi.co</Text>
>       </Pressable>
>     </SafeAreaView>
>   );
> }
> ```
>
> (The 2022 About screen showed `https://pokeapi.co/` and opened `https://google.com`.)
>
> **What each 2022 bug turned into:**
>
> | 2022 | 2026 |
> |---|---|
> | `JSON.parse` of a Promise, favourites never load | `getItemSync` through JSI, read by `useSyncExternalStore` |
> | Arrival order, 20 `setState` per page | `Promise.all` keeps input order; one cache write per page |
> | Pages overwrite each other (stale closure) | The cache owns the pages; there is no `listPokes` to go stale |
> | `next.replace` on `null` | `getNextPageParam` returns `null` → `hasNextPage` is `false` |
> | `try/catch` around `.then`, spinner forever | `isError` + Retry; a rejected `queryFn` is an error state |
> | `retry-axios` configured, then commented out | Queries retry 3 times with backoff by default |
> | `createNativeStackNavigator()` inside each component body | Routes are files; layouts are `_layout.tsx` |
> | `order` and raw hectograms | `id` and `weight / 10` |
> | `TouchableWithoutFeedback`, no role | `Pressable` with a label, via `Link` |
> | `SafeAreaView` from `react-native` | `react-native-safe-area-context` — the core one is deprecated since 0.81 (Android 16 is edge-to-edge) |
> | `Dimensions.get` at module load | Flex and `aspectRatio`; `useWindowDimensions` if a size is really needed |

### Level 2 traps — answer before opening

1. Why the `!query.isFetchingNextPage` guard in `onEndReached`? What happens without it?
2. Why does `lib/favorites.ts` keep `cached` instead of parsing storage in every `getSnapshot` call?
3. `useSyncExternalStore` here has no `getServerSnapshot`. Why is that fine on a phone, and when would this exact code break?
4. `FavoriteRow` builds its key with `String(id)`. What happens if it uses `['pokemon', id]` with the number?

> [!success]- Solution — traps
> 1. `fetchNextPage` defaults to `cancelRefetch: true`: calling it again while a page is in flight **cancels and restarts** that fetch. `onEndReached` can fire several times near the bottom, so without the guard the same page is requested over and over. The guard (or `fetchNextPage({ cancelRefetch: false })`) makes it single-flight.
> 2. `getSnapshot` runs on every render, and React compares its result with `Object.is`. Parsing JSON returns a **new array** every call, which always looks "changed" → React re-renders in a loop and warns that `getSnapshot` should be cached. Same trap as [[01 useSyncExternalStore and hydration]] Level 2, trap 1.
> 3. On iOS and Android there is no server render, so React never needs a server snapshot. It breaks on **Expo Router web with static or server output**: that HTML is rendered in Node, where there is no device storage — it needs a `getServerSnapshot` returning `[]`, and then everything from reto 01 about hydration applies.
> 4. The detail screen caches `['pokemon', '25']` (params are strings) and the row caches `['pokemon', 25]`. Query keys are compared by value **and type**, so these are two entries: the same Pokémon is fetched twice and the two copies can disagree. Normalise at one place.

---

## Level 3 — OXXO: stale-but-usable data on a flaky connection

A customer opens the app on the bus: the connection drops and comes back. Put the Pokédex in OXXO's shoes — think *promotions list* instead of Pokémon. The product wants:

- The list keeps showing what was loaded when the connection drops — no blank screen, no error.
- A banner: *"Offline — showing saved data"* while there is no connection.
- When the connection comes back, **or** the app returns to the foreground, stale data refreshes on its own.

TanStack Query does the last part on the web out of the box, through `window` focus and `online` events. React Native has neither. Wire it:

1. `onlineManager` → `expo-network`, so queries pause offline and resume when back online.
2. `focusManager` → `AppState`, so returning to the app refetches stale queries.
3. An `<OfflineBanner />` in the root layout.

Test it: on the simulator, turn off the Mac's Wi-Fi; on the phone, airplane mode (Metro disconnects, but the loaded app keeps running). Background the app and bring it back.

Then answer: the cached list is a **promotion** list. What would you not let the customer do from cached data, and what would you show them?

> [!success]- Solution — Level 3
> **`app/_layout.tsx`**, additions:
>
> ```tsx
> import { focusManager, onlineManager } from '@tanstack/react-query';
> import * as Network from 'expo-network';
> import { useEffect } from 'react';
> import { AppState, Platform, Text } from 'react-native';
> import { SafeAreaView } from 'react-native-safe-area-context';
>
> onlineManager.setEventListener(setOnline => {
>   const subscription = Network.addNetworkStateListener(state => {
>     setOnline(!!state.isConnected);
>   });
>   return subscription.remove;
> });
>
> function OfflineBanner() {
>   const { isConnected } = Network.useNetworkState();
>   if (isConnected !== false) return null; // undefined while unknown → don't flash the banner
>   return (
>     <SafeAreaView edges={['top']} style={{ backgroundColor: '#fde68a' }}>
>       <Text accessibilityRole="alert" style={{ padding: 8, textAlign: 'center' }}>
>         Offline — showing saved data
>       </Text>
>     </SafeAreaView>
>   );
> }
>
> // inside RootLayout:
> useEffect(() => {
>   const subscription = AppState.addEventListener('change', status => {
>     if (Platform.OS !== 'web') focusManager.setFocused(status === 'active');
>   });
>   return () => subscription.remove();
> }, []);
>
> // and render <OfflineBanner /> above <Stack>.
> ```
>
> Why it works: TanStack Query keeps the last successful data in the cache while a refetch fails or is paused, so the list never goes blank — `data` is still there, only `isFetching` / `fetchStatus` change. `onlineManager` pauses fetches while offline instead of burning retries, and resumes them on reconnect. `focusManager` turns "the app came back to the foreground" into the same refetch the web gets on tab focus. Both only refetch queries that are **stale** (`staleTime` defaults to 0).
>
> This survives losing the connection, not killing the app: the cache is in memory. To open the app offline with yesterday's list you'd add a persister (`PersistQueryClientProvider` with a storage-backed persister) — and decide a `gcTime` long enough to make that useful.
>
> **The product answer:** stale data is fine to *browse*, not to *act on*. Show "Updated 10:42" next to the list; let the customer look at promotions offline, but don't let them **redeem** one — a coupon code or a points spend — until the server confirms it's still valid. Anything that moves money or points is decided online.

---

## Level 4 — Say it out loud

Answer these out loud, in English, without looking. Then open the fold.

1. "Your last React Native app was from 2022. What has changed?"
2. Why was AsyncStorage asynchronous, and why can storage be synchronous now?
3. Why TanStack Query for the list instead of `useEffect` + `fetch`?
4. Expo or bare React Native CLI for a new app in 2026 — and does Expo still mean "no custom native code"?
5. What is the difference between Expo Go and a development build, and when do you need the second?

> [!success]- Solution — Level 4
> 1. Four layers. **Architecture:** the bridge is gone — the New Architecture is the only one since 0.82: JSI for direct JS ↔ C++ calls, Fabric as the renderer, TurboModules loaded on demand, Codegen for typed native interfaces. **Framework:** the React Native docs recommend starting with a framework, and that framework is Expo — file-based routing with Expo Router, Continuous Native Generation instead of committed native folders, EAS for builds and updates. **Libraries:** server state moved to TanStack Query; storage went synchronous (MMKV, `expo-sqlite/kv-store`); `Pressable`, `expo-image`, `react-native-safe-area-context` replaced the core equivalents. **Tooling:** Hermes is the default engine, and React Native DevTools replaced Flipper and Chrome remote debugging. Plus React itself: 17 → 19.
> 2. On the bridge every native call was an async, serialised message between two threads, so native modules were async by design. JSI lets JS hold a reference to a C++ object and call it directly, on the JS thread, with no serialisation — a small synchronous read is now cheap and safe.
> 3. Because the list's state isn't mine — it's a cache of the server. Hand-rolled, I had to get ordering, pagination, races, retries, errors and "is there a next page" right myself, and in 2022 I got four of them wrong in one screen. TanStack Query owns that: deduplication, caching, retries with backoff, an error state, and refetch on focus and reconnect once it's wired to `AppState` and the network.
> 4. Expo. It's the framework the React Native docs recommend, and it no longer implies a native ceiling: you write native code in Expo Modules, change native projects through config plugins, and `npx expo prebuild` regenerates `ios/` and `android/` from configuration — there is no "eject". I'd only weigh going without it for a brownfield app, where React Native is added into an existing native app with its own build system.
> 5. Expo Go is a prebuilt app from the store with a fixed set of native modules — the Expo SDK — and it runs only the current SDK. A development build is your own debug build of your app, with `expo-dev-client` and whatever native libraries you added. You need one as soon as a library has native code that Expo Go doesn't ship — MMKV, for instance — and for anything a real release would test, like push notifications or deep links with your own scheme.

> [!question] Short answer for the interview
> "My last React Native app was from early 2022, on the bridge, and I rebuilt it on Expo SDK 57 to see exactly what changed. The architecture is the big one: the bridge is gone, JSI lets JavaScript call native code directly, so things like storage can be synchronous now, and Fabric and TurboModules sit on top of it. The day-to-day is Expo: file-based routing, prebuild instead of maintaining native folders, EAS for builds and over-the-air updates. And server state moved to TanStack Query — rebuilding my old list screen, I deleted four bugs I had written by hand in 2022: out-of-order results, pages overwriting each other, a crash on the last page and a spinner that never stopped on errors."

---

## Done when

- [ ] Level 0 predicted on paper, all eight
- [ ] Level 1 both bugs reproduced in the Expo project
- [ ] Level 2 all five requirements, traps answered
- [ ] Level 3 offline banner and refetch-on-foreground working, product answer written down
- [ ] Level 4 answered out loud without notes
