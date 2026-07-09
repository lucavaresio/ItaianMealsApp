import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import MealCard from "../components/MealCard";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { fetchItalianMeals } from "../services/mealsApi";
import { createSharedStyles } from "../theme/styles";
import { theme } from "../theme/colors";
import type { RootStackParamList } from "../../App";

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const styles = createSharedStyles(theme);

const WIDE_BREAKPOINT = 600;

export default function HomeScreen({ navigation }: Props) {
  const { favoriteIds } = useFavorites();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  const numColumns = isWide ? 2 : 1;

  const [state, setState] = React.useState<{
    status: "idle" | "loading" | "success" | "error";
    items: MealSummary[];
    message: string;
  }>({
    status: "idle",
    items: [],
    message: "",
  });

  const loadMeals = React.useCallback(async () => {
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
  }, []);

  React.useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <Pressable
            style={styles.favBadge}
            onPress={() => navigation.navigate("Favorites")}
          >
            <Text style={styles.favBadgeText}>{`♥ ${favoriteIds.length}`}</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Profile")}>
            <Image source={{ uri: user?.avatarUri }} style={styles.avatar} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, favoriteIds.length, user]);

  if (state.status === "error") {
    return (
      <View style={styles.screen}>
        <Text style={styles.error}>{state.message}</Text>
        <Pressable style={styles.button} onPress={loadMeals}>
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Piatti italiani</Text>
      <Text style={styles.subtitle}>
        Preferiti salvati: {favoriteIds.length} (chiave app:v1:favs)
      </Text>

      {state.status === "loading" ? (
        <View style={styles.centered}>
          <ActivityIndicator />
          <Text>Caricamento...</Text>
        </View>
      ) : state.items.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Nessun piatto trovato.</Text>
        </View>
      ) : (
        <FlatList
          key={`cols-${numColumns}`}
          data={state.items}
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