import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';

const localStrings = {
  en: {
    discretion: 'Discretion & Privacy',
    hivWarning: 'HIV Prevention Warning',
    findService: 'Find Nearest Free Service',
    tryAgain: 'Try Matcher Again',
    qLabel: 'Question',
    ofLabel: 'of',
  },
  sn: {
    discretion: 'Chivande & Mutemo',
    hivWarning: 'Yambiro Pamusoro pe HIV',
    findService: 'Tsvaga Makiriniki Padhuze',
    tryAgain: 'Edza Kusarudza Zvakare',
    qLabel: 'Mubvunzo',
    ofLabel: 'we',
  },
  nd: {
    discretion: 'Imfihlo loKuphatheka',
    hivWarning: 'Isixwayiso nge-HIV',
    findService: 'Dinga Amakiliniki Eduze',
    tryAgain: 'Zama Ukukhetha Futhi',
    qLabel: 'Umbuzo',
    ofLabel: 'ku',
  }
};

const getLocalizedMethod = (key, lang) => {
  return {
    name: t(`method_${key}_name`, lang),
    effectiveness: t(`method_${key}_effectiveness`, lang),
    bestFeature: t(`method_${key}_bestFeature`, lang),
    description: t(`method_${key}_description`, lang),
    discreetInfo: t(`method_${key}_discreetInfo`, lang),
    dualAlert: key !== 'condoms',
  };
};

