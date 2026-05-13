import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { Pill } from '../components/Pill';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';
import { clinics } from '../data/clinics';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'free', label: 'Free' },
  { id: 'youth', label: 'Youth-friendly' },
  { id: 'hiv', label: 'HIV testing' },
  { id: 'prep', label: 'PrEP' },
  { id: 'contra', label: 'Contraception' },
];

export default function FindScreen() {
  const language = useAppStore((s) => s.language);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clinics.filter((c) => {
      if (filter === 'free' && c.cost !== 'free') return false;
      if (filter === 'youth' && !c.youthFriendly) return false;
      if (filter === 'hiv' && !c.services.some((s) => s.toLowerCase().includes('hiv'))) return false;
      if (filter === 'prep' && !c.services.some((s) => s.toLowerCase().includes('prep'))) return false;
      if (filter === 'contra' && !c.services.some((s) => s.toLowerCase().includes('contra'))) return false;
      if (q && !(c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [filter, query]);

  const openMap = (c) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`;
    Linking.openURL(url).catch(() => {});
  };
  const call = (c) => {
    Linking.openURL(`tel:${c.phone.replace(/\s+/g, '')}`).catch(() => {});
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>{t('findTitle', language)}</Text>
        <Text style={styles.sub}>{t('findSub', language)}</Text>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.search}
            placeholder="Search by name or area"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: spacing.sm }}>
          {FILTERS.map((f) => {
            const active = f.id === filter;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => setFilter(f.id)}
                style={[styles.filterPill, active && styles.filterPillActive]}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {filtered.length === 0 ? (
          <Card>
            <Text style={styles.muted}>No matches. Try removing a filter.</Text>
          </Card>
        ) : null}

        {filtered.map((c) => (
          <Card key={c.id} style={{ marginBottom: spacing.sm }}>
            <Text style={styles.clinicName}>{c.name}</Text>
            <Text style={styles.clinicAddr}>{c.address}</Text>

            <View style={styles.tags}>
              <Pill label={c.cost === 'free' ? t('free', language) : t('paid', language)} tone={c.cost === 'free' ? 'success' : 'neutral'} />
              {c.youthFriendly ? <Pill label={t('youthFriendly', language)} tone="info" /> : null}
              {c.services.map((s) => (
                <Pill key={s} label={s} />
              ))}
            </View>

            <Text style={styles.hours}>{c.hours}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.action} onPress={() => openMap(c)}>
                <Ionicons name="navigate" size={16} color={colors.primary} />
                <Text style={styles.actionText}>{t('directions', language)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.action} onPress={() => call(c)}>
                <Ionicons name="call" size={16} color={colors.primary} />
                <Text style={styles.actionText}>{t('call', language)}</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  sub: { color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  search: { flex: 1, paddingVertical: 10, marginLeft: spacing.sm, color: colors.text },
  filterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    marginRight: spacing.sm,
  },
  filterPillActive: { backgroundColor: colors.primary },
  filterText: { color: colors.text, fontWeight: '600' },
  filterTextActive: { color: colors.textInverse },
  clinicName: { fontSize: 17, fontWeight: '700', color: colors.text },
  clinicAddr: { color: colors.textMuted, marginTop: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  hours: { color: colors.textMuted, marginTop: spacing.xs, fontSize: 13 },
  actions: { flexDirection: 'row', marginTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  action: { flexDirection: 'row', alignItems: 'center', marginRight: spacing.lg },
  actionText: { color: colors.primary, fontWeight: '700', marginLeft: 4 },
  muted: { color: colors.textMuted },
});
