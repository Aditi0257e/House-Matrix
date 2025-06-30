import React, { Component } from "react";
import { ViroARScene, ViroText } from "@reactvision/react-viro";

// Define an interface for the props. This tells TypeScript that
// this component expects a prop called `sceneNavigator` with a
// nested object `viroAppProps` that contains a `sampleData` string.
interface ARHitTestSampleProps {
  sceneNavigator: {
    viroAppProps: {
      sampleData: string;
    };
  };
}

// Define an interface for the state.
interface ARHitTestSampleState {
  message: string;
}

export default class ARScreenWithOptions extends Component<
  ARHitTestSampleProps,
  ARHitTestSampleState
> {
  constructor(props: ARHitTestSampleProps) {
    super(props);
    this.state = {
      message: "Initializing AR...",
    };
  }

  componentDidMount() {
    // Extract sampleData from the passed viroAppProps.
    const { sampleData } = this.props.sceneNavigator.viroAppProps;
    this.setState({ message: sampleData || "No Data Received" });
  }

  render() {
    return (
      <ViroARScene>
        <ViroText
          text={this.state.message}
          position={[0, 0, -2]}
          style={{ fontSize: 20, color: "white" }}
        />
      </ViroARScene>
    );
  }
}
