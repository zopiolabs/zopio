/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) => {
  const getButtonStyle = () => {
    let buttonStyle = {};
    
    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyle = styles.primaryButton;
        break;
      case 'secondary':
        buttonStyle = styles.secondaryButton;
        break;
      case 'outline':
        buttonStyle = styles.outlineButton;
        break;
      default:
        buttonStyle = styles.primaryButton;
        break;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        buttonStyle = { ...buttonStyle, ...styles.smallButton };
        break;
      case 'medium':
        buttonStyle = { ...buttonStyle, ...styles.mediumButton };
        break;
      case 'large':
        buttonStyle = { ...buttonStyle, ...styles.largeButton };
        break;
      default:
        buttonStyle = { ...buttonStyle, ...styles.mediumButton };
        break;
    }
    
    // Disabled style
    if (disabled) {
      buttonStyle = { ...buttonStyle, ...styles.disabledButton };
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyle = {};
    
    // Variant text styles
    switch (variant) {
      case 'primary':
        textStyle = styles.primaryText;
        break;
      case 'secondary':
        textStyle = styles.secondaryText;
        break;
      case 'outline':
        textStyle = styles.outlineText;
        break;
      default:
        textStyle = styles.primaryText;
        break;
    }
    
    // Size text styles
    switch (size) {
      case 'small':
        textStyle = { ...textStyle, ...styles.smallText };
        break;
      case 'medium':
        textStyle = { ...textStyle, ...styles.mediumText };
        break;
      case 'large':
        textStyle = { ...textStyle, ...styles.largeText };
        break;
      default:
        textStyle = { ...textStyle, ...styles.mediumText };
        break;
    }
    
    // Disabled text style
    if (disabled) {
      textStyle = { ...textStyle, ...styles.disabledText };
    }
    
    return textStyle;
  };
  
  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? '#f35815' : '#fff'} 
          size="small" 
        />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
  },
  // Variant styles
  primaryButton: {
    backgroundColor: '#f35815',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#333',
  },
  secondaryText: {
    color: '#fff',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f35815',
  },
  outlineText: {
    color: '#f35815',
  },
  // Size styles
  smallButton: {
    height: 36,
    paddingHorizontal: 16,
  },
  smallText: {
    fontSize: 14,
  },
  mediumButton: {
    height: 48,
    paddingHorizontal: 24,
  },
  mediumText: {
    fontSize: 16,
  },
  largeButton: {
    height: 56,
    paddingHorizontal: 32,
  },
  largeText: {
    fontSize: 18,
  },
  // Disabled styles
  disabledButton: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
  disabledText: {
    color: '#888',
  },
});

export default Button;
