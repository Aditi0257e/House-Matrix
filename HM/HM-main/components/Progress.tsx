import React, { Component } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Block from './block';

type ProgressProps = {
  startColor?: string;
  endColor?: string;
  value?: number; // Progress value (0 to 1)
  opacity?: number;
  style?: StyleProp<ViewStyle>;
};

class Progress extends Component<ProgressProps> {
  static defaultProps = {
    startColor: '#4F8DFD',
    endColor: '#3FE4D4',
    value: 0.75,
    opacity: 0.2,
  };

  render() {
    const { startColor, endColor, value = 0.75, opacity = 0.2, style, ...props } = this.props;

    return (
      <Block
        row
        center
        color={`rgba(0,0,0,${opacity})`} // Background color with opacity
        style={[styles.background, style]}
        {...props}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[startColor!, endColor!]}
          style={[styles.overlay, { flex: value }]}
        />
      </Block>
    );
  }
}

export default Progress;

const styles = StyleSheet.create({
  background: {
    height: 6,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden', // Ensures progress bar stays within rounded edges
  },
  overlay: {
    height: 6,
    borderRadius: 8,
  },
});
