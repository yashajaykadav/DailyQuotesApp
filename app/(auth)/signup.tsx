import { 
  View, Text, TextInput, TouchableOpacity, Alert, 
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, 
  ScrollView, Image 
} from "react-native";
import { useState } from "react";
import { supabase } from "../../libs/supabase";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
     
      // 3. Sign Up with Metadata
      const { data: { session }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          },
        },
      });

      if (error) throw error;

      if (!session) {
        Alert.alert("Success", "Check your email to verify account.", [
          { text: "OK", onPress: () => router.replace("/(auth)/login") }
        ]);
      } else {
        router.replace("/(tabs)/explore");
      }

    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Account</Text>

        {/* Name */}
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#888"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        {/* Email */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons name={showPass ? "eye-off" : "eye"} size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            style={styles.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPass}
          />
          <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
            <Ionicons name={showConfirmPass ? "eye-off" : "eye"} size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSignup} 
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#121212" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkHighlight}>Login</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 24 },
  title: {
    fontSize: 28, color: "#FFD700", fontWeight: "bold", 
    textAlign: "center", marginBottom: 20 
  },
  imageContainer: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  placeholderImage: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: "#1e1e1e",
    justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#333"
  },
  addPhotoText: { color: "#FFD700", marginTop: 8, fontSize: 14 },
  input: {
    backgroundColor: "#1e1e1e", color: "#fff", padding: 14,
    borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: "#333"
  },
  passwordContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#1e1e1e",
    borderRadius: 8, paddingHorizontal: 14, marginBottom: 16,
    borderWidth: 1, borderColor: "#333", height: 50
  },
  passwordInput: { flex: 1, color: "#fff" },
  button: {
    backgroundColor: "#FFD700", padding: 14, borderRadius: 8,
    alignItems: "center", marginTop: 8, height: 50, justifyContent: "center"
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#121212", fontWeight: "bold", fontSize: 16 },
  linkText: { color: "#aaa", textAlign: "center", marginTop: 24 },
  linkHighlight: { color: "#FFD700", fontWeight: "bold" },
});