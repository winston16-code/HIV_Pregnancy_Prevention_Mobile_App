import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

import RootNavigator from './src/navigation/RootNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LockScreen from './src/screens/LockScreen';
import { useAppStore } from './src/state/useAppStore';
import { colors } from './src/theme/colors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const hydrated = useAppStore((s) => s.hydrated);
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const appLockEnabled = useAppStore((s) => s.appLockEnabled);
  const hydrate = useAppStore((s) => s.hydrate);

  const [locked, setLocked] = useState(false);

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    setLocked(appLockEnabled);
  }, [appLockEnabled]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background' && appLockEnabled) {
        setLocked(true);
      }
    });
    return () => sub.remove();
  }, [appLockEnabled]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {!hasOnboarded ? (
        <OnboardingScreen />
      ) : locked ? (
        <LockScreen onUnlock={() => setLocked(false)} />
      ) : (
        <RootNavigator />
      )}
    </SafeAreaProvider>
  );
}
