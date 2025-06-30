import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera, useCameraDevices, PhotoFile } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import Icon from 'react-native-vector-icons/Ionicons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Cam'>;

const Cam: React.FC = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<PhotoFile | null>(null);
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');
  const camera = useRef<Camera>(null);
  const navigation = useNavigation<NavigationProp>();
  const [cameraActive, setCameraActive] = useState(true);

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === 'granted');
    })();
  }, []);

  const toggleFlashlight = () => {
    setIsFlashlightOn(!isFlashlightOn);
  };

  const takePicture = async () => {
    try {
      const photo = await camera.current?.takePhoto();
      if (photo) {
        setCapturedPhoto(photo);
        setCameraActive(false);
      }
    } catch (error) {
      console.error('Failed to take photo', error);
    }
  };

  const retakePicture = () => {
    setCapturedPhoto(null);
    setCameraActive(true);
  };

  const uploadPhoto = async () => {
    if (!capturedPhoto) return;

    try {
      const response = await fetch(`file://${capturedPhoto.path}`);
      const blob = await response.blob();
  
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const base64 = base64data.split(',')[1];
  
        try {
          const uploadResponse = await fetch('http://192.168.1.4:5000/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64 }),
          });
  
          const responseData = await uploadResponse.json();
          console.log('Upload response:', responseData);
  
          // Extract the detected color value from the 0th index
          const detectedColor = responseData.detected_color.name || 'No color detected';
          const genderSpecific = responseData.recommendations || {};
          const hexCode = responseData.detected_color.hex;
          console.log('Detected Color:', detectedColor);
          console.log('Gender Specific:', genderSpecific);
  
          // Navigate to FormPage with the detected color
          navigation.navigate('FormPage', { detectedColor, hexCode, genderSpecific });
          
        } catch (uploadError) {
          console.error('Upload failed', uploadError);
        }
      };
    } catch (error) {
      console.error('Failed to read photo', error);
    }
  };

  if (!hasPermission) return <Text>No camera permissions</Text>;
  if (!device) return <Text>No back camera device found</Text>;

  // Photo Preview Screen
  if (capturedPhoto) {
    return (
      <View style={styles.previewContainer}>
        <Image 
          source={{ uri: `file://${capturedPhoto.path}` }} 
          style={styles.previewImage} 
          resizeMode="cover"
        />
        <View style={styles.previewButtonContainer}>
          <TouchableOpacity 
            style={styles.previewButton} 
            onPress={retakePicture}
          >
            <Icon name="camera-reverse" size={24} color="white" />
            <Text style={styles.previewButtonText}>Retake</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.previewButton} 
            onPress={uploadPhoto}
          >
            <Icon name="checkmark" size={24} color="white" />
            <Text style={styles.previewButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Camera View
  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={cameraActive}
        photo={true}
        torch={isFlashlightOn ? 'on' : 'off'}
      />
      <View style={styles.buttonContainer}>
        {/* Flashlight Toggle Button */}
        <TouchableOpacity 
          style={styles.flashlightButton} 
          onPress={toggleFlashlight}
        >
          <Icon 
            name={isFlashlightOn ? "flash" : "flash-outline"} 
            size={30} 
            color="white" 
          />
        </TouchableOpacity>

        {/* Capture Button */}
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  flashlightButton: {
    position: 'absolute',
    left: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(245, 13, 13, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  previewButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  previewButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default Cam;