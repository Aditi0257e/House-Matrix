import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import {
    ViroARSceneNavigator,
    ViroARScene,
    Viro3DObject,
    ViroAmbientLight,
    ViroTrackingStateConstants
} from "@reactvision/react-viro";
type Position = [number, number, number];
type Scale = [number, number, number];

// Props interface for the AR scene
interface HelloWorldSceneARProps {
    viroAppProps: { object: string };
}

// AR scene that uses passed properties from viroAppProps
const HelloWorldSceneAR: React.FC<HelloWorldSceneARProps> = ({ viroAppProps }) => {
    const [text, setText] = useState("Initializing AR...");
    const [scale, setScale] = useState<Scale>([0.2, 0.2, 0.2]);
  const [position, setPosition] = useState<Position>([0, -0.5, -1]);

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
    function onInitialized(state: any, reason: any) {
        console.log("onInitialized:", state, reason);
        if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
            setText("Hello Sayantani!");
        }
    }

    console.log("Rendering HelloWorldSceneAR with object:", viroAppProps.object);

    return (
        <ViroARScene onTrackingUpdated={onInitialized}>
            <ViroAmbientLight color={"#ffffff"} />
            {viroAppProps.object === "sofa" ? (
                <Viro3DObject
                    source={require("../assets/res/office_sofa_-25mb.glb")}
                    type="GLB"
                    scale={scale}
                    position={position}
                    rotation={[0, 0, 0]}
                    dragType="FixedToWorld"
                    onDrag={_onDrag}
                    onPinch={handlePinch}
                    animation={{
                        name: "Take 001",
                        run: true,
                        loop: true,
                        delay: 1000,
                    }}
                />
            ) : (
                <Viro3DObject
                    source={require("../assets/res/c.glb")}
                    type="GLB"
                    scale={scale}
                    position={position}
                    rotation={[0, 0, 0]}
                    dragType="FixedToWorld"
                    onDrag={_onDrag}
                    onPinch={handlePinch}
                    animation={{
                        name: "Take 001",
                        run: true,
                        loop: true,
                        delay: 1000,
                    }}
                />
            )}
        </ViroARScene>
    );
};

const ARSceneWithOptions = () => {
    const [object, setObject] = useState("sofa");

    // Function to update the object and trigger re-render
    const handleObjectChange = (newObject: string, sceneNavigator: any) => {
        console.log("Object changed to:", newObject);
        setObject(newObject);

        // Replace the scene with the updated object
        sceneNavigator.replace({
            scene: HelloWorldSceneAR,
            passProps: { viroAppProps: { object: newObject } },
        });
    };

    // Wrapper function to ensure proper props passing to the scene
    const HelloWorldSceneARWithProps = () => {
        return <HelloWorldSceneAR viroAppProps={{ object }} />;
    };

    let sceneNavigatorRef: any = null;

    return (
        <View style={styles.mainView}>
            <ViroARSceneNavigator
                ref={(navigator) => {
                    sceneNavigatorRef = navigator;
                }}
                autofocus={true}
                initialScene={{
                    scene: HelloWorldSceneARWithProps,  // Wrap it here to ensure it gets the props correctly
                }}
                style={{ flex: 1 }}
            />
            <View style={styles.controlsView}>
                <TouchableOpacity onPress={() => handleObjectChange("sofa", sceneNavigatorRef)}>
                    <Text style={styles.textStyle}>sofa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleObjectChange("desk", sceneNavigatorRef)}>
                    <Text style={styles.textStyle}>desk</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    controlsView: {
        width: "100%",
        height: 100,
        backgroundColor: "#ffffff",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    textStyle: {
        margin: 20,
        fontSize: 16,
        color: "#000",
        backgroundColor: "#9d9d9d",
        padding: 10,
        borderRadius: 5,
        fontWeight: "bold",
    },
});

export default ARSceneWithOptions;
