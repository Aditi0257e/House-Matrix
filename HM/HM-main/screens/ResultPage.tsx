import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList, RootStackNavigationProp } from '../navigation/types';
import { sofaDetails } from '../constants/mocks1';

interface ColorRecommendation {
  base_color_hex: string;
  base_color_name: string;
  complementary_hex: string;
  match_distance: number;
  rank: number;
}

interface FurnitureRecommendation {
  Type: string;
  Style: string;
  Color: string;
  Material: string;
  'Room Type': string;
  Details: string;
  'Price Range': string;
}

interface ServerResponse {
  colorName: string;
  colorHex: string;
  responseData: {
    furniture_recommendations: FurnitureRecommendation[];
    recommendations: ColorRecommendation[];
    detected_color: {
      hex: string;
      name: string;
    };
    furniture_type: string;
    room_type: string;
  };
  timestamp: string;
}

type ResultPageRouteProp = RouteProp<RootStackParamList, 'ResultPage'>;

interface ResultPageProps {
  route: ResultPageRouteProp;
}

const ResultPage: React.FC<ResultPageProps> = ({ route }) => {
  const { dimensions, roomType, furnitureType, detectedColor, hexCode, genderSpecificColor } = route.params || {};
  const navigation = useNavigation<RootStackNavigationProp<'ResultPage'>>();
  
  // State to store all server responses
  const [serverResponses, setServerResponses] = useState<ServerResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Send each gender-specific color to the server
  useEffect(() => {
    if (genderSpecificColor && roomType && furnitureType) {
      const sendColorsToServer = async () => {
        try {
          setLoading(true);
          // Send each recommended color separately (excluding detected color)
          const colorRecommendations = genderSpecificColor as ColorRecommendation[];
          const responses: ServerResponse[] = [];
          
          for (const colorItem of colorRecommendations) {
            const responseData = await uploadColorToServer(colorItem, roomType, furnitureType);
            
            // Store response with additional metadata
            responses.push({
              colorName: colorItem.base_color_name,
              colorHex: colorItem.base_color_hex,
              responseData,
              timestamp: new Date().toISOString()
            });
          }
          
          // Update state with all responses
          setServerResponses(responses);
          
          // Log all stored responses
          console.log('All server responses:', responses);
        } catch (error) {
          console.error('Error uploading colors:', error);
        } finally {
          setLoading(false);
        }
      };
      
      sendColorsToServer();
    }
  }, [genderSpecificColor, roomType, furnitureType]);

  // Function to upload each color to the server
  const uploadColorToServer = async (
    colorItem: ColorRecommendation,
    roomType: string,
    furnitureType: string
  ) => {
    try {
      const uploadResponse = await fetch('http://192.168.1.4:5000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          colorOnly: true,
          roomType: roomType,
          furnitureType: furnitureType,
          detected_color: {
            name: colorItem.base_color_name,
            hex: colorItem.base_color_hex
          }
        }),
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Server responded with status: ${uploadResponse.status}`);
      }
      
      const responseData = await uploadResponse.json();
      console.log(`Color ${colorItem.base_color_name} uploaded:`, responseData);
      return responseData;
    } catch (error) {
      console.error(`Error uploading color ${colorItem.base_color_name}:`, error);
      throw error;
    }
  };

  if (!dimensions || !roomType || !furnitureType || !detectedColor) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: Required information is missing.</Text>
      </SafeAreaView>
    );
  }

  // Use genderSpecificColor as the color recommendations array
  const colorRecommendations = genderSpecificColor as ColorRecommendation[] | undefined;

  const handleItemPress = (item: any) => {
    navigation.navigate('ARScene', {
      furnitureType: item.furnitureType || item.Type,
      variantName: item.name || item.Style,
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>Detected Color:</Text>
      <View style={[styles.colorPreview, { backgroundColor: hexCode }]} />
      <Text style={styles.detectedColorText}>{detectedColor}</Text>
      
      <Text style={styles.headerText}>Recommended Colors:</Text>
      
      {colorRecommendations && colorRecommendations.length > 0 ? (
        <View style={styles.colorList}>
          {colorRecommendations.map((colorItem) => (
            <View key={colorItem.rank} style={styles.colorItem}>
              <View style={[styles.colorSquare, { backgroundColor: colorItem.base_color_hex }]} />
              <Text style={styles.colorName}>
                {colorItem.base_color_name}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noColorText}>No color recommendations available</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderHeader()}
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F3E6C9" />
            <Text style={styles.loadingText}>Loading recommendations...</Text>
          </View>
        ) : (
          <View style={styles.recommendationsContainer}>
            {serverResponses.map((response, index) => (
              <View key={index} style={styles.colorRecommendationSection}>
                <View style={styles.colorHeaderSection}>
                  <View style={[styles.colorSquareLarge, { backgroundColor: response.colorHex }]} />
                  <Text style={styles.colorSectionTitle}>{response.colorName} Recommendations</Text>
                </View>
                
                {response.responseData.furniture_recommendations && 
                 response.responseData.furniture_recommendations.length > 0 ? (
                  response.responseData.furniture_recommendations.map((item, itemIndex) => (
                    <TouchableOpacity 
                      key={`${index}-${itemIndex}`}
                      style={styles.furnitureCard}
                      onPress={() => handleItemPress(item)}
                    >
                      <View style={styles.cardContent}>
                        <Text style={styles.title}>{item.Style} {item.Type}</Text>
                        <Text style={styles.subtitle}>Color: {item.Color}</Text>
                        <Text style={styles.subtitle}>Material: {item.Material}</Text>
                        <Text style={styles.description}>{item.Details}</Text>
                        <Text style={styles.priceRange}>Price Range: {item['Price Range']}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noRecommendationText}>
                    No furniture recommendations available for {response.colorName}
                  </Text>
                )}
                
                <View style={styles.divider} />
              </View>
            ))}
            
            {serverResponses.length === 0 && !loading && (
              <Text style={styles.noResponseText}>
                No recommendations received from server
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F2F2F',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    padding: 16,
    backgroundColor: '#F3E6C9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 8,
  },
  colorPreview: {
    width: 200,
    height: 70,
    borderRadius: 0,
    marginBottom: 8,
  },
  detectedColorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  colorList: {
    width: '100%',
    marginTop: 8,
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    justifyContent: 'flex-start',
  },
  colorSquare: {
    width: 30,
    height: 30,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorSquareLarge: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorName: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginRight: 12,
    width: 80,
  },
  noColorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#F3E6C9',
    fontWeight: '500',
    marginTop: 12,
  },
  recommendationsContainer: {
    padding: 16,
  },
  colorRecommendationSection: {
    marginBottom: 24,
  },
  colorHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F3E6C9',
    flex: 1,
  },
  furnitureCard: {
    marginBottom: 16,
    borderRadius: 15,
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D9C59',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#808080',
    lineHeight: 20,
    marginBottom: 8,
  },
  priceRange: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5D9C59',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3E6C9',
    marginVertical: 16,
  },
  noRecommendationText: {
    fontSize: 16,
    color: '#F3E6C9',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  noResponseText: {
    fontSize: 18,
    color: '#F3E6C9',
    fontWeight: '500',
    textAlign: 'center',
    padding: 30,
  },
  errorText: {
    fontSize: 18,
    color: '#D87D4A',
    textAlign: 'center',
    marginTop: 20,
    padding: 16,
  },
});

export default ResultPage;