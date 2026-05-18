import { create } from 'zustand';
import { storage } from '../storage/storage';

const STATE_KEY = 'mascot.state.v1';

const defaultState = {
  hasOnboarded: false,
  language: 'en',
  appLockEnabled: false,
  anonId: null,
  results: [],
  quizProgress: {},
  reminders: [],
  chatHistory: [],
  periodStartDate: null,
  cycleLength: 28,
  periodDuration: 5,
  userPasscode: null,
  isAuthenticated: false,
};

function randomAnonId() {
  const adj = ['Quiet', 'Bright', 'Calm', 'Kind', 'Wise', 'Brave', 'Steady', 'Open'];
  const noun = ['River', 'Stone', 'Flame', 'Cloud', 'Bird', 'Tree', 'Star', 'Wave'];
  const a = adj[Math.floor(Math.random() * adj.length)];
  const n = noun[Math.floor(Math.random() * noun.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${a}${n}${num}`;
}

export const useAppStore = create((set, get) => ({
  ...defaultState,
  hydrated: false,

  hydrate: async () => {
    const saved = await storage.getJSON(STATE_KEY);
    if (saved) {
      set({ ...defaultState, ...saved, hydrated: true });
    } else {
      const anonId = randomAnonId();
      set({ ...defaultState, anonId, hydrated: true });
      await storage.setJSON(STATE_KEY, { ...defaultState, anonId });
    }
  },

  persist: async () => {
    const { hydrated, ...rest } = get();
    await storage.setJSON(STATE_KEY, rest);
  },

  setLanguage: (language) => {
    set({ language });
    get().persist();
  },

  completeOnboarding: () => {
    set({ hasOnboarded: true });
    get().persist();
  },

  setAppLock: (enabled) => {
    set({ appLockEnabled: enabled });
    get().persist();
  },

  setPeriodData: (startDate, length, duration) => {
    set({ periodStartDate: startDate, cycleLength: length, periodDuration: duration });
    get().persist();
  },

  registerUser: (username, PIN) => {
    set({ anonId: username, userPasscode: PIN, isAuthenticated: true, appLockEnabled: true });
    get().persist();
  },

  loginUser: (PIN) => {
    if (get().userPasscode === PIN) {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logoutUser: () => {
    set({ isAuthenticated: false });
  },

  addResult: (result) => {
    const results = [...get().results, { ...result, id: Date.now(), at: new Date().toISOString() }];
    set({ results });
    get().persist();
  },

  saveQuizScore: (topicId, score) => {
    const quizProgress = { ...get().quizProgress, [topicId]: score };
    set({ quizProgress });
    get().persist();
  },

  addReminder: (reminder) => {
    const reminders = [...get().reminders, { ...reminder, id: Date.now() }];
    set({ reminders });
    get().persist();
  },

  removeReminder: (id) => {
    set({ reminders: get().reminders.filter((r) => r.id !== id) });
    get().persist();
  },

  appendChat: (msg) => {
    const chatHistory = [...get().chatHistory, { ...msg, id: Date.now() + Math.random() }];
    set({ chatHistory });
    get().persist();
  },

  clearAll: async () => {
    await storage.remove(STATE_KEY);
    const anonId = randomAnonId();
    set({ ...defaultState, anonId, hydrated: true });
    await storage.setJSON(STATE_KEY, { ...defaultState, anonId });
  },
}));
