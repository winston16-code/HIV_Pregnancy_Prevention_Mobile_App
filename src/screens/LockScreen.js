import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Screen } from '../components/Screen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, spacing } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';

export default function LockScreen({ onUnlock }) {
  const language = useAppStore((s) => s.language);
  const [error, setError] = useState(null);

  const tryUnlock = async () => {
    try {
      const hardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hardware || !enrolled) {
        onUnlock();
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t('unlock', language),
        fallbackLabel: '',
      });
      if (result.success) {
        onUnlock();
      } else {
        setError('Try again');
      }
    } catch {
      onUnlock();
    }
  };

  useEffect(() => {
    tryUnlock();
  }, []);

  return (
    <Screen>
      <View style={styles.body}>
        <Text style={styles.emoji}>🔒</Text>
        <Text style={styles.title}>{t('lockTitle', language)}</Text>
        <Text style={styles.sub}>{t('lockBody', language)}</Text>
        {error ? <Text style={styles.err}>{error}</Text> : null}
        <PrimaryButton
          title={t('unlock', language)}
          onPress={tryUnlock}
          style={{ marginTop: spacing.lg, width: '60%' }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emoji: { fontSize: 64, marginBottom: spacing.md },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  sub: { fontSize: 16, color: colors.textMuted, marginBottom: spacing.lg },
  err: { color: colors.danger, marginTop: spacing.sm },
});
