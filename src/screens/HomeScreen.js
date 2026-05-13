import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { RiskBadge } from '../components/RiskBadge';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';

export default function HomeScreen({ navigation }) {
  const language = useAppStore((s) => s.language);
  const anonId = useAppStore((s) => s.anonId);
  const results = useAppStore((s) => s.results);
  const latest = results[results.length - 1];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greet}>{t('homeGreeting', language)}</Text>
            <Text style={styles.anon}>{anonId}</Text>
          </View>
          <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
        </View>
        <Text style={styles.sub}>{t('homeSub', language)}</Text>

        <TouchableOpacity onPress={() => navigation.getParent()?.navigate('Assess')} activeOpacity={0.85}>
          <Card style={styles.heroCard}>
            <View style={styles.heroRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroTitle}>{t('quickAssess', language)}</Text>
                <Text style={styles.heroSub}>{t('quickAssessSub', language)}</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={36} color={colors.textInverse} />
            </View>
          </Card>
        </TouchableOpacity>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.cardTitle}>{t('yourLastResult', language)}</Text>
          {latest ? (
            <View style={styles.lastRow}>
              <RiskBadge band={latest.band} size="lg" />
              <Text style={styles.lastDate}>
                {new Date(latest.at).toLocaleDateString()}
              </Text>
            </View>
          ) : (
            <Text style={styles.muted}>{t('noResultYet', language)}</Text>
          )}
        </Card>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.tile, { backgroundColor: '#FEF3C7' }]}
            onPress={() => navigation.getParent()?.navigate('Learn')}
            activeOpacity={0.85}>
            <Ionicons name="book" size={28} color="#B45309" />
            <Text style={styles.tileText}>{t('learnSomething', language)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tile, { backgroundColor: '#DBEAFE' }]}
            onPress={() => navigation.getParent()?.navigate('Find')}
            activeOpacity={0.85}>
            <Ionicons name="location" size={28} color="#1D4ED8" />
            <Text style={styles.tileText}>{t('nearestHelp', language)}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Chat')} activeOpacity={0.85}>
          <Card style={styles.chatCard}>
            <View style={styles.heroRow}>
              <Ionicons name="chatbubbles" size={28} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.cardTitle}>{t('chatTitle', language)}</Text>
                <Text style={styles.muted}>{t('chatSub', language)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
            </View>
          </Card>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greet: { fontSize: 14, color: colors.textMuted },
  anon: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: 2 },
  sub: { color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  heroCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroTitle: { color: colors.textInverse, fontSize: 18, fontWeight: '700' },
  heroSub: { color: '#D1FAE5', marginTop: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  lastRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  lastDate: { color: colors.textMuted },
  muted: { color: colors.textMuted },
  row: { flexDirection: 'row', marginTop: spacing.md, gap: spacing.md },
  tile: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  tileText: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  chatCard: { marginTop: spacing.md },
});
