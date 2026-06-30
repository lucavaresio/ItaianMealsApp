// screens/FavoritesScreen.tsx
// Lab 17 - Schermata Preferiti: stessi idMeal della lista, filtrati con
// fetchItalianMeals() + favoriteIds dal FavoritesContext. Riusa MealCard.
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import MealCard, { type MealCardItem } from "../components/MealCard";
import { useFavorites } from "../context/FavoritesContext";
import { fetchItalianMeals } from "../services/mealsApi";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Favorites">;

export default function FavoritesScreen({ navigation }: Props) {
  const { favoriteIds } = useFavorites();
  const [allMeals, setAllMeals] = React.useState<MealCardItem[]>([]);
  const [status, setStatus] = React.useState<"loading" | "success" | "error">(
    "loading",
  );

  React.useEffect(() => {
    let active = true;
    setStatus("loading");
    fetchItalianMeals()
      .then((data: MealCardItem[]) => {
        if (active) {
          setAllMeals(data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  const favoriteMeals = allMeals.filter((meal) => favoriteIds.includes(meal.idMeal));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>I tuoi preferiti</Text>

      {status === "loading" ? (
        <View style={styles.centered}>
          <ActivityIndicator />
          <Text>Caricamento...</Text>
        </View>
      ) : status === "error" ? (
        <Text style={styles.error}>
          Caricamento fallito. Controlla la connessione.
        </Text>
      ) : favoriteMeals.length === 0 ? (
        // Edge case richiesto dal lab 17
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            Nessun preferito ancora. Tocca ♡ su un piatto dalla lista.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteMeals}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={{ gap: 4 }}
          renderItem={({ item }) => (
            <MealCard
              item={item}
              onPress={(idMeal) => navigation.navigate("Detail", { mealId: idMeal })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    gap: 12,
    backgroundColor: "#fffaf5",
  },
  centered: {
    flex: 1,
    padding: 16,
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2f2a24",
  },
  error: {
    color: "#b42318",
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#7a6f65",
    fontSize: 15,
    paddingHorizontal: 12,
  },
});
