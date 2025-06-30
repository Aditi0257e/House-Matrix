import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { sofaDetails } from '../constants/mocks1';

type SofaDetailsProps = {
  route: RouteProp<RootStackParamList, 'SofaDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'SofaDetails'>;
};

const { width } = Dimensions.get('window');

const SofaDetails: React.FC<SofaDetailsProps> = ({ route, navigation }) => {
  const { id } = route.params;

  // Fetch the variants for the given product ID
  const variants = sofaDetails[id];

  const handleVariantPress = (variant: any) => {
    // Optional: Navigate to a detailed variant view or perform an action
    // navigation.navigate('VariantDetails', { variant });
  };

  if (!variants || variants.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No variants available for this product.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Details</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeader}>Product Variants</Text>
        {variants.map((variant, index) => (
          <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => navigation.navigate('ARScene', { 
            furnitureType:variant.furnitureType,
            variantName: variant.name,
        
          })}
        >
          
            <Image
              source={variant.image}
              style={styles.image}
              resizeMode="cover"
              defaultSource={require('../assets/images/explore_1.png')} // Add a placeholder image
            />
            <View style={styles.variantInfo}>
              <Text style={styles.name}>{variant.name}</Text>
              
              {variant.price && (
                <Text style={styles.price}>₹{variant.price.toFixed(2)}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SofaDetails;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    backgroundColor: '#5D9C59',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: width * 0.9,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    padding: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  variantInfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BFA980', // Updated color
  },
  price: {
    fontSize: 16,
    color: '#666',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});