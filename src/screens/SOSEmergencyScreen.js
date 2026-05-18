import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';

const DICT = {
  en: {
    title: 'SOS Emergency Help',
    sub: 'Confidential offline guidelines & toll-free student clinics.',
    timelineHeader: '🕒 Golden 72-Hour Prevention Timeline',
    timelineSub: 'Effectiveness drops rapidly with time. Take action now.',
    
    t1_title: '0 - 24 Hours (Golden Window)',
    t1_hiv: 'PEP is >99% effective at stopping HIV.',
    t1_preg: 'Morning-after pill is 95% effective at stopping pregnancy.',
    t1_action: '🚨 Best time to act. Visit a clinic or pharmacy immediately.',

    t2_title: '24 - 48 Hours (High Safety)',
    t2_hiv: 'PEP remains extremely effective.',
    t2_preg: 'Morning-after pill drops to 85% effectiveness.',
    t2_action: '⚠️ Action still highly effective. Do not delay.',

    t3_title: '48 - 72 Hours (Critical Limit)',
    t3_hiv: 'PEP is moderately effective (final window).',
    t3_preg: 'Standard pill drop to 58%. Ask for Ella pill if available.',
    t3_action: '⏳ Urgent. This is the absolute final window for PEP.',

    t4_title: '72+ Hours (Clinic Care Required)',
    t4_hiv: 'PEP is no longer initiated. Regular screening recommended.',
    t4_preg: 'Morning-after pills fail. An Emergency IUD coil can be fitted up to 5 days (120 hours).',
    t4_action: 'ℹ️ Walk into a youth clinic for specialized medical care.',

    callTitle: '📞 Free Confidential Helplines',
    callSub: 'Toll-free from any Econet, NetOne, or Telecel card.',
    callCeshar: 'Call CeSHHAR Youth Line',
    callCesharSub: 'Free counseling & clinic bookings',
    callMusasa: 'Call Musasa GBV Helpline',
    callMusasaSub: 'Confidential emergency rescue',
    dialUZ: 'UZ Campus Student Health',
  },
  sn: {
    title: 'Rubatsiro rwe Emergency (SOS)',
    sub: 'Nzira dzechivande dzekuzvidzivirira & nhamba dzemahara dzekufona.',
    timelineHeader: '🕒 Nguva ye Nhanho dzekudzivirira (Maawa 72)',
    timelineSub: 'Kudzivirira kunodzikira nekufamba kwenguva. Tora matanho izvozvi.',
    
    t1_title: '0 - 24 Maawa (Mukana Wakanaka)',
    t1_hiv: 'PEP inodzivirira HIV kudarika 99%.',
    t1_preg: 'Piritsi re Emergency rinoshanda 95% kudzivirira pamuviri.',
    t1_action: '🚨 Nguva yakanakisisa. Mhanyira kukiriniki kana pharmacy izvozvi.',

    t2_title: '24 - 48 Maawa (Dziviriro Yakakwira)',
    t2_hiv: 'PEP inoramba ichishanda zvakanyanya.',
    t2_preg: 'Piritsi re Emergency rinoshanda rinosvika pa 85%.',
    t2_action: '⚠️ Matanho achiri kushanda zvakanaka. Usanonoke.',

    t3_title: '48 - 72 Maawa (Nguva yekupedzisira)',
    t3_hiv: 'PEP inoshanda nepakati (mukana wekupedzisira).',
    t3_preg: 'Piritsi rekaenzana rinodzika pa 58%. Kumbira Ella pill kana riripo.',
    t3_action: '⏳ Kurumidza. Uyu ndiwo mukana wako wekupedzisira wekunwa PEP.',

    t4_title: '72+ Maawa (Kiriniki Inodiwa)',
    t4_hiv: 'PEP haichapihwi pashure pemaawa 72. Zvakanaka kuita test.',
    t4_preg: 'Piritsi re emergency harichashandi. IUD coil inogona kuiswa kusvika kumazuva 5.',
    t4_action: 'ℹ️ Enda kukiriniki yevechidiki kuti uwane rubatsiro rwechiremba.',

    callTitle: '📞 Nhamba dzemahara dzekufona',
    callSub: 'Kufona ndekwemahara kubva pa Econet, NetOne, kana Telecel.',
    callCeshar: 'Fona CeSHHAR Youth Line',
    callCesharSub: 'Pangamazano nekuwana kiriniki mahara',
    callMusasa: 'Fona Musasa GBV Helpline',
    callMusasaSub: 'Rubatsiro nekununurwa pachivande',
    dialUZ: 'UZ Campus Student Health',
  },
  nd: {
    title: 'Usizo lwe Emergency (SOS)',
    sub: 'Izikhombisi-ndlela eziyimfihlo lenombolo zocansi zamahhala.',
    timelineHeader: '🕒 Isikhathi sezinyathelo zokuzivikela (Amahora 72)',
    timelineSub: 'Ukuvikeleka kwehla masinyane ngokuhamba kwesikhathi. Thatha inyathelo manje.',
    
    t1_title: '0 - 24 Amahora (Isikhathi esihle)',
    t1_hiv: 'I-PEP ivimbela i-HIV ngaphezu kwe-99%.',
    t1_preg: 'Iphilisi le-Emergency livimbela ukukhulelwa ngo-95%.',
    t1_action: '🚨 Isikhathi esingcono kakhulu. Gijimela ekiliniki kumbe ekhemisi manje.',

    t2_title: '24 - 48 Amahora (Ukuvikeleka okuphezulu)',
    t2_hiv: 'I-PEP isasebenza kakhulu.',
    t2_preg: 'Iphilisi le-Emergency lihla lifike ku-85% ukusebenza.',
    t2_action: '⚠️ Izinyathelo zisasebenza kahle. Ungalibali.',

    t3_title: '48 - 72 Amahora (Umkhawulo wokugcina)',
    t3_hiv: 'I-PEP isebenza ngesilinganiso (ithuba lokugcina).',
    t3_preg: 'Iphilisi elijwayelekile lihla lifike ku-58%. Dinga i-Ella pill uma ikhona.',
    t3_action: '⏳ Shesha. Leli yithuba lakho lokugcina lokuthola i-PEP.',

    t4_title: '72+ Amahora (Ikiliniki iyadingeka)',
    t4_hiv: 'I-PEP ayisaphiwa ngemva kwamahora angama-72. Kuhle ukuyohlola.',
    t4_preg: 'Amaphilisi e-emergency awasasebenzi. I-IUD coil ingafakwa kuze kube yizinsuku ezi-5.',
    t4_action: 'ℹ️ Yana ekiliniki yabatsha ukuze uthole usizo lukadokotela.',

    callTitle: '📞 Inombolo zamahhala zocingo',
    callSub: 'Ukufona kumahhala kusuka ku-Econet, NetOne, loba Telecel.',
    callCeshar: 'Biza CeSHHAR Youth Line',
    callCesharSub: 'Ukululekwa lamakiliniki mahhala',
    callMusasa: 'Biza Musasa GBV Helpline',
    callMusasaSub: 'Ukuhlangulwa ngemfihlo masinyane',
    dialUZ: 'UZ Campus Student Health',
  }
};

