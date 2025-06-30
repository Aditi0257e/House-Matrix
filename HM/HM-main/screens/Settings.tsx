import React, { useState, useEffect, useCallback } from 'react';
import {
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  BackHandler
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Divider, Button, Block, Text, Switch } from '../components';
import { theme, mocks } from '../constants';
import { RootStackParamList } from '../navigation/types';

// Types
type Profile = typeof mocks.profile;
type SettingsProps = {
  route: RouteProp<RootStackParamList, 'Browse'>;
  navigation: {
    navigate: (screen: string, params?: object) => void;
    goBack: () => void;
  };
};

const Settings: React.FC<SettingsProps> = ({ route, navigation }) => {
  const { username } = route.params;
  const [profile, setProfile] = useState<Profile>(mocks.profile);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [editing, setEditing] = useState<keyof Profile | null>(null);

  // Handle back button press to navigate to Browse instead of showing exit dialog
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true; // Prevent default back behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  // Load saved profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('userProfile');
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile(parsedProfile);
          // Update mock profile to match saved profile
          Object.assign(mocks.profile, parsedProfile);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile');
      }
    };
    loadProfile();
  }, []);

  // Update profile in state, mocks, and storage
  const updateProfile = async (updates: Partial<Profile>) => {
    const newProfile = { ...profile, ...updates };
    
    // Update state
    setProfile(newProfile);
    
    // Update mock data
    Object.assign(mocks.profile, newProfile);
    
    // Persist to storage
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleEdit = (field: keyof Profile, value: string) => {
    updateProfile({ [field]: value });
  };

  const toggleEdit = (field: keyof Profile) => {
    setEditing(editing === field ? null : field);
  };

  const selectAvatar = (avatar: any) => {
    updateProfile({ avatar });
    setShowAvatarOptions(false);
  };

  const handleLogout = async () => {
    // You might want to clear some data before logging out
    try {
      // Optionally clear user session data
      // await AsyncStorage.removeItem('userToken');
      
      // Navigate to Login screen
      navigation.navigate('Welcome');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const renderEditField = (field: keyof Profile) => {
    if (editing === field) {
      return (
        <TextInput
          style={styles.input}
          defaultValue={String(profile[field])}
          onChangeText={(text) => handleEdit(field, text)}
          autoFocus
          onBlur={() => toggleEdit(field)}
        />
      );
    }
    return <Text bold>{profile[field]}</Text>;
  };

  const renderAvatarOption = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => selectAvatar(item)}>
      <Image
        source={item}
        style={[
          styles.avatarOption,
          profile.avatar === item && styles.selectedAvatar
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <Block>
      <Block flex={false} row center space="between" style={styles.header}>
        <Text h1 bold>Settings</Text>
        <TouchableOpacity onPress={() => setShowAvatarOptions(!showAvatarOptions)}>
          <Image source={profile.avatar} style={styles.avatar} />
        </TouchableOpacity>
      </Block>

      {showAvatarOptions && (
        <Block flex={false} style={styles.avatarOptionsContainer}>
          <FlatList
            horizontal
            data={mocks.avatarOptions}
            renderItem={renderAvatarOption}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.avatarOptionsList}
            showsHorizontalScrollIndicator={false}
          />
        </Block>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <Block style={styles.inputs}>
          <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
            <Block>
              <Text gray2 style={{ marginBottom: 10 }}>Username</Text>
              <Text bold>{username}</Text>
            </Block>
          </Block>

          <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
            <Block>
              <Text gray2 style={{ marginBottom: 10 }}>Email</Text>
              {renderEditField('email')}
            </Block>
            <Button style={styles.editButton} onPress={() => toggleEdit('email')}>
              <Text medium secondary>
                {editing === 'email' ? 'Save' : 'Edit'}
              </Text>
            </Button>
          </Block>

          <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
            <Block>
              <Text gray2 style={{ marginBottom: 10 }}>Location</Text>
              {renderEditField('location')}
            </Block>
            <Button style={styles.editButton} onPress={() => toggleEdit('location')}>
              <Text medium secondary>
                {editing === 'location' ? 'Save' : 'Edit'}
              </Text>
            </Button>
          </Block>
        </Block>

        <Divider margin={[theme.sizes.base, theme.sizes.base * 2]} />

        <Block style={styles.sliders}>
          <Block margin={[10, 0]}>
            <Text gray2 style={{ marginBottom: 10 }}>Budget</Text>
            <Slider
              minimumValue={0}
              maximumValue={5000}
              step={100}
              value={profile.budget}
              onValueChange={(value) => updateProfile({ budget: value })}
              minimumTrackTintColor={theme.colors.secondary}
              maximumTrackTintColor="rgba(157, 163, 180, 0.10)"
            />
            <Text caption gray right>${profile.budget.toFixed(0)}</Text>
          </Block>
        </Block>

        <Divider />

        <Block style={styles.toggles}>
          <Block row center space="between" style={{ marginBottom: theme.sizes.base * 2 }}>
            <Text gray2>Notifications</Text>
            <Switch
              value={profile.notifications}
              onValueChange={(value) => updateProfile({ notifications: value })}
            />
          </Block>

          <Block row center space="between">
            <Text gray2>Newsletter</Text>
            <Switch
              value={profile.newsletter}
              onValueChange={(value) => updateProfile({ newsletter: value })}
            />
          </Block>
        </Block>

        <Divider margin={[theme.sizes.base, theme.sizes.base * 2]} />

        {/* Logout Button */}
        <Block style={styles.logoutContainer}>
          <Button gradient onPress={handleLogout}>
            <Text center bold white>Logout</Text>
          </Button>
        </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingTop: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 3,
    width: theme.sizes.base * 3,
    borderRadius: theme.sizes.base * 1.5,
  },
  inputs: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray2,
    paddingVertical: 5,
    width: '80%',
  },
  inputRow: {
    alignItems: 'flex-end',
  },
  editButton: {
    padding: theme.sizes.base / 2,
  },
  sliders: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
  toggles: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base * 2,
  },
  avatarOptionsContainer: {
    paddingHorizontal: theme.sizes.base,
    paddingVertical: theme.sizes.base,
    backgroundColor: theme.colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.gray2,
  },
  avatarOptionsList: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOption: {
    height: theme.sizes.base * 4,
    width: theme.sizes.base * 4,
    borderRadius: theme.sizes.base * 2,
    marginHorizontal: theme.sizes.base / 2,
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: theme.colors.secondary,
  },
  logoutContainer: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base * 3,
  }
});

export default Settings;