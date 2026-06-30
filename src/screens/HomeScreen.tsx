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

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface HomeScreenProps {
  items: MealSummary[];
  status: "idle" | "loading" | "success" | "error";
  message: string;
  favoriteIds: string[];
  onSelectMeal: (idMeal: string) => void;
  onToggleFavorite: (idMeal: string) => void;
  onRetry: () => void;
}

export default function HomeScreen({
  items,
  status,
  message,
  favoriteIds,
  onSelectMeal,
  onToggleFavorite,
  onRetry,
}: HomeScreenProps) {
  if (status === "error") {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{message}</Text>
        <Pressable style={styles.button} onPress={onRetry}>
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

      {status === "loading" ? (
        <View style={styles.centered}>
          <ActivityIndicator />
          <Text>Caricamento...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={{ gap: 4 }}
          renderItem={({ item }) => {
            const active = favoriteIds.includes(item.idMeal);
            return (
              <Pressable onPress={() => onSelectMeal(item.idMeal)}>
                <View style={styles.row}>
                  <Image source={{ uri: item.strMealThumb }} style={styles.thumb} />
                  <Text style={styles.mealName} numberOfLines={2}>
                    {item.strMeal}
                  </Text>
                  <Pressable
                    style={styles.favButton}
                    onPress={() => onToggleFavorite(item.idMeal)}
                  >
                    <Text style={styles.favText}>{active ? "♥" : "♡"}</Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          }}
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumb: { width: 56, height: 56, borderRadius: 10 },
  mealName: { flex: 1, fontWeight: "600", color: "#2f2a24" },
  favButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 999,
    borderColor: "#f2d2a2",
    backgroundColor: "#fff7eb",
  },
  favText: { fontSize: 18 },
});
