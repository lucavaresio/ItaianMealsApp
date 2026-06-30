// screens/ProfileScreen.tsx
// Mostra i dettagli dell'utente loggato (avatar, nome, email) presi da
// AuthContext, raggiunta toccando l'avatar in HomeScreen.
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  if (!user) {
    // Non dovrebbe succedere: Profile esiste solo nello stack autenticato
    return (
      <View style={styles.centered}>
        <Text>Nessun utente loggato.</Text>
      </View>
    );
  }

  function handleLogout() {
    logout();
    // RootNavigator ricalcola lo stack in base a user=null e mostra Login
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.buttonText}>Torna alla lista</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Esci</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fffaf5",
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#f2d2a2",
  },
  name: { fontSize: 22, fontWeight: "700", color: "#2f2a24" },
  email: { fontSize: 14, color: "#7a6f65", marginBottom: 18 },
  button: {
    alignSelf: "stretch",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f0b46e",
    backgroundColor: "#fff2e2",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { fontWeight: "600", color: "#8a4b12" },
  logoutButton: {
    alignSelf: "stretch",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e3a39a",
    backgroundColor: "#fdecea",
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: { fontWeight: "700", color: "#b42318" },
});
