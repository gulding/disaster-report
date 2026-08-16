import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Categories } from '../constants/Categories';
import { useThemeColors } from '../hooks/useThemeColors';

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CategoryPicker({ selectedId, onSelect }: Props) {
  const Colors = useThemeColors();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Odaberite kategoriju problema</Text>
      <View style={styles.grid}>
        {Categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.card,
              { borderLeftColor: cat.color },
              selectedId === cat.id && styles.cardSelected,
              selectedId === cat.id && { backgroundColor: cat.color + '20' }
            ]}
            onPress={() => onSelect(cat.id)}
          >
            <Text style={styles.icon}>{cat.icon}</Text>
            <Text style={[styles.name, selectedId === cat.id && { fontWeight: 'bold' }]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: Colors.primary,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  name: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    flexWrap: 'wrap',
  },
});
