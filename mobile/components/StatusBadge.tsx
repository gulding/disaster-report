import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { Statuses } from '../constants/Categories';

interface Props {
  status: 'novo' | 'u_obradi' | 'rijeseno';
}

export default function StatusBadge({ status }: Props) {
  const Colors = useThemeColors();
  const styles = getStyles(Colors);
  const bgColor = Colors.status[status] || Colors.textSecondary;
  const label = Statuses[status] || status;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor + '20' }]}>
      <View style={[styles.dot, { backgroundColor: bgColor }]} />
      <Text style={[styles.text, { color: bgColor }]}>{label}</Text>
    </View>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
