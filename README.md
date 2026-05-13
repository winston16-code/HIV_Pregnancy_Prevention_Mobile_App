# MASCOT — mHealth Tool

A self-care companion for college and university students in Zimbabwe, supporting decisions on HIV prevention and pregnancy prevention. Built for the **CeSHHAR / MASCOT mHealth Tool Hackathon 2026**.

> Privacy by design. No real names. Everything stays on the phone unless you choose to share.

## What's inside

Six functional pillars, all wired up:

1. **Risk Assessment Engine** — adaptive 11-question questionnaire that branches based on prior answers and produces a personalised risk profile (low / moderate / high) with plain-language explanations.
2. **Decision Support & Guidance** — context-aware recommendations triggered by specific answers, not just totals.
3. **Knowledge Hub** — five topic packs (HIV basics, contraception, PrEP, consent & relationships, testing) delivered as short cards at a form 4 reading level, each with a quick quiz.
4. **Service Locator** — searchable list of youth-friendly clinics, VCT centres, and pharmacies across Harare, Bulawayo, and university campuses, with one-tap directions and call.
5. **Anonymous Chat** — rule-based FAQ assistant covering condoms, PrEP, PEP, emergency contraception, consent, side effects, and more. Can be upgraded to an LLM (Claude API) backend later.
6. **Reminders** — discreet local notifications for daily PrEP, injection cycles, and yearly HIV tests. Lock-screen text never spells out details — just "Health reminder".

Plus: onboarding, biometric app lock, English + Shona translations, and a one-tap "erase all my data" button.

## Tech stack

- **Frontend**: React Native + Expo SDK 50
- **Navigation**: React Navigation (bottom tabs + native-stack)
- **State**: Zustand
- **Storage**: AsyncStorage (local-only, on-device)
- **Auth**: expo-local-authentication (Face ID / fingerprint)
- **Notifications**: expo-notifications (local scheduling)
- **Icons**: @expo/vector-icons (Ionicons)

No backend required for the MVP. Everything runs on-device, which is the strongest possible privacy story for a tool that handles sexual health information.

## Run it

```bash
npm install
npx expo start
```

Then press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with the Expo Go app on a physical phone.

## Project layout

```
src/
├── components/       Card, PrimaryButton, RiskBadge, Pill, Screen
├── data/             questions, content topics, clinics, FAQ rules
├── logic/            riskEngine, chatBot, i18n
├── navigation/       RootNavigator (tabs + stacks)
├── screens/          Onboarding, Lock, Home, AssessIntro, Questionnaire,
│                     Result, Learn, Topic, Quiz, Find, Chat, Profile, Reminders
├── state/            useAppStore (Zustand)
├── storage/          AsyncStorage wrapper
└── theme/            colors, spacing, radius
```

## Design principles applied

| Principle from the brief | Where it shows up |
| --- | --- |
| Privacy by design | Anonymous IDs (e.g. `QuietRiver421`), no real name ever asked, optional biometric lock, one-tap data wipe |
| Warm, non-judgmental tone | "Here's what we found" instead of "Assessment result"; recommendations framed as suggestions |
| Form 4 reading level | All content cards written in short, plain sentences |
| Low-end Android support | No video, no heavy assets, AsyncStorage-only, list-based UI |
| Offline mode | All content, clinics, FAQ, and risk engine are bundled — no network needed |
| Discreet notifications | Reminder body is always "Health reminder · Tap to view" |
| Bilingual | English + Shona translations via lightweight `t()` helper |

## Tuning the risk engine

Risk bands live in `src/logic/riskEngine.js`:

```js
const HIV_LOW_MAX = 2;
const HIV_MOD_MAX = 6;
const PREG_LOW_MAX = 1;
const PREG_MOD_MAX = 4;
```

Each option in `src/data/questions.js` carries `hiv` and `preg` weights. Tune by hand against personas or replace with a clinician-reviewed scoring sheet.

## What would come next

- Map view for the Find pillar (`react-native-maps` is already in dependencies).
- Optional Claude-backed chat with prompt caching for nuanced answers.
- Telemetry that never leaves the device — local-only counters to help the team understand which content cards get read most.
- Verified clinic data from CeSHHAR / MoHCC partners.
- Ndebele translation pack.

## Contact

mascot.hackathon@ceshhar.org
