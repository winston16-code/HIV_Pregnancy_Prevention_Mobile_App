import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';
import { questionsById, questions } from '../data/questions';
import { nextQuestionId, evaluate } from '../logic/riskEngine';

export default function QuestionnaireScreen({ navigation, route }) {
  const language = useAppStore((s) => s.language);
  const addResult = useAppStore((s) => s.addResult);

  const { qid, answers } = route.params;
  const question = questionsById[qid];
  const [selected, setSelected] = useState(null);

  const totalSteps = questions.length;
  const stepIndex = useMemo(() => {
    return questions.findIndex((q) => q.id === qid);
  }, [qid]);

  if (!question) return null;

  const onContinue = () => {
    if (!selected) return;
    const updatedAnswers = { ...answers, [qid]: selected };
    const nextId = nextQuestionId(qid, selected);
    if (nextId && questionsById[nextId]) {
      navigation.push('Questionnaire', { qid: nextId, answers: updatedAnswers });
    } else {
      const result = evaluate(updatedAnswers);
      addResult({ answers: updatedAnswers, ...result });
      navigation.replace('Result', { result });
    }
  };

  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <Screen>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.stepLabel}>
          {t('question', language)} {stepIndex + 1} {t('of', language)} {totalSteps}
        </Text>
        <View style={styles.iconBtn} />
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.qText}>{t(question.text, language)}</Text>
        {question.options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.option, selected === opt.value && styles.optionSelected]}
            onPress={() => setSelected(opt.value)}
            activeOpacity={0.85}>
            <View style={[styles.radio, selected === opt.value && styles.radioActive]}>
              {selected === opt.value ? <View style={styles.radioInner} /> : null}
            </View>
            <Text style={styles.optLabel}>{t(opt.label, language)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={t('next', language)}
          onPress={onContinue}
          disabled={!selected}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  iconBtn: { padding: spacing.sm, width: 40 },
  stepLabel: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  body: { padding: spacing.lg },
  qText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
    lineHeight: 30,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optLabel: { fontSize: 16, color: colors.text, flex: 1 },
  footer: { padding: spacing.lg, borderTopColor: colors.border, borderTopWidth: 1 },
});
