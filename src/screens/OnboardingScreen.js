import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen } from '../components/Screen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';

const slides = (lang) => [
  {
    emoji: '🔒',
    title: t('onboardingTitle1', lang),
    body: t('onboardingBody1', lang),
  },
  {
    emoji: '📚',
    title: t('onboardingTitle2', lang),
    body: t('onboardingBody2', lang),
  },
  {
    emoji: '📍',
    title: t('onboardingTitle3', lang),
    body: t('onboardingBody3', lang),
  },
];

export default function OnboardingScreen() {
  const language = useAppStore((s) => s.language);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);

  const list = slides(language);
  const slide = list[step];
  const isLast = step === list.length - 1;

  const onNext = () => {
    if (isLast) completeOnboarding();
    else setStep(step + 1);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <TouchableOpacity onPress={completeOnboarding} style={styles.skip}>
          <Text style={styles.skipText}>{t('skip', language)}</Text>
        </TouchableOpacity>

        <View style={styles.body}>
          <Text style={styles.emoji}>{slide.emoji}</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.text}>{slide.body}</Text>
        </View>

        <View style={styles.dots}>
          {list.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>

        <PrimaryButton
          title={isLast ? t('getStarted', language) : t('next', language)}
          onPress={onNext}
          style={{ marginHorizontal: spacing.lg, marginBottom: spacing.lg }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  skip: {
    alignSelf: 'flex-end',
    padding: spacing.lg,
  },
  skipText: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emoji: { fontSize: 80, marginBottom: spacing.lg },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  text: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  dotActive: { backgroundColor: colors.primary, width: 24 },
});
