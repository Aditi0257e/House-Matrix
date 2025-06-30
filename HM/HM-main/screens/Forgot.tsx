import React, { Component } from 'react';
import { Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

interface ForgotState {
  email: string;
  errors: string[];
  loading: boolean;
}

export default class Forgot extends Component<any, ForgotState> {
  state: ForgotState = {
    email: '', // Initialize email as empty
    errors: [],
    loading: false,
  };

  handleForgot = () => {
    const { navigation } = this.props;
    const { email } = this.state;
    const errors: string[] = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // Check if email is empty
    if (!email) {
      errors.push('email');
      this.setState({ errors, loading: false });
      Alert.alert('Error', 'Please enter an email address.', [{ text: 'OK' }], { cancelable: false });
      return;
    }

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        this.setState({ loading: false });
        Alert.alert(
          'Success',
          'Password reset email sent. Please check your inbox.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ],
          { cancelable: false }
        );
      })
      .catch((error) => {
        this.setState({ loading: false });
        const errorCode = error.code;
        let errorMessage = 'An error occurred. Please try again later.';
        if (errorCode === 'auth/invalid-email') {
          errorMessage = 'Invalid email address format.';
        } else if (errorCode === 'auth/user-not-found') {
          errorMessage = 'No user found with this email.';
        }
        Alert.alert('Error', errorMessage, [{ text: 'Try again' }], { cancelable: false });
      });
  };

  hasErrors = (key: string): boolean => {
    return this.state.errors.includes(key);
  };

  render() {
    const { navigation } = this.props;
    const { loading, email } = this.state;

    return (
      <KeyboardAvoidingView style={styles.forgot} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold style={styles.title}>Forgot</Text>
          <Block middle>
            <Input
              label="Email"
              error={this.hasErrors('email')}
              style={[styles.input, this.hasErrors('email') && styles.hasErrors]}
              value={email}
              onChangeText={(text: string) => this.setState({ email: text })}
              placeholder="Enter your email"
            />
            <Button gradient onPress={this.handleForgot}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text bold white center>Forgot</Text>
              )}
            </Button>

            <Button onPress={() => navigation.navigate('Login')}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                Back to Login
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  forgot: {
    flex: 1,
    justifyContent: 'center',
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