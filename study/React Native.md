---
title: React Native
tags:
  - react-native
  - expo
  - mobile
---

# React Native

A guide for coming back to React Native after four years. My last app was [PokedexRN](https://github.com/SAW1518/PokedexRN) (January 2022: React Native 0.66, React 17, CLI, React Navigation 6, axios, AsyncStorage). The ecosystem below is as of **October 2026**: React Native 0.87, Expo SDK 57 (React Native 0.86, React 19.2).

Three parts:

- **[[#Part 0 — Setting up a Mac from zero]]** — what to install, in order, and how to check each step.
- **[[#Part 1 — What I already knew]]** — the knowledge the 2022 repo shows, refreshed. Most of it still holds.
- **[[#Part 2 — What changed since 2022]]** — what is new, ordered by how likely an interview is to ask it.

Positions: [[OXXO]]. Hands-on: [[02 PokedexRN from 2022 to 2026]].

---

# Part 0 — Setting up a Mac from zero

## What each goal needs

| I want to… | Needs on the Mac |
|---|---|
| Run an Expo project on an **Android phone** with Expo Go | Node only. Expo Go comes from the Play Store |
| Run it on the **iOS Simulator** | Node + Xcode + an iOS Simulator runtime |
| Run it on the **Android emulator** | Node + Android Studio with an emulator |
| Make a **local development build** (`npx expo run:ios` / `run:android`), or a bare React Native CLI app | All of the above + JDK 17 + CocoaPods |
| Run Expo Go on a **physical iPhone** | A paid Apple Developer Program membership: Expo Go for iOS is now built with `npx eas-cli@latest go` and installed through TestFlight. Use the Simulator instead |

Watchman is only required for Expo SDK 55 and earlier. The bare React Native CLI docs still recommend it.

## Step by step

**1. Homebrew and Node** — already on this Mac (`brew --version`; Node 22 through nvm). Expo SDK 57 needs Node 22.13 or later.

```bash
node --version          # v22.13+ 
nvm alias default 22    # so new terminals use it
```

Xcode builds run outside the interactive shell, so they don't see nvm. Move nvm's init lines from `~/.zshrc` to `~/.zshenv`:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

**2. Xcode** (iOS Simulator). This Mac runs macOS 15.7, and the App Store's current Xcode (27) requires macOS Tahoe 26.6 or later. Two ways out:

- Update macOS to 26.6+, then install Xcode from the App Store; or
- Stay on 15.7 and download the latest **Xcode 26.x** from [developer.apple.com/download/all](https://developer.apple.com/download/all/) (a free Apple ID is enough). Unzip it into `/Applications`.

Then:

```bash
sudo xcode-select --switch /Applications/Xcode.app   # or Xcode_26.x.app
sudo xcodebuild -license accept
xcodebuild -runFirstLaunch
```

Open Xcode → **Settings → Components** (called Platforms on some versions) → install an **iOS Simulator** runtime. Check:

```bash
xcrun simctl list devices available | head
```

**3. JDK 17 and Android Studio** (Android emulator, local builds). React Native wants Azul Zulu JDK **17** — newer JDKs can break the Gradle build.

```bash
brew install --cask zulu@17
brew install --cask android-studio
```

If `java -version` doesn't show 17 afterwards, run `brew info --cask zulu@17`, open the folder it prints and double-click the `.pkg` installer. Then add to `~/.zshrc`:

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Open Android Studio → **More Actions → SDK Manager**:

- **SDK Platforms:** Android 16 (Baklava), **API 36** — Expo's docs say it is required to compile a React Native app — plus a **Google APIs ARM 64 v8a** system image (this Mac is Apple silicon).
- **SDK Tools:** Android SDK Build-Tools, Android SDK Command-line Tools (latest), Android Emulator, Platform-Tools.

Then **More Actions → Virtual Device Manager → Create device** → any phone → the API 36 image. Check:

```bash
source ~/.zshrc
java -version            # 17
adb --version
emulator -list-avds      # the device you created
```

**4. CocoaPods** — only for local iOS native builds (`npx expo run:ios`, bare CLI). Not needed for Expo Go on the Simulator.

```bash
brew install cocoapods
pod --version
```

**5. VS Code** — install the **Expo Tools** extension (autocomplete and validation for `app.json`, `eas.json`), plus ESLint and Prettier.

**6. Expo account and EAS CLI** — not needed until builds and over-the-air updates:

```bash
npx expo login
npm install --global eas-cli
```

## Smoke test

```bash
cd ~/Notes/Study/Retos
npx create-expo-app@latest retos-expo
cd retos-expo
npx expo start
```

In the terminal: `i` opens the iOS Simulator, `a` the Android emulator (start the emulator first), `j` opens React Native DevTools, `r` reloads. On an Android phone, scan the QR with Expo Go. If a screen appears in each, the Mac is ready.

> [!tip] Fix the environment with the tool, not by hand
> `npx expo-doctor` checks the project's dependencies against its SDK. `npx expo install <pkg>` installs the version that matches the SDK — use it instead of `npm install` for anything native.

---

# Part 1 — What I already knew

The 2022 repo shows this knowledge. Each topic: what it is, the 2022 code, and what still holds today.

## 1. The runtime model

React Native runs **JavaScript on the device** and renders to **real native views** — `UIView` on iOS, `android.view.View` on Android — not to a DOM or a WebView. Three pieces:

- **The JS thread** runs the React code: components, state, effects, business logic.
- **The UI (main) thread** owns the native views, touches and gestures.
- **Yoga**, a C++ layout engine, turns the flexbox styles into frames.

The 2022 entry point is still how a React Native app starts underneath:

```js
// index.js (2022)
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

With Expo Router, `"main": "expo-router/entry"` in `package.json` does this for you, and the `app/` folder becomes the root component.

What changed underneath — how the JS thread talks to the native side — is [[#1. The New Architecture — the bridge is gone|Part 2 §1]].

> [!question] Short answer for the interview
> "React Native runs my React code in a JavaScript engine on the device and renders real native views, not a web view. The JS thread runs React, the main thread owns the views and the gestures, and Yoga computes the flexbox layout. That's why a heavy JS task freezes the logic and the gestures that need JS, but native scrolling keeps going."

## 2. Core components

| Component | Remember |
|---|---|
| `View` | The `div`. No text directly inside it |
| `Text` | **Every** string must be inside a `Text`. Text styles only inherit from a parent `Text`, never from a `View` |
| `Image` | Remote images need an explicit size; local ones use `require('./img.png')` |
| `ScrollView` | Renders **all** its children. Fine for a detail screen, wrong for a long list |
| `FlatList` / `SectionList` | Virtualised lists — see §4 |
| `TextInput` | Controlled with `value` + `onChangeText` (the string, not an event) |
| `Button` | Barely stylable — real apps build their own on a pressable |
| `ActivityIndicator`, `Switch`, `Modal` | Native widgets |
| `Linking` | `Linking.openURL(url)` — links, phone, maps, deep links |

From the 2022 detail screen:

```js
<ScrollView style={styles.container}>
    {!pokemon ? renderLoader() :
        <>
            <Herder order={pokemon?.order} img={...}/>
            <NamePokemonDetail name={pokemon?.name}/>
            <Stats stats={pokemon?.stats}/>
        </>}
</ScrollView>
```

Still valid. Three core components have a preferred replacement today: `Touchable*` → `Pressable`, `Image` → `expo-image`, `SafeAreaView` → `react-native-safe-area-context` ([[#7. Components and styling — the new defaults|Part 2 §7]]).

> [!question] Short answer for the interview
> "The primitives are `View`, `Text`, `Image`, `ScrollView`, `TextInput` and the virtualised lists. The rules that catch web developers: every string has to be inside a `Text`, text styles don't cascade from a `View`, and a `ScrollView` renders everything, so long data goes in a `FlatList`."

## 3. Styling and layout

`StyleSheet.create`, no cascade, no selectors — styles are objects passed to `style`, and an **array** merges them left to right:

```js
// PokemonItem.js (2022)
<View style={styles.item}>
// Types.js (2022)
<Text style={[styles.typeContainer, {backgroundColor: getColorByPK(item.type.name)}]}>
```

Units are **density-independent pixels**, no `px`/`rem`. Percentages work for sizes and positions.

**Flexbox with different defaults from the web:**

| Property | React Native | Web |
|---|---|---|
| `flexDirection` | `column` | `row` |
| `alignContent` | `flex-start` | `stretch` |
| `flexShrink` | `0` | `1` |
| `flex` | A single number only | Shorthand |

`flex: 1` means "take the free space along the parent's main axis" — the most common line in any RN stylesheet.

**Screen size:** the 2022 code read `Dimensions.get('window')` inside `StyleSheet.create`, at module load. That value never updates on rotation or split screen. `useWindowDimensions()` re-renders with the new size; better still, let flex, percentages and `aspectRatio` do the work.

> [!question] Short answer for the interview
> "Styles are plain objects with flexbox from Yoga, and there's no cascade, so composition is by arrays and by components. Flexbox defaults differ from the web — column direction, no shrinking by default — and I avoid `Dimensions.get` in stylesheets because it's read once; `useWindowDimensions` or plain flex handles rotation."

## 4. Lists: `FlatList`

The 2022 list used most of the props that matter:

```js
<FlatList
    keyExtractor={(pk) => String(pk.id)}
    data={listPokes}
    numColumns={1}
    renderItem={({item}) => <PokemonItem pokemon={item}/>}
    contentContainerStyle={styles.flatListContainer}
    onEndReached={nextUrl && loadMore}
    onEndReachedThreshold={0.1}
    ListFooterComponent={nextUrl && <ActivityIndicator .../>}
/>
```

**Virtualisation:** only the rows near the viewport are mounted; the rest are blank space that gets filled as you scroll. Consequences:

- Rows lose local state when they scroll far away and unmount.
- `renderItem` should be cheap and the row component memoised — every parent render can re-render visible rows.
- `keyExtractor` must be stable and unique, or rows remount and state jumps between rows.
- `onEndReached` can fire **more than once** near the end — guard the "load more" so the same page isn't requested twice.

**Tuning props:** `getItemLayout` (fixed-height rows skip measurement), `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `removeClippedSubviews`. Plus `ListEmptyComponent`, `ListHeaderComponent`, `refreshing` + `onRefresh` for pull to refresh, `SectionList` for grouped data.

What's new: **FlashList** and **Legend List** recycle rows instead of mounting and unmounting them ([[#8. Lists and animation|Part 2 §8]]).

> [!question] Short answer for the interview
> "`FlatList` virtualises: it only mounts the rows near the viewport. So I keep `renderItem` cheap, memoise the row, give stable keys, use `getItemLayout` when rows have a fixed height, and guard `onEndReached` because it can fire several times. For a really long or heavy list I'd measure and move to FlashList, which recycles rows."

## 5. Navigation

The 2022 app used React Navigation 6: a `NavigationContainer`, bottom tabs, and a native stack **per tab**:

```js
// Navigation.js (2022)
<Tap.Navigator>
    <Tap.Screen name='ListOfPokemon' component={ListOfPokemonNavigation} options={{
        tabBarLabel: 'Lista de Pokemons',
        tabBarIcon: () => renderListImage(),
        header: (() => null)
    }}/>
</Tap.Navigator>

// PokemonItem.js (2022)
const navigation = useNavigation()
navigation.navigate("PokemonDetailScreen", {id: pokemon.id})

// PokemonDetail.js (2022)
export default function PokemonDetail({route, navigation}) { ... route.params.id ... }
```

The concepts carry over unchanged: **navigators** (stack, native stack, tabs, drawer), **nesting** (a stack inside each tab, so each tab keeps its own history), **params**, **screen options** (header, title, tab icon), going back.

What changed is how you declare them: Expo Router turns files into routes ([[#4. Expo Router — routes are files|Part 2 §4]]). React Navigation itself is on version 7 and is still the choice for a bare app.

One habit to drop: the 2022 code called `createNativeStackNavigator()` **inside** the component body, which creates a new navigator object on every render. Navigators are created once, at module level.

> [!question] Short answer for the interview
> "Navigation in React Native is navigators — stacks, tabs, drawers — nested, with params passed between screens. I used React Navigation with a stack per tab so every tab keeps its own history. Today I'd use Expo Router, which uses the same model but derives the routes from files, and gives deep links for free because every screen already has a URL."

## 6. Networking and data

The 2022 app had a **services layer** over an axios instance, with `retry-axios` for retries and a commented-out interceptor for refreshing tokens:

```js
// axiosConfig/index.js (2022)
export const JSServeAxios = axios.create({ baseURL: BASE_URL })
export const interceptorId = rax.attach(JSServeAxios)

// services/GetPokemonDetailById.js (2022)
export default async function GetPokemonDetailById (Id = 0) {
    return await JSServeAxios.get(`/pokemon/${Id}`).then(response => response.data)
}
```

Still true:

- `fetch` is built in. axios still works; with `fetch` you check `res.ok` yourself — a 404 doesn't reject (see [[JavaScript]]).
- **No CORS on native.** CORS is a browser rule; a native app can call any origin. It reappears on the web build.
- **Plain HTTP is blocked by default:** App Transport Security on iOS, cleartext traffic on Android (API 28+). Use HTTPS, or an explicit exception for local development.
- **`localhost` on the Android emulator is the emulator itself.** The Mac is `10.0.2.2`. On a physical phone, use the Mac's LAN IP.
- A service layer and interceptors for auth headers and token refresh are still the right shape.

What changed: the fetching **state** — loading, error, cache, retries, pagination — moved to TanStack Query ([[#6. Server state — TanStack Query|Part 2 §6]]).

> [!question] Short answer for the interview
> "I keep networking in a service layer with one configured client, interceptors for auth and token refresh. On mobile there's no CORS, plain HTTP is blocked by default on both platforms, and the Android emulator reaches the host at 10.0.2.2. The request lifecycle — caching, retries, pagination, refetching — I leave to TanStack Query."

## 7. Local storage

AsyncStorage: an **asynchronous**, **unencrypted** key-value store of **strings**:

```js
// Favorites.js (2022)
AsyncStorage.getItem('@favoriteList').then(res => { ... })
```

Every read is a Promise — it has to be awaited or `.then`-ed; it can't be read during render. It's not encrypted, so tokens and personal data never go there — they go to the **Keychain** (iOS) or **Keystore** (Android), through `expo-secure-store`.

What changed: synchronous stores built on JSI ([[#5. Storage — synchronous again|Part 2 §5]]).

> [!question] Short answer for the interview
> "AsyncStorage is an async, unencrypted string store, fine for preferences and caches, never for tokens — those go to the Keychain or Keystore through secure storage. Today I'd use MMKV or Expo's SQLite-backed store, which can read synchronously thanks to JSI."

## 8. State management

At work, Redux. What's current:

- **Redux Toolkit** is how Redux is written: `configureStore`, `createSlice` (reducers with Immer, so "mutating" code is safe), `useSelector` / `useDispatch` instead of `connect`, and **RTK Query** for server data. See [[State Management]].
- **Zustand** and **Jotai** for small client state with far less ceremony.
- **Server state is not client state**: data from the API lives in TanStack Query or RTK Query, not in a hand-written slice.

> [!question] Short answer for the interview
> "I've used Redux in production; today that means Redux Toolkit — slices, hooks, and RTK Query for server data. But I'd first split server state from client state: server data goes in a query cache, and what's left is usually small enough for Zustand or plain context."

## 9. Platform differences

The 2022 code had one: `textAlignVertical: 'center'` is Android-only. The tools to handle them:

```tsx
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  card: Platform.select({
    ios: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
    android: { elevation: 4 },
  }),
});

if (Platform.OS === 'android') { /* … */ }
```

And per-platform files: `Button.ios.tsx` / `Button.android.tsx` — the bundler picks one for `import Button from './Button'`.

The usual suspects: shadows (`shadow*` on iOS, `elevation` on Android — `boxShadow` now works on both, Part 2 §7), `KeyboardAvoidingView` (`behavior="padding"` on iOS, often unnecessary on Android), the Android **back button** (`BackHandler`), runtime **permissions** (both, with different flows), fonts and their weights, and performance on low-end Android devices.

> [!question] Short answer for the interview
> "Platform differences go through `Platform.select`, `Platform.OS` or `.ios` / `.android` files, kept at the edge so the screen logic stays shared. The ones I check first are shadows versus elevation, keyboard avoidance, the Android back button, permissions and low-end Android performance."

## 10. The native projects and the build

A 2022 CLI app had `ios/` (an Xcode workspace, a `Podfile`, `pod install`) and `android/` (Gradle) checked in, edited by hand when a library needed it. **Metro** bundles the JS: in **debug** the app loads it from Metro on the Mac; in **release** the bundle is baked into the binary. Release builds need signing — a certificate and provisioning profile on iOS, a keystore on Android.

All of that still exists underneath. What changed is who owns it: Expo regenerates `ios/` and `android/` from configuration, and EAS builds and signs in the cloud ([[#3. Expo — the framework|Part 2 §3]], [[#10. Build and release|§10]]).

> [!question] Short answer for the interview
> "Under any React Native app there's an Xcode project and a Gradle project; Metro bundles the JavaScript, served live in debug and embedded in release. The difference today is that I don't maintain those folders by hand — Expo generates them from config, and EAS handles signing and builds."

## 11. Debugging

Still there: the **dev menu** (`Cmd+D` on the iOS Simulator, `Cmd+M` on Android, or shake a phone), **Fast Refresh**, **LogBox** (the in-app warnings and errors). Gone: Chrome remote debugging and Flipper ([[#9. Tooling|Part 2 §9]]).

## 12. Testing

The 2022 project had Jest, React Native Testing Library 9 and `jest-native` installed — but no tests. The model hasn't changed: render the component, query it the way a user finds it, interact, assert. See [[Testing and Process]].

```tsx
import { render, screen, userEvent } from '@testing-library/react-native';

test('adds a pokémon to favourites', async () => {
  const user = userEvent.setup();
  render(<PokemonDetail pokemon={pikachu} />);
  await user.press(screen.getByRole('button', { name: 'Add to favorites' }));
  expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeOnTheScreen();
});
```

What changed: [[#11. Testing|Part 2 §11]].

---

# Part 2 — What changed since 2022

## 1. The New Architecture — the bridge is gone

**2022:** JS and native lived on separate threads and talked only through the **bridge**: every call was serialised to JSON, queued, batched, and answered asynchronously. Every native module was initialised at startup.

```js
// 2022: a native module through the bridge — async, untyped
import { NativeModules } from 'react-native';
NativeModules.Battery.getLevel(level => console.log(level));
```

**Since React Native 0.82, the New Architecture is the only one:**

| Piece | What it does |
|---|---|
| **JSI** (JavaScript Interface) | JS holds direct references to C++ objects and calls them — no JSON, no queue, and calls can be **synchronous** |
| **TurboModules** | Native modules over JSI, **loaded lazily** on first use instead of all at startup |
| **Codegen** | Generates the native glue from a **typed spec** in TypeScript, so JS and native agree on types at build time |
| **Fabric** | The new renderer: the UI tree lives in C++, layout can be measured synchronously, and React's concurrent features (Suspense, transitions) work on native |
| **Bridgeless** | The bridge is removed entirely, not just bypassed |

```ts
// 2026: a TurboModule spec — Codegen reads this file
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getLevel(): number;               // synchronous, through JSI
  requestPermission(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeBattery');
```

In practice, as an app developer: synchronous storage (MMKV), animation and gesture libraries that run on the UI thread, `useLayoutEffect` that can measure before paint, and libraries that **only** support the New Architecture (Reanimated 4, FlashList 2).

> [!question] Short answer for the interview
> "The bridge serialised every call between JavaScript and native to JSON and sent it asynchronously. The New Architecture, which is now the only one, replaces it with JSI: JavaScript calls C++ objects directly, even synchronously. TurboModules load native modules lazily, Codegen generates the glue from typed specs, and Fabric is the new renderer that lets React's concurrent features run on native. For me that shows up as synchronous storage, smoother gestures and better startup."

## 2. Hermes, the engine

Hermes has been the default engine since 0.70; JavaScriptCore stopped shipping with React Native in 0.81 (it lives on as a community package). Hermes compiles JS to **bytecode at build time**, so the app starts faster and uses less memory. **Hermes V1**, the next-generation engine, is available in recent versions.

> [!question] Short answer for the interview
> "Hermes is the default engine; it precompiles JavaScript to bytecode at build time, which mainly buys startup time and memory on low-end Android."

## 3. Expo — the framework

**2022:** Expo meant a "managed" app with a fixed set of native modules; if you needed anything else, you **ejected** and owned `ios/` and `android/` from then on. CLI was the default for serious apps.

**2026:**

- `react-native init` is gone (deprecated in 0.75). The React Native docs recommend starting with a **framework**, and that is **Expo**.
- **Continuous Native Generation (CNG):** `ios/` and `android/` are generated from `app.json` / `app.config.ts` by `npx expo prebuild`, and can be git-ignored. No eject.
- **Config plugins** apply native changes during prebuild (an `Info.plist` key, a Gradle setting) — repeatable, instead of hand edits that get lost.
- **Expo Modules API**: write your own native module in Swift and Kotlin.
- **Expo Go vs development builds:** Expo Go is a store app with a fixed set of modules, for learning. A **development build** is your own debug app with `expo-dev-client` and any native library — that's what real projects use.

```bash
npx expo install react-native-mmkv   # a library with native code
npx expo run:ios                     # prebuild + local development build
```

> [!question] Short answer for the interview
> "I'd start with Expo — it's what the React Native docs recommend, and it no longer limits native code. Native folders are generated from config with prebuild, config plugins make native changes repeatable, and I can write native modules in Swift and Kotlin. Expo Go is for learning; the team works in a development build."

## 4. Expo Router — routes are files

| React Navigation 6 (2022) | Expo Router (2026) |
|---|---|
| `NavigationContainer` + navigators in code | Folders and `_layout.tsx` files |
| `<Stack.Screen name="PokemonDetailScreen" component={…}/>` | `app/pokemon/[id].tsx` |
| `navigation.navigate('PokemonDetailScreen', {id})` | `router.push('/pokemon/25')` or `<Link href="/pokemon/25">` |
| `route.params.id` | `const { id } = useLocalSearchParams()` — always a **string** |
| `options={{ title }}` on the navigator | `<Stack.Screen options={{ title }} />` from the layout or the screen |
| A linking config, written by hand | Deep links for free: every screen has a URL |

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="pokemon/[id]" options={{ title: '' }} />
    </Stack>
  );
}
```

`(tabs)` is a **group**: it organises files without adding a URL segment. The same project builds for the web, where every route is a real URL. **API routes** (`app/api/chat+api.ts`) run on a server — the place for secrets like an LLM key.

> [!question] Short answer for the interview
> "Expo Router is file-based routing for React Native: folders and layout files define the stacks and tabs, every screen has a URL, so deep links and the web build come for free, and params arrive through `useLocalSearchParams`. API routes let me keep secrets like an AI key on a server in the same project."

## 5. Storage — synchronous again

| Need | 2026 choice |
|---|---|
| Fast key-value, read during render | **MMKV** — synchronous over JSI; needs a development build |
| Key-value inside Expo Go | **`expo-sqlite/kv-store`** — AsyncStorage-compatible, plus `getItemSync` / `setItemSync` |
| Tokens and secrets | **`expo-secure-store`** — Keychain / Keystore |
| Relational data, offline | **`expo-sqlite`** |

```ts
import Storage from 'expo-sqlite/kv-store';

Storage.setItemSync('currency', 'MXN');
const currency = Storage.getItemSync('currency'); // a string, not a Promise
```

To read it in a component and re-render on change, use `useSyncExternalStore` — the same pattern as [[01 useSyncExternalStore and hydration]].

> [!question] Short answer for the interview
> "Storage can be synchronous now because of JSI: MMKV or Expo's SQLite key-value store read without a Promise, so a preference can be read during render. Secrets still go to the Keychain or Keystore through secure storage."

## 6. Server state — TanStack Query

**2022:** `useEffect` + axios + `useState` for data, loading, error and the next page — every screen re-implemented it, with its races and stale closures.

**2026:**

```tsx
const { data, isPending, isError, refetch } = useQuery({
  queryKey: ['pokemon', id],
  queryFn: ({ signal }) => getPokemon(id, signal),
});
```

Cache by key, deduplication, retries with backoff, stale-while-revalidate, `useInfiniteQuery` for pagination, `useMutation` with optimistic updates. Two lines of wiring are specific to React Native, because there is no `window` focus and no browser `online` event: **`focusManager`** with `AppState` and **`onlineManager`** with the network state. The [[02 PokedexRN from 2022 to 2026]] Level 3 has the code.

> [!question] Short answer for the interview
> "Data from the API is a cache of the server, so I use TanStack Query instead of effects: caching, deduplication, retries, pagination and refetching come built in. On React Native I wire its focus manager to `AppState` and its online manager to the network state, so it refetches when the app comes back to the foreground or the connection returns."

## 7. Components and styling — the new defaults

| 2022 | 2026 | Why |
|---|---|---|
| `TouchableOpacity`, `TouchableWithoutFeedback` | `Pressable` | One API, `pressed` state for styling, hit slop, long press |
| Core `Image` | `expo-image` | Disk and memory cache, placeholders, transitions, modern formats |
| `SafeAreaView` from `react-native` | `react-native-safe-area-context` | Core one is deprecated since 0.81 and was iOS-only |
| Opt-in edge-to-edge | **Edge-to-edge is mandatory** on Android 16 | Content draws under the system bars; insets are your job |
| `margin` on every child | `gap`, `rowGap`, `columnGap` | Since 0.71 |
| `shadow*` vs `elevation` | `boxShadow` and `filter` | Since 0.76, New Architecture |
| `accessibilityRole` / `accessibilityLabel` | Also `role` and `aria-*` | Since 0.71, closer to the web |
| Flow | TypeScript | The template default since 0.71 |

```tsx
<Pressable
  onPress={onAdd}
  accessibilityRole="button"
  accessibilityLabel="Add to favorites"
  style={({ pressed }) => [styles.button, pressed && { opacity: 0.6 }]}
>
  <Text>Add</Text>
</Pressable>
```

Styling libraries worth recognising: **NativeWind** (Tailwind classes) and **Unistyles** (themes and breakpoints on top of `StyleSheet`).

## 8. Lists and animation

- **FlashList** (Shopify) **recycles** row views instead of unmounting them; version 2 is New-Architecture-only and no longer needs a size estimate. **Legend List** is a newer alternative. Both are near drop-in replacements for `FlatList`.
- **Reanimated 4** (New Architecture only) runs animations on the UI thread through worklets, and adds a CSS-like API for animations and transitions. With **Gesture Handler**, gestures stay smooth even when the JS thread is busy.
- **React Native Skia** for custom 2D drawing.

> [!question] Short answer for the interview
> "For lists I start with `FlatList`, measure, and move to FlashList when the list is long or the rows are heavy, because it recycles views. Animations run on the UI thread with Reanimated and Gesture Handler, so they stay at frame rate even when JavaScript is busy."

## 9. Tooling

- **React Native DevTools** (default since 0.76) replaced Chrome remote debugging and Flipper: Chrome-DevTools-style console, sources and breakpoints, React DevTools, a profiler — debugging the JS where it actually runs, on Hermes. Open it with `j` from Metro.
- **`npx expo-doctor`** checks dependency versions against the SDK.
- **0.87:** a **strict TypeScript API** by default (types generated from the source, deep imports into internals restricted), experimental **Swift Package Manager** support instead of CocoaPods, and `InteractionManager` removed.

## 10. Build and release

| 2022 | 2026 |
|---|---|
| Xcode and Gradle on my machine, Fastlane | **EAS Build** — cloud builds, iOS without a Mac |
| Upload by hand / Fastlane | **EAS Submit** to App Store Connect and Google Play |
| CodePush (App Center) | **EAS Update** — App Center and CodePush were retired in 2025 |
| CI scripts | **EAS Workflows**, or GitHub Actions calling EAS |

`eas.json` defines **profiles** — `development`, `preview` (internal distribution for QA), `production`.

**Over-the-air updates only replace JavaScript and assets.** Any native change — a new native library, a permission, an SDK upgrade — needs a store build. `runtimeVersion` (with the `fingerprint` policy, computed from the native project) makes sure an update only reaches binaries whose native code it is compatible with.

> [!question] Short answer for the interview
> "Builds and signing run on EAS: profiles for development, internal preview and production, then submit to the stores with a staged rollout. JavaScript-only fixes ship over the air with EAS Update, guarded by a runtime version derived from the native fingerprint, so an update never lands on a binary it isn't compatible with. Anything native goes through the stores."

## 11. Testing

- **React Native Testing Library 13**: Jest matchers built in (`toBeOnTheScreen`, `toBeDisabled`, `toHaveTextContent` — no `jest-native` setup), **`userEvent`** for realistic presses and typing, **`getByRole`** first.
- **`react-test-renderer` is deprecated** (React 19). Snapshot-everything tests are out of fashion; behaviour tests are in.
- **E2E: Maestro** (YAML flows, little setup) is common; Detox is still around.
- Visual and isolated components: **Storybook for React Native**.

---

# Study order

1. **Part 0** — the Mac set up and the smoke test passing on the Simulator and the emulator.
2. **Part 1** — read it against the 2022 repo; say every *Short answer* out loud.
3. **Part 2 §1–§4** — the New Architecture, Hermes, Expo, Expo Router: the "what changed" answer stands on these.
4. **Part 2 §5–§7** — storage, TanStack Query, the new components.
5. **Hands-on:** [[02 PokedexRN from 2022 to 2026]].
6. **Part 2 §8–§11**, then the position's own `# Still to study` in [[OXXO]].

# Still to study

- [ ] Expo Router beyond the basics: modals, protected routes, typed routes, universal links
- [ ] Development builds and EAS end to end: `eas.json` profiles, a build, an update, a rollback
- [ ] Reanimated 4: shared values, worklets, the CSS-like API — one real animation
- [ ] Offline: TanStack Query persistence and mutation queues
- [ ] Auth: OAuth 2 + PKCE with `expo-auth-session`, tokens in `expo-secure-store`
- [ ] Writing an Expo Module in Swift and Kotlin
- [ ] Performance profiling: React Native DevTools profiler, Android systrace, startup time
