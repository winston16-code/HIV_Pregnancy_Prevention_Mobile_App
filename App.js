import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

import RootNavigator from './src/navigation/RootNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
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
  const userPasscode = useAppStore((s) => s.userPasscode);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const hydrate = useAppStore((s) => s.hydrate);
  const logoutUser = useAppStore((s) => s.logoutUser);

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background' && appLockEnabled) {
        logoutUser();
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
      ) : !userPasscode ? (
        <RegisterScreen />
      ) : !isAuthenticated ? (
        <LoginScreen />
      ) : (
        <RootNavigator />
      )}
    </SafeAreaProvider>
  );
}
