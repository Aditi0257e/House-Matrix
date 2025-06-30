import React from 'react';
import { Switch, Platform, SwitchProps } from 'react-native';
import { theme } from '../constants';

const GRAY_COLOR = 'rgba(168, 182, 200, 0.30)';

interface SwitchInputProps extends SwitchProps {
  value: boolean;
}

export default class SwitchInput extends React.PureComponent<SwitchInputProps> {
  render() {
    const { value, ...props } = this.props;
    const thumbColor =
      Platform.OS === 'android' ? (value ? theme.colors.secondary : GRAY_COLOR) : undefined;

    return (
      <Switch
        thumbColor={thumbColor} // Only applies on Android
        ios_backgroundColor={GRAY_COLOR} // iOS inactive background color
        trackColor={{
          false: GRAY_COLOR,
          true: theme.colors.secondary,
        }} // Active and inactive track colors
        value={value}
        {...props} // Pass additional props
      />
    );
  }
}
