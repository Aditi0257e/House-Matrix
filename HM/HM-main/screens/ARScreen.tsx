import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  ViroARSceneNavigator,
  ViroARScene,
  Viro3DObject,
  ViroAmbientLight,
  ViroARPlaneSelector,
  ViroTrackingStateConstants
} from "@reactvision/react-viro";
import { RouteProp } from "@react-navigation/native";
import { furnitureModels, FurnitureModelKey } from "../constants/mocks";
import { sofaDetails ,FurnitureVariant} from "../constants/mocks1";
import { RootStackParamList } from "../navigation/types";

// Type definitions
type Position = [number, number, number];
type Scale = [number, number, number];
type Rotation = [number, number, number];

interface HelloWorldSceneARProps {
  selectedModel: FurnitureModelKey;
}

// AR Scene Component
const HelloWorldSceneAR: React.FC<HelloWorldSceneARProps> = ({
  selectedModel,
}) => {
   const [text, setText] = useState("Initializing AR...");
  const [scale, setScale] = useState<Scale>([0.2, 0.2, 0.2]);
  const [position, setPosition] = useState<Position>([0, -0.5, -1]);
  const [rotation, setRotation] = useState<Rotation>([0, 0, 0]);

  const modelSource = furnitureModels[selectedModel];
//console.log(modelSource);
  const _onDrag = (dragToPos: Position) => {
    setPosition(dragToPos);
  };

  const handlePinch = (pinchState: number, scaleFactor: number) => {
    if (pinchState === 3) {
      const newScale: Scale = [
        Math.max(0.05, Math.min(scale[0] * scaleFactor, 2)),
        Math.max(0.05, Math.min(scale[1] * scaleFactor, 2)),
        Math.max(0.05, Math.min(scale[2] * scaleFactor, 2)),
      ];
      setScale(newScale);
    }
  };

  const _onRotate = (rotateState: number, rotationFactor: number) => {
    if (rotateState === 2) {
      const newRotation: Rotation = [
        rotation[0],
        rotation[1] - rotationFactor,
        rotation[2],
      ];
      setRotation(newRotation);
    }
  };

   function onInitialized(state: any, reason: any) {
              console.log("onInitialized:", state, reason);
              if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
                  setText("Place your furniture!");
              }
          }

  console.log(selectedModel);
  return (
    <ViroARScene  onTrackingUpdated={onInitialized}>
      <ViroAmbientLight color="#ffffff" />
      <ViroARPlaneSelector>
        <Viro3DObject
          key={selectedModel} // Force re-render on model change
          source={modelSource}
          type="GLB"
          scale={scale}
          position={position}
          rotation={rotation}
          dragType="FixedToWorld"
          onDrag={_onDrag}
          onPinch={handlePinch}
          onRotate={_onRotate}
        />
      </ViroARPlaneSelector>
    </ViroARScene>
  );
};

// AR Scene Navigator with Options
const ARSceneWithOptions = ({
  route,
}: {
  route: RouteProp<RootStackParamList, "ARscene">;
}) => {
  const initialModel =
    (route.params?.variantName as FurnitureModelKey) || "default";
  const furnitureVariant = route.params?.furnitureType || "Sofa"; // Default to "Sofa" if not provided
  const [selectedModel, setSelectedModel] =
    useState<FurnitureModelKey>(initialModel);

  // Filter sofaDetails based on furnitureVariant
  const filteredFurniture = Object.keys(sofaDetails)
    .filter((key) =>
      sofaDetails[key].some(
        (variant) => variant.furnitureType === furnitureVariant
      )
    )
    .flatMap((key) => sofaDetails[key]); // Flatten the filtered data

  const renderFurnitureOption = ({ item }: { item: FurnitureVariant }) => {
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => setSelectedModel(item.modelSource)} // Update selected model dynamically
      >
        {item.image ? (
          <Image source={item.image} style={styles.thumbnail} />
        ) : (
          <View style={styles.missingThumbnail}>
            <Text style={styles.optionText}>No Image</Text>
          </View>
        )}
        <Text style={styles.optionText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainView}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => <HelloWorldSceneAR selectedModel={selectedModel} />, // Pass selectedModel
        }}
        key={selectedModel} // Force re-render when selectedModel changes
        style={{ flex: 1 }}
      />

      <View style={styles.optionsContainer}>
        <FlatList
          horizontal
          data={filteredFurniture} // Use filtered furniture variants
          renderItem={renderFurnitureOption}
          keyExtractor={(item, index) => `${item.name}-${index}`} // Unique key for each item
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};


// Styles
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  optionsContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 10,
    padding: 10,
  },
  optionContainer: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    resizeMode: "cover",
  },
  missingThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
    color: "#333",
  },
});

export default ARSceneWithOptions;