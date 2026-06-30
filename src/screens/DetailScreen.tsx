import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fetchMealById } from "../services/mealsApi";

interface DetailScreenProps {
  mealId: string;
  onBack: () => void;
}

export default function DetailScreen({ mealId, onBack }: DetailScreenProps) {
  const [meal, setMeal] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;

    async function loadMeal() {
      setLoading(true);
      try {
        const data = await fetchMealById(mealId);
        if (active) {
          setMeal(data);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (mealId) {
      loadMeal();
    }

    return () => {
      active = false;
    };
  }, [mealId]);

  if (!mealId) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Torna indietro</Text>
      </Pressable>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator />
          <Text>Caricamento dettaglio...</Text>
        </View>
      ) : meal ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
          <Text style={styles.title}>{meal.strMeal}</Text>
          <Text style={styles.sectionTitle}>Categoria</Text>
          <Text>{meal.strCategory}</Text>
          <Text style={styles.sectionTitle}>Area</Text>
          <Text>{meal.strArea}</Text>
          <Text style={styles.sectionTitle}>Istruzioni</Text>
          <Text style={styles.instructions}>{meal.strInstructions}</Text>
        </ScrollView>
      ) : (
        <Text>Non è stato possibile caricare il piatto.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fffaf5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    marginBottom: 12,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#fff2e2",
  },
  backText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8a4b12",
  },
  content: { gap: 10, paddingBottom: 24 },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2f2a24",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6,
    color: "#7a6f65",
  },
  instructions: {
    lineHeight: 20,
    color: "#4f463f",
  },
});
