import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../libs/supabase';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const [userEmail, setUserEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/(auth)/login");
      } else {
        setUserEmail(data.user.email ?? "");
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Toast.show({
        type: 'success',
        text1: 'Logged out successfully'
      });
      router.replace("/(auth)/login");
    }
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {userEmail ? userEmail.charAt(0).toUpperCase() : "?"}
          </Text>
        </View>
        <Text style={styles.emailText}>{userEmail}</Text>
        <Text style={styles.roleText}>Quote Collector</Text>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon" size={22} color="#FFF" />
            <Text style={styles.rowLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: "#767577", true: "#FFD700" }}
            thumbColor="#f4f3f4"
          />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  emailText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  roleText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontSize: 16,
    color: '#FFF',
  },
  logoutBtn: {
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  logoutText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    color: '#444',
    marginTop: 30,
    fontSize: 12,
  }
});