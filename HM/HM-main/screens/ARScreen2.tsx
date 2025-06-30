import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  ViroARSceneNavigator,
  ViroARScene,
  Viro3DObject,
  ViroAmbientLight,
  ViroARPlaneSelector,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";
import { RouteProp } from "@react-navigation/native";
import { furnitureModels, FurnitureModelKey } from "../constants/mocks";
import { sofaDetails, FurnitureVariant } from "../constants/mocks1";
import { RootStackParamList } from "../navigation/types";

// ------------------------------------------------------------------
// Type definitions
// ------------------------------------------------------------------
type Position = [number, number, number];
type Scale = [number, number, number];
type Rotation = [number, number, number];

interface HelloWorldSceneARProps {
  selectedModel: FurnitureModelKey;
  onTrackingStatusChange?: (status: string) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
}

// ------------------------------------------------------------------
// AR Scene Component – encapsulates the ViroARScene and 3D object,
// implements drag, pinch, rotate, and onLoad hit testing.
// ------------------------------------------------------------------
const HelloWorldSceneAR: React.FC<HelloWorldSceneARProps> = ({
  selectedModel,
  onTrackingStatusChange,
  onLoadStart,
  onLoadEnd,
}) => {
  
  const [scale, setScale] = useState<Scale>([0.2, 0.2, 0.2]);
  const [position, setPosition] = useState<Position>([0, -0.5, -1]);
  const [rotation, setRotation] = useState<Rotation>([0, 0, 0]);
  const modelSource = furnitureModels[selectedModel];

  // Use a ref to access AR scene methods (e.g. for hit testing)
  const arSceneRef = useRef<any>(null);

  // Called when the object is dragged.
  const _onDrag = (dragToPos: Position) => {
    setPosition(dragToPos);
  };

  // Called during pinch gesture – scale the object.
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

  // Called during rotate gesture.
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

  // Called when tracking is updated.
  const onInitialized = (state: number, reason: any) => {
    console.log("onInitialized:", state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      if (onTrackingStatusChange) onTrackingStatusChange("Place your furniture!");
    } else {
      if (onTrackingStatusChange) onTrackingStatusChange("Initializing AR...");
    }
  };

  // Helper: compute distance between two 3D points.
  const computeDistance = (p1: Position, p2: Position) => {
    return Math.sqrt(
      (p2[0] - p1[0]) ** 2 +
      (p2[1] - p1[1]) ** 2 +
      (p2[2] - p1[2]) ** 2
    );
  };

  // Given the camera’s position and hit test results, choose a good placement.
  const computeInitialPlacement = (
    cameraPos: Position,
    forward: Position,
    results: any[]
  ): Position => {
    // Default: 1.5 meters in front of the camera.
    let newPosition: Position = [
      forward[0] * 1.5,
      forward[1] * 1.5,
      forward[2] * 1.5,
    ];

    let hitResultPosition: Position | undefined = undefined;
    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.type === "ExistingPlaneUsingExtent") {
          const distance = computeDistance(cameraPos, result.transform.position);
          if (distance > 0.2 && distance < 10) {
            hitResultPosition = result.transform.position;
            break;
          }
        } else if (result.type === "FeaturePoint" && !hitResultPosition) {
          const distance = computeDistance(cameraPos, result.transform.position);
          if (distance > 0.2 && distance < 10) {
            hitResultPosition = result.transform.position;
          }
        }
      }
    }
    if (hitResultPosition) {
      newPosition = hitResultPosition;
    }
    return newPosition;
  };

  // When the model finishes loading, we perform an AR hit test
  // to adjust the placement of the object.
  const handleLoadEnd = () => {
    if (onLoadEnd) onLoadEnd();
    if (arSceneRef.current && arSceneRef.current.getCameraOrientationAsync) {
      arSceneRef.current
        .getCameraOrientationAsync()
        .then((orientation: any) => {
          if (
            arSceneRef.current &&
            arSceneRef.current.performARHitTestWithRay
          ) {
            arSceneRef.current
              .performARHitTestWithRay(orientation.forward)
              .then((results: any[]) => {
                const newPos = computeInitialPlacement(
                  orientation.position,
                  orientation.forward,
                  results
                );
                setPosition(newPos);
              })
              .catch((error: any) => {
                console.warn("AR hit test error:", error);
              });
          }
        });
    }
  };

  return (
    <ViroARScene ref={arSceneRef} onTrackingUpdated={onInitialized}>
      <ViroAmbientLight color="#ffffff" />
      <ViroARPlaneSelector>
        <Viro3DObject
          key={selectedModel} // Force a re-render when the model changes
          source={modelSource}
          type="GLB"
          scale={scale}
          position={position}
          rotation={rotation}
          dragType="FixedToWorld"
          onDrag={_onDrag}
          onPinch={handlePinch}
          onRotate={_onRotate}
          onLoadStart={onLoadStart}
          onLoadEnd={handleLoadEnd}
        />
      </ViroARPlaneSelector>
    </ViroARScene>
  );
};

// ------------------------------------------------------------------
// AR Scene Navigator with Options – displays the AR scene and overlays
// tracking text, a loading indicator, and a FlatList of furniture options.
// ------------------------------------------------------------------
const ARSceneWithOptions = ({
  route,
}: {
  route: RouteProp<RootStackParamList, "ARscene">;
}) => {
  const initialModel =
    (route.params?.variantName as FurnitureModelKey) || "default";
  const furnitureVariant = route.params?.furnitureType || "Sofa"; // Default if not provided
  const [selectedModel, setSelectedModel] = useState<FurnitureModelKey>(initialModel);
  const [trackingStatusText, setTrackingStatusText] = useState("Initializing AR...");
  const [isLoading, setIsLoading] = useState(false);

  // Filter the available furniture options based on the current variant.
  const filteredFurniture = Object.keys(sofaDetails)
    .filter((key) =>
      sofaDetails[key].some(
        (variant) => variant.furnitureType === furnitureVariant
      )
    )
    .flatMap((key) => sofaDetails[key]);

  const renderFurnitureOption = ({ item }: { item: FurnitureVariant }) => {
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => setSelectedModel(item.name)}
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
          scene: () => (
            <HelloWorldSceneAR
              selectedModel={selectedModel}
              onTrackingStatusChange={setTrackingStatusText}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
          ),
        }}
        key={selectedModel} // Ensure the scene re-renders when the model changes
        style={{ flex: 1 }}
      />

      {/* Tracking Status Overlay (similar to _renderTrackingText) */}
      <View style={styles.trackingOverlay}>
        <Text style={styles.trackingText}>{trackingStatusText}</Text>
      </View>

      {/* Loading Indicator Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      {/* Options bar to choose a different model */}
      <View style={styles.optionsContainer}>
        <FlatList
          horizontal
          data={filteredFurniture}
          renderItem={renderFurnitureOption}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

// ------------------------------------------------------------------
// Styles
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  trackingOverlay: {
    position: "absolute",
    top: 30,
    left: 30,
    right: 30,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 5,
    borderRadius: 5,
  },
  trackingText: {
    fontSize: 12,
    color: "#ffffff",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
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
