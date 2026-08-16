import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const Colors = useThemeColors();
  const styles = getStyles(Colors);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Greška', 'Molimo unesite email i lozinku.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Greška', error.message);
    } else {
      Alert.alert('Uspješno', 'Registracija uspješna! Možete se prijaviti.', [
        { text: 'U redu', onPress: () => router.back() }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registracija</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Lozinka"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Registruj se</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.linkButton} onPress={() => router.back()}>
        <Text style={styles.linkText}>Već imate račun? Prijavite se</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.textSecondary,
    fontSize: 16,
  }
});
