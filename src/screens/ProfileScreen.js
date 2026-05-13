import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t, supportedLanguages } from '../logic/i18n';

export default function ProfileScreen({ navigation }) {
  const {
    language,
    setLanguage,
    appLockEnabled,
    setAppLock,
    anonId,
    clearAll,
  } = useAppStore();

  const confirmClear = () => {
    Alert.alert(
      t('clearData', language),
      t('clearDataConfirm', language),
      [
        { text: t('cancel', language), style: 'cancel' },
        { text: t('erase', language), style: 'destructive', onPress: clearAll },
      ],
    );
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>{t('profileTitle', language)}</Text>
        <Text style={styles.sub}>{t('profileSub', language)}</Text>

        <Card style={styles.idCard}>
          <Text style={styles.idLabel}>Your private name</Text>
          <Text style={styles.idValue}>{anonId}</Text>
          <Text style={styles.idHint}>We made this up. It doesn’t link to your real identity.</Text>
        </Card>

        <SectionTitle>{t('language', language)}</SectionTitle>
        <Card>
          {supportedLanguages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.row}
              onPress={() => setLanguage(lang.code)}>
              <Text style={styles.rowLabel}>{lang.label}</Text>
              {language === lang.code ? (
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              ) : null}
            </TouchableOpacity>
          ))}
        </Card>

        <SectionTitle>{t('appLock', language)}</SectionTitle>
        <Card>
          <TouchableOpacity style={styles.row} onPress={() => setAppLock(!appLockEnabled)}>
            <View>
              <Text style={styles.rowLabel}>{t('appLock', language)}</Text>
              <Text style={styles.rowHelp}>Use device biometrics to keep this private.</Text>
            </View>
            <View style={[styles.toggle, appLockEnabled && styles.toggleOn]}>
              <View style={[styles.thumb, appLockEnabled && styles.thumbOn]} />
            </View>
          </TouchableOpacity>
        </Card>

        <SectionTitle>{t('reminders', language)}</SectionTitle>
        <TouchableOpacity onPress={() => navigation.navigate('Reminders')}>
          <Card style={styles.linkCard}>
            <View>
              <Text style={styles.rowLabel}>{t('reminders', language)}</Text>
              <Text style={styles.rowHelp}>Discreet nudges that say only “Health reminder”.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Card>
        </TouchableOpacity>

        <SectionTitle>{t('about', language)}</SectionTitle>
        <Card>
          <Text style={styles.aboutBody}>{t('aboutBody', language)}</Text>
          <Text style={styles.version}>
            {t('version', language)} {Constants.expoConfig?.version ?? '0.1.0'}
          </Text>
        </Card>

        <TouchableOpacity onPress={confirmClear} style={styles.dangerBtn}>
          <Ionicons name="trash" size={18} color={colors.danger} />
          <Text style={styles.dangerText}>{t('clearData', language)}</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

function SectionTitle({ children }) {
  return <Text style={styles.section}>{children}</Text>;
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  sub: { color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  idCard: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft, marginBottom: spacing.md },
  idLabel: { color: colors.primaryDark, fontSize: 12, fontWeight: '700' },
  idValue: { color: colors.primaryDark, fontSize: 22, fontWeight: '700', marginTop: 4 },
  idHint: { color: colors.primaryDark, marginTop: spacing.xs, fontSize: 13 },
  section: { fontSize: 14, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginTop: spacing.lg, marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  rowLabel: { fontSize: 16, color: colors.text, fontWeight: '600' },
  rowHelp: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  linkCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggle: {
    width: 44,
    height: 26,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: { backgroundColor: colors.primary },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surface,
  },
  thumbOn: { transform: [{ translateX: 18 }] },
  aboutBody: { color: colors.text, lineHeight: 22 },
  version: { color: colors.textMuted, marginTop: spacing.sm, fontSize: 12 },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginTop: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  dangerText: { color: colors.danger, fontWeight: '700', marginLeft: spacing.sm },
});
