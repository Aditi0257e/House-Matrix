import React, { Component } from 'react';
import { Animated, Dimensions, Image, FlatList, Modal, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native';
import { Button, Block, Text } from '../components';
import { theme } from '../constants';

const { width, height } = Dimensions.get('window');

// Define the type for your props
interface WelcomeProps {
  illustrations: { id: number; source: any }[];
  navigation: NavigationProp<ParamListBase>; // Correctly type the navigation prop
}

interface WelcomeState {
  showTerms: boolean;
}

// HOC to handle back button blocking
const withBackButtonBlocking = (WrappedComponent: any) => {
  return (props: any) => {
    // Use the useFocusEffect hook to handle the back button
    useFocusEffect(
      React.useCallback(() => {
        // This function will be called when the screen comes into focus
        const onBackPress = () => {
          // Return true to prevent going back
          return true;
        };

        // Add event listener for the hardware back button
        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        // Clean up function to be called when the screen loses focus
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        };
      }, [])
    );

    // Also disable the gesture for going back (swipe)
    React.useEffect(() => {
      props.navigation.setOptions({
        gestureEnabled: false,
      });
    }, [props.navigation]);

    // Return the original component with all props
    return <WrappedComponent {...props} />;
  };
};

class Welcome extends Component<WelcomeProps, WelcomeState> {
  static navigationOptions = {
    header: null,
  };

  static defaultProps = {
    illustrations: [
      { id: 1, source: require('../assets/images/Sofa.png') },
      { id: 2, source: require('../assets/images/sofa2.png') },
      { id: 3, source: require('../assets/images/lamp.png') },
    ],
  };

  scrollX = new Animated.Value(0);
  scrollRef: FlatList | null = null;
  autoScrollInterval: any = null;

  state = {
    showTerms: false,
  };

  componentDidMount() {
    this.startAutoScroll();
    
    // Disable going back when this component mounts
    const { navigation } = this.props;
    navigation.setOptions({
      headerLeft: null, // Remove the back button from the header
      gestureEnabled: false, // Disable swipe gesture
    });
  }

  componentWillUnmount() {
    this.stopAutoScroll();
  }

  startAutoScroll = () => {
    const { illustrations } = this.props;
    const numberOfItems = illustrations.length;

    let currentIndex = 0;
    this.autoScrollInterval = setInterval(() => {
      if (this.scrollRef) {
        currentIndex = (currentIndex + 1) % numberOfItems; // Loop back to the first item
        this.scrollRef.scrollToIndex({ animated: true, index: currentIndex });
      }
    }, 3000); // Change slide every 3 seconds
  };

  stopAutoScroll = () => {
    clearInterval(this.autoScrollInterval);
  };

  renderTermsService() {
    return (
      <Modal animationType="slide" visible={this.state.showTerms}>
        <Block padding={[theme.sizes.padding * 2, theme.sizes.padding]} space="between">
          <Text h2 light>Terms of Service</Text>
          <ScrollView style={{ marginVertical: theme.sizes.padding }}>
            <Text caption gray height={24} style={{ marginBottom: theme.sizes.base }}>
              1. Your use of the Service is at your sole risk...
            </Text>
          </ScrollView>
          <Block middle padding={[theme.sizes.base / 2, 0]}>
            <Button gradient onPress={() => this.setState({ showTerms: false })}>
              <Text center white>I understand</Text>
            </Button>
          </Block>
        </Block>
      </Modal>
    );
  }

  renderIllustrations() {
    const { illustrations } = this.props;

    return (
      <FlatList
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToAlignment="center"
        data={illustrations}
        extraData={this.state}
        keyExtractor={(item, index) => `${item.id}`}
        renderItem={({ item }) => (
          <Image
            source={item.source}
            resizeMode="contain"
            style={{ width, height: height / 2, overflow: 'visible' }}
          />
        )}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: this.scrollX } } }],
          { useNativeDriver: false }
        )}
        ref={(ref) => (this.scrollRef = ref)} // Save reference to FlatList
      />
    );
  }

  renderSteps() {
    const { illustrations } = this.props;
    const stepPosition = Animated.divide(this.scrollX, width);

    return (
      <Block row center middle style={styles.stepsContainer}>
        {illustrations.map((item, index) => {
          const opacity = stepPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Block
              animated
              flex={false}
              key={`step-${index}`}
              color="gray"
              style={[styles.steps, { opacity }]}
            />
          );
        })}
      </Block>
    );
  }

  render() {
    const { navigation } = this.props;

    return (
      <Block>
        <Block center bottom flex={0.4}>
          <Text h1 center bold>
            Your Home.
            <Text h1 primary> Classier.</Text>
          </Text>
          <Text h3 gray2 style={{ marginTop: theme.sizes.padding / 2 }}>
            Enjoy the experience.
          </Text>
        </Block>
        <Block center middle>
          {this.renderIllustrations()}
          {this.renderSteps()}
        </Block>
        <Block middle flex={0.5} margin={[0, theme.sizes.padding * 2]}>
          <Button gradient onPress={() => navigation.navigate('Login')}>
            <Text center semibold white>Login</Text>
          </Button>
          <Button shadow onPress={() => navigation.navigate('SignUp')}>
            <Text center semibold>Signup</Text>
          </Button>
          <Button onPress={() => this.setState({ showTerms: true })}>
            <Text center caption gray>Terms of service</Text>
          </Button>
        </Block>
        {this.renderTermsService()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  stepsContainer: {
    position: 'absolute',
    bottom: theme.sizes.base * 3,
    right: 0,
    left: 0,
  },
  steps: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginHorizontal: 2.5,
  },
});

// Export the enhanced component with back button blocking
export default withBackButtonBlocking(Welcome);