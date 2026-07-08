import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from './theme';

export type LoadingScreenProps = {
  label?: string;
};

export function LoadingScreen({
  label = 'Loading…',
}: LoadingScreenProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  label: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textMuted,
  },
});
