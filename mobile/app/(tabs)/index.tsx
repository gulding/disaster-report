import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import CategoryPicker from '../../components/CategoryPicker';
import LocationPicker from '../../components/LocationPicker';
import PhotoPicker from '../../components/PhotoPicker';
import { Priorities } from '../../constants/Categories';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export default function HomeScreen() {
  const Colors = useThemeColors();
  const styles = getStyles(Colors);
  const [category, setCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('srednji');
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!category) {
      Alert.alert('Greška', 'Molimo odaberite kategoriju problema.');
      return;
    }
    if (!location) {
      Alert.alert('Greška', 'Molimo potvrdite lokaciju.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Greška', 'Molimo unesite kratak opis problema.');
      return;
    }

    // BiH bounding box validation (approximate)
    if (location.latitude < 42.5 || location.latitude > 45.3 || location.longitude < 15.7 || location.longitude > 19.7) {
      Alert.alert('Greška', 'Lokacija mora biti unutar Bosne i Hercegovine.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload photos to Supabase Storage if any
      const photoPaths: string[] = [];
      
      for (const uri of photos) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        
        const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const contentType = fileExt === 'png' ? 'image/png' : 'image/jpeg';
        
        const { error: uploadError } = await supabase.storage
          .from('report-photos')
          .upload(filePath, decode(base64), { contentType });
          
        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          throw new Error('Greška pri slanju fotografije. Molimo provjerite da li ste kreirali report-photos storage bucket u Supabase-u i podesili RLS.');
        }
        
        photoPaths.push(filePath);
      }

      // 2. Get user ID if logged in
      const { data: { user } } = await supabase.auth.getUser();

      // 3. Insert report into database
      const { error: insertError } = await supabase
        .from('reports')
        .insert({
          user_id: user ? user.id : null,
          kategorija: category,
          opis: description,
          latitude: location.latitude,
          longitude: location.longitude,
          prioritet: priority,
          photos: photoPaths,
        });

      if (insertError) throw insertError;

      Alert.alert('Uspješno', 'Vaša prijava je poslana!', [
        { text: 'U redu', onPress: () => {
          // Reset form
          setCategory(null);
          setDescription('');
          setPriority('srednji');
          setPhotos([]);
          router.push('/reports');
        }}
      ]);

    } catch (error: any) {
      Alert.alert('Greška', error.message || 'Došlo je do greške prilikom slanja prijave.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <CategoryPicker selectedId={category} onSelect={setCategory} />

      {category && (
        <View style={styles.formContainer}>
          <LocationPicker location={location} onLocationChange={setLocation} />
          
          <Text style={styles.label}>Opis problema</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            placeholder="Opišite šta se dešava..."
            placeholderTextColor={Colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Prioritet</Text>
          <View style={styles.priorityContainer}>
            {Priorities.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.priorityChip,
                  priority === p.id && styles.priorityChipSelected
                ]}
                onPress={() => setPriority(p.id)}
              >
                <Text style={[
                  styles.priorityText,
                  priority === p.id && styles.priorityTextSelected
                ]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <PhotoPicker photos={photos} onPhotosChange={setPhotos} />

          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Pošalji Prijavu</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  formContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    color: Colors.text,
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  priorityChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.border,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  priorityChipSelected: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  priorityText: {
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  priorityTextSelected: {
    color: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
