import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { colors, spacing, radius } from '../theme/colors';
import { useAppStore } from '../state/useAppStore';
import { t } from '../logic/i18n';
import { reply } from '../logic/chatBot';

export default function ChatScreen({ navigation }) {
  const language = useAppStore((s) => s.language);
  const chatHistory = useAppStore((s) => s.chatHistory);
  const appendChat = useAppStore((s) => s.appendChat);
  const [text, setText] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (chatHistory.length === 0) {
      appendChat({ role: 'bot', text: t('chatGreeting', language) });
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  }, [chatHistory.length]);

  const send = () => {
    const value = text.trim();
    if (!value) return;
    appendChat({ role: 'user', text: value });
    setText('');
    setTimeout(() => {
      appendChat({ role: 'bot', text: reply(value) });
    }, 250);
  };

  return (
    <Screen edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{t('chatTitle', language)}</Text>
          <Text style={styles.sub}>{t('chatSub', language)}</Text>
        </View>
        <View style={styles.iconBtn} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.list}>
          {chatHistory.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.bubble,
                msg.role === 'user' ? styles.bubbleUser : styles.bubbleBot,
              ]}>
              <Text style={msg.role === 'user' ? styles.bubbleUserText : styles.bubbleBotText}>
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t('chatPlaceholder', language)}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            multiline
            onSubmitEditing={send}
            returnKeyType="send"
            blurOnSubmit
          />
          <TouchableOpacity onPress={send} style={styles.sendBtn}>
            <Ionicons name="send" size={20} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  iconBtn: { padding: spacing.sm, width: 40 },
  title: { fontSize: 17, fontWeight: '700', color: colors.text, textAlign: 'center' },
  sub: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  list: { padding: spacing.md },
  bubble: {
    maxWidth: '85%',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginVertical: 4,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
  },
  bubbleBot: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderTopLeftRadius: 4,
  },
  bubbleUserText: { color: colors.textInverse, fontSize: 15, lineHeight: 21 },
  bubbleBotText: { color: colors.text, fontSize: 15, lineHeight: 21 },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 15,
    maxHeight: 120,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
