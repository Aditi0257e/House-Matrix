import React, { Component } from 'react';
import { Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../configs/FirebaseConfig'; // Update the path as necessary

interface SignUpState {
  email: string | null;
  username: string | null;
  password: string | null;
  errors: string[];
  loading: boolean;
}

export default class SignUp extends Component<any, SignUpState> {
  state: SignUpState = {
    email: null,
    username: null,
    password: null,
    errors: [],
    loading: false,
  };

  // Method to handle signup
  handleSignUp = () => {
    const { navigation } = this.props;
    const { email, username, password } = this.state;
    const errors: string[] = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // Validation logic
    if (!email) errors.push('email');
    if (!username) errors.push('username');
    if (!password) errors.push('password');

    if (errors.length) {
      this.setState({ errors, loading: false });
      return;
    }

    // Firebase authentication
    createUserWithEmailAndPassword(auth, email!, password!)
      .then((userCredential) => {
        // Account creation successful
        const user = userCredential.user;
        Alert.alert('Success!', 'Your account has been created.', [
          {
            text: 'Continue',
            onPress: () => {
              navigation.navigate('Browse'); // Change 'Browse' to your intended screen
            },
          },
        ]);
        this.setState({ loading: false });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
        Alert.alert('Error', errorMessage);
        this.setState({ loading: false });
      });
  };

  // Helper function for error checking
  hasErrors = (key: string): boolean => {
    return this.state.errors.includes(key);
  };

  render() {
    const { navigation } = this.props;
    const { loading, email, username, password } = this.state;

    return (
      <KeyboardAvoidingView style={styles.signup} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold style={styles.title}>
            Sign Up
          </Text>
          <Block middle>
            <Input
              email
              label="Email"
              error={this.hasErrors('email')}
              style={[styles.input, this.hasErrors('email') && styles.hasErrors]}
              value={email || ''}
              onChangeText={(text: string) => this.setState({ email: text })}
              placeholder="Enter your email"
            />
            <Input
              label="Username"
              error={this.hasErrors('username')}
              style={[styles.input, this.hasErrors('username') && styles.hasErrors]}
              value={username || ''}
              onChangeText={(text: string) => this.setState({ username: text })}
              placeholder="Enter your username"
            />
            <Input
              secure
              label="Password"
              error={this.hasErrors('password')}
              style={[styles.input, this.hasErrors('password') && styles.hasErrors]}
              value={password || ''}
              onChangeText={(text: string) => this.setState({ password: text })}
              placeholder="Enter your password"
            />
            <Button gradient onPress={this.handleSignUp}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text bold white center>
                  Sign Up
                </Text>
              )}
            </Button>

            <Button onPress={() => navigation.navigate('Login')}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                Back to Login.
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  signup: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  },
  
  title: {
   
    fontSize: 30,
    marginBottom: 0,
    marginTop: 100,
    color: '#333',
  },
});
