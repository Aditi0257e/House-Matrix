import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Picker } from '@react-native-picker/picker';

type NavigationProp = StackNavigationProp<RootStackParamList, 'FormPage'>;
type FormPageRouteProp = RouteProp<RootStackParamList, 'FormPage'>;

// Define color options with their hex values
const COLOR_OPTIONS = [
  { name: 'RED', hex: '#FF0000' },
  { name: 'GREEN', hex: '#008000' },
  { name: 'YELLOW', hex: '#FFFF00' },
  { name: 'BLUE', hex: '#0000FF' },
  { name: 'ORANGE', hex: '#FFA500' },
  { name: 'PURPLE', hex: '#800080' },
  { name: 'PINK', hex: '#FFC0CB' },
  { name: 'BROWN', hex: '#A52A2A' },
  { name: 'BLACK', hex: '#000000' },
  { name: 'WHITE', hex: '#FFFFFF' },
  { name: 'GRAY', hex: '#808080' },
  { name: 'CYAN', hex: '#00FFFF' },
  { name: 'MAGENTA', hex: '#FF00FF' },
  { name: 'LIME', hex: '#00FF00' },
  { name: 'NAVY', hex: '#000080' },
  { name: 'TEAL', hex: '#008080' },
];

const FormPage = ({ route }: { route: FormPageRouteProp }) => {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [roomType, setRoomType] = useState('');
  const [furnitureType, setFurnitureType] = useState('');
  const [detectedColor, setDetectedColor] = useState<string>('');
  const [hexCode, setHexCode] = useState<string>('');
  const [genderSpecificColor, setGenderSpecificColor] = useState<object>({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (route.params?.detectedColor) {
      setDetectedColor(route.params.detectedColor);
    }
    if (route.params?.hexCode) {
      setHexCode(route.params.hexCode);
    }
    if (route.params?.genderSpecific) {
      setGenderSpecificColor(route.params.genderSpecific);
    }
  }, [route.params?.detectedColor, route.params?.genderSpecific, route.params?.hexCode]);

  // Function to send color data to server using the same approach as photo upload
  const uploadColorData = async (colorName: string, colorHex: string) => {
    setIsUploading(true);
    
    try {
      // Format the request in the same way as the photo upload
      // but with a colorOnly flag to indicate this is not an image
      const uploadResponse = await fetch('http://192.168.1.4:5000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          colorOnly: true,
          detected_color: {
            name: colorName,
            hex: colorHex
          }
        }),
      });
      
      // Check if response is OK
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Server error:', uploadResponse.status, errorText);
        throw new Error(`Server responded with status: ${uploadResponse.status}`);
      }
      
      const responseData = await uploadResponse.json();
      console.log('Color upload response:', responseData);
      
      // Update recommendations if returned
      if (responseData.recommendations) {
        setGenderSpecificColor(responseData.recommendations);
      }
      
      return responseData;
    } catch (error) {
      console.error('Failed to upload color data', error);
      Alert.alert('Error', 'Failed to upload color data. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDone = async () => {
    if (!length || !width || !height || !roomType || !furnitureType) {
      Alert.alert('Error', 'Please fill all fields with valid data.');
      return;
    }

    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);

    if (l <= 0 || w <= 0 || h <= 0) {
      Alert.alert('Error', 'All dimensions must be positive numbers.');
      return;
    }

    // Upload the final color data if color is selected
    if (detectedColor && hexCode) {
      try {
        setIsUploading(true);
        await uploadColorData(detectedColor, hexCode);
      } catch (error) {
        console.error('Error uploading color data:', error);
        // Continue with navigation even if upload fails
      } finally {
        setIsUploading(false);
      }
    }

    const dimensions = `${l}" x ${w}" x ${h}"`;
    const detectedColorValue = detectedColor || 'No color detected';

    navigation.navigate('ResultPage', {
      dimensions,
      roomType,
      furnitureType,
      detectedColor: detectedColorValue,
      hexCode: hexCode,
      genderSpecificColor: genderSpecificColor,
    });
  };

  const handleColorSelect = async (colorName: string, colorHex: string) => {
    setDetectedColor(colorName);
    setHexCode(colorHex);
    setShowColorPicker(false);
    
    // Upload color data when a color is selected
    try {
      await uploadColorData(colorName, colorHex);
    } catch (error) {
      console.error('Error uploading selected color:', error);
      // We don't stop the app flow if upload fails
    }
  };

  const handleRetakeColor = () => {
    navigation.navigate('Cam');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Room Dimensions</Text>

          {/* Input Fields */}
          <Text style={styles.label}>Length:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Length"
            keyboardType="numeric"
            value={length}
            onChangeText={setLength}
          />

          <Text style={styles.label}>Width:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Width"
            keyboardType="numeric"
            value={width}
            onChangeText={setWidth}
          />

          <Text style={styles.label}>Height:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Height"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />

          {/* Room Type Picker */}
          <Text style={styles.label}>Room Type:</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={roomType} onValueChange={setRoomType} style={styles.picker}>
              <Picker.Item label="Select Room Type" value="" />
              <Picker.Item label="Living Room" value="Living Room" />
              <Picker.Item label="Bedroom" value="Bedroom" />
              <Picker.Item label="Kitchen" value="Kitchen" />
              <Picker.Item label="Bathroom" value="Bathroom" />
            </Picker>
          </View>

          {/* Furniture Type Picker */}
          <Text style={styles.label}>Furniture Type:</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={furnitureType} onValueChange={setFurnitureType} style={styles.picker}>
              <Picker.Item label="Select Furniture Type" value="" />
              <Picker.Item label="Sofa" value="Sofa" />
              <Picker.Item label="Table" value="Table" />
              <Picker.Item label="Chair" value="Chair" />
              <Picker.Item label="Bed" value="Bed" />
              <Picker.Item label="Closet" value="Closet" />
              <Picker.Item label="Desk" value="Desk" />
            </Picker>
          </View>

          {/* Custom Color Picker */}
          <Text style={styles.label}>Select Color:</Text>
          <View style={styles.colorSelectionContainer}>
            {/* Color preview box */}
            <View style={[styles.colorPreview, { backgroundColor: hexCode || '#CCCCCC' }]} />
            
            {/* Selected color text */}
            <Text style={styles.selectedColorText}>
              {detectedColor ? detectedColor : 'Select a color'}
            </Text>
            
            {/* Button to show color options */}
            <TouchableOpacity 
              style={styles.selectColorButton} 
              onPress={() => setShowColorPicker(!showColorPicker)}
              disabled={isUploading}
            >
              <Text style={styles.selectColorButtonText}>
                {isUploading ? 'Uploading...' : showColorPicker ? 'Hide Colors' : 'Show Colors'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Retake color button */}
          <TouchableOpacity 
            style={styles.retakeButton} 
            onPress={handleRetakeColor}
            disabled={isUploading}
          >
            <Text style={styles.retakeButtonText}>Retake Color with Camera</Text>
          </TouchableOpacity>

          {/* Color palette (shown conditionally) */}
          {showColorPicker && (
            <View style={styles.colorPaletteContainer}>
              <FlatList
                data={COLOR_OPTIONS}
                keyExtractor={(item) => item.name}
                numColumns={4}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.colorOption,
                      { backgroundColor: item.hex },
                      detectedColor === item.name && styles.selectedColorOption,
                    ]}
                    onPress={() => handleColorSelect(item.name, item.hex)}
                    disabled={isUploading}
                  >
                    {detectedColor === item.name && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.colorPalette}
              />
            </View>
          )}

          <TouchableOpacity 
            style={[styles.doneButton, isUploading && styles.disabledButton]} 
            onPress={handleDone}
            disabled={isUploading}
          >
            <Text style={styles.buttonText}>{isUploading ? 'Uploading...' : 'Done'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d7f2d5',
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  formContainer: {
    width: '90%',
    backgroundColor: '#F3E6C9',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#000',
  },
  input: {
    height: 45,
    borderColor: '#BFA980',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    color: '#000',
    paddingHorizontal: 15,
    backgroundColor: '#FAFAFA',
    fontSize: 16,
  },
  pickerContainer: {
    borderColor: '#BFA980',
    borderWidth: 1,
    padding: 2,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#5D9C59',
  },
  picker: {
    height: 45,
    alignItems: 'center',
    marginBottom: 6,
    color: '#FAFAFA',
  },
  colorSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderColor: '#BFA980',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FAFAFA',
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
  },
  selectedColorText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  selectColorButton: {
    backgroundColor: '#5D9C59',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  selectColorButtonText: {
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: '500',
  },
  retakeButton: {
    backgroundColor: '#6E85B7',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  retakeButtonText: {
    color: '#FAFAFA',
    fontSize: 16,
    fontWeight: '500',
  },
  colorPaletteContainer: {
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 10,
    borderColor: '#BFA980',
    borderWidth: 1,
  },
  colorPalette: {
    paddingVertical: 5,
  },
  colorOption: {
    width: 50,
    height: 50,
    margin: 5,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#000',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  doneButton: {
    backgroundColor: '#D87D4A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#AAA',
  },
  buttonText: {
    color: '#FAFAFA',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FormPage;