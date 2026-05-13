import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, spacing } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';
import { topicsById } from '../data/content';

export default function TopicScreen({ navigation, route }) {
  const language = useAppStore((s) => s.language);
  const { topicId } = route.params;
  const topic = topicsById[topicId];

  if (!topic) return null;

  return (
    <Screen>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.colorDot, { backgroundColor: topic.color }]} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>{topic.title}</Text>
        <Text style={styles.summary}>{topic.summary}</Text>

        {topic.cards.map((card) => (
          <Card key={card.id} style={{ marginBottom: spacing.sm }}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardBody}>{card.body}</Text>
          </Card>
        ))}

        {topic.quiz?.length ? (
          <PrimaryButton
            title={t('quizPrompt', language)}
            onPress={() => navigation.navigate('Quiz', { topicId })}
            style={{ marginTop: spacing.md }}
          />
        ) : null}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  iconBtn: { padding: spacing.sm },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: spacing.md },
  body: { padding: spacing.lg },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  summary: { color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 6 },
  cardBody: { color: colors.text, lineHeight: 22 },
});