export default function SOSEmergencyScreen({ navigation }) {
  const language = useAppStore((s) => s.language);
  const dict = DICT[language] || DICT.en;

  const [activeTab, setActiveTab] = useState('24h');

  const makeCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <Screen>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{dict.title}</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sub}>{dict.sub}</Text>

        <Card style={styles.sosCard}>
          <View style={styles.sosRow}>
            <View style={styles.sosDot} />
            <Text style={styles.sosTime}>72 Hours Active PEP / EC Limits</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>{dict.timelineHeader}</Text>
        <Text style={styles.sectionSub}>{dict.timelineSub}</Text>

        {/* Timeline Tabs */}
        <View style={styles.tabsRow}>
          {['24h', '48h', '72h', '72h+'].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}
              onPress={() => setActiveTab(t)}>
              <Text style={[styles.tabBtnText, activeTab === t && styles.tabBtnTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Timeline Details */}
        <Card style={styles.detailsCard}>
          {activeTab === '24h' && (
            <View>
              <Text style={styles.detailsTitle}>{dict.t1_title}</Text>
              <Row icon="medkit" text={dict.t1_hiv} color={colors.primary} />
              <Row icon="heart" text={dict.t1_preg} color="#BE185D" />
              <View style={styles.alertBox}>
                <Text style={styles.alertText}>{dict.t1_action}</Text>
              </View>
            </View>
          )}

          {activeTab === '48h' && (
            <View>
              <Text style={styles.detailsTitle}>{dict.t2_title}</Text>
              <Row icon="medkit" text={dict.t2_hiv} color={colors.primary} />
              <Row icon="heart" text={dict.t2_preg} color="#BE185D" />
              <View style={[styles.alertBox, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
                <Text style={[styles.alertText, { color: '#B45309' }]}>{dict.t2_action}</Text>
              </View>
            </View>
          )}

          {activeTab === '72h' && (
            <View>
              <Text style={styles.detailsTitle}>{dict.t3_title}</Text>
              <Row icon="medkit" text={dict.t3_hiv} color={colors.primary} />
              <Row icon="heart" text={dict.t3_preg} color="#BE185D" />
              <View style={[styles.alertBox, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}>
                <Text style={[styles.alertText, { color: '#B91C1C' }]}>{dict.t3_action}</Text>
              </View>
            </View>
          )}

          {activeTab === '72h+' && (
            <View>
              <Text style={styles.detailsTitle}>{dict.t4_title}</Text>
              <Row icon="medkit" text={dict.t4_hiv} color={colors.textMuted} />
              <Row icon="heart" text={dict.t4_preg} color="#BE185D" />
              <View style={[styles.alertBox, { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }]}>
                <Text style={[styles.alertText, { color: '#1D4ED8' }]}>{dict.t4_action}</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Emergency Dials */}
        <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>{dict.callTitle}</Text>
        <Text style={styles.sectionSub}>{dict.callSub}</Text>

        <TouchableOpacity style={styles.callRow} onPress={() => makeCall('08080074')}>
          <View style={[styles.callIcon, { backgroundColor: '#E0F2FE' }]}>
            <Ionicons name="call" size={20} color="#0284C7" />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.callLabel}>{dict.callCeshar}</Text>
            <Text style={styles.callDesc}>{dict.callCesharSub} · Toll-Free</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.callRow} onPress={() => makeCall('08080009')}>
          <View style={[styles.callIcon, { backgroundColor: '#FCE7F3' }]}>
            <Ionicons name="call" size={20} color="#BE185D" />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.callLabel}>{dict.callMusasa}</Text>
            <Text style={styles.callDesc}>{dict.callMusasaSub} · Toll-Free</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.callRow} onPress={() => makeCall('+263242303211')}>
          <View style={[styles.callIcon, { backgroundColor: '#F3F4F6' }]}>
            <Ionicons name="business" size={20} color={colors.text} />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.callLabel}>{dict.dialUZ}</Text>
            <Text style={styles.callDesc}>UZ Campus Clinic · Landline</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

function Row({ icon, text, color }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color={color} style={{ marginTop: 2 }} />
      <Text style={styles.rowText}>{text}</Text>
    </View>
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
  sosCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    paddingVertical: 10,
    marginBottom: spacing.lg,
  },
  sosRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  sosDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  sosTime: { color: '#B91C1C', fontWeight: '700', fontSize: 13, textTransform: 'uppercase' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  sectionSub: { fontSize: 13, color: colors.textMuted, marginTop: 2, marginBottom: spacing.md },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  tabBtnActive: {
    backgroundColor: colors.surface,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tabBtnText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  detailsCard: {
    minHeight: 180,
    justifyContent: 'center',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  rowText: {
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    flex: 1,
  },
  alertBox: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  alertText: {
    fontSize: 13,
    color: '#065F46',
    fontWeight: '700',
  },
  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  callIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  callDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
