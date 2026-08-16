import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useThemeColors } from '../hooks/useThemeColors';

interface Props {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export default function PhotoPicker({ photos, onPhotosChange }: Props) {
  const Colors = useThemeColors();
  const styles = getStyles(Colors);
  
  const handleAddPhoto = async () => {
    if (photos.length >= 3) {
      Alert.alert('Ograničenje', 'Možete dodati maksimalno 3 fotografije.');
      return;
    }

    Alert.alert(
      'Dodaj fotografiju',
      'Izaberite način dodavanja fotografije',
      [
        {
          text: 'Kamera',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Dozvola potrebna', 'Molimo dozvolite pristup kameri.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.7,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              onPhotosChange([...photos, result.assets[0].uri]);
            }
          },
        },
        {
          text: 'Galerija',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Dozvola potrebna', 'Molimo dozvolite pristup galeriji.');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.7,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              onPhotosChange([...photos, result.assets[0].uri]);
            }
          },
        },
        {
          text: 'Odustani',
          style: 'cancel',
        },
      ]
    );
  };

  const removePhoto = (indexToRemove: number) => {
    onPhotosChange(photos.filter((_, index) => index !== indexToRemove));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fotografije (opcionalno)</Text>
      <View style={styles.photoContainer}>
        {photos.map((uri, index) => (
          <View key={index} style={styles.photoWrapper}>
            <Image source={{ uri }} style={styles.photo} />
            <TouchableOpacity style={styles.deleteButton} onPress={() => removePhoto(index)}>
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        {photos.length < 3 && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddPhoto}>
            <Text style={styles.addButtonText}>+ Dodaj</Text>
          </TouchableOpacity>
        )}
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
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.error,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  addButtonText: {
    color: Colors.textSecondary,
  }
});
