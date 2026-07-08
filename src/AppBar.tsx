import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from './theme';

export type AppBarProps = {
  title: string;
  subtitle?: string;
};

/**
 * Top bar every screen (microapps, examples and the main app) inherits from
 * shared-rn, so branding stays consistent regardless of who hosts the screen.
 */
export function AppBar({title, subtitle}: AppBarProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.onPrimary,
  },
  subtitle: {
    marginTop: spacing.xs / 2,
    fontSize: 13,
    color: colors.onPrimary,
    opacity: 0.85,
  },
});
