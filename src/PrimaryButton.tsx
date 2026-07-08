import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors, radius, spacing} from './theme';

export type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline';
};

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
}: PrimaryButtonProps): React.JSX.Element {
  const isOutline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        isOutline ? styles.outline : styles.filled,
        pressed ? styles.pressed : null,
      ]}>
      <Text style={isOutline ? styles.labelOutline : styles.labelFilled}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
  labelFilled: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  labelOutline: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});
