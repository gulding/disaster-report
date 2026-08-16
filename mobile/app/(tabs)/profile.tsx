import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useTheme } from '../../context/ThemeContext';
import { router, useFocusEffect } from 'expo-router';

export default function ProfileScreen() {
  const Colors = useThemeColors();
  const { theme, setTheme } = useTheme();
  const styles = getStyles(Colors);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      checkUser();
    }, [])
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.authContainer}>
          <Text style={styles.title}>Prijavite se</Text>
          <Text style={styles.subtitle}>
            Kreirajte račun ili se prijavite kako biste pratili status vaših prijava.
          </Text>
          
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/login')}>
            <Text style={styles.primaryButtonText}>Prijava</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/register')}>
            <Text style={styles.secondaryButtonText}>Registracija</Text>
          </TouchableOpacity>

          <View style={styles.divider} />
          
          <Text style={styles.infoText}>
            Napomena: Prijave možete slati i anonimno bez kreiranja računa, ali u tom slučaju nećete moći pratiti njihov status.
          </Text>
        </View>

        <View style={styles.themeSection}>
          <Text style={styles.themeTitle}>Izgled Aplikacije</Text>
          <View style={styles.themeOptions}>
            <TouchableOpacity 
              style={[styles.themeBtn, theme === 'light' && styles.themeBtnActive]} 
              onPress={() => setTheme('light')}>
              <Text style={[styles.themeBtnText, theme === 'light' && styles.themeBtnTextActive]}>Svijetli</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.themeBtn, theme === 'dark' && styles.themeBtnActive]} 
              onPress={() => setTheme('dark')}>
              <Text style={[styles.themeBtnText, theme === 'dark' && styles.themeBtnTextActive]}>Tamni</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.themeBtn, theme === 'system' && styles.themeBtnActive]} 
              onPress={() => setTheme('system')}>
              <Text style={[styles.themeBtnText, theme === 'system' && styles.themeBtnTextActive]}>Sistem</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.email?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Odjavi se</Text>
      </TouchableOpacity>

      <View style={styles.themeSection}>
        <Text style={styles.themeTitle}>Izgled Aplikacije</Text>
        <View style={styles.themeOptions}>
          <TouchableOpacity 
            style={[styles.themeBtn, theme === 'light' && styles.themeBtnActive]} 
            onPress={() => setTheme('light')}>
            <Text style={[styles.themeBtnText, theme === 'light' && styles.themeBtnTextActive]}>Svijetli</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.themeBtn, theme === 'dark' && styles.themeBtnActive]} 
            onPress={() => setTheme('dark')}>
            <Text style={[styles.themeBtnText, theme === 'dark' && styles.themeBtnTextActive]}>Tamni</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.themeBtn, theme === 'system' && styles.themeBtnActive]} 
            onPress={() => setTheme('system')}>
            <Text style={[styles.themeBtnText, theme === 'system' && styles.themeBtnTextActive]}>Sistem</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 20,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  profileCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  logoutButton: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
  themeSection: {
    marginTop: 32,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 4,
  },
  themeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  themeBtnActive: {
    backgroundColor: Colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  themeBtnText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  themeBtnTextActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  }
});
