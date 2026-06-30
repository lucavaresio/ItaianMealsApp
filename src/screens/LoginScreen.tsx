// screens/LoginScreen.tsx
// Lab 09 pattern: form controllato con useState, validazione derivata,
// errori mostrati solo dopo submit. Le credenziali vengono verificate
// tramite useAuth().login(), che usa MOCK_USERS in services/auth.ts.
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [authError, setAuthError] = React.useState(false);

  const emailOk = email.includes("@");
  const passwordOk = password.length >= 6;
  const canSubmit = emailOk && passwordOk;

  function handleSubmit() {
    setSubmitted(true);
    if (!canSubmit) return;
    const ok = login(email, password);
    setAuthError(!ok);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Italian Meals App</Text>
        <Text style={styles.subtitle}>Accedi per continuare</Text>

        <TextInput
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setAuthError(false);
          }}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        {submitted && !emailOk && (
          <Text style={styles.error}>L'email deve contenere @</Text>
        )}

        <TextInput
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setAuthError(false);
          }}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
        />
        {submitted && !passwordOk && (
          <Text style={styles.error}>Minimo 6 caratteri</Text>
        )}

        {submitted && canSubmit && authError && (
          <Text style={styles.error}>Email o password non corrette</Text>
        )}

        <Pressable
          onPress={handleSubmit}
          style={[styles.button, submitted && !canSubmit && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Accedi</Text>
        </Pressable>

        <Text style={styles.hint}>
          Demo: mario.rossi@student.it / React2026!
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fffaf5" },
  container: { flex: 1, padding: 24, gap: 10, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", color: "#2f2a24" },
  subtitle: { fontSize: 14, color: "#7a6f65", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#f2d2a2",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#ffffff",
  },
  error: { color: "#b42318", fontSize: 13 },
  button: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f0b46e",
    alignItems: "center",
    backgroundColor: "#fff2e2",
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { fontWeight: "700", color: "#8a4b12" },
  hint: { marginTop: 14, fontSize: 12, color: "#a59a8e", textAlign: "center" },
});
