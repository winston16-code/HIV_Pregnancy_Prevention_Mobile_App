import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { RiskBadge } from '../components/RiskBadge';
import { colors, spacing } from '../theme/colors';
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

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.kicker}>{t('resultTitle', language)}</Text>
        <Text style={styles.title}>{t(titleByBand[result.band], language)}</Text>
        <RiskBadge band={result.band} size="lg" />
        <Text style={styles.body2}>{t(bodyByBand[result.band], language)}</Text>

        <Text style={styles.section}>{t('recommendations', language)}</Text>
        {result.recs.map((rec, i) => (
          <Card key={i} style={{ marginBottom: spacing.sm }}>
            <Text style={styles.recTitle}>{rec.title}</Text>
            <Text style={styles.recBody}>{rec.body}</Text>
            <TouchableOpacity style={styles.recAction} onPress={() => goToAction(rec)}>
              <Text style={styles.recActionText}>{rec.actionLabel}</Text>
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
  title: { fontSize: 26, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  body2: { fontSize: 16, color: colors.text, marginTop: spacing.md, lineHeight: 22 },
  section: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  recTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  recBody: { color: colors.text, lineHeight: 20 },
  recAction: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  recActionText: { color: colors.primary, fontWeight: '700', marginRight: 4 },
  row: { flexDirection: 'row' },
});
