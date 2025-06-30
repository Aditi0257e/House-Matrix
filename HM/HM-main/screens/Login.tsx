import React, { Component } from 'react';
import { ActivityIndicator, Keyboard, View, KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../configs/FirebaseConfig';



type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginProps {
  navigation: LoginScreenNavigationProp;
}

interface LoginState {
  email: string;
  password: string;
  errors: string[];
  loading: boolean;
  showPassword: boolean;
}

export default class Login extends Component<LoginProps, LoginState> {
  state: LoginState = {
    email: '',
    password: '',
    errors: [],
    loading: false,
    showPassword: false,
  };

  handleLogin = () => {
    const { navigation } = this.props;
     //const { email, password } = this.state;
    const email = "bcrec@gmail.com";
    const password = "Bc@2025";
    const errors: string[] = [];
    const username = "Suvajit Garai";
   
    Keyboard.dismiss();
    this.setState({ loading: true });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email format before Firebase call
    if (!emailRegex.test(email)) {
      errors.push('email');
    }
    if (errors.length) {
      this.setState({ errors, loading: false });
      return;
    }

    // Firebase authentication logic
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        this.setState({ loading: false });
        // Explicitly pass username parameter for Browse route
        navigation.navigate('Browse', { username: username });
      })
      .catch((error) => {
        console.error(error);
        const errorCode = error.code;
        const errorMessages: string[] = [];
        if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
          errorMessages.push('email', 'password');
        } else if (errorCode === 'auth/invalid-email') {
          errorMessages.push('email');
        }
        this.setState({ errors: errorMessages, loading: false });
      });
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  render() {
    const { navigation } = this.props;
    const { loading, errors, email, password, showPassword } = this.state;

    const hasErrors = (key: string) => errors.includes(key);

    return (
      <KeyboardAvoidingView style={styles.login} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold style={styles.title}>Login</Text>
          <Block middle>
            <Input
              label="Email"
              error={hasErrors('email')}
              style={[styles.input, hasErrors('email') && styles.hasErrors]}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text: string) => this.setState({ email: text })}
            />
            <Input
              secure={!showPassword}
              label="Password"
              error={hasErrors('password')}
              style={[styles.input, hasErrors('password') && styles.hasErrors]}
              placeholder="Enter your password"
              value={password}
              onChangeText={(text: string) => this.setState({ password: text })}
              rightIcon={
                <TouchableOpacity onPress={this.togglePasswordVisibility}>
                  <FontAwesome
                    name={showPassword ? 'eye' : 'eye-slash'}
                    size={24}
                    color={theme.colors.gray2}
                  />
                </TouchableOpacity>
              }
            />
            {errors.includes('email') && (
              <Text caption accent>Invalid email or email format.</Text>
            )}
            {errors.includes('password') && (
              <Text caption accent>Invalid password.</Text>
            )}
            <Button gradient onPress={this.handleLogin}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text bold white center>Login</Text>
              )}
            </Button>

            <Button onPress={() => navigation.navigate('Forgot')}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                Forgot your password?
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  login: {
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
    fontWeight: 'bold',
    marginBottom: 0,
    marginTop: 100,
    color: '#333',
  },
});