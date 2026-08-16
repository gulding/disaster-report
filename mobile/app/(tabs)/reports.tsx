import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useThemeColors } from '../../hooks/useThemeColors';
import ReportCard from '../../components/ReportCard';
import { router, useFocusEffect } from 'expo-router';

export default function ReportsScreen() {
  const Colors = useThemeColors();
  const styles = getStyles(Colors);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const checkUserAndFetch = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      await fetchReports(user.id);
    } else {
      setUserId(null);
      setReports([]);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      checkUserAndFetch();
    }, [])
  );

  const fetchReports = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (userId) {
      await fetchReports(userId);
    }
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Prijavite se da biste vidjeli svoje prijave.</Text>
        <Text style={styles.linkText} onPress={() => router.push('/profile')}>Idi na Profil</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
        renderItem={({ item }) => (
          <ReportCard
            report={item}
            onPress={() => router.push(`/report/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>Nemate prijava. Prijavite prvi problem!</Text>
          </View>
        }
      />
    </View>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  }
});
