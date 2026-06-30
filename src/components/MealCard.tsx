// components/MealCard.tsx
// Lab 17 - Card piatto riusata sia in HomeScreen sia in FavoritesScreen.
// Il cuore (FavoriteButton) usa useFavorites() internamente: nessuno stato
// locale dei preferiti da passare via props.
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import FavoriteButton from "./FavoriteButton";

export interface MealCardItem {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface MealCardProps {
  item: MealCardItem;
  onPress: (idMeal: string) => void;
}

export default function MealCard({ item, onPress }: MealCardProps) {
  return (
    <Pressable onPress={() => onPress(item.idMeal)}>
      <View style={styles.row}>
        <Image source={{ uri: item.strMealThumb }} style={styles.thumb} />
        <Text style={styles.mealName} numberOfLines={2}>
          {item.strMeal}
        </Text>
        <FavoriteButton idMeal={item.idMeal} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
