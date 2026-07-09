
# ItalianMealsApp

ItalianMealsApp è un applicazione mobile scritta in linguaggio React Native che ci permette di visualizzare una lista di piatti italiani con al suo interno la descrizione del piatto e la sua rispettiva ricetta

La pagina offre anche una sezione di piatti preferiti selezionabili dall'utente ed una pagina di login e di profilo per l'utente che si andrà a loggare nell'applicazione




## Installation

Per poter installare correttamente questo progetto occorre prima di tutto aver installato sulla propria macchina Node.js con Expo per poterla far partire.

Successivamente entriamo nel folder principale del progetto e scarichiamo le dipendenze con il seguente comando:

```
npm install
```

Successivamente, dopo aver scaricato i node_modules correttamente facciamo partire il progetto con:

```
npx expo start
```

Inoltre va anche installata la dipendenza per la geolocalizzazione dell'app:

```
npx expo install expo-location
```

### In alternativa

Si possono scaircare le dipendenze per far partire il progetto direttamente da web qualora non fosse possibile connettersi sulla stessa rete della macchina che sta facendo partire il progetto:

```
npm install react react-dom react-native-web
```



    
## Author

- [Luca Varesio](https://github.com/lucavaresio)

## TheMealDB REST API

### `GET /filter.php?a=Italian`

```ts
fetch(`${BASE}/filter.php?a=Italian`)
```

Restituisce l'elenco dei piatti italiani (`data.meals`), ognuno con `idMeal`, `strMeal`, `strMealThumb`. Usata in `fetchItalianMeals()` (`services/mealsApi.ts`) per popolare `HomeScreen` e `FavoritesScreen`.

### `GET /lookup.php?i={id}`

```ts
fetch(`${BASE}/lookup.php?i=${id}`)
```

Restituisce il dettaglio completo di un piatto (`data.meals[0]`): categoria, area, istruzioni, immagine. Usata in `fetchMealById()` per `DetailScreen`. Ritorna `null` se l'id non esiste.

`BASE = "https://www.themealdb.com/api/json/v1/1"`

---

## `@react-native-async-storage/async-storage`

### `AsyncStorage.getItem(key)`

```ts
AsyncStorage.getItem(key: string): Promise<string | null>
```

Legge un valore stringa salvato su disco. Usato in `loadFavoriteIds()` e `loadThemeMode()` (`services/storage.ts`) con parsing/validazione del contenuto (`JSON.parse` per i preferiti, confronto diretto per il tema).

### `AsyncStorage.setItem(key, value)`

```ts
AsyncStorage.setItem(key: string, value: string): Promise<void>
```

Scrive un valore stringa su disco. Usato in `saveFavoriteIds()` (con `JSON.stringify`) e `saveThemeMode()`.

Chiavi usate nel progetto: `app:v1:favs`, `app:v1:theme`.

---

## `@react-navigation/native` / `@react-navigation/native-stack`

### `NavigationContainer`

```tsx
<NavigationContainer linking={linking}>{children}</NavigationContainer>
```

Root della navigazione. `linking` configura i deep link (`prefixes`, `config.screens`) mappando le route (`login`, `home`, `details/:mealId`, `favorites`, `profile`) agli screen dello stack.

### `createNativeStackNavigator<ParamList>()`

```ts
const Stack = createNativeStackNavigator<RootStackParamList>();
```

Crea il navigator a stack tipizzato su `RootStackParamList`.

### `Stack.Navigator` / `Stack.Screen`

```tsx
<Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} options={{ title: "..." }} />
</Stack.Navigator>
```

Le screen mostrate dipendono da `user` (`AuthContext`): stack "Login" se `user` è `null`, stack "Home/Detail/Favorites/Profile" altrimenti.

### `NativeStackScreenProps<ParamList, RouteName>`

```ts
type Props = NativeStackScreenProps<RootStackParamList, "Detail">;
```

Tipizza `navigation` e `route.params` per ogni screen (es. `route.params.mealId` in `DetailScreen`).

### `navigation.navigate(name, params?)` / `navigation.setOptions(options)`

```ts
navigation.navigate("Detail", { mealId: idMeal });
navigation.setOptions({ headerRight: () => <FavoriteButton ... /> });
```

`setOptions` è usato dentro `useLayoutEffect` per iniettare componenti custom nell'header (avatar, badge preferiti, cuore preferito).

---

## `expo-linking`

### `Linking.createURL(path)`

```ts
Linking.createURL("/"): string
```

Genera il prefisso di deep link per l'ambiente corrente (Expo Go / dev build), usato in `App.tsx` per costruire `linking.prefixes`.

---

## `expo-location`

### `Location.getForegroundPermissionsAsync()`

```ts
Location.getForegroundPermissionsAsync(): Promise<PermissionResponse>
```

Legge lo stato attuale del permesso di posizione **senza mostrare popup**. Usato al mount di `ProfileScreen` per impostare lo stato iniziale (`unknown` / `denied` / `granted`).

### `Location.requestForegroundPermissionsAsync()`

```ts
Location.requestForegroundPermissionsAsync(): Promise<PermissionResponse>
```

Mostra il dialog di sistema per il permesso in foreground (iOS: `When In Use`). Se già negato in precedenza può restituire `denied` senza nuovo popup.

### `Location.getCurrentPositionAsync(options)`

```ts
Location.getCurrentPositionAsync(options?: LocationOptions): Promise<LocationObject>
```

Legge la posizione corrente; richiede permesso concesso. `accuracy` usa l'enum `Location.Accuracy` (nel progetto: `Balanced`). Può fallire (throw) se il GPS non risponde.

### `Location.getLastKnownPositionAsync(options)`

```ts
Location.getLastKnownPositionAsync(options?: LocationLastKnownOptions): Promise<LocationObject | null>
```

Fallback usato quando `getCurrentPositionAsync` fallisce: restituisce l'ultima posizione nota senza attivare il GPS. `null` se non disponibile.

### Tipi principali

```ts
interface LocationObject {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

interface PermissionResponse {
  status: "granted" | "denied" | "undetermined";
  granted: boolean;
  canAskAgain: boolean;
  expires: "never" | number;
}
```

---

## `react-native-safe-area-context`

### `SafeAreaProvider`

```tsx
<SafeAreaProvider>{children}</SafeAreaProvider>
```

Fornisce i valori dei safe-area insets a tutto l'albero. Wrappa `NavigationContainer` in `App.tsx`.

---

## `react-native` (core)

### `Linking.openSettings()`

```ts
Linking.openSettings(): Promise<void>
```

Apre le impostazioni di sistema dell'app, usato quando il permesso di posizione è negato (`ProfileScreen`).

### `useWindowDimensions()`

```ts
const { width, height } = useWindowDimensions();
```

Hook reattivo alle dimensioni della finestra/schermo. Usato in `HomeScreen` e `FavoritesScreen` per calcolare `isWide = width >= 600` e decidere il numero di colonne della griglia.

### `<FlatList numColumns columnWrapperStyle keyExtractor renderItem />`

```tsx
<FlatList
  key={`cols-${numColumns}`}
  data={items}
  numColumns={numColumns}
  columnWrapperStyle={isWide ? styles.columnWrapper : undefined}
  keyExtractor={(item) => item.idMeal}
  renderItem={({ item }) => <MealCard item={item} onPress={...} />}
/>
```

Lista virtualizzata. `key` cambia con `numColumns` per forzare il remount quando si passa da 1 a 2 colonne (richiesto da `FlatList`). `columnWrapperStyle` è valido solo con `numColumns > 1`.

### `<Pressable style={({ pressed }) => ...} onPress accessibilityRole accessibilityLabel />`

```tsx
<Pressable
  onPress={() => onPress(item.idMeal)}
  accessibilityRole="button"
  accessibilityLabel={`Apri ${item.strMeal}`}
  style={({ pressed }) => [styles.listItem, pressed && styles.pressedFeedback]}
/>
```

Componente toccabile con stile funzione dello stato `pressed` (feedback visivo, opacità ridotta) e proprietà di accessibilità (`MealCard`, `FavoriteButton`, bottoni di `ProfileScreen`).

### `<Switch value onValueChange accessibilityLabel />`

```tsx
<Switch value={mode === "dark"} onValueChange={toggleTheme} accessibilityLabel="..." />
```

Toggle nativo usato in `ProfileScreen` per il tema scuro.

### `StyleSheet.create(styles)`

```ts
const styles = StyleSheet.create({ ... });
```

Definisce e ottimizza gli oggetti di stile. Centralizzato in `createSharedStyles(theme)` (`theme/styles.ts`), ricreato con `useMemo` a ogni cambio di `theme`.

### `<Image source={{ uri }} />`, `<ActivityIndicator />`, `<ScrollView contentContainerStyle />`, `<KeyboardAvoidingView behavior />`, `<TextInput secureTextEntry keyboardType autoCapitalize />`

Componenti standard usati rispettivamente per: avatar/thumbnail piatti, indicatori di caricamento, scroll del dettaglio ricetta, form di login su iOS/Android, campi email e password.

---

## React (hooks)

### `React.useState`, `React.useEffect`, `React.useCallback`, `React.useMemo`, `React.useLayoutEffect`

Usati per: stato locale di fetch (`HomeScreen`, `FavoritesScreen`, `DetailScreen`), side effect di caricamento dati al mount, memoizzazione di `createSharedStyles(theme)` a ogni cambio tema, iniezione dell'header custom via `navigation.setOptions`.

### `React.createContext` / `React.useContext`

```ts
const Ctx = React.createContext<Value | undefined>(undefined);
export function useX() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useX deve essere usato dentro un XProvider");
  return ctx;
}
```

Pattern usato per i tre Context del progetto:

- `AuthContext` → `user`, `login(email, password)`, `logout()`
- `FavoritesContext` → `favoriteIds`, `isFavorite(id)`, `toggleFavorite(id)`, persistenza via `storage.ts`
- `ThemeContext` → `theme`, `mode`, `toggleTheme()`, persistenza via `storage.ts` (`THEME_KEY`)