import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

const palette = {
  low: { bg: '#DCFCE7', fg: colors.riskLow, label: 'Lower risk' },
  moderate: { bg: '#FEF3C7', fg: colors.riskModerate, label: 'Moderate' },
  high: { bg: '#FEE2E2', fg: colors.riskHigh, label: 'Higher risk' },
};

export function RiskBadge({ band, size = 'md' }) {
  const p = palette[band] || palette.low;
  const sz = size === 'lg' ? 18 : 14;
  return (
    <View style={[styles.badge, { backgroundColor: p.bg, paddingHorizontal: size === 'lg' ? spacing.md : spacing.sm }]}>
      <Text style={{ color: p.fg, fontWeight: '700', fontSize: sz }}>{p.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.pill,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
});
