import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

export function Pill({ label, tone = 'neutral' }) {
  const tones = {
    neutral: { bg: colors.surfaceAlt, fg: colors.text },
    success: { bg: '#DCFCE7', fg: colors.success },
    info: { bg: '#DBEAFE', fg: colors.info },
    warn: { bg: '#FEF3C7', fg: colors.riskModerate },
  };
  const p = tones[tone] || tones.neutral;
  return (
    <View style={[styles.pill, { backgroundColor: p.bg }]}>
      <Text style={{ color: p.fg, fontSize: 12, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
});
