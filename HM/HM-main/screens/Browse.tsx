import React, { useState, useEffect } from 'react';
import { 
  Dimensions, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  View, 
  TextInput, 
  BackHandler,
  Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { Card, Badge, Button, Block, Text } from '../components';
import { theme, mocks } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import sofa data
import { sofaDetails } from '../constants/mocks1'; // Adjust the import path as needed

const { width } = Dimensions.get('window');

interface Category {
  name: string;
  tags: string[];
  image: any;
  count: number;
}

interface SofaVariant {
  name: string;
  image: any;
  color: string;
  price: number;
  dimensions: string;
  roomType: string;
  furnitureType: string;
  a: any;
  b: any;
}

interface BrowseProps {
  navigation: {
    navigate: (screen: string, params?: object) => void;
    goBack: () => void;
  };
  route: {
    params?: {
      username?: string;
    };
  };
}

const Browse: React.FC<BrowseProps> = ({ navigation, route }) => {
  const username = route.params?.username || 'Guest';
  const [active, setActive] = useState('Products');
  const [profile, setProfile] = useState(mocks.profile);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(mocks.categories);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SofaVariant[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load profile from AsyncStorage
  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        // Ensure avatar is properly set
        if (parsedProfile.avatar) {
          setProfile(parsedProfile);
          // Update mock profile to match saved profile
          Object.assign(mocks.profile, parsedProfile);
        }
      }
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  };

  // Use focus effect to handle both profile loading and back button customization
  useFocusEffect(
    React.useCallback(() => {
      // Load profile when screen comes into focus
      loadProfile();
      
      // Set up back button handler only when this screen is focused
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (showSearch || isSearching) {
          // If search is open, close it instead of going back
          setShowSearch(false);
          setSearchQuery('');
          setIsSearching(false);
          return true; // Prevent default back behavior
        }
        
        // Show exit confirmation dialog only on this screen
        Alert.alert(
          "Exit App",
          "Do you want to exit?",
          [
            {
              text: "No",
              onPress: () => null,
              style: "cancel"
            },
            { 
              text: "Yes", 
              onPress: () => BackHandler.exitApp() 
            }
          ],
          { cancelable: false }
        );
        
        return true; // Prevent default back behavior
      });

      // Clean up function that removes the event listener
      // This will run when screen loses focus or unmounts
      return () => backHandler.remove();
    }, [showSearch, isSearching])
  );

  // Search sofa variants
  const searchSofaVariants = (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
  
    const lowerCaseQuery = query.toLowerCase();
    
    // Use the same filtering approach on sofaDetails
    const results = Object.keys(sofaDetails)
      .flatMap((key) => sofaDetails[key])
      .filter(
        (variant) =>
          variant.name.toLowerCase().includes(lowerCaseQuery) ||
          variant.furnitureType.toLowerCase().includes(lowerCaseQuery)
      );
  
    setSearchResults(results);
    setIsSearching(results.length > 0);
  };

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Reset to filtered categories based on active tab
      handleTab(active);
      setIsSearching(false);
    } else {
      // Search sofa variants
      searchSofaVariants(searchQuery);
      
      // Also filter categories for non-sofa items
      const searched = mocks.categories.filter(
        category => 
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          category.tags.includes(active.toLowerCase())
      );
      setFilteredCategories(searched);
    }
  }, [searchQuery, active]);

  const handleTab = (tab: string) => {
    const filtered = mocks.categories.filter(category =>
      category.tags.includes(tab.toLowerCase())
    );
    setActive(tab);
    setFilteredCategories(filtered);
  };

  const renderTab = (tab: string) => {
    const isActive = active === tab;
    return (
      <TouchableOpacity
        key={`tab-${tab}`}
        onPress={() => handleTab(tab)}
        style={[styles.tab, isActive ? styles.active : null]}
      >
        <Text size={16} medium gray={!isActive} secondary={isActive}>
          {tab}
        </Text>
      </TouchableOpacity>
    );
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      // Clear search when closing
      setSearchQuery('');
      setIsSearching(false);
    }
  };
  
  // Reset search state
  const resetSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    setIsSearching(false);
    handleTab(active); // Reset to current tab's categories
  };

  const tabs = ['Products', 'Inspirations', 'Shop'];

  return (
    <Block style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Header */}
        <Block flex={false} row center space="between" style={styles.header}>
          {showSearch ? (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <TouchableOpacity onPress={resetSearch} style={styles.searchIcon}>
                <FontAwesome name="times" size={20} color={theme.colors.gray} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text h1 bold>Browse</Text>
              <Block flex={false} row center>
                <TouchableOpacity onPress={toggleSearch} style={styles.searchButton}>
                  <FontAwesome name="search" size={20} color={theme.colors.gray} />
                </TouchableOpacity>
                <Button onPress={() => navigation.navigate('Settings', { username })}>
                  <View style={styles.avatarContainer}>
                    <Image 
                      source={profile.avatar} 
                      style={styles.avatar} 
                      resizeMode="cover"
                    />
                  </View>
                </Button>
              </Block>
            </>
          )}
        </Block>
  
        {/* Search Results Section */}
        {isSearching && searchResults.length > 0 && (
          <Block style={styles.searchResultsContainer}>
            <Block flex={false} row space="between" style={styles.searchResultsHeader}>
              <Text style={styles.sectionHeader}>Search Results</Text>
              {/*<TouchableOpacity onPress={resetSearch} style={styles.backButton}>
                <FontAwesome name="arrow-left" size={20} color={theme.colors.gray} />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              */}
            </Block>
            
            {searchResults.map((variant, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => navigation.navigate('ARScene', { 
                  furnitureType: variant.furnitureType,
                  variantName: variant.name,
                })}
              >
                <Image
                  source={variant.image}
                  style={styles.image}
                  resizeMode="cover"
                  defaultSource={require('../assets/images/explore_1.png')} // Adjust this path as needed
                />
                <View style={styles.variantInfo}>
                  <Text style={styles.name}>{variant.name}</Text>
                  {variant.price && (
                    <Text style={styles.price}>₹{variant.price.toFixed(2)}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </Block>
        )}

        {/* Regular Browse Content - Only show if not displaying search results */}
        {(!isSearching || searchResults.length === 0) && (
          <>
            <Block flex={false} row style={styles.tabs}>
              {tabs.map(tab => renderTab(tab))}
            </Block>
    
            <Block flex={false} row space="between" style={styles.categories}>
              {filteredCategories.map(category => (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => navigation.navigate('Sofa1', { category })}
                >
                  <Card center middle shadow style={styles.category}>
                    <Badge margin={[0, 0, 15]} size={50} color="rgba(41,216,143,0.20)">
                      <Image source={category.image} />
                    </Badge>
                    <Text medium height={20}>{category.name}</Text>
                    <Text gray caption>{category.count} products</Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </Block>
          </>
        )}
      </ScrollView>
  
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          navigation.navigate("Cam");
        }}
      >
        <LinearGradient
          colors={['#D87D4A', '#BFA980']}
          style={styles.fabGradient}
        >
          <FontAwesome name="camera" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </Block>
  );
};

export default Browse;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatarContainer: {
    borderRadius: theme.sizes.base,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  searchButton: {
    padding: 10,
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray2,
    borderRadius: theme.sizes.radius,
    paddingHorizontal: 10,
    flex: 1, // Take up all available space
    marginTop: 20
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: theme.colors.black,
  },
  searchIcon: {
    padding: 5,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    marginLeft: 5,
    color: theme.colors.gray,
    fontSize: 16,
  },
  tabs: {
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
  },
  tab: {
    marginRight: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base,
  },
  active: {
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: 3,
  },
  categories: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    width: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxHeight: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    marginBottom: theme.sizes.base * 2,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  // Search results styling
  searchResultsContainer: {
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 2,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
  },
  variantInfo: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    color: theme.colors.secondary,
    fontWeight: '600',
  },
});