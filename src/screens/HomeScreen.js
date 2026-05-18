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
  const periodStartDate = useAppStore((s) => s.periodStartDate);
  const cycleLength = useAppStore((s) => s.cycleLength);
  const periodDuration = useAppStore((s) => s.periodDuration);

  const localStrings = {
    en: {
      setupCycle: 'Tap to set up your cycle',
      futureCycle: 'Cycle starts in the future',
    },
    sn: {
      setupCycle: 'Baya kuti ugadzirise kutevera kwako',
      futureCycle: 'Kutevera kunotanga mune ramangwana',
    },
    nd: {
      setupCycle: 'Cindezela ukuze uhlele inqubo yakho',
      futureCycle: 'Inqubo iqala esikhathini esizayo',
    }
  };

  const periodSummary = React.useMemo(() => {
    const dict = localStrings[language] || localStrings.en;
    if (!periodStartDate) return dict.setupCycle;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(periodStartDate);
    start.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return dict.futureCycle;
    const currentDay = (diff % cycleLength) + 1;
    
    let label = t('fertilityLow', language);
    if (currentDay <= periodDuration) {
      label = t('bleeding', language);
    } else if (currentDay > periodDuration && currentDay <= 10) {
      label = t('fertilityModerate', language);
    } else if (currentDay >= 11 && currentDay <= 17) {
      label = t('fertilityHigh', language);
    }
    return `${t('cycleDay', language)} ${currentDay} · ${label}`;
  }, [periodStartDate, cycleLength, periodDuration, language]);

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

        {/* Pulsing Offline Emergency SOS Card */}
        <TouchableOpacity onPress={() => navigation.navigate('SOSEmergency')} activeOpacity={0.85}>
          <Card style={styles.sosCard}>
            <View style={styles.sosRow}>
              <Ionicons name="warning" size={26} color="#EF4444" style={styles.sosIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.sosTitle}>{t('emergencySosTitle', language)}</Text>
                <Text style={styles.sosSub}>{t('emergencySosSub', language)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#EF4444" />
            </View>
          </Card>
        </TouchableOpacity>

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

        <TouchableOpacity onPress={() => navigation.navigate('PeriodTracker')} activeOpacity={0.85}>
          <Card style={[styles.periodCard, periodStartDate ? { borderLeftColor: '#BE185D', borderLeftWidth: 4 } : null]}>
            <View style={styles.heroRow}>
              <View style={styles.periodIconBox}>
                <Ionicons name="heart" size={24} color="#BE185D" />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.cardTitle}>{t('cycleTracker', language)}</Text>
                <Text style={styles.muted}>{periodSummary}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
            </View>
          </Card>
        </TouchableOpacity>

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
  sosCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
    borderWidth: 1,
    borderLeftColor: '#EF4444',
    borderLeftWidth: 5,
    marginBottom: spacing.md,
  },
  sosRow: { flexDirection: 'row', alignItems: 'center' },
  sosIcon: { marginRight: spacing.sm },
  sosTitle: { color: '#B91C1C', fontSize: 16, fontWeight: '700' },
  sosSub: { color: '#EF4444', fontSize: 12, marginTop: 2, fontWeight: '600' },
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
  periodCard: { marginTop: spacing.md },
  periodIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
