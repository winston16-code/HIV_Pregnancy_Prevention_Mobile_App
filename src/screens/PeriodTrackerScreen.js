import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';

export default function PeriodTrackerScreen({ navigation }) {
  const language = useAppStore((s) => s.language);
  const {
    periodStartDate,
    cycleLength,
    periodDuration,
    setPeriodData,
  } = useAppStore();

  const localStrings = {
    en: {
      oneDay: '1 day ago',
      twoDays: '2 days ago',
      threeDays: '3 days ago',
      fiveDays: '5 days ago',
      oneWeek: '1 week ago',
      twoWeeks: '2 weeks ago',
      futureError: 'Please set your last period start date in the past.',
      daysToPeriod: 'Days to Period',
      flowLength: 'Flow Length',
      periodParams: 'Period Parameters',
      cycleLengthHelp: 'Time between period start dates',
      periodDurationHelp: 'Days of bleeding',
      yesterday: 'Yesterday',
      resetTitle: 'Reset Tracker',
      resetConfirm: 'Are you sure you want to clear your cycle logs? Your other app data will remain safe.',
      resetBtn: 'Reset',
    },
    sn: {
      oneDay: 'Zuva 1 rakadarika',
      twoDays: 'Mazuva 2 akadarika',
      threeDays: 'Mazuva 3 akadarika',
      fiveDays: 'Mazuva 5 akadarika',
      oneWeek: 'Vhiki 1 rakapfuura',
      twoWeeks: 'Mavhiki 2 akapfuura',
      futureError: 'Ndapota sarudza zuva remunguva yakapfuura.',
      daysToPeriod: 'Mazuva asara',
      flowLength: 'Mazuva ekubuda ropa',
      periodParams: 'Zvirongwa zvenzira',
      cycleLengthHelp: 'Nguva iri pakati pekutanga kwekutevera',
      periodDurationHelp: 'Mazuva ekubuda kweropa',
      yesterday: 'Nezuro',
      resetTitle: 'Gadzirisazve Kutevera',
      resetConfirm: 'Uine chokwadi chekuti unoda kudzima zvese zvekutevera zvako here?',
      resetBtn: 'Kugadzirisa',
    },
    nd: {
      oneDay: 'Zuva eli-1 elidlulileyo',
      twoDays: 'Mazuva amabili adlulileyo',
      threeDays: 'Mazuva amathathu adlulileyo',
      fiveDays: 'Mazuva amahlanu adlulileyo',
      oneWeek: 'Iviki eli-1 elidlulileyo',
      twoWeeks: 'Amaviki amabili adlulileyo',
      futureError: 'Sicela ubeke usuku lwenqubo yakho edluleyo.',
      daysToPeriod: 'Mazuva asele',
      flowLength: 'Flow Length',
      periodParams: 'Period Parameters',
      cycleLengthHelp: 'Isikhathi esiphakathi kokuqala kwenqubo',
      periodDurationHelp: 'Mazuva okuphuma kwegazi',
      yesterday: 'Izolo',
      resetTitle: 'Hlola Kabusha',
      resetConfirm: 'Uqinisekile ukuthi ufuna ukususa yonke idatha yakho yenqubo?',
      resetBtn: 'Susa',
    }
  };

  const dict = localStrings[language] || localStrings.en;

  // Helper to calculate cycle statistics
  const stats = useMemo(() => {
    if (!periodStartDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(periodStartDate);
    start.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      // Future date logged, handle gracefully
      return {
        currentDay: 1,
        daysUntilNext: cycleLength,
        phase: 'luteal',
        phaseLabel: t('fertilityLow', language),
        riskColor: colors.success,
        advice: dict.futureError
      };
    }

    const currentDay = (diffDays % cycleLength) + 1;
    const daysUntilNext = cycleLength - (diffDays % cycleLength);

    let phase = 'luteal';
    let phaseLabel = t('fertilityLow', language);
    let riskColor = colors.success;
    let advice = t('periodAdviceLow', language);

    if (currentDay <= periodDuration) {
      phase = 'bleeding';
      phaseLabel = t('bleeding', language);
      riskColor = colors.primary;
      advice = t('periodAdviceBleeding', language);
    } else if (currentDay > periodDuration && currentDay <= 10) {
      phase = 'follicular';
      phaseLabel = t('fertilityModerate', language);
      riskColor = colors.accent;
      advice = t('periodAdviceModerate', language);
    } else if (currentDay >= 11 && currentDay <= 17) {
      phase = 'fertile';
      phaseLabel = t('fertilityHigh', language);
      riskColor = colors.danger;
      advice = t('periodAdviceHigh', language);
    }

    return {
      currentDay,
      daysUntilNext: daysUntilNext === cycleLength ? 0 : daysUntilNext,
      phase,
      phaseLabel,
      riskColor,
      advice,
    };
  }, [periodStartDate, cycleLength, periodDuration, language]);

  const selectStartDateOffset = (daysOffset) => {
    const d = new Date();
    d.setDate(d.getDate() - daysOffset);
    d.setHours(0, 0, 0, 0);
    setPeriodData(d.toISOString().split('T')[0], cycleLength, periodDuration);
  };

  const updateCycleLength = (amount) => {
    const nextVal = Math.max(20, Math.min(45, cycleLength + amount));
    setPeriodData(periodStartDate, nextVal, periodDuration);
  };

  const updatePeriodDuration = (amount) => {
    const nextVal = Math.max(2, Math.min(10, periodDuration + amount));
    setPeriodData(periodStartDate, cycleLength, nextVal);
  };

  const clearData = () => {
    Alert.alert(
      dict.resetTitle,
      dict.resetConfirm,
      [
        { text: t('cancel', language), style: 'cancel' },
        {
          text: dict.resetBtn,
          style: 'destructive',
          onPress: () => setPeriodData(null, 28, 5)
        }
      ]
    );
  };

  return (
    <Screen>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('periodTracker', language)}</Text>
        <TouchableOpacity onPress={clearData} style={styles.iconBtn}>
          {periodStartDate ? <Ionicons name="refresh" size={20} color={colors.textMuted} /> : <View />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {!periodStartDate ? (
          // ONBOARDING / EMPTY STATE
          <Card style={styles.onboardCard}>
            <Ionicons name="calendar-outline" size={50} color={colors.primary} style={{ alignSelf: 'center', marginBottom: spacing.md }} />
            <Text style={styles.onboardTitle}>{t('periodOnboardTitle', language)}</Text>
            <Text style={styles.onboardText}>
              {t('periodOnboardText', language)}
            </Text>

            <Text style={styles.logHeader}>{t('periodOnboardPrompt', language)}</Text>
            <View style={styles.buttonGrid}>
              <TouchableOpacity style={styles.gridBtn} onPress={() => selectStartDateOffset(0)}>
                <Text style={styles.gridBtnText}>{t('today', language)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.gridBtn} onPress={() => selectStartDateOffset(1)}>
                <Text style={styles.gridBtnText}>{dict.oneDay}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.gridBtn} onPress={() => selectStartDateOffset(2)}>
                <Text style={styles.gridBtnText}>{dict.twoDays}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.gridBtn} onPress={() => selectStartDateOffset(3)}>
                <Text style={styles.gridBtnText}>{dict.threeDays}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.gridBtn} onPress={() => selectStartDateOffset(5)}>
                <Text style={styles.gridBtnText}>{dict.fiveDays}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.gridBtn} onPress={() => selectStartDateOffset(7)}>
                <Text style={styles.gridBtnText}>{dict.oneWeek}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.gridBtn, { width: '100%' }]} onPress={() => selectStartDateOffset(14)}>
                <Text style={styles.gridBtnText}>{dict.twoWeeks}</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ) : (
          // LOGGED STATE / ANALYTICS DASHBOARD
          <>
            <View style={styles.wheelContainer}>
              <View style={[styles.outerWheel, { borderColor: stats.riskColor }]}>
                <View style={styles.innerWheel}>
                  <Text style={styles.wheelLabel}>{t('cycleDay', language)}</Text>
                  <Text style={styles.wheelValue}>{stats.currentDay}</Text>
                  <Text style={styles.wheelTotal}>of {cycleLength}</Text>
                </View>
              </View>
            </View>

            <Card style={[styles.statusCard, { borderLeftColor: stats.riskColor, borderLeftWidth: 5 }]}>
              <Text style={styles.statusLabel}>{t('fertileWindow', language)}</Text>
              <Text style={[styles.statusValue, { color: stats.riskColor }]}>{stats.phaseLabel}</Text>
              <Text style={styles.statusAdvice}>{stats.advice}</Text>
            </Card>

            <View style={styles.countdownRow}>
              <Card style={[styles.countdownCard, { flex: 1, marginRight: spacing.sm }]}>
                <Text style={styles.countNum}>{stats.daysUntilNext}</Text>
                <Text style={styles.countLabel}>{dict.daysToPeriod}</Text>
              </Card>
              <Card style={[styles.countdownCard, { flex: 1, marginLeft: spacing.sm }]}>
                <Text style={styles.countNum}>{periodDuration}</Text>
                <Text style={styles.countLabel}>{dict.flowLength}</Text>
              </Card>
            </View>

            {/* ADJUSTMENT CONTROLS */}
            <SectionTitle>{dict.periodParams}</SectionTitle>
            <Card>
              <View style={styles.controlRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.controlLabel}>{t('cycleLengthLabel', language)}</Text>
                  <Text style={styles.controlHelp}>{dict.cycleLengthHelp}</Text>
                </View>
                <View style={styles.adjusters}>
                  <TouchableOpacity style={styles.adjBtn} onPress={() => updateCycleLength(-1)}>
                    <Ionicons name="remove" size={18} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={styles.adjVal}>{cycleLength}</Text>
                  <TouchableOpacity style={styles.adjBtn} onPress={() => updateCycleLength(1)}>
                    <Ionicons name="add" size={18} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.controlRow, { marginTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.controlLabel}>{t('periodDurationLabel', language)}</Text>
                  <Text style={styles.controlHelp}>{dict.periodDurationHelp}</Text>
                </View>
                <View style={styles.adjusters}>
                  <TouchableOpacity style={styles.adjBtn} onPress={() => updatePeriodDuration(-1)}>
                    <Ionicons name="remove" size={18} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={styles.adjVal}>{periodDuration}</Text>
                  <TouchableOpacity style={styles.adjBtn} onPress={() => updatePeriodDuration(1)}>
                    <Ionicons name="add" size={18} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>

            <SectionTitle>{t('logNewPeriod', language)}</SectionTitle>
            <Card>
              <Text style={styles.logHeader}>{t('logNewPeriodPrompt', language)}</Text>
              <View style={styles.buttonGrid}>
                <TouchableOpacity style={styles.gridBtn} onPress={() => selectStartDateOffset(0)}>
                  <Text style={styles.gridBtnText}>{t('today', language)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gridBtn} onPress={() => selectStartDateOffset(1)}>
                  <Text style={styles.gridBtnText}>{dict.yesterday}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gridBtn} onPress={() => selectStartDateOffset(2)}>
                  <Text style={styles.gridBtnText}>{dict.twoDays}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gridBtn} onPress={() => selectStartDateOffset(3)}>
                  <Text style={styles.gridBtnText}>{dict.threeDays}</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </>
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

function SectionTitle({ children }) {
  return <Text style={styles.section}>{children}</Text>;
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
  onboardCard: { padding: spacing.lg, marginTop: spacing.md },
  onboardTitle: { fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  onboardText: { color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.lg },
  logHeader: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  buttonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  gridBtn: {
    width: '48%',
    padding: spacing.md,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  gridBtnText: { color: colors.text, fontWeight: '600' },
  wheelContainer: { alignItems: 'center', marginVertical: spacing.lg },
  outerWheel: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  innerWheel: {
    alignItems: 'center',
  },
  wheelLabel: { fontSize: 13, color: colors.textMuted, textTransform: 'uppercase', fontWeight: '700' },
  wheelValue: { fontSize: 44, fontWeight: '800', color: colors.text, marginVertical: 2 },
  wheelTotal: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  statusCard: { padding: spacing.md, marginBottom: spacing.md },
  statusLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' },
  statusValue: { fontSize: 18, fontWeight: '700', marginVertical: 4 },
  statusAdvice: { color: colors.text, lineHeight: 20, fontSize: 14, marginTop: 4 },
  countdownRow: { flexDirection: 'row', marginBottom: spacing.md },
  countdownCard: { alignItems: 'center', padding: spacing.md },
  countNum: { fontSize: 24, fontWeight: '800', color: colors.text },
  countLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4, fontWeight: '600' },
  section: { fontSize: 14, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginTop: spacing.md, marginBottom: spacing.sm },
  controlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  controlLabel: { fontSize: 15, fontWeight: '700', color: colors.text },
  controlHelp: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  adjusters: { flexDirection: 'row', alignItems: 'center' },
  adjBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  adjVal: { marginHorizontal: spacing.md, fontSize: 16, fontWeight: '700', color: colors.text },
});
