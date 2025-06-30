import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { profile } from '../constants/mocks';
import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Forgot from '../screens/Forgot';
import Explore from '../screens/Explore';
import Browse from '../screens/Browse';
//import Product from '../screens/Camera1';
import Settings from '../screens/Settings';
import ARSceneWithOptions from '../screens/ARScreen';
import SofaDetails from '../screens/sofaDetails';
import Sofa1 from '../screens/sofa1';
import { RootStackParamList } from './types'; // Import RootStackParamList
import { theme } from '../constants';
import CameraComponent from '../screens/Camera1';
import FormPage from '../screens/FormPage';
import ResultPage from '../screens/ResultPage';
import Demo from '../screens/demo';
import ARScene from '../screens/ARScene';
import Sug from '../screens/Sug';

const Stack = createStackNavigator<RootStackParamList>();

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: theme.colors.white,
    elevation: 0, // Android shadow
  },
});

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: styles.headerStyle,
          headerShadowVisible: false,
          headerLeft: ({ onPress }) => (
            <TouchableOpacity onPress={onPress} style={{ marginLeft: theme.sizes.base * 2 }}>
              <Image
                source={require('../assets/icons/back.png')}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
          headerBackTitle: undefined,
          headerLeftContainerStyle: { alignItems: 'center', paddingRight: theme.sizes.base },
          headerRightContainerStyle: { alignItems: 'center', paddingRight: theme.sizes.base },
        }}
      >
        <Stack.Screen
          name="Welcome"
          options={{
            headerLeft: () => null,
            headerShadowVisible: false,
            headerShown: false,
          }}
        >
          {(props) => <Welcome {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Cam" component={CameraComponent} />
        <Stack.Screen name="FormPage" component={FormPage} />
        <Stack.Screen name="ResultPage" component={ResultPage} />

        <Stack.Screen
          name="Sofa1"
          options={{
            headerLeft: () => null,
            headerShadowVisible: false,
            headerShown: false,
          }}
        >
          {(props) => <Sofa1 {...props} />}
        </Stack.Screen>

        <Stack.Screen
          name="Login"
          options={{
            headerShadowVisible: false,
            headerShown: false,
          }}
        >
          {(props) => <Login {...props} />}
        </Stack.Screen>

        <Stack.Screen
          name="Forgot"
          options={{
            headerShadowVisible: false,
            headerShown: false,
          }}
        >
          {(props) => <Forgot {...props} />}
        </Stack.Screen>

        <Stack.Screen
          name="SignUp"
          options={{
            headerShadowVisible: false,
            headerShown: false,
          }}
        >
          {(props) => <SignUp {...props} />}
        </Stack.Screen>

        <Stack.Screen
          name="Browse"
          options={{
            headerShadowVisible: false,
            headerShown: false,
          }}
        >
          {(props) => <Browse {...props} />}
        </Stack.Screen>

        <Stack.Screen name="Explore" component={Explore} />
        <Stack.Screen
          name="Sug"
          component={Sug}
          options={{
            headerShadowVisible: false,
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Settings"
          options={{
            headerShadowVisible: false,
            headerShown: false,
          }}
        >
          {(props) => <Settings {...props} profile={profile} />}
        </Stack.Screen>

        <Stack.Screen name="ARScene" component={ARScene} />
        
        <Stack.Screen name="demo" component={Demo} />


        <Stack.Screen
          name="SofaDetails"
          component={SofaDetails}
          options={{
            headerShadowVisible: false,
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}