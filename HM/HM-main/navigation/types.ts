import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Forgot: undefined;
  Browse: {
    username:string;
  };
  Explore: undefined;
  FormPage: {
    detectedColor :string;
    hexCode:string;
    genderSpecific:object;
  };
  Product: undefined;
  ResultPage: { 
    dimensions: string; 
    roomType: string; 
    furnitureType: string;
    detectedColor: string; 
    hexCode:string;
    genderSpecificColor:object;
    //furnitureRecommendations:object;
  };
  Settings: {username:string};
  ARCarDemo:{
    furnitureType:string;
    variantName:string;
  };
  Sug:{
    id: string; 
    categoryName?: string;

  }
  Cam: undefined;
  SofaDetails: { 
    id: string; 
    categoryName?: string;
  };
  Sofa1: { 
    category: {
      name: string;
      // Add other category properties as needed
    };
  };
  ARScene: { 
    furnitureType:string;
    variantName: string;
    
  };
  demo:undefined;
};

// Navigation prop type for screens
export type RootStackNavigationProp<T extends keyof RootStackParamList> = 
  StackNavigationProp<RootStackParamList, T>;

// Route prop type for screens
export type RootStackRouteProp<T extends keyof RootStackParamList> = 
  RouteProp<RootStackParamList, T>;