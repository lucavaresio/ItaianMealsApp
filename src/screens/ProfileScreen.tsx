import React from "react";
import { Image, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useTheme } from "../context/ThemeContext";
import { createSharedStyles } from "../theme/styles";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const { favoriteIds } = useFavorites();
  const { theme, mode, toggleTheme } = useTheme();
  const shared = React.useMemo(() => createSharedStyles(theme), [theme]);
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  if (!user) {
    return (
      <View style={shared.centered}>
        <Text style={{ color: theme.colors.text }}>Nessun utente loggato.</Text>
      </View>
    );
  }

  function handleLogout() {
    logout();
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
      <Text accessibilityRole="header" style={styles.name}>
        {user.name}
      </Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={shared.switchRow}>
        <Text style={shared.switchLabel}>Tema scuro</Text>
        <Switch
          accessibilityLabel="Attiva o disattiva il tema scuro"
          value={mode === "dark"}
          onValueChange={toggleTheme}
        />
      </View>

      <View style={shared.switchRow}>
        <Text style={shared.switchLabel}>Preferiti salvati</Text>
        <Text style={styles.favCount}>{favoriteIds.length}</Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
        accessibilityRole="button"
        accessibilityLabel="Torna alla lista dei piatti"
      >
        <Text style={styles.buttonText}>Torna alla lista</Text>
      </Pressable>

      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}
        accessibilityRole="button"
        accessibilityLabel="Esci dall'account"
      >
        <Text style={styles.logoutText}>Esci</Text>
      </Pressable>
    </View>
  );
}

function createStyles(theme: import("../theme/colors").Theme) {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      alignItems: "center",
      gap: 10,
      backgroundColor: colors.background,
    },
    avatar: {
      width: 110,
      height: 110,
      borderRadius: 55,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: colors.primaryBorder,
    },
    name: { fontSize: 22, fontWeight: "700", color: colors.text },
    email: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
    favCount: { fontWeight: "700", color: colors.primary, fontSize: 16 },
    button: {
      alignSelf: "stretch",
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.warning,
      backgroundColor: colors.warningBackground,
      alignItems: "center",
      marginTop: 8,
    },
    buttonText: { fontWeight: "600", color: colors.warningText },
    logoutButton: {
      alignSelf: "stretch",
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.error,
      backgroundColor: colors.background,
      alignItems: "center",
      marginTop: 10,
    },
    logoutText: { fontWeight: "700", color: colors.error },
  });
}