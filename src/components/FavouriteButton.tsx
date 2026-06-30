
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useFavorites } from "../context/FavoritesContext";

interface FavoriteButtonProps {
  idMeal: string;
  size?: number;
}

export default function FavoriteButton({ idMeal, size = 18 }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(idMeal);

  return (
    <Pressable
      style={styles.favButton}
      onPress={() => toggleFavorite(idMeal)}
      hitSlop={8}
    >
      <Text style={[styles.favText, { fontSize: size }]}>
        {active ? "♥" : "♡"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  favButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 999,
    borderColor: "#f2d2a2",
    backgroundColor: "#fff7eb",
  },
  favText: { color: "#c0392b" },
});
