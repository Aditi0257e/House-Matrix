import React from 'react';
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { Card, Badge, Block, Text } from '../components';
import { theme } from '../constants';
import { sofas, diningTables, beds, closets, chairs, officeDesks } from '../constants/mocks1'; // Import from the data file
import { RouteProp } from '@react-navigation/native';
import { profile } from '../constants/mocks';

const { width } = Dimensions.get('window');

interface ProductItem {
  id: string;
  name: string;
  count: number;
  image: any;
}

// Define a type for the category data map
type CategoryDataMap = {
  [key: string]: ProductItem[];
};

type SofaScreenRouteProp = RouteProp<{
  Sofa1: {
    category: {
      name: string;
      // Add other properties of the category if needed
    };
  };
}, 'Sofa1'>;

interface SofaProps {
  navigation: {
    navigate: (screen: string, params?: object) => void;
  };
  route: SofaScreenRouteProp;
}

const Sofa1: React.FC<SofaProps> = ({ navigation, route }) => {
  // Map category names to their corresponding data arrays
  const categoryDataMap: CategoryDataMap = {
    'Sofa': sofas,
    'Dinning Table': diningTables,
    'Bed': beds,
    'closet': closets,
    'Chair': chairs,
    'office Desk': officeDesks
  };

  // Get the category from navigation params
  const { category } = route.params;

  // Select the appropriate data based on the category
  // Use type assertion to handle potential undefined
  const filteredOptions = categoryDataMap[category.name] || [];

  return (
    
<Block>
  <Block flex={false} row center space="between" style={styles.header}>
    <Text h1 bold>{category?.name || "Category"} Sets</Text>
    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
      <View style={styles.avatarContainer}>
        <Image source={profile.avatar || require('../assets/images/avatar.png')} style={styles.avatar} />
      </View>
    </TouchableOpacity>
  </Block>

  {/* Divider */}
  <View style={styles.divider} />
  
  <ScrollView
    showsVerticalScrollIndicator={false}
    style={{ paddingVertical: theme.sizes.base * 2 }}
  >
    <Block flex={false} row space="between" style={styles.categories}>
      {filteredOptions.length > 0 ? (
        filteredOptions.map((item) => (
          
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate('SofaDetails', {
              id: item.id,
              categoryName: category.name,
            })}
          >
            
            <Card center middle shadow style={styles.category}>
              <Badge margin={[0, 0, 15]} size={50} color="rgba(41,216,143,0.20)">
                <Image source={item.image || require('../assets/images/avatar.png')} />
              </Badge>
              <Text medium height={20}>{item.name}</Text>
              <Text gray caption>{item.count} options</Text>
              
            </Card>
          </TouchableOpacity>
        ))
      ) : (
      <Text gray caption>No products available</Text>
        
      )}
    </Block>
  </ScrollView>
</Block>

  );
};

export default Sofa1;

// ... styles remain the same

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
    marginTop: theme.sizes.base * 2,
  },
  divider: {
    height: 1, // Thin line
    backgroundColor: theme.colors.secondary, // Neutral color
    marginVertical: theme.sizes.base, // Spacing around the divider
  },
  categories: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    width: (width - theme.sizes.padding * 2.4) / 2 - theme.sizes.base, // Uniform width
    height: (width - theme.sizes.padding * 2.4) / 2 - theme.sizes.base, // Uniform height
    marginBottom: theme.sizes.base * 2,
  },
  avatarContainer: {
    borderRadius: theme.sizes.base,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.gray,
    marginTop: 10,
  },
  avatar: {
    width: 40,
    height: 40,
  },
});
