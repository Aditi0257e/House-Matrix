import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import {
  ViroARScene,
  ViroMaterials,
  ViroNode,
  ViroAnimations,
  Viro3DObject,
  ViroLightingEnvironment,
  ViroARImageMarker,
  ViroARTrackingTargets,
  ViroSphere,
  ViroSpotLight,
  ViroQuad,
  ViroARSceneNavigator
} from '@reactvision/react-viro';
import { sofaDetails, FurnitureVariant } from "../constants/mocks1"; // Adjust path
import Voice from '@react-native-voice/voice'; // Import Voice package
import Tts from 'react-native-tts'; // Import TTS package

type Position = [number, number, number];
type Scale = [number, number, number];
type Rotation = [number, number, number];

// Helper function to parse dimensions string (e.g., "84" x 36" x 32"")
// Returns width in meters (assumes input in inches)
const parseDimensions = (dimensionsStr: string): number => {
  try {
    // Extract the first number from the string (width)
    const match = dimensionsStr.match(/(\d+(\.\d+)?)/);
    if (match && match[1]) {
      // Convert inches to meters (1 inch = 0.0254 meters)
      return parseFloat(match[1]) * 0.0254;
    }
  } catch (error) {
    console.error('Error parsing dimensions:', error);
  }
  
  // Default value if parsing fails
  return 1.0;
};

type ARSceneProps = {
  sceneNavigator: {
    viroAppProps: {
      modelObj: any;
      modelGlb: any;
      dimensions: string;
      furnitureType: string;
      variantName: string;
      voiceControlRef?: React.MutableRefObject<{
        startVoiceControl: () => void;
        stopVoiceControl: () => void;
      }>;
    };
  };
};

interface ARCarDemoProps {
  furnitureType: string;
  variantName: string;
}

