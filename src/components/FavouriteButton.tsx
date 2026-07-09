import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useFavorites } from "../context/FavoritesContext";
import { useTheme } from "../context/ThemeContext";

interface FavoriteButtonProps {
  idMeal: string;
  size?: number;
}

export default function FavoriteButton({ idMeal, size = 18 }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { theme } = useTheme();
  const active = isFavorite(idMeal);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        favButton: {
          padding: 8,
          borderWidth: 1,
          borderRadius: 999,
          borderColor: theme.colors.primaryBorder,
          backgroundColor: theme.colors.primaryBackground,
        },
        pressedFeedback: {
          opacity: 0.7,
        },
        favText: {
          color: theme.colors.primary,
        },
      }),
    [theme],
  );

  return (
    <Pressable
      style={({ pressed }) => [styles.favButton, pressed && styles.pressedFeedback]}
      onPress={() => toggleFavorite(idMeal)}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={active ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
    >
      <Text style={[styles.favText, { fontSize: size }]}>
        {active ? "♥" : "♡"}
      </Text>
    </Pressable>
  );
}