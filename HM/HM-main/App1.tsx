import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroTrackingReason,
  ViroTrackingStateConstants,
  Viro3DObject,
  ViroAmbientLight,
  ViroDirectionalLight,
} from "@reactvision/react-viro";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button } from "react-native";

// Define types
type Position = [number, number, number];
type Scale = [number, number, number];

const objectResources = {
  Object1: {
    source: require('./assets/res/office_sofa_-25mb.glb'),
  },
  Object2: {
    source: require('./assets/res/office_sofa_-25mb.glb'),
  },
  Object3: {
    source: require('./assets/res/some_furniture.glb'),
  },
};

const HelloWorldSceneAR = ({ selectedObject }: { selectedObject: keyof typeof objectResources }) => {
  const [scale, setScale] = useState<Scale>([0.2, 0.2, 0.2]);
  const [position, setPosition] = useState<Position>([0, -0.5, -1]);
  const [objectSource, setObjectSource] = useState(objectResources[selectedObject].source);

  useEffect(() => {
    console.log("Loading object:", selectedObject);
    setObjectSource(objectResources[selectedObject].source);
  }, [selectedObject]);

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

  const onInitialized = (state: any, reason: ViroTrackingReason) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log("AR tracking is normal");
    } else {
      console.log("AR tracking not ready:", reason);
    }
  };

  const _onClick = () => {
    console.log("Object clicked at position:", position);
    console.log("Object source:", objectSource);
  };

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroAmbientLight color="#ffffff" />
      <ViroDirectionalLight
        color="#ffffff"
        direction={[0, -1, -0.5]}
        castsShadow={true}
      />
      <Viro3DObject
        source={objectSource}
        type="GLB"
        scale={scale}
        position={position}
        rotation={[0, 0, 0]}
        dragType="FixedToWorld"
        onDrag={_onDrag}
        onPinch={handlePinch}
        onClick={_onClick}
      />
    </ViroARScene>
  );
};

const ARSceneWithOptions: React.FC = () => {
  const [selectedObject, setSelectedObject] = useState<keyof typeof objectResources>("Object2");

  const handlePress = (key: keyof typeof objectResources) => {
    console.log("Button pressed:", key);
    setSelectedObject(key);
  };

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => <HelloWorldSceneAR selectedObject={selectedObject} />
        }}
        style={styles.arNavigator}
      />
      <View style={styles.optionsContainer}>
        <Button title="Object1" onPress={() => handlePress("Object1")} />
        <Button title="Object2" onPress={() => handlePress("Object2")} />
        <Button title="Object3" onPress={() => handlePress("Object3")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arNavigator: {
    flex: 1,
  },
  optionsContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#f0f0f0",
    zIndex: 1,
  },
});

export default ARSceneWithOptions;
