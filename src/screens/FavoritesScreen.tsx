import React from "react";
import { ActivityIndicator, FlatList, Text, View, useWindowDimensions } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import MealCard, { type MealCardItem } from "../components/MealCard";
import { useFavorites } from "../context/FavoritesContext";
import { fetchItalianMeals } from "../services/mealsApi";
import { createSharedStyles } from "../theme/styles";
import { theme } from "../theme/colors";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Favorites">;

const styles = createSharedStyles(theme);

const WIDE_BREAKPOINT = 600;

export default function FavoritesScreen({ navigation }: Props) {
  const { favoriteIds } = useFavorites();
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  const numColumns = isWide ? 2 : 1;

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
    <View style={styles.screen}>
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
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            Nessun preferito ancora. Tocca ♡ su un piatto dalla lista.
          </Text>
        </View>
      ) : (
        <FlatList
          key={`cols-${numColumns}`}
          data={favoriteMeals}
          keyExtractor={(item) => item.idMeal}
          numColumns={numColumns}
          columnWrapperStyle={isWide ? styles.columnWrapper : undefined}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <MealCard
                item={item}
                onPress={(idMeal) => navigation.navigate("Detail", { mealId: idMeal })}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}