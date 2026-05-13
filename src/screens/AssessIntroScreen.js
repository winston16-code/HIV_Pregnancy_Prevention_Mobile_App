import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { colors, spacing } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';
import { firstQuestionId } from '../logic/riskEngine';

export default function AssessIntroScreen({ navigation }) {
  const language = useAppStore((s) => s.language);

  return (
    <Screen>
      <View style={styles.body}>
        <Ionicons name="pulse" size={56} color={colors.primary} />
        <Text style={styles.title}>{t('assessIntroTitle', language)}</Text>
        <Text style={styles.text}>{t('assessIntroBody', language)}</Text>

        <Card style={{ marginTop: spacing.lg }}>
          <Row icon="time-outline" text="2 minutes" />
          <Row icon="lock-closed-outline" text="Stays on this phone" />
          <Row icon="medkit-outline" text="Not a diagnosis — guidance only" />
        </Card>

        <View style={{ flex: 1 }} />

        <PrimaryButton
          title={t('startAssessment', language)}
          onPress={() => navigation.navigate('Questionnaire', { qid: firstQuestionId(), answers: {} })}
        />
      </View>
    </Screen>
  );
}

function Row({ icon, text }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: spacing.lg, alignItems: 'flex-start' },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginTop: spacing.md },
  text: { color: colors.textMuted, fontSize: 16, lineHeight: 22, marginTop: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  rowText: { marginLeft: spacing.sm, color: colors.text, fontSize: 15 },
});
