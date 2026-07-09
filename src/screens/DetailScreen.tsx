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
import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

export default function DetailScreen({ navigation, route }: Props) {
  const mealId = route.params?.mealId;
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const [meal, setMeal] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

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

  if (!mealId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Invalid route param</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator />
          <Text style={styles.sectionTitle}>Caricamento dettaglio...</Text>
        </View>
      ) : meal ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
          <Text
            accessibilityRole="header"
            style={styles.title}
            maxFontSizeMultiplier={1.4}
          >
            {meal.strMeal}
          </Text>
          <Text style={styles.sectionTitle}>Categoria</Text>
          <Text style={styles.body}>{meal.strCategory}</Text>
          <Text style={styles.sectionTitle}>Area</Text>
          <Text style={styles.body}>{meal.strArea}</Text>
          <Text style={styles.sectionTitle}>Istruzioni</Text>
          <Text style={styles.instructions}>{meal.strInstructions}</Text>
        </ScrollView>
      ) : (
        <Text style={styles.notFound}>Product not found</Text>
      )}
    </View>
  );
}

function createStyles(theme: import("../theme/colors").Theme) {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
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
      color: colors.text,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "700",
      marginTop: 6,
      color: colors.textSecondary,
    },
    body: {
      color: colors.text,
    },
    instructions: {
      lineHeight: 20,
      color: colors.text,
    },
    notFound: { padding: 16, color: colors.textSecondary },
  });
}