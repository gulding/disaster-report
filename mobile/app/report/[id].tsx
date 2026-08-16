import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useTheme } from '../../context/ThemeContext';
import { Categories, Priorities } from '../../constants/Categories';
import StatusBadge from '../../components/StatusBadge';
import MapView, { Marker, UrlTile } from 'react-native-maps';

const { width } = Dimensions.get('window');

export default function ReportDetailScreen() {
  const Colors = useThemeColors();
  const { isDark } = useTheme();
  const styles = getStyles(Colors);
  const { id } = useLocalSearchParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setReport(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.centerContainer}>
        <Text>Prijava nije pronađena.</Text>
      </View>
    );
  }

  const category = Categories.find(c => c.id === report.kategorija);
  const priority = Priorities.find(p => p.id === report.prioritet);
  const dateStr = new Date(report.created_at).toLocaleString('bs-BA');

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Detalji prijave' }} />
      
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: report.latitude,
            longitude: report.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <UrlTile
            urlTemplate="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
          <Marker 
            coordinate={{ latitude: report.latitude, longitude: report.longitude }} 
            pinColor={category?.color}
          />
        </MapView>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.categoryIcon}>{category?.icon}</Text>
          <Text style={[styles.categoryName, { color: category?.color }]}>
            {category?.name || report.kategorija}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <StatusBadge status={report.status} />
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityText}>{priority?.label || report.prioritet}</Text>
          </View>
        </View>

        <Text style={styles.dateText}>Prijavljeno: {dateStr}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Opis</Text>
        <Text style={styles.description}>{report.opis}</Text>

        {report.photos && report.photos.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Fotografije</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
              {report.photos.map((photo: string, index: number) => {
                const { data } = supabase.storage.from('report-photos').getPublicUrl(photo);
                return (
                  <Image 
                    key={index} 
                    source={{ uri: data.publicUrl }} 
                    style={styles.photo} 
                  />
                );
              })}
            </ScrollView>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 200,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 16,
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  priorityBadge: {
    backgroundColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  photoScroll: {
    flexDirection: 'row',
    marginTop: 10,
  },
  photo: {
    width: width * 0.7,
    height: 200,
    borderRadius: 12,
    marginRight: 10,
  }
});
