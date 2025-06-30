import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

import Block from './block';
import { theme } from '../constants';

interface BadgeProps {
  children?: React.ReactNode; // To render nested elements
  style?: ViewStyle | ViewStyle[]; // Custom styling
  size?: number; // Badge size (height, width, borderRadius)
  color?: string; // Background color
  [key: string]: any; // To allow additional props
}

const Badge: React.FC<BadgeProps> = ({ children, style, size, color, ...props }) => {
  const badgeStyles: ViewStyle[] = [
    styles.badge,
    size ? { height: size, width: size, borderRadius: size / 2 } : {}, // Ensure a valid object is added
    style as ViewStyle, // Cast `style` to `ViewStyle` to satisfy TypeScript
  ];

  return (
    <Block flex={false} middle center color={color} style={badgeStyles} {...props}>
      {children}
    </Block>
  );
};

const styles = StyleSheet.create({
  badge: {
    height: theme.sizes.base,
    width: theme.sizes.base,
    borderRadius: theme.sizes.border,
  },
});

export default Badge;
