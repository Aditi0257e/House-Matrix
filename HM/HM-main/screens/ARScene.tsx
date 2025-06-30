import React, { useEffect, useState } from 'react';
import ARCarDemo from './ARCarDemo';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { View, ActivityIndicator } from 'react-native';

type ARSceneProps = StackScreenProps<RootStackParamList, 'ARScene'>;

const ARScene: React.FC<ARSceneProps> = ({ route }) => {
  const { furnitureType, variantName } = route.params;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Reset ready state whenever parameters change
    setIsReady(false);
    
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 800); // 2-second delay

    // Cleanup timeout if component unmounts or parameters change
    return () => clearTimeout(timer);
  }, [furnitureType, variantName]); // Trigger effect when parameters change

  return (
    <View style={{ flex: 1 }}>
      {isReady ? (
        <ARCarDemo
          furnitureType={furnitureType}
          variantName={variantName}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

export default ARScene;