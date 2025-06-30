import React, { Component } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';

import Block from './block';
import { theme } from '../constants';

// Define the types for the props
type DividerProps = {
  color?: string; // Optional color property
  style?: StyleProp<ViewStyle>; // Optional style property
  [key: string]: any; // To allow any other additional props
};

export default class Divider extends Component<DividerProps> {
  render() {
    const { color, style, ...props } = this.props;

    const dividerStyles = [
      styles.divider,
      style,
    ];

    return (
      <Block
        color={color || theme.colors.gray2} // Use default color if not provided
        style={dividerStyles}
        {...props}
      />
    );
  }
}

export const styles = StyleSheet.create({
  divider: {
    height: 0,
    margin: theme.sizes.base * 2,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
