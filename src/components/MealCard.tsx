import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import FavoriteButton from "./FavoriteButton";
import { createSharedStyles } from "../theme/styles";
import { useTheme } from "../context/ThemeContext";

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
  const { theme } = useTheme();
  const styles = React.useMemo(() => createSharedStyles(theme), [theme]);

  return (
    <Pressable
      onPress={() => onPress(item.idMeal)}
      accessibilityRole="button"
      accessibilityLabel={`Apri ${item.strMeal}`}
      style={({ pressed }) => [styles.listItem, pressed && styles.pressedFeedback]}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.listItemThumb} />
      <Text style={styles.listTitle} numberOfLines={2} maxFontSizeMultiplier={1.4}>
        {item.strMeal}
      </Text>
      <FavoriteButton idMeal={item.idMeal} />
    </Pressable>
  );
}