// import React from 'react';
// import { StyleSheet, SafeAreaView } from 'react-native';
// //import ARSceneWithOptions from './components/ARSceneWithOptions';
// import Navigation from './navigation';
// import * as constants from './constants';

// export default function App() {
//   return (
//     <SafeAreaView style={styles.container}>
//       <ARSceneWithOptions />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
// });



import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Navigation from './navigation';
import { Block } from './components';

const images = [
  require('./assets/icons/back.png'),
  require('./assets/icons/plants.png'),
  require('./assets/icons/seeds.png'),
  require('./assets/icons/flowers.png'),
  require('./assets/icons/sprayers.png'),
  require('./assets/icons/pots.png'),
  require('./assets/icons/fertilizers.png'),
  require('./assets/images/plants_1.png'),
  require('./assets/images/plants_2.png'),
  require('./assets/images/plants_3.png'),
  require('./assets/images/explore_1.png'),
  require('./assets/images/explore_2.png'),
  require('./assets/images/explore_3.png'),
  require('./assets/images/explore_4.png'),
  require('./assets/images/explore_5.png'),
  require('./assets/images/explore_6.png'),
  require('./assets/images/illustration_1.png'),
  require('./assets/images/illustration_2.png'),
  require('./assets/images/illustration_3.png'),
  require('./assets/images/avatar.png'),
];

const App = () => {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  const handleResourcesAsync = async () => {
    try {
      const cacheImages = images.map((image) => {
        return Image.prefetch(Image.resolveAssetSource(image).uri);
      });

      await Promise.all(cacheImages);
      setIsLoadingComplete(true);
    } catch (error) {
      console.warn("Error caching images:", error);
    }
  };

  React.useEffect(() => {
    handleResourcesAsync();
  }, []);

  if (!isLoadingComplete) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <Block color="white">
      <Navigation />
    </Block>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
});
