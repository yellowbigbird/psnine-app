import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useSettings } from '../hooks/useSettings';

export function Loading({ text = '加载中...' }: { text?: string }) {
  const { colors } = useSettings();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.text, { color: colors.textSecondary }]}>{text}</Text>
    </View>
  );
}

export function ErrorView({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  const { colors } = useSettings();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.errorText, { color: colors.accent }]}>
        {message}
      </Text>
      {onRetry && (
        <Text
          style={[styles.retryText, { color: colors.primary }]}
          onPress={onRetry}
        >
          重试
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
  },
  retryText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '600',
  },
});
