import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Categories } from '../constants/Categories';
import { useThemeColors } from '../hooks/useThemeColors';
import StatusBadge from './StatusBadge';
import { supabase } from '../lib/supabase';

interface Props {
  report: any;
  onPress: () => void;
}

export default function ReportCard({ report, onPress }: Props) {
  const Colors = useThemeColors();
  const styles = getStyles(Colors);
  const category = Categories.find(c => c.id === report.kategorija);
  
  // Get public URL for the first photo if it exists
  let photoUrl = null;
  if (report.photos && report.photos.length > 0) {
    const { data } = supabase.storage.from('report-photos').getPublicUrl(report.photos[0]);
    photoUrl = data.publicUrl;
  }

  const dateStr = new Date(report.created_at).toLocaleDateString('bs-BA');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {photoUrl && (
        <Image source={{ uri: photoUrl }} style={styles.thumbnail} />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.categoryIcon}>{category?.icon}</Text>
          <Text style={[styles.categoryName, { color: category?.color }]}>
            {category?.name || report.kategorija}
          </Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {report.opis}
        </Text>
        <View style={styles.footer}>
          <StatusBadge status={report.status} />
          <Text style={styles.date}>{dateStr}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
  },
  thumbnail: {
    width: 100,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
