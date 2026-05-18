import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';

const PRESETS = [
  { label: 'Daily PrEP pill', days: 1, mask: 'none' },
  { label: '2-month injection', days: 60, mask: 'none' },
  { label: '3-month injection', days: 90, mask: 'none' },
  { label: 'Yearly HIV test', days: 365, mask: 'none' },
];

const MASKS = [
  { id: 'none', label: 'None (Standard)' },
  { id: 'duolingo', label: 'Duolingo 🦉' },
  { id: 'system', label: 'System Warning ⚙️' },
  { id: 'battery', label: 'Battery Saver 🔋' },
];

const getMaskDetails = (maskId, lang) => {
  const dicts = {
    en: {
      duolingo_title: 'Duolingo',
      duolingo_body: 'Your daily 5-minute study lesson is waiting! 🦉',
      system_title: 'System Warning',
      system_body: 'Internal storage cache full. Clean temporary files now ⚙️',
      battery_title: 'Battery Saver',
      battery_body: 'Battery optimization complete. Performance is stable 🔋',
    },
    sn: {
      duolingo_title: 'Duolingo',
      duolingo_body: 'Dzidzo yako ye zuva rimwe nerimwe yakamirira! 🦉',
      system_title: 'Chenjedzo yeSystem',
      system_body: 'Internal storage yakazara. Bvisa mafaira asina kukosha ikozvino ⚙️',
      battery_title: 'Battery Saver',
      battery_body: 'Kugadziriswa kwebhatiri kwapera zvakanaka 🔋',
    },
    nd: {
      duolingo_title: 'Duolingo',
      duolingo_body: 'Isifundo sakho sansuku zonke silindile! 🦉',
      system_title: 'Ukubikwa kweSystem',
      system_body: 'Internal storage igcwele. Susa amafayili angadingekiyo manje ⚙️',
      battery_title: 'Battery Saver',
      battery_body: 'Ukulungiswa kwebhatiri kuqedwe kahle 🔋',
    }
  };
  const active = dicts[lang] || dicts.en;
  
  if (maskId === 'duolingo') return { title: active.duolingo_title, body: active.duolingo_body };
  if (maskId === 'system') return { title: active.system_title, body: active.system_body };
  if (maskId === 'battery') return { title: active.battery_title, body: active.battery_body };
  
  return { title: 'Health reminder', body: 'Tap to view' };
};

