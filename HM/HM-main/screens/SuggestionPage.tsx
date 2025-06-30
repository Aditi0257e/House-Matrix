import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SuggestionPage: React.FC = () => {
    const navigation = useNavigation();
    
    const handleGoBack = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        // Navigate to a specific screen instead of going back
        navigation.navigate('ARCarDemo');
      }
    };
    
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>This is the Suggestion Page</Text>
        <TouchableOpacity
          onPress={handleGoBack}
          style={{ backgroundColor: '#000', padding: 10, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  };

export default SuggestionPage;
