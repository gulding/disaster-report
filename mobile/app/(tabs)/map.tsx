import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, Callout, UrlTile } from 'react-native-maps';
import { supabase } from '../../lib/supabase';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useTheme } from '../../context/ThemeContext';
import { Categories } from '../../constants/Categories';
import { router, useFocusEffect } from 'expo-router';

export default function MapScreen() {
  const Colors = useThemeColors();
  const { isDark } = useTheme();
  const styles = getStyles(Colors);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [])
  );

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (catId: string) => {
    const cat = Categories.find(c => c.id === catId);
    return cat ? cat.color : Colors.primary;
  };

  const getCategoryIcon = (catId: string) => {
    const cat = Categories.find(c => c.id === catId);
    return cat ? cat.icon : '📌';
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 43.9159,
          longitude: 17.6791,
          latitudeDelta: 3.5,
          longitudeDelta: 3.5,
        }}
      >
        <UrlTile
          urlTemplate="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {reports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{ latitude: report.latitude, longitude: report.longitude }}
            pinColor={getCategoryColor(report.kategorija)}
          >
            <Callout onPress={() => router.push(`/report/${report.id}`)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>
                  {getCategoryIcon(report.kategorija)} {Categories.find(c => c.id === report.kategorija)?.name || report.kategorija}
                </Text>
                <Text style={styles.calloutDesc} numberOfLines={2}>{report.opis}</Text>
                <Text style={styles.calloutLink}>Detalji &gt;</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 20,
    left: '50%',
    marginLeft: -20,
    zIndex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  callout: {
    width: 200,
    padding: 5,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  calloutDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  calloutLink: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  }
});
