import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import HomeScreen, { type MealSummary } from "./src/screens/HomeScreen";
import DetailScreen from "./src/screens/DetailScreen";
import { fetchItalianMeals } from "./src/services/mealsApi";
import { loadFavoriteIds, saveFavoriteIds } from "./src/services/storage";

export default function App() {
  const [state, setState] = React.useState<{
    status: "idle" | "loading" | "success" | "error";
    items: MealSummary[];
    message: string;
  }>({
    status: "idle",
    items: [],
    message: "",
  });
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>([]);
  const [favoritesLoaded, setFavoritesLoaded] = React.useState(false);
  const [screen, setScreen] = React.useState<"home" | "detail">("home");
  const [selectedMealId, setSelectedMealId] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadFavoriteIds()
      .then(setFavoriteIds)
      .finally(() => setFavoritesLoaded(true));
  }, []);

  async function loadMeals() {
    setState({ status: "loading", items: [], message: "" });
    try {
      const data = await fetchItalianMeals();
      setState({ status: "success", items: data, message: "" });
    } catch {
      setState({
        status: "error",
        items: [],
        message: "Caricamento fallito. Controlla la connessione.",
      });
    }
  }

  React.useEffect(() => {
    loadMeals();
  }, []);

  function toggleFavorite(idMeal: string) {
    setFavoriteIds((current) => {
      const next = current.includes(idMeal)
        ? current.filter((id) => id !== idMeal)
        : [...current, idMeal];
      void saveFavoriteIds(next);
      return next;
    });
  }

  function openDetail(idMeal: string) {
    setSelectedMealId(idMeal);
    setScreen("detail");
  }

  function goHome() {
    setScreen("home");
    setSelectedMealId(null);
  }

  if (!favoritesLoaded || state.status === "loading") {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator />
          <Text>Caricamento...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {screen === "home" ? (
          <HomeScreen
            items={state.items}
            status={state.status}
            message={state.message}
            favoriteIds={favoriteIds}
            onSelectMeal={openDetail}
            onToggleFavorite={toggleFavorite}
            onRetry={loadMeals}
          />
        ) : (
          <DetailScreen mealId={selectedMealId ?? ""} onBack={goHome} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, padding: 16, gap: 8, justifyContent: "center" },
});
