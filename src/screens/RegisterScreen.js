import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';

export default function RegisterScreen() {
  const language = useAppStore((s) => s.language);
  const registerUser = useAppStore((s) => s.registerUser);

  // Generate an anonymous username on the fly if not set, or read from store
  const currentAnonId = useAppStore((s) => s.anonId) || (() => {
    const adjs = ['Quiet', 'Brave', 'Gentle', 'Bright', 'Wise', 'Warm', 'Kind', 'Calm'];
    const nouns = ['River', 'Hill', 'Forest', 'Star', 'Lake', 'Cloud', 'Leaf', 'Sun'];
    const adj = adjs[Math.floor(Math.random() * adjs.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(100 + Math.random() * 900);
    return `${adj}${noun}${num}`;
  })();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(0); // 0 = Enter PIN, 1 = Confirm PIN

  const handleKeyPress = (num) => {
    if (step === 0) {
      if (pin.length < 4) {
        const nextPin = pin + num;
        setPin(nextPin);
        if (nextPin.length === 4) {
          // Progress to confirmation step
          setTimeout(() => setStep(1), 200);
        }
      }
    } else {
      if (confirmPin.length < 4) {
        const nextConfirm = confirmPin + num;
        setConfirmPin(nextConfirm);
        if (nextConfirm.length === 4) {
          // Validate
          setTimeout(() => {
            if (pin === nextConfirm) {
              registerUser(currentAnonId, pin);
            } else {
              Alert.alert(t('pinMismatchTitle', language) || 'PINs Do Not Match', t('pinMismatchBody', language) || 'Please try again.');
              setConfirmPin('');
              setPin('');
              setStep(0);
            }
          }, 200);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (step === 0) {
      setPin(pin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const activeLength = step === 0 ? pin.length : confirmPin.length;

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
          </View>
          <Text style={styles.title}>
            {step === 0 ? (t('createPinTitle', language) || 'Secure Your Account') : (t('confirmPinTitle', language) || 'Confirm Your PIN')}
          </Text>
          <Text style={styles.subtitle}>
            {step === 0 
              ? (t('createPinSub', language) || 'Set a 4-digit PIN to lock your personal tracker and logs.')
              : (t('confirmPinSub', language) || 'Re-enter your 4-digit PIN to confirm.')}
          </Text>
          
          <View style={styles.aliasBadge}>
            <Ionicons name="person-circle-outline" size={16} color={colors.textMuted} />
            <Text style={styles.aliasText}>{t('anonIdText', language) || 'Anonymous ID'}: {currentAnonId}</Text>
          </View>
        </View>

        {/* DOTS INDICATORS */}
        <View style={styles.dotsRow}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i <= activeLength ? styles.dotFilled : null
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
            <View style={styles.emptyKey} />
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
  emptyKey: {
    width: 70,
    height: 70,
  },
});