export default function RemindersScreen({ navigation }) {
  const language = useAppStore((s) => s.language);
  const reminders = useAppStore((s) => s.reminders);
  const addReminder = useAppStore((s) => s.addReminder);
  const removeReminder = useAppStore((s) => s.removeReminder);

  const [showModal, setShowModal] = useState(false);
  const [label, setLabel] = useState('');
  const [days, setDays] = useState('7');
  const [selectedMask, setSelectedMask] = useState('none');

  const schedule = async (reminder) => {
    try {
      await Notifications.requestPermissionsAsync();
      const seconds = Math.max(1, Number(reminder.days) * 24 * 60 * 60);
      const { title, body } = getMaskDetails(reminder.mask || 'none', language);
      const id = await Notifications.scheduleNotificationAsync({
        content: { title, body },
        trigger: { seconds, repeats: true },
      });
      return id;
    } catch {
      return null;
    }
  };

  const onAdd = async () => {
    if (!label.trim()) return;
    const reminder = { label: label.trim(), days: Number(days) || 7, mask: selectedMask };
    const notifId = await schedule(reminder);
    addReminder({ ...reminder, notifId });
    setLabel('');
    setDays('7');
    setSelectedMask('none');
    setShowModal(false);
  };

  const onRemove = async (r) => {
    if (r.notifId) {
      try { await Notifications.cancelScheduledNotificationAsync(r.notifId); } catch {}
    }
    removeReminder(r.id);
  };

  return (
    <Screen>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('remindersTitle', language)}</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sub}>{t('remindersSub', language)}</Text>

        {reminders.length === 0 ? (
          <Card>
            <Text style={styles.muted}>No reminders yet. Add one below.</Text>
          </Card>
        ) : null}

        {reminders.map((r) => (
          <Card key={r.id} style={styles.reminderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rLabel}>{r.label}</Text>
              <Text style={styles.rMeta}>Every {r.days} day{r.days === 1 ? '' : 's'}</Text>
            </View>
            <TouchableOpacity onPress={() => onRemove(r)} style={styles.delBtn}>
              <Ionicons name="trash" size={18} color={colors.danger} />
            </TouchableOpacity>
          </Card>
        ))}

        <PrimaryButton
          title={t('addReminder', language)}
          onPress={() => setShowModal(true)}
          style={{ marginTop: spacing.md }}
        />

        <Text style={styles.section}>Quick presets</Text>
        {PRESETS.map((p) => (
          <TouchableOpacity
            key={p.label}
            style={styles.preset}
            onPress={async () => {
              const notifId = await schedule(p);
              addReminder({ ...p, notifId });
            }}>
            <Ionicons name="add-circle" size={20} color={colors.primary} />
            <Text style={styles.presetText}>{p.label}</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalRoot}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{t('addReminder', language)}</Text>
            <Text style={styles.modalLabel}>{t('reminderLabel', language)}</Text>
            <TextInput
              value={label}
              onChangeText={setLabel}
              placeholder="e.g. Injection at clinic"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <Text style={styles.modalLabel}>Repeat every (days)</Text>
            <TextInput
              value={days}
              onChangeText={setDays}
              keyboardType="number-pad"
              placeholder="7"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />

            <Text style={styles.modalLabel}>🔒 Notification Mask (Discreet Cover)</Text>
            <View style={styles.maskContainer}>
              {MASKS.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.maskBtn, selectedMask === m.id && styles.maskBtnSelected]}
                  onPress={() => setSelectedMask(m.id)}>
                  <Text style={[styles.maskBtnText, selectedMask === m.id && styles.maskBtnTextSelected]}>
                    {m.id === 'none' ? 'None' : m.id === 'duolingo' ? 'Duolingo 🦉' : m.id === 'system' ? 'System Warning ⚙️' : 'Battery 🔋'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedMask !== 'none' ? (
              <View style={styles.previewCard}>
                <Text style={styles.previewTitle}>Lock Screen Preview:</Text>
                <View style={styles.fakeNotif}>
                  <View style={styles.fakeNotifHeader}>
                    <Text style={styles.fakeNotifApp}>{getMaskDetails(selectedMask, language).title}</Text>
                    <Text style={styles.fakeNotifTime}>now</Text>
                  </View>
                  <Text style={styles.fakeNotifBody}>{getMaskDetails(selectedMask, language).body}</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.modalRow}>
              <PrimaryButton
                title={t('cancel', language)}
                variant="ghost"
                onPress={() => setShowModal(false)}
                style={{ flex: 1, marginRight: spacing.sm }}
              />
              <PrimaryButton title={t('save', language)} onPress={onAdd} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  iconBtn: { padding: spacing.sm, width: 40 },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  body: { padding: spacing.lg },
  sub: { color: colors.textMuted, marginBottom: spacing.md },
  reminderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  rLabel: { fontSize: 16, fontWeight: '600', color: colors.text },
  rMeta: { color: colors.textMuted, marginTop: 2 },
  delBtn: { padding: spacing.sm },
  muted: { color: colors.textMuted },
  section: { fontSize: 14, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginTop: spacing.lg, marginBottom: spacing.sm },
  preset: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  presetText: { marginLeft: spacing.sm, color: colors.text, fontWeight: '600' },
  modalRoot: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modal: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  modalLabel: { color: colors.textMuted, fontSize: 13, marginTop: spacing.sm, marginBottom: 6 },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  maskContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: spacing.md,
  },
  maskBtn: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    marginRight: 6,
    marginBottom: 6,
  },
  maskBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  maskBtnText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  maskBtnTextSelected: {
    color: '#fff',
  },
  previewCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  fakeNotif: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    padding: spacing.md,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
  },
  fakeNotifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  fakeNotifApp: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  fakeNotifTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  fakeNotifBody: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
  modalRow: { flexDirection: 'row', marginTop: spacing.md },
});
