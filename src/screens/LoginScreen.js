import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { Screen } from '../components/Screen';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';

export default function LoginScreen() {
  const language = useAppStore((s) => s.language);
  const anonId = useAppStore((s) => s.anonId);
  const loginUser = useAppStore((s) => s.loginUser);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [hasBiometrics, setHasBiometrics] = useState(false);

  // Check biometric support on mount
  useEffect(() => {
    (async () => {
      const hardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (hardware && enrolled) {
        setHasBiometrics(true);
        tryBiometrics();
      }
    })();
  }, []);

  const tryBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t('unlockPrompt', language) || 'Unlock MASCOT',
        fallbackLabel: '',
      });
      if (result.success) {
        // Authenticated successfully!
        useAppStore.setState({ isAuthenticated: true });
      }
    } catch {
      // Gracefully fall back to PIN
    }
  };

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === 4) {
        setTimeout(() => {
          const success = loginUser(nextPin);
          if (!success) {
            setError(true);
            setPin('');
            Alert.alert(t('wrongPinTitle', language) || 'Incorrect PIN', t('wrongPinBody', language) || 'Please try again.');
          }
        }, 150);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={32} color={colors.primary} />
          </View>
          <Text style={styles.title}>{t('welcomeBack', language) || 'Welcome Back'}</Text>
          <Text style={styles.subtitle}>{t('loginPromptText', language) || 'Enter your 4-digit PIN to access your dashboard.'}</Text>
          
          <View style={styles.aliasBadge}>
            <Ionicons name="person" size={14} color={colors.textMuted} />
            <Text style={styles.aliasText}>{anonId}</Text>
          </View>
        </View>

        {/* DOTS INDICATORS */}
        <View style={styles.dotsRow}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i <= pin.length ? styles.dotFilled : null,
                error ? styles.dotError : null
              ]}
            />
          ))}
        </View>

        {/* CUSTOM KEYBOARD */}
        <View style={styles.keyboard}>
          <View style={styles.keyRow}>
            <KeyButton label="1" onPress={() => handleKeyPress('1')} />
            <KeyButton label="2" onPress={() => handleKeyPress('2')} />
            <KeyButton label="3" onPress={() => handleKeyPress('3')} />
          </View>
          <View style={styles.keyRow}>
            <KeyButton label="4" onPress={() => handleKeyPress('4')} />
            <KeyButton label="5" onPress={() => handleKeyPress('5')} />
            <KeyButton label="6" onPress={() => handleKeyPress('6')} />
          </View>
          <View style={styles.keyRow}>
            <KeyButton label="7" onPress={() => handleKeyPress('7')} />
            <KeyButton label="8" onPress={() => handleKeyPress('8')} />
            <KeyButton label="9" onPress={() => handleKeyPress('9')} />
          </View>
          <View style={styles.keyRow}>
            {hasBiometrics ? (
              <TouchableOpacity style={styles.bioKey} onPress={tryBiometrics}>
                <Ionicons name="finger-print-outline" size={26} color={colors.primary} />
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyKey} />
            )}
            <KeyButton label="0" onPress={() => handleKeyPress('0')} />
            <TouchableOpacity style={styles.backKey} onPress={handleBackspace}>
              <Ionicons name="backspace-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Screen>
  );
}

function KeyButton({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.keyBtn} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.keyText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.md,
  },
  aliasBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  aliasText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dotError: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  keyboard: {
    marginBottom: spacing.lg,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  keyBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  backKey: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioKey: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyKey: {
    width: 70,
    height: 70,
  },
});