export default function MethodMatcherScreen({ navigation }) {
  const language = useAppStore((s) => s.language);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ upkeep: '', discreet: '', dual: '' });
  const [match, setMatch] = useState(null); // stores string key: 'condoms', 'pill', 'injection', 'implant'

  const handleSelect = (key, value) => {
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);

    if (step < 2) {
      setStep(step + 1);
    } else {
      calculateMatch(nextAnswers);
      setStep(3); // Result step
    }
  };

  const calculateMatch = (ans) => {
    // Decision Tree Algorithm
    if (ans.dual === 'both') {
      setMatch('condoms');
    } else if (ans.upkeep === 'daily') {
      setMatch('pill');
    } else if (ans.upkeep === 'months') {
      setMatch('injection');
    } else if (ans.upkeep === 'years') {
      setMatch('implant');
    } else {
      setMatch('implant');
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({ upkeep: '', discreet: '', dual: '' });
    setMatch(null);
  };

  const dict = localStrings[language] || localStrings.en;
  const matchedMethod = match ? getLocalizedMethod(match, language) : null;

  return (
    <Screen>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('methodMatcherTitle', language)}</Text>
        <TouchableOpacity onPress={reset} style={styles.iconBtn}>
          <Ionicons name="refresh" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {step < 3 ? (
          // QUESTION FLOW
          <View>
            <View style={styles.progressRow}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.progressLine,
                    i <= step ? styles.progressLineActive : null
                  ]}
                />
              ))}
            </View>
            <Text style={styles.stepNum}>{dict.qLabel} {step + 1} {dict.ofLabel} 3</Text>

            {step === 0 && (
              <View>
                <Text style={styles.questionText}>{t('matcherQuestion1', language)}</Text>
                <AnswerCard
                  title={t('optionDaily', language)}
                  body={t('matcherDailySub', language)}
                  icon="alarm-outline"
                  onPress={() => handleSelect('upkeep', 'daily')}
                />
                <AnswerCard
                  title={t('optionFewMonths', language)}
                  body={t('matcherMonthsSub', language)}
                  icon="calendar-outline"
                  onPress={() => handleSelect('upkeep', 'months')}
                />
                <AnswerCard
                  title={t('optionYears', language)}
                  body={t('matcherYearsSub', language)}
                  icon="shield-checkmark-outline"
                  onPress={() => handleSelect('upkeep', 'years')}
                />
              </View>
            )}

            {step === 1 && (
              <View>
                <Text style={styles.questionText}>{t('matcherQuestion2', language)}</Text>
                <AnswerCard
                  title={t('optionYes', language)}
                  body={t('matcherYesSub', language)}
                  icon="eye-off-outline"
                  onPress={() => handleSelect('discreet', 'yes')}
                />
                <AnswerCard
                  title={t('optionNo', language)}
                  body={t('matcherNoSub', language)}
                  icon="eye-outline"
                  onPress={() => handleSelect('discreet', 'no')}
                />
              </View>
            )}

            {step === 2 && (
              <View>
                <Text style={styles.questionText}>{t('matcherQuestion3', language)}</Text>
                <AnswerCard
                  title={t('optionBoth', language)}
                  body={t('matcherBothSub', language)}
                  icon="sparkles-outline"
                  onPress={() => handleSelect('dual', 'both')}
                />
                <AnswerCard
                  title={t('optionPregnancy', language)}
                  body={t('matcherPregnancySub', language)}
                  icon="egg-outline"
                  onPress={() => handleSelect('dual', 'pregnancy')}
                />
              </View>
            )}
          </View>
        ) : (
          // MATCH RESULT DASHBOARD
          <View>
            <Text style={styles.kicker}>{t('perfectMatch', language)}</Text>
            <Text style={styles.matchTitle}>{matchedMethod.name}</Text>

            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: '#ECFDF5' }]}>
                <Text style={[styles.badgeText, { color: colors.success }]}>{t('effectiveness', language)}: {matchedMethod.effectiveness}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: '#EEF2F6' }]}>
                <Text style={styles.badgeTextMuted}>{matchedMethod.bestFeature}</Text>
              </View>
            </View>

            <Card style={styles.descCard}>
              <Text style={styles.sectionHeader}>{t('methodDescription', language)}</Text>
              <Text style={styles.descText}>{matchedMethod.description}</Text>
            </Card>

            <Card style={styles.descCard}>
              <Text style={styles.sectionHeader}>{dict.discretion}</Text>
              <Text style={styles.descText}>{matchedMethod.discreetInfo}</Text>
            </Card>

            {matchedMethod.dualAlert && (
              <Card style={[styles.descCard, { borderLeftColor: colors.danger, borderLeftWidth: 4 }]}>
                <View style={styles.alertHeaderRow}>
                  <Ionicons name="warning" size={16} color={colors.danger} />
                  <Text style={styles.alertHeader}>{dict.hivWarning}</Text>
                </View>
                <Text style={styles.descText}>{t('dualNote', language)}</Text>
              </Card>
            )}

            <View style={{ height: spacing.lg }} />

            <PrimaryButton
              title={dict.findService}
              onPress={() => navigation.getParent()?.navigate('Find')}
              style={{ marginBottom: spacing.sm }}
            />
            <PrimaryButton
              title={dict.tryAgain}
              variant="ghost"
              onPress={reset}
            />
          </View>
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

function AnswerCard({ title, body, icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{ marginBottom: spacing.sm }}>
      <Card style={styles.answerCard}>
        <View style={styles.cardIconBox}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardBody}>{body}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.border} />
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  iconBtn: { padding: spacing.sm, width: 40, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  scroll: { padding: spacing.lg },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: spacing.md },
  progressLine: { flex: 1, height: 4, backgroundColor: colors.border, borderRadius: 2 },
  progressLineActive: { backgroundColor: colors.primary },
  stepNum: { fontSize: 12, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.sm },
  questionText: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: spacing.lg, lineHeight: 28 },
  answerCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  cardIconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 },
  cardBody: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  kicker: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 4 },
  matchTitle: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  badge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
  badgeText: { fontSize: 12, fontWeight: '700' },
  badgeTextMuted: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  descCard: { padding: spacing.md, marginBottom: spacing.md },
  sectionHeader: { fontSize: 12, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 4 },
  descText: { fontSize: 14, color: colors.text, lineHeight: 22 },
  alertHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  alertHeader: { fontSize: 12, fontWeight: '700', color: colors.danger },
});
