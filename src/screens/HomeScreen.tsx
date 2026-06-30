import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import MealCard from "../components/MealCard";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { fetchItalianMeals } from "../services/mealsApi";
import type { RootStackParamList } from "../../App";

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  // Lab 17: preferiti dal Context
  const { favoriteIds } = useFavorites();
  // Login: utente loggato dal Context, per mostrare l'avatar nell'header
  const { user } = useAuth();

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

  // Avatar utente + contatore preferiti nell'header dello stack (lab 13 style)
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
      <View style={styles.container}>
        <Text style={styles.error}>{state.message}</Text>
        <Pressable style={styles.button} onPress={loadMeals}>
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Piatti italiani</Text>
      <Text style={styles.subtitle}>
        Preferiti salvati: {favoriteIds.length} (chiave app:v1:favs)
      </Text>

      {state.status === "loading" ? (
        <View style={styles.centered}>
          <ActivityIndicator />
          <Text>Caricamento...</Text>
        </View>
      ) : (
        <FlatList
          data={state.items}
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
  subtitle: {
    color: "#7a6f65",
    fontSize: 13,
  },
  error: {
    color: "#b42318",
    fontWeight: "600",
  },
  button: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 999,
    borderColor: "#f0b46e",
    backgroundColor: "#fff2e2",
  },
  buttonText: {
    fontWeight: "600",
    color: "#8a4b12",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 4,
  },
  favBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#f2d2a2",
    backgroundColor: "#fff7eb",
  },
  favBadgeText: { fontWeight: "700", color: "#c0392b", fontSize: 13 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f2d2a2",
  },
});