// Define the AR Scene as a functional component
const ARScene: React.FC<ARSceneProps> = React.memo((props: ARSceneProps) => {
  const { 
    modelObj, 
    modelGlb, 
    dimensions, 
    furnitureType, 
    variantName,
    voiceControlRef
  } = props.sceneNavigator.viroAppProps;
  
  // Constants
  const MARKER_WIDTH = 0.16; // Physical marker width in meters (A4 size)
  
  // Parse dimensions from the string format and calculate scaling
  const realWorldWidth = parseDimensions(dimensions);
  
  // Calculate scale factor to maintain true-to-size appearance
  const initialScaleFactor = realWorldWidth ? MARKER_WIDTH / realWorldWidth : 0.09;
  
  const [texture, setTexture] = useState<string>('white');
  const [playAnim, setPlayAnim] = useState<boolean>(false);
  const [objectVisible, setObjectVisible] = useState<boolean>(false);
  const [tapWhite, setTapWhite] = useState<boolean>(false);
  const [tapBlue, setTapBlue] = useState<boolean>(false);
  const [tapGrey, setTapGrey] = useState<boolean>(false);
  const [tapRed, setTapRed] = useState<boolean>(false);
  const [tapYellow, setTapYellow] = useState<boolean>(false);
  const [animName, setAnimName] = useState<string>('scaleUp');
  const [pauseUpdates] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const voiceControlActive = useRef<boolean>(false);
  const voiceCommandTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize with the calculated scale factor
  const [scale, setScale] = useState<Scale>([initialScaleFactor, initialScaleFactor, initialScaleFactor]);
  const [rotation, setRotation] = useState<Rotation>([0, 0, 0]);
  
  // Initialize position to be directly on the anchor (y slightly above to avoid z-fighting)
  const [position, setPosition] = useState<Position>([0, 0.01, 0]);
  const [initialPosition] = useState<Position>([0, 0.01, 0]);

  const radius = 0.04; // Adjust the Radius for color Balls
  
  // Function to start voice control
  const startVoiceControl = async () => {
    console.log("Starting voice control...");
    voiceControlActive.current = true;
    //Voice control activated.
    await Tts.speak('Say a color name.');
    startListening();
  };
  
  // Function to stop voice control
  const stopVoiceControl = async () => {
    console.log("Stopping voice control...");
    voiceControlActive.current = false;
    setIsListening(false);
    await Voice.stop();
    //await Tts.speak('Voice control Stoped');
    
    // Clear any pending timers
    if (voiceCommandTimeout.current) {
      clearTimeout(voiceCommandTimeout.current);
      voiceCommandTimeout.current = null;
    }
  };
  
  // Expose the functions via ref
  useEffect(() => {
    if (voiceControlRef) {
      voiceControlRef.current = {
        startVoiceControl,
        stopVoiceControl
      };
    }
    
    // Initialize Voice recognition
    Voice.onSpeechStart = () => {
      console.log('Speech started');
      setIsListening(true);
    };
    
    Voice.onSpeechEnd = () => {
      console.log('Speech ended');
      setIsListening(false);
      
      // If voice control is still active, restart listening after a delay
      if (voiceControlActive.current) {
        console.log("Will restart listening in 1 second...");
        voiceCommandTimeout.current = setTimeout(() => {
          startListening();
        }, 1000);
      }
    };
    
    Voice.onSpeechResults = (event: any) => {
      if (event.value) {
        console.log('Speech recognized:', event.value);
        processVoiceCommand(event.value);
      }
    };
    
    Voice.onSpeechError = (error: any) => {
      console.log('Speech recognition error:', error);
      setIsListening(false);
      
      // If voice control is still active, restart listening after a delay
      if (voiceControlActive.current) {
        console.log("Error occurred. Will retry in .5 seconds...");
        voiceCommandTimeout.current = setTimeout(() => {
          startListening();
        }, 100);
      }
    };
    
    // Setup TTS
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5);
    
    return () => {
      // Clean up
      stopVoiceControl();
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [voiceControlRef]);

  // Function to start listening
  const startListening = async () => {
    if (!voiceControlActive.current) return;
    
    try {
      console.log("Starting voice recognition...");
      await Voice.stop(); // Stop any ongoing recognition first
      await Voice.start('en-US');
      setIsListening(true);
    } catch (error) {
      console.log('Error starting voice recognition:', error);
      
      // If voice control is still active, retry after a delay
      if (voiceControlActive.current) {
        voiceCommandTimeout.current = setTimeout(() => {
          startListening();
        }, 2000);
      }
    }
  };

  // Process voice commands
  const processVoiceCommand = async (results: string[]) => {
    if (!voiceControlActive.current) return;
    
    const lowerResults = results.map(text => text.toLowerCase());
    console.log("Processing voice command:", lowerResults);
    
    if (lowerResults.some(text => text.includes('white'))) {
      console.log("Changing to white color");
      selectWhite();
      await Tts.speak('Changed to white color');
    } 
    else if (lowerResults.some(text => text.includes('blue'))) {
      console.log("Changing to blue color");
      selectBlue();
      await Tts.speak('Changed to blue color');
    } 
    else if (lowerResults.some(text => 
      text.includes('grey') || text.includes('gray'))) {
      console.log("Changing to grey color");
      selectGrey();
      await Tts.speak('Changed to grey color');
    } 
    else if (lowerResults.some(text => text.includes('red'))) {
      console.log("Changing to red color");
      selectRed();
      await Tts.speak('Changed to red color');
    } 
    else if (lowerResults.some(text => text.includes('yellow'))) {
      console.log("Changing to yellow color");
      selectYellow();
      await Tts.speak('Changed to yellow color');
    } 
    else if (lowerResults.some(text => 
      text.includes('stop') || 
      text.includes('quit') || 
      text.includes('exit'))) {
      console.log("Stop command detected");
      stopVoiceControl();
    } 
    else {
      console.log("Command not recognized");
      await Tts.speak('Color not Found.Available Colors are red,yellow,gray,blue,white');
    }
  };

  const _onDrag = (dragToPos: Position) => {
    setPosition(dragToPos);
  };

  const handlePinch = (pinchState: number, scaleFactor: number, source: any) => {
    if (pinchState === 3) {
      const newScale: Scale = [
        Math.max(0.01, Math.min(scale[0] * scaleFactor, 5)),
        Math.max(0.01, Math.min(scale[1] * scaleFactor, 5)),
        Math.max(0.01, Math.min(scale[2] * scaleFactor, 5)),
      ];
      setScale(newScale);
    }
  };

  const _onRotate = (rotateState: number, rotationFactor: number, source: any) => {
    if (rotateState === 2) {
      const newRotation: Rotation = [
        rotation[0],
        rotation[1] - rotationFactor,
        rotation[2],
      ];
      setRotation(newRotation);
    }
  };

  const onAnchorFound = useCallback(async () => {
    // Reset position to initial when anchor is found to ensure proper placement
    setPosition(initialPosition);
    
    // Reset rotation when anchor is found
    setRotation([0, 0, 0]);
    
    // Make object visible
    setObjectVisible(true);
    
    // Provide audible feedback when anchor is found
    //Tap the model to view color options or say a color name.(add this to speak)
    await Tts.speak('Model placed.');
    
    console.log(`Anchor Found. Applied scale: ${initialScaleFactor} for ${furnitureType} - ${variantName} (real width: ${realWorldWidth}m from dimensions: ${dimensions}). Position set to: [${initialPosition.join(', ')}]`);
  }, [initialScaleFactor, furnitureType, variantName, realWorldWidth, dimensions, initialPosition]);

  // Called when anchor tracking is lost
  const onAnchorRemoved = useCallback(async () => {
    console.log("Anchor removed or tracking lost");
    await Tts.speak('Tracking lost');
    // Optionally hide the object when tracking is lost
    // setObjectVisible(false);
  }, []);

  const toggleButtons = useCallback(() => {
    setAnimName((prev) => (prev === 'scaleUp' ? 'scaleDown' : 'scaleUp'));
    setPlayAnim(true);
  }, []);

  const selectWhite = useCallback(() => {
    setTexture('white');
    setTapWhite(true);
  }, []);

  const selectBlue = useCallback(() => {
    setTexture('blue');
    setTapBlue(true);
  }, []);

  const selectGrey = useCallback(() => {
    setTexture('grey');
    setTapGrey(true);
  }, []);

  const selectRed = useCallback(() => {
    setTexture('red');
    setTapRed(true);
  }, []);

  const selectYellow = useCallback(() => {
    setTexture('yellow');
    setTapYellow(true);
  }, []);
 
  const animateFinished = useCallback(() => {
    setTapWhite(false);
    setTapBlue(false);
    setTapGrey(false);
    setTapRed(false);
    setTapYellow(false);
  }, []);

  return (
    <ViroARScene>
      <ViroLightingEnvironment source={require('../assets/res/TESLA2/TESLA/garage_1k.hdr')} />

      <ViroARImageMarker
        target="logo"
        onAnchorFound={onAnchorFound}
        onAnchorRemoved={onAnchorRemoved}
        pauseUpdates={pauseUpdates}
      >
        {/* Node for the color selection spheres */}
        <ViroNode
          scale={[0, 0, 0]}
          transformBehaviors={['billboardY']}
          animation={{ name: animName, run: playAnim }}
        >
          <ViroSphere
            materials={['white_sphere']}
            heightSegmentCount={20}
            widthSegmentCount={20}
            radius={radius}
            position={[-0.2, 0.25, 0]}
            onClick={selectWhite}
            animation={{ name: 'tapAnimation', run: tapWhite, onFinish: animateFinished }}
            shadowCastingBitMask={0}
          />
          <ViroSphere
            materials={['blue_sphere']}
            heightSegmentCount={20}
            widthSegmentCount={20}
            radius={radius}
            position={[-0.1, 0.25, 0]}
            onClick={selectBlue}
            animation={{ name: 'tapAnimation', run: tapBlue, onFinish: animateFinished }}
            shadowCastingBitMask={0}
          />
          <ViroSphere
            materials={['grey_sphere']}
            heightSegmentCount={20}
            widthSegmentCount={20}
            radius={radius}
            position={[0, 0.25, 0]}
            onClick={selectGrey}
            animation={{ name: 'tapAnimation', run: tapGrey, onFinish: animateFinished }}
            shadowCastingBitMask={0}
          />
          <ViroSphere
            materials={['red_sphere']}
            heightSegmentCount={20}
            widthSegmentCount={20}
            radius={radius}
            position={[0.1, 0.25, 0]}
            onClick={selectRed}
            animation={{ name: 'tapAnimation', run: tapRed, onFinish: animateFinished }}
            shadowCastingBitMask={0}
          />
          <ViroSphere
            materials={['yellow_sphere']}
            heightSegmentCount={20}
            widthSegmentCount={20}
            radius={radius}
            position={[0.2, 0.25, 0]}
            onClick={selectYellow}
            animation={{ name: 'tapAnimation', run: tapYellow, onFinish: animateFinished }}
            shadowCastingBitMask={0}
          />
        </ViroNode>

        {/* 3D Furniture Object with true-to-size scaling */}
        <Viro3DObject
          position={position}
          rotation={rotation}
          scale={scale}
          source={modelObj}
          resources={[modelGlb]}
          type="OBJ"
          materials={[texture]}
          onClick={toggleButtons}
          animation={{ name: 'fadeIn', run: objectVisible }}
          onDrag={_onDrag}
          onPinch={handlePinch}
          onRotate={_onRotate}
          dragType="FixedToWorld"
        />

        <ViroSpotLight
          innerAngle={5}
          outerAngle={25}
          direction={[0, -1, 0]}
          position={[0, 5, 1]}
          color="#ffffff"
          castsShadow={true}
          shadowMapSize={2048}
          shadowNearZ={2}
          shadowFarZ={7}
          shadowOpacity={0.7}
        />

        <ViroQuad
          rotation={[-90, 0, 0]}
          position={[0, -0.001, 0]}
          width={2.5}
          height={2.5}
          arShadowReceiver={true}
        />
      </ViroARImageMarker>
    </ViroARScene>
  );
});

// Main component
const ARCarDemo: React.FC<ARCarDemoProps> = ({ furnitureType, variantName }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const voiceControlRef = useRef<{
    startVoiceControl: () => void;
    stopVoiceControl: () => void;
  }>({ startVoiceControl: () => {}, stopVoiceControl: () => {} });

  // Find the matching variant
  const selectedVariant = Object.values(sofaDetails)
    .flat()
    .find((item) => item.furnitureType === furnitureType && item.name === variantName);

  const filteredFurniture = Object.keys(sofaDetails)
    .filter((key) =>
      sofaDetails[key].some(
        (variant) => variant.furnitureType === furnitureType
      )
    )
    .flatMap((key) => sofaDetails[key]);

  // Toggle voice control
  const toggleVoiceControl = () => {
    if (isVoiceActive) {
      voiceControlRef.current.stopVoiceControl();
      setIsVoiceActive(false);
    } else {
      voiceControlRef.current.startVoiceControl();
      setIsVoiceActive(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* AR Scene Navigator */}
      <ViroARSceneNavigator
        initialScene={{
          scene: () => (
            <ARScene
              sceneNavigator={{
                viroAppProps: {
                  modelObj: selectedVariant?.a,
                  modelGlb: selectedVariant?.b,
                  dimensions: selectedVariant?.dimensions || "40\" x 20\" x 20\"", // Default if missing
                  furnitureType: furnitureType,
                  variantName: variantName,
                  voiceControlRef: voiceControlRef
                },
              }}
            />
          ),
        }}
        autofocus={true}
        style={styles.arView}
      />

      {/* Voice Control Button */}
      <TouchableOpacity
        style={[
          styles.voiceButton,
          isVoiceActive ? styles.listeningButton : {}
        ]}
        onPress={toggleVoiceControl}
      >
        <Text style={styles.voiceButtonText}>
          {isVoiceActive ? "Stop Voice" : "Start Voice"}
        </Text>
      </TouchableOpacity>

      {/* FlatList for Variants */}
      <View style={styles.flatlistContainer}>
        <FlatList
          horizontal
          data={filteredFurniture}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.variantButton,
                item.name === variantName ? styles.selectedVariant : null
              ]}
              onPress={() => {
                // Navigate to the ARScene with the new variant
                navigation.navigate('ARScene', {
                  furnitureType: item.furnitureType,
                  variantName: item.name,
                });
              }}
            >
              {item.image ? (
                <Image source={item.image} style={styles.thumbnail} />
              ) : (
                <Text style={styles.variantButtonText}>{item.name}</Text>
              )}
              <Text style={styles.variantButtonText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      </View>
    </View>
  );
};

// Materials - remain unchanged from original code
ViroMaterials.createMaterials({
  white: {
    lightingModel: 'PBR',
    diffuseTexture: require('../assets/res/z/phong1_baseColor.png'),
    metalnessTexture: require('../assets/res/z/phong1_metallicRoughness.png'),
    roughnessTexture: require('../assets/res/z/phong1_normal.png'),
  },
  blue: {
    lightingModel: 'PBR',
    diffuseTexture: require('../assets/res/TESLA2/TESLA/object_car_main_Base_Color_blue.png'),
    metalnessTexture: require('../assets/res/TESLA2/TESLA/object_car_main_Metallic.png'),
    roughnessTexture: require('../assets/res/TESLA2/TESLA/object_car_main_Roughness.png'),
  },
  grey: {
    lightingModel: 'PBR',
    diffuseTexture: require('../assets/res/TESLA2/TESLA/object_car_main_Base_Color_grey.png'),
    metalnessTexture: require('../assets/res/TESLA2/TESLA/object_car_main_Metallic.png'),
    roughnessTexture: require('../assets/res/TESLA2/TESLA/object_car_main_Roughness.png'),
  },
  red: {
    lightingModel: 'PBR',
    diffuseTexture: require('../assets/res/TESLA2/TESLA/object_car_main_Base_Color_red.png'),
    metalnessTexture: require('../assets/res/TESLA2/TESLA/object_car_main_Metallic.png'),
    roughnessTexture: require('../assets/res/TESLA2/TESLA/object_car_main_Roughness.png'),
  },
  yellow: {
    lightingModel: 'PBR',
    diffuseTexture: require('../assets/res/TESLA2/TESLA/object_car_main_Base_Color_yellow.png'),
    metalnessTexture: require('../assets/res/TESLA2/TESLA/object_car_main_Metallic.png'),
    roughnessTexture: require('../assets/res/TESLA2/TESLA/object_car_main_Roughness.png'),
  },
  white_sphere: {
    lightingModel: 'PBR',
    diffuseColor: 'rgb(231,231,231)',
  },
  blue_sphere: {
    lightingModel: 'PBR',
    diffuseColor: 'rgb(19,42,143)',
  },
  grey_sphere: {
    lightingModel: 'PBR',
    diffuseColor: 'rgb(75,76,79)',
  },
  red_sphere: {
    lightingModel: 'PBR',
    diffuseColor: 'rgb(168,0,0)',
  },
  yellow_sphere: {
    lightingModel: 'PBR',
    diffuseColor: 'rgb(200,142,31)',
  },
});

// Create AR tracking target for the image marker.
ViroARTrackingTargets.createTargets({
  logo: {
    source: require('../assets/res/logo.jpg'),
    orientation: 'Up',
    physicalWidth: 0.16, // real-world width in meters (A4 size)
  },
});

// Register animations
ViroAnimations.registerAnimations({
  scaleUp: {
    properties: { scaleX: 1, scaleY: 1, scaleZ: 1 },
    duration: 500,
    easing: 'bounce',
  },
  scaleDown: {
    properties: { scaleX: 0, scaleY: 0, scaleZ: 0 },
    duration: 200,
  },
  fadeIn: {
    properties: { opacity: 1 },
    duration: 500,
    easing: 'ease-in',
  },
  tapAnimationUp: {
    properties: { scaleX: 0.8, scaleY: 0.8, scaleZ: 0.8 },
    duration: 150,
    easing: 'easeineaseout',
  },
  tapAnimationDown: {
    properties: { scaleX: 1, scaleY: 1, scaleZ: 1 },
    duration: 150,
    easing: 'easeineaseout',
  },
  //tapAnimation: [['tapAnimationUp', 'tapAnimationDown']], // Sequence for tap animation
});

const styles = StyleSheet.create({
  arView: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  flatlistContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  variantButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedVariant: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  variantButtonText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom: 5,
  },
  voiceButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    zIndex: 1000,
  },
  listeningButton: {
    backgroundColor: 'rgba(255,0,0,0.7)',
  },
  voiceButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});

export default ARCarDemo;