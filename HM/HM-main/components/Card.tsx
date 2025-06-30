import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';

interface CardProps {
  children?: React.ReactNode; // Add children prop to handle nested content
  style?: ViewStyle | ViewStyle[]; // Style prop for custom styling
  center?: boolean; // New prop to center content horizontally
  middle?: boolean;
  shadow?: boolean; // New prop to center content vertically
}

const Card: React.FC<CardProps> = ({ children, style, center, middle }) => {
  // Add centering styles conditionally based on the center and middle props
  const cardStyle = [
    styles.card,
    center && styles.center, // Conditionally apply centering horizontally
    middle && styles.middle, // Conditionally apply centering vertically
    style, // Custom style passed as prop
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  center: {
    alignItems: 'center', // Centers horizontally
  },
  middle: {
    justifyContent: 'center', // Centers vertically
  },
});

export default Card;
