import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SettingsProvider, useSettings } from '../hooks/useSettings';

const queryClient = new QueryClient();

function RootLayoutInner() {
  const { colors, darkMode } = useSettings();

  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <RootLayoutInner />
      </SettingsProvider>
    </QueryClientProvider>
  );
}
