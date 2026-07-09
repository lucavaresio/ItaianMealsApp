import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import FavoriteButton from "./FavoriteButton";
import { createSharedStyles } from "../theme/styles";
import { theme } from "../theme/colors";

export interface MealCardItem {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface MealCardProps {
  item: MealCardItem;
  onPress: (idMeal: string) => void;
}

const styles = createSharedStyles(theme);

export default function MealCard({ item, onPress }: MealCardProps) {
  return (
    <Pressable onPress={() => onPress(item.idMeal)}>
      <View style={styles.listItem}>
        <Image source={{ uri: item.strMealThumb }} style={styles.listItemThumb} />
        <Text style={styles.listTitle} numberOfLines={2}>
          {item.strMeal}
        </Text>
        <FavoriteButton idMeal={item.idMeal} />
      </View>
    </Pressable>
  );
}