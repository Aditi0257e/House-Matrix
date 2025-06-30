import React, { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
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
} from '@reactvision/react-viro';

/* -------------------------
   Define Materials
------------------------- */
ViroMaterials.createMaterials({
  white: {
    diffuseColor: 'white',
  },
  metallic: {
    lightingModel: 'PBR',
    diffuseTexture: require('../assets/res/TESLA2/TESLA/object_car_main_Base_Color.png'), // Adjust as needed
  },
});

/* -------------------------
   Define AR Tracking Targets
------------------------- */

ViroARTrackingTargets.createTargets({
    logo: {
      source: require('../assets/res/logo.jpg'),
      orientation: 'Up',
      physicalWidth: 0.165, // real-world width in meters
    },
  });
  

/* -------------------------
   Object List for Selection
------------------------- */
const objectList = [
  { id: '1', name: 'Sofa', model: require('../assets/res/mainsofa.obj'), material: 'white' },
  { id: '2', name: 'Table', model: require('../assets/res/heart.obj'), material: 'white' },
  { id: '3', name: 'Chair', model: require('../assets/res/TESLA2/TESLA/object_car.obj'), material: 'metallic' },
];

/* -------------------------
   AR Scene Component
------------------------- */
const DemoARScene: React.FC<{ selectedObject: any }> = ({ selectedObject }) => {
  const [animateCar, setAnimateCar] = useState(false);

  const onAnchorFound = useCallback(() => {
    setAnimateCar(true);
  }, []);

  return (
    <ViroARScene>
      {/* Lighting Environment */}
      <ViroLightingEnvironment source={require('../assets/res/TESLA2/TESLA/garage_1k.hdr')} />

      {/* AR Image Marker */}
      <ViroARImageMarker target="logo" onAnchorFound={onAnchorFound}>
        {/* 3D Object */}
        <Viro3DObject
          source={selectedObject.model}
          type="OBJ"
          materials={selectedObject.material}
          scale={[0.1, 0.1, 0.1]}
          position={[0, 0, 0]}
          animation={{ name: 'scaleCar', run: animateCar }}
        />

        {/* Spotlight for better lighting */}
        <ViroSpotLight
          innerAngle={5}
          outerAngle={25}
          direction={[0, -1, 0]}
          position={[0, 5, 1]}
          color="#ffffff"
          castsShadow={true}
        />

        {/* Shadow Receiver */}
        <ViroQuad rotation={[-90, 0, 0]} position={[0, -0.001, 0]} width={2} height={2} arShadowReceiver />
      </ViroARImageMarker>
    </ViroARScene>
  );
};

/* -------------------------
   Main Component
------------------------- */
const Demo: React.FC = () => {
  const [selectedObject, setSelectedObject] = useState(objectList[0]); // Default to first object

  return (
    <View style={{ flex: 1 }}>
      {/* AR Scene Navigator */}
      <ViroARSceneNavigator
        autofocus
        initialScene={{ scene: () => <DemoARScene selectedObject={selectedObject} /> }}
        style={{ flex: 1 }}
      />

      {/* Object Selection FlatList */}
      <FlatList
        data={objectList}
        horizontal
        style={styles.flatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.listItem, selectedObject.id === item.id && styles.selectedItem]}
            onPress={() => setSelectedObject(item)}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

/* -------------------------
   Styles
------------------------- */
const styles = StyleSheet.create({
  flatList: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
  },
  listItem: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  selectedItem: {
    backgroundColor: '#2196F3',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Demo;
