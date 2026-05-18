import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';
import { topics } from '../data/content';

export default function LearnScreen({ navigation }) {
  const language = useAppStore((s) => s.language);
  const quizProgress = useAppStore((s) => s.quizProgress);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>{t('learnTitle', language)}</Text>
        <Text style={styles.sub}>{t('learnSub', language)}</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('MethodMatcher')}
          activeOpacity={0.85}
          style={{ marginBottom: spacing.md }}>
          <Card style={styles.matcherCard}>
            <View style={styles.matcherRow}>
              <View style={styles.matcherIconBox}>
                <Ionicons name="color-wand" size={24} color="#6D28D9" />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.matcherTitle}>{t('methodMatcherTitle', language)}</Text>
                <Text style={styles.matcherSub}>{t('takeMatcher', language)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#6D28D9" />
            </View>
          </Card>
        </TouchableOpacity>

        {topics.map((topic) => {
          const score = quizProgress[topic.id];
          return (
            <TouchableOpacity
              key={topic.id}
              onPress={() => navigation.navigate('Topic', { topicId: topic.id })}
              activeOpacity={0.85}>
              <Card style={[styles.topic, { borderLeftColor: topic.color, borderLeftWidth: 4 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicSummary}>{topic.summary}</Text>
                  <View style={styles.meta}>
                    <Text style={styles.metaText}>{topic.cards.length} cards</Text>
                    {topic.quiz?.length ? (
                      <Text style={styles.metaText}> · {topic.quiz.length} quiz Qs</Text>
                    ) : null}
                    {score != null ? (
                      <View style={styles.badgeDone}>
                        <Ionicons name="checkmark" size={12} color={colors.success} />
                        <Text style={styles.badgeText}>{score}/{topic.quiz.length}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  sub: { color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  topic: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  topicTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  topicSummary: { color: colors.textMuted, marginTop: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, flexWrap: 'wrap' },
  metaText: { color: colors.textMuted, fontSize: 12 },
  badgeDone: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeText: { color: colors.success, fontWeight: '700', fontSize: 12, marginLeft: 2 },
  matcherCard: {
    backgroundColor: '#F5F3FF',
    borderColor: '#E9D5FF',
    borderWidth: 1,
    padding: spacing.md,
  },
  matcherRow: { flexDirection: 'row', alignItems: 'center' },
  matcherIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matcherTitle: { fontSize: 16, fontWeight: '700', color: '#5B21B6' },
  matcherSub: { fontSize: 13, color: '#7C3AED', marginTop: 2 },
});
