import { Tabs } from 'expo-router';
import React from 'react';
// Replace FontAwesome with a simple text icon or another icon library if preferred
// The default Expo template uses @expo/vector-icons
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../hooks/useThemeColors';

export default function TabLayout() {
  const Colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Nova Prijava',
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }) => <Ionicons name="map" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Moje Prijave',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
