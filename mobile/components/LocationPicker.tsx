import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTheme } from '../context/ThemeContext';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface Props {
  location: LocationCoords | null;
  onLocationChange: (loc: LocationCoords) => void;
}

export default function LocationPicker({ location, onLocationChange }: Props) {
  const Colors = useThemeColors();
  const { isDark } = useTheme();
  const styles = getStyles(Colors);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Dozvola za lokaciju je odbijena.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      onLocationChange({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      setErrorMsg('Greška pri dohvaćanju lokacije.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!location) {
      fetchLocation();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lokacija problema</Text>
      
      {loading ? (
        <View style={styles.mapPlaceholder}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 10, color: Colors.textSecondary }}>Dohvaćanje GPS lokacije...</Text>
        </View>
      ) : location ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <UrlTile
              urlTemplate="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
            />
            <Marker coordinate={location} draggable onDragEnd={(e) => onLocationChange(e.nativeEvent.coordinate)} />
          </MapView>
          <Text style={styles.coordText}>
            Lat: {location.latitude.toFixed(5)}, Lng: {location.longitude.toFixed(5)}
          </Text>
        </View>
      ) : (
        <View style={styles.mapPlaceholder}>
          <Text style={{ color: Colors.error, marginBottom: 10 }}>{errorMsg || 'Lokacija nije dostupna'}</Text>
          <TouchableOpacity style={styles.button} onPress={fetchLocation}>
            <Text style={styles.buttonText}>Pokušaj ponovo</Text>
          </TouchableOpacity>
        </View>
      )}
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
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  map: {
    height: 150,
    width: '100%',
  },
  mapPlaceholder: {
    height: 150,
    width: '100%',
    backgroundColor: Colors.border,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coordText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: 5,
    backgroundColor: Colors.card,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
