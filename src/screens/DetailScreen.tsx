import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import FavoriteButton from "../components/FavoriteButton";
import { fetchMealById } from "../services/mealsApi";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

export default function DetailScreen({ navigation, route }: Props) {
  // Lab 13/14: id del piatto passato via route params (anche da deep link)
  const mealId = route.params?.mealId;

  const [meal, setMeal] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Cuoricino preferito nell'header, sincronizzato col FavoritesContext (lab 17)
  React.useLayoutEffect(() => {
    if (mealId) {
      navigation.setOptions({
        headerRight: () => <FavoriteButton idMeal={mealId} size={20} />,
      });
    }
  }, [navigation, mealId]);

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
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [mealId]);

  // Edge case lab 13/14: id mancante
  if (!mealId) {
    return (
      <View style={styles.centered}>
        <Text>Invalid route param</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        // Edge case lab 13/14: item non trovato (es. id inesistente da deep link)
        <Text style={styles.notFound}>Product not found</Text>
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
  notFound: { padding: 16, color: "#7a6f65" },
});
