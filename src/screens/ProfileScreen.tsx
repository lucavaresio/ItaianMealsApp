import React from "react";
import { Image, Linking, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useTheme } from "../context/ThemeContext";
import { createSharedStyles } from "../theme/styles";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

type PermissionState = "unknown" | "denied" | "granted";
type LocationReadState = "idle" | "loading" | "ready" | "error";

function formatCoords(pos: Location.LocationObject) {
  return `Lat: ${pos.coords.latitude.toFixed(5)} | Lng: ${pos.coords.longitude.toFixed(5)}`;
}

async function readPosition(): Promise<Location.LocationObject> {
  try {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
  } catch {
    const last = await Location.getLastKnownPositionAsync();
    if (last) return last;
    throw new Error("GPS non disponibile. Attiva la posizione e riprova.");
  }
}

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const { favoriteIds } = useFavorites();
  const { theme, mode, toggleTheme } = useTheme();
  const shared = React.useMemo(() => createSharedStyles(theme), [theme]);
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const [bootstrapping, setBootstrapping] = React.useState(true);
  const [permission, setPermission] = React.useState<PermissionState>("unknown");
  const [locationState, setLocationState] = React.useState<LocationReadState>("idle");
  const [coords, setCoords] = React.useState("");
  const [locationError, setLocationError] = React.useState("");

  React.useEffect(() => {
    Location.getForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status === "granted") setPermission("granted");
        else if (status === "denied") setPermission("denied");
        else setPermission("unknown");
      })
      .finally(() => setBootstrapping(false));
  }, []);

  async function onReadLocation() {
    setLocationError("");
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setPermission("denied");
      setLocationState("idle");
      return;
    }

    setPermission("granted");
    setLocationState("loading");

    try {
      const pos = await readPosition();
      setCoords(formatCoords(pos));
      setLocationState("ready");
    } catch (err) {
      setLocationState("error");
      setLocationError(
        err instanceof Error
          ? err.message
          : "GPS non disponibile. Attiva la posizione e riprova.",
      );
    }
  }

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

      <View style={styles.locationSection}>
        <Text accessibilityRole="header" style={styles.locationTitle}>
          La tua posizione
        </Text>

        {bootstrapping && (
          <Text style={styles.locationHint}>Controllo permesso…</Text>
        )}

        {!bootstrapping && permission === "unknown" && locationState === "idle" && (
          <Text style={styles.locationHint}>
            Tocca il pulsante per consentire l'accesso alla posizione.
          </Text>
        )}

        {!bootstrapping && permission === "denied" && (
          <View style={styles.locationGap}>
            <Text style={styles.locationHint}>Permesso posizione negato.</Text>
            <Pressable
              style={styles.button}
              onPress={() => Linking.openSettings()}
              accessibilityRole="button"
              accessibilityLabel="Apri le impostazioni di sistema"
            >
              <Text style={styles.buttonText}>Apri Impostazioni</Text>
            </Pressable>
          </View>
        )}

        {!bootstrapping && permission === "granted" && locationState === "idle" && (
          <Text style={styles.locationHint}>
            Permesso concesso. Tocca il pulsante per leggere le coordinate.
          </Text>
        )}

        {!bootstrapping && locationState === "loading" && (
          <Text style={styles.locationHint}>Lettura coordinate…</Text>
        )}

        {!bootstrapping && permission === "granted" && locationState === "ready" && (
          <Text style={styles.coordsText}>{coords}</Text>
        )}

        {!bootstrapping && permission === "granted" && locationState === "error" && (
          <Text style={shared.error}>{locationError}</Text>
        )}

        <Pressable
          style={styles.button}
          onPress={onReadLocation}
          accessibilityRole="button"
          accessibilityLabel="Leggi la posizione attuale"
        >
          <Text style={styles.buttonText}>Leggi posizione</Text>
        </Pressable>
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
  const { colors, spacing } = theme;
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
    locationSection: {
      alignSelf: "stretch",
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      marginTop: 4,
    },
    locationTitle: {
      fontWeight: "700",
      color: colors.text,
      fontSize: 15,
    },
    locationHint: {
      color: colors.textSecondary,
      fontSize: 13,
    },
    locationGap: {
      gap: spacing.sm,
    },
    coordsText: {
      color: colors.text,
      fontWeight: "600",
    },
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