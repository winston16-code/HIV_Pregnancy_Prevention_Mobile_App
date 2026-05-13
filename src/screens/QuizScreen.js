import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';
import { topicsById } from '../data/content';

export default function QuizScreen({ navigation, route }) {
  const language = useAppStore((s) => s.language);
  const saveQuizScore = useAppStore((s) => s.saveQuizScore);

  const { topicId } = route.params;
  const topic = topicsById[topicId];

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!topic) return null;
  const q = topic.quiz[step];

  const onCheck = () => {
    if (picked == null) return;
    setReveal(true);
    if (picked === q.answer) setScore((s) => s + 1);
  };

  const onNext = () => {
    if (step + 1 >= topic.quiz.length) {
      saveQuizScore(topicId, score + (picked === q.answer && !reveal ? 1 : 0));
      setFinished(true);
    } else {
      setStep(step + 1);
      setPicked(null);
      setReveal(false);
    }
  };

  if (finished) {
    return (
      <Screen>
        <View style={styles.finishWrap}>
          <Ionicons name="trophy" size={56} color={colors.accent} />
          <Text style={styles.finishTitle}>{t('quizScore', language)}</Text>
          <Text style={styles.finishScore}>
            {score} / {topic.quiz.length}
          </Text>
          <PrimaryButton
            title={t('doneResult', language)}
            onPress={() => navigation.popToTop()}
            style={{ marginTop: spacing.lg, width: '60%' }}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.step}>
          {step + 1} / {topic.quiz.length}
        </Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.q}>{q.q}</Text>
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isAnswer = i === q.answer;
          const showAnswer = reveal && isAnswer;
          const showWrong = reveal && isPicked && !isAnswer;
          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.option,
                isPicked && !reveal && styles.optionPicked,
                showAnswer && styles.optionCorrect,
                showWrong && styles.optionWrong,
              ]}
              onPress={() => !reveal && setPicked(i)}
              activeOpacity={reveal ? 1 : 0.85}>
              <Text style={styles.optText}>{opt}</Text>
              {showAnswer ? <Ionicons name="checkmark-circle" size={20} color={colors.success} /> : null}
              {showWrong ? <Ionicons name="close-circle" size={20} color={colors.danger} /> : null}
            </TouchableOpacity>
          );
        })}

        {reveal ? (
          <Card style={{ marginTop: spacing.md, backgroundColor: colors.primarySoft, borderColor: colors.primarySoft }}>
            <Text style={styles.feedback}>
              {picked === q.answer ? t('correct', language) : t('incorrect', language)}
            </Text>
          </Card>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {reveal ? (
          <PrimaryButton title={t('next', language)} onPress={onNext} />
        ) : (
          <PrimaryButton title="Check" onPress={onCheck} disabled={picked == null} />
        )}
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
  step: { color: colors.textMuted, fontWeight: '600' },
  body: { padding: spacing.lg },
  q: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.lg },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  optionPicked: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionCorrect: { borderColor: colors.success, backgroundColor: '#DCFCE7' },
  optionWrong: { borderColor: colors.danger, backgroundColor: '#FEE2E2' },
  optText: { fontSize: 16, color: colors.text, flex: 1 },
  feedback: { fontWeight: '700', color: colors.primary, fontSize: 16 },
  footer: { padding: spacing.lg, borderTopColor: colors.border, borderTopWidth: 1 },
  finishWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  finishTitle: { fontSize: 18, color: colors.textMuted, marginTop: spacing.md },
  finishScore: { fontSize: 48, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
});
