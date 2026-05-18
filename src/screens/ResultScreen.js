import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { RiskBadge } from '../components/RiskBadge';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';
import { firstQuestionId } from '../logic/riskEngine';

const titleByBand = {
  low: 'resultLowTitle',
  moderate: 'resultModerateTitle',
  high: 'resultHighTitle',
};

const bodyByBand = {
  low: 'resultLowBody',
  moderate: 'resultModerateBody',
  high: 'resultHighBody',
};

export default function ResultScreen({ navigation, route }) {
  const language = useAppStore((s) => s.language);
  const { result } = route.params;

  const goToAction = (rec) => {
    const tabs = navigation.getParent();
    if (!tabs) return;
    if (rec.actionType === 'find') {
      tabs.navigate('Find');
    } else if (rec.actionType === 'learn') {
      if (rec.topicId) {
        tabs.navigate('Learn', { screen: 'Topic', params: { topicId: rec.topicId } });
      } else {
        tabs.navigate('Learn', { screen: 'LearnHome' });
      }
    }
  };

  const bandColor = {
    low: colors.success,
    moderate: colors.accent,
    high: colors.danger,
  };

  const localStrings = {
    en: {
      breakdown: 'Detailed Breakdown',
      hiv: 'HIV Prevention',
      preg: 'Pregnancy Risk',
      low: 'LOW',
      moderate: 'MODERATE',
      high: 'HIGH',
    },
    sn: {
      breakdown: 'Tsananguro Yakazara',
      hiv: 'Kudzivirira HIV',
      preg: 'Ngozi yePamuviri',
      low: 'YAKADERERA',
      moderate: 'INE MWERO',
      high: 'YAKANYANYA',
    },
    nd: {
      breakdown: 'Ukucaciswa Kwemiphumela',
      hiv: 'Ukuvimbela i-HIV',
      preg: 'Ubungozi bokuKhulelwa',
      low: 'OKUPHANSI',
      moderate: 'OKUMAPHAKATHI',
      high: 'OKUPHEZULU',
    }
  };

  const dict = localStrings[language] || localStrings.en;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.kicker}>{t('resultTitle', language)}</Text>
        <Text style={styles.title}>{t(titleByBand[result.band], language)}</Text>
        <RiskBadge band={result.band} size="lg" />
        <Text style={styles.body2}>{t(bodyByBand[result.band], language)}</Text>

        {/* Dynamic Double Gauge Breakdown */}
        <Text style={styles.section}>{dict.breakdown}</Text>
        <View style={styles.gaugesRow}>
          <Card style={[styles.gaugeCard, { borderColor: bandColor[result.hivBand], borderTopWidth: 4 }]}>
            <View style={[styles.iconContainer, { backgroundColor: bandColor[result.hivBand] + '15' }]}>
              <Ionicons name="pulse" size={20} color={bandColor[result.hivBand]} />
            </View>
            <Text style={styles.gaugeKicker}>{dict.hiv}</Text>
            <Text style={[styles.gaugeValue, { color: bandColor[result.hivBand] }]}>
              {dict[result.hivBand]}
            </Text>
          </Card>
          
          <Card style={[styles.gaugeCard, { borderColor: bandColor[result.pregBand], borderTopWidth: 4 }]}>
            <View style={[styles.iconContainer, { backgroundColor: bandColor[result.pregBand] + '15' }]}>
              <Ionicons name="egg" size={20} color={bandColor[result.pregBand]} />
            </View>
            <Text style={styles.gaugeKicker}>{dict.preg}</Text>
            <Text style={[styles.gaugeValue, { color: bandColor[result.pregBand] }]}>
              {dict[result.pregBand]}
            </Text>
          </Card>
        </View>

        <Text style={styles.section}>{t('recommendations', language)}</Text>
        {result.recs.map((rec, i) => (
          <Card key={i} style={styles.recCard}>
            <Text style={styles.recTitle}>{t(rec.title, language)}</Text>
            <Text style={styles.recBody}>{t(rec.body, language)}</Text>
            <TouchableOpacity style={styles.recAction} onPress={() => goToAction(rec)}>
              <Text style={styles.recActionText}>{t(rec.actionLabel, language)}</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </Card>
        ))}

        <View style={{ height: spacing.lg }} />

        <View style={styles.row}>
          <PrimaryButton
            title={t('retake', language)}
            variant="ghost"
            onPress={() => navigation.replace('Questionnaire', { qid: firstQuestionId(), answers: {} })}
            style={{ flex: 1, marginRight: spacing.sm }}
          />
          <PrimaryButton
            title={t('doneResult', language)}
            onPress={() => navigation.popToTop()}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg },
  kicker: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.xs },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  body2: { fontSize: 15, color: colors.text, marginTop: spacing.md, lineHeight: 22 },
  section: { fontSize: 15, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginTop: spacing.lg, marginBottom: spacing.sm },
  gaugesRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  gaugeCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  gaugeKicker: { fontSize: 12, color: colors.textMuted, fontWeight: '600', marginBottom: 2 },
  gaugeValue: { fontSize: 15, fontWeight: '800' },
  recCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderColor: colors.border,
    borderWidth: 1,
  },
  recTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  recBody: { color: colors.text, lineHeight: 20 },
  recAction: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  recActionText: { color: colors.primary, fontWeight: '700', marginRight: 4 },
  row: { flexDirection: 'row' },
});
