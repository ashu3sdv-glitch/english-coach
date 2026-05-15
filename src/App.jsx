import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const ALL_PHRASES = [
  // ── A2: МОЙ ДЕНЬ ─────────────────────────────────────────────────────────
  { word: "I get up at 7", transcription: "/aɪ ɡɛt ʌp æt ˈsɛvən/", translation: "Я встаю в 7", example: "I get up at 7 every day.", cefr: "A2", category: "Мой день" },
  { word: "I make coffee", transcription: "/aɪ meɪk ˈkɒfi/", translation: "Я делаю кофе", example: "I make coffee every morning.", cefr: "A2", category: "Мой день" },
  { word: "I check my phone", transcription: "/aɪ tʃɛk maɪ foʊn/", translation: "Я проверяю телефон", example: "I check my phone when I wake up.", cefr: "A2", category: "Мой день" },
  { word: "I start working", transcription: "/aɪ stɑːrt ˈwɜːrkɪŋ/", translation: "Я начинаю работать", example: "I start working at 9.", cefr: "A2", category: "Мой день" },
  { word: "I have lunch", transcription: "/aɪ hæv lʌntʃ/", translation: "Я обедаю", example: "I have lunch at 1 pm.", cefr: "A2", category: "Мой день" },
  { word: "I feel tired", transcription: "/aɪ fiːl ˈtaɪərd/", translation: "Я устал", example: "I feel tired after work.", cefr: "A2", category: "Мой день" },
  { word: "I go to bed", transcription: "/aɪ ɡoʊ tə bɛd/", translation: "Я иду спать", example: "I go to bed at 11.", cefr: "A2", category: "Мой день" },
  { word: "I brush my teeth", transcription: "/aɪ brʌʃ maɪ tiːθ/", translation: "Я чищу зубы", example: "I brush my teeth twice a day.", cefr: "A2", category: "Мой день" },
  { word: "I take a shower", transcription: "/aɪ teɪk ə ˈʃaʊər/", translation: "Я принимаю душ", example: "I take a shower in the morning.", cefr: "A2", category: "Мой день" },
  { word: "I have breakfast", transcription: "/aɪ hæv ˈbrɛkfəst/", translation: "Я завтракаю", example: "I have breakfast at 8.", cefr: "A2", category: "Мой день" },
  // ── A2: ОБЩЕНИЕ ───────────────────────────────────────────────────────────
  { word: "Nice to meet you", transcription: "/naɪs tə miːt juː/", translation: "Приятно познакомиться", example: "Hi, I'm Alex. Nice to meet you!", cefr: "A2", category: "Общение" },
  { word: "Where are you from?", transcription: "/wɛr ɑːr juː frɒm/", translation: "Откуда ты?", example: "Where are you from? — Russia.", cefr: "A2", category: "Общение" },
  { word: "What do you do?", transcription: "/wɒt duː juː duː/", translation: "Чем занимаешься?", example: "What do you do? — I make music.", cefr: "A2", category: "Общение" },
  { word: "Say that again?", transcription: "/seɪ ðæt əˈɡɛn/", translation: "Повтори?", example: "Sorry, say that again?", cefr: "A2", category: "Общение" },
  { word: "Speak slowly please", transcription: "/spiːk ˈsloʊli pliːz/", translation: "Говори медленно", example: "Can you speak slowly please?", cefr: "A2", category: "Общение" },
  { word: "I don't understand", transcription: "/aɪ doʊnt ˌʌndəˈstænd/", translation: "Я не понимаю", example: "Sorry, I don't understand.", cefr: "A2", category: "Общение" },
  { word: "What does it mean?", transcription: "/wɒt dʌz ɪt miːn/", translation: "Что это значит?", example: "What does it mean?", cefr: "A2", category: "Общение" },
  { word: "That's interesting", transcription: "/ðæts ˈɪntrəstɪŋ/", translation: "Интересно!", example: "That's interesting! Tell me more.", cefr: "A2", category: "Общение" },
  // ── A2: БЫТ ──────────────────────────────────────────────────────────────
  { word: "How much is it?", transcription: "/haʊ mʌtʃ ɪz ɪt/", translation: "Сколько стоит?", example: "How much is it?", cefr: "A2", category: "Быт" },
  { word: "Can I pay by card?", transcription: "/kæn aɪ peɪ baɪ kɑːrd/", translation: "Можно картой?", example: "Can I pay by card?", cefr: "A2", category: "Быт" },
  { word: "I need help", transcription: "/aɪ niːd hɛlp/", translation: "Мне нужна помощь", example: "Excuse me, I need help.", cefr: "A2", category: "Быт" },
  { word: "Sorry I'm late", transcription: "/ˈsɒri aɪm leɪt/", translation: "Извини, опоздал", example: "Sorry I'm late!", cefr: "A2", category: "Быт" },
  // ── A2: ПАТТЕРНЫ ─────────────────────────────────────────────────────────
  { word: "I'm working on it", transcription: "/aɪm ˈwɜːrkɪŋ ɒn ɪt/", translation: "Я работаю над этим", example: "Don't worry, I'm working on it.", cefr: "A2", category: "Паттерны" },
  { word: "I'm going to", transcription: "/aɪm ˈɡoʊɪŋ tə/", translation: "Я собираюсь", example: "I'm going to learn English.", cefr: "A2", category: "Паттерны" },
  { word: "I want to", transcription: "/aɪ wɒnt tə/", translation: "Я хочу", example: "I want to improve my English.", cefr: "A2", category: "Паттерны" },
  { word: "I need to", transcription: "/aɪ niːd tə/", translation: "Мне нужно", example: "I need to call him.", cefr: "A2", category: "Паттерны" },
  { word: "I think so", transcription: "/aɪ θɪŋk soʊ/", translation: "Я думаю да", example: "Is it good? — I think so.", cefr: "A2", category: "Паттерны" },
  { word: "I'm not sure", transcription: "/aɪm nɒt ʃʊər/", translation: "Я не уверен", example: "I'm not sure about that.", cefr: "A2", category: "Паттерны" },
  // ── B1: ФРАЗОВЫЕ ГЛАГОЛЫ ─────────────────────────────────────────────────
  { word: "go ahead", transcription: "/ɡoʊ əˈhɛd/", translation: "давай / продолжай", example: "Go ahead, I'm listening.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "figure out", transcription: "/ˈfɪɡjər aʊt/", translation: "разобраться", example: "I need to figure it out.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "come up with", transcription: "/kʌm ʌp wɪð/", translation: "придумать", example: "She came up with a great idea.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "get along", transcription: "/ɡɛt əˈlɒŋ/", translation: "ладить", example: "We get along well.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "put off", transcription: "/pʊt ɒf/", translation: "откладывать", example: "Don't put it off.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "break down", transcription: "/breɪk daʊn/", translation: "сломаться", example: "My car broke down.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "turn out", transcription: "/tɜːrn aʊt/", translation: "оказаться", example: "It turned out great.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "bring up", transcription: "/brɪŋ ʌp/", translation: "поднять тему", example: "He brought it up.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "set up", transcription: "/sɛt ʌp/", translation: "организовать", example: "Let's set it up.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "deal with", transcription: "/diːl wɪð/", translation: "разбираться", example: "How do you deal with it?", cefr: "B1", category: "Фразовые глаголы" },
  { word: "pick up", transcription: "/pɪk ʌp/", translation: "освоить / забрать", example: "I picked it up fast.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "run out of", transcription: "/rʌn aʊt əv/", translation: "закончиться", example: "We ran out of time.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "give up", transcription: "/ɡɪv ʌp/", translation: "сдаться", example: "Don't give up!", cefr: "B1", category: "Фразовые глаголы" },
  { word: "end up", transcription: "/ɛnd ʌp/", translation: "в итоге", example: "We ended up staying late.", cefr: "B1", category: "Фразовые глаголы" },
  // ── B1: РАЗГОВОР ─────────────────────────────────────────────────────────
  { word: "In my opinion", transcription: "/ɪn maɪ əˈpɪnjən/", translation: "На мой взгляд", example: "In my opinion, it's great.", cefr: "B1", category: "Разговор" },
  { word: "Good point", transcription: "/ɡʊd pɔɪnt/", translation: "Хорошее замечание", example: "Good point, I agree.", cefr: "B1", category: "Разговор" },
  { word: "Let me think", transcription: "/lɛt miː θɪŋk/", translation: "Дай подумаю", example: "Let me think for a second.", cefr: "B1", category: "Разговор" },
  { word: "I see your point", transcription: "/aɪ siː jɔːr pɔɪnt/", translation: "Понимаю тебя", example: "I see your point, but...", cefr: "B1", category: "Разговор" },
  { word: "By the way", transcription: "/baɪ ðə weɪ/", translation: "Кстати", example: "By the way, did you hear?", cefr: "B1", category: "Разговор" },
  { word: "Anyway", transcription: "/ˈɛniweɪ/", translation: "В общем / ладно", example: "Anyway, let's move on.", cefr: "B1", category: "Разговор" },
  { word: "I've been working", transcription: "/aɪv bɪn ˈwɜːrkɪŋ/", translation: "Я работаю (уже)", example: "I've been working all day.", cefr: "B1", category: "Разговор" },
  { word: "I used to", transcription: "/aɪ juːzd tə/", translation: "Раньше я", example: "I used to live there.", cefr: "B1", category: "Разговор" },
  { word: "It depends", transcription: "/ɪt dɪˈpɛndz/", translation: "Зависит", example: "It depends on the weather.", cefr: "B1", category: "Разговор" },
  { word: "Let me get back to you", transcription: "/lɛt miː ɡɛt bæk tə juː/", translation: "Отвечу позже", example: "Let me get back to you.", cefr: "B1", category: "Разговор" },
  { word: "That sounds great", transcription: "/ðæt saʊndz ɡreɪt/", translation: "Звучит отлично", example: "That sounds great!", cefr: "B1", category: "Разговор" },
  { word: "I appreciate it", transcription: "/aɪ əˈpriːʃieɪt ɪt/", translation: "Ценю это", example: "I appreciate it, thank you.", cefr: "B1", category: "Разговор" },
  { word: "I completely agree", transcription: "/aɪ kəmˈpliːtli əˈɡriː/", translation: "Полностью согласен", example: "I completely agree with you.", cefr: "B1", category: "Разговор" },
  // ── B2: ПРОДВИНУТЫЕ ──────────────────────────────────────────────────────
  { word: "To be honest", transcription: "/tə biː ˈɒnɪst/", translation: "Честно говоря", example: "To be honest, I don't know.", cefr: "B2", category: "Продвинутые" },
  { word: "In other words", transcription: "/ɪn ˈʌðər wɜːrdz/", translation: "Другими словами", example: "In other words, it failed.", cefr: "B2", category: "Продвинутые" },
  { word: "What I mean is", transcription: "/wɒt aɪ miːn ɪz/", translation: "Я имею в виду", example: "What I mean is we need time.", cefr: "B2", category: "Продвинутые" },
  { word: "On the other hand", transcription: "/ɒn ðə ˈʌðər hænd/", translation: "С другой стороны", example: "On the other hand, it could work.", cefr: "B2", category: "Продвинутые" },
  { word: "As far as I know", transcription: "/æz fɑːr æz aɪ noʊ/", translation: "Насколько я знаю", example: "As far as I know, it's fine.", cefr: "B2", category: "Продвинутые" },
  { word: "Having said that", transcription: "/ˈhævɪŋ sɛd ðæt/", translation: "Тем не менее", example: "Having said that, let's try.", cefr: "B2", category: "Продвинутые" },
  { word: "I couldn't agree more", transcription: "/aɪ ˈkʊdnt əˈɡriː mɔːr/", translation: "Полностью согласен", example: "I couldn't agree more.", cefr: "B2", category: "Продвинутые" },
  { word: "It goes without saying", transcription: "/ɪt ɡoʊz wɪˈðaʊt ˈseɪɪŋ/", translation: "Само собой разумеется", example: "It goes without saying.", cefr: "B2", category: "Продвинутые" },
  { word: "I'd be happy to", transcription: "/aɪd biː ˈhæpi tə/", translation: "С удовольствием", example: "I'd be happy to help.", cefr: "B2", category: "Продвинутые" },
];

const FREQ_WORDS = ALL_PHRASES;

const SCENARIOS = [
  { id: "daily", label: "Everyday Talk", icon: "☕", prompt: "Let's have a casual conversation about daily life. Ask me about my morning routine, hobbies, or what I did today. Keep it natural and friendly. I'm learning English, correct my mistakes gently after I respond." },
  { id: "business", label: "Business", icon: "💼", prompt: "Let's practice business English. Simulate a professional meeting. I'm pitching a project idea. Ask me questions a manager would ask. Correct my grammar if needed." },
  { id: "travel", label: "Travel", icon: "✈️", prompt: "Simulate a travel situation — I'm at an airport or hotel. Play the role of staff. Gently correct my English mistakes." },
  { id: "music", label: "AI Music", icon: "🎵", prompt: "Let's discuss AI music production and Suno AI. You're a fellow creator. Ask me about my workflow, what music I make. Correct my English naturally." },
  { id: "interview", label: "Job Interview", icon: "🤝", prompt: "You're a job interviewer. Ask me 3-5 interview questions one at a time. Give brief feedback on my English after each answer." },
  { id: "story", label: "Storytelling", icon: "📖", prompt: "Let's do a collaborative story. Start a short story and I'll continue it. We alternate. Gently correct my grammar. Keep it fun." },
];

const READING_TOPICS = [
  { id: "music", label: "AI Music", icon: "🎵" },
  { id: "travel", label: "Путешествие", icon: "✈️" },
  { id: "business", label: "Бизнес", icon: "💼" },
  { id: "daily", label: "Будний день", icon: "☕" },
  { id: "tech", label: "Технологии", icon: "💻" },
  { id: "random", label: "Случайная", icon: "🎲" },
];

const TIPS = [
  "Говори с первого дня — ошибки это часть процесса",
  "2000 слов = понимание 80% разговорной речи",
  "Shadowing: повторяй вслед за носителем с той же интонацией",
  "Переключи телефон на английский прямо сейчас",
  "20 минут каждый день лучше, чем 3 часа раз в неделю",
  "Учи фразы в контексте, не одиночные слова",
  "Смотри сериалы с субтитрами — это тоже учёба",
  "Используй AI как 24/7 репетитора — без страха ошибиться",
];

const PLACEMENT_QUESTIONS = [
  { q: "What does 'go ahead' mean?", options: ["остановиться", "продолжай", "вернуться", "подождать"], correct: 1 },
  { q: "Choose the correct sentence:", options: ["I am know this word.", "I have been working all day.", "She goed to the store.", "We was happy."], correct: 1 },
  { q: "Translate: 'It depends on the weather'", options: ["Это зависит от погоды", "Погода зависит от этого", "Мне нравится погода", "Погода хорошая"], correct: 0 },
  { q: "Fill in: 'She ___ a great idea for the project.'", options: ["came up with", "went through", "put off", "broke down"], correct: 0 },
  { q: "What level describes you best?", options: ["Я почти не знаю английский (A1)", "Знаю базу, но говорю с трудом (A2)", "Могу объясниться, есть пробелы (B1)", "Говорю уверенно (B2+)"], correct: -1 },
];

const BUILDER_SENTENCES = [
  { id: 1, cefr: "A2", words: ["I", "get", "up", "at", "7"], hint: "Я встаю в 7" },
  { id: 2, cefr: "A2", words: ["I", "make", "coffee", "every", "morning"], hint: "Я делаю кофе каждое утро" },
  { id: 3, cefr: "A2", words: ["Sorry", "I'm", "late"], hint: "Извини, я опоздал" },
  { id: 4, cefr: "A2", words: ["I", "don't", "understand"], hint: "Я не понимаю" },
  { id: 5, cefr: "A2", words: ["I", "need", "help"], hint: "Мне нужна помощь" },
  { id: 6, cefr: "A2", words: ["I'm", "going", "to", "learn", "English"], hint: "Я собираюсь учить английский" },
  { id: 7, cefr: "A2", words: ["I", "feel", "tired", "after", "work"], hint: "Я устаю после работы" },
  { id: 8, cefr: "A2", words: ["I", "have", "breakfast", "at", "8"], hint: "Я завтракаю в 8" },
  { id: 9, cefr: "B1", words: ["She", "came", "up", "with", "a", "great", "idea"], hint: "Она придумала отличную идею" },
  { id: 10, cefr: "B1", words: ["Don't", "put", "it", "off"], hint: "Не откладывай это" },
  { id: 11, cefr: "B1", words: ["It", "turned", "out", "great"], hint: "Оказалось отлично" },
  { id: 12, cefr: "B1", words: ["I've", "been", "working", "all", "day"], hint: "Я работаю весь день" },
  { id: 13, cefr: "B1", words: ["Let", "me", "get", "back", "to", "you"], hint: "Я вернусь к этому позже" },
  { id: 14, cefr: "B1", words: ["That", "sounds", "great"], hint: "Звучит отлично" },
  { id: 15, cefr: "B1", words: ["I", "used", "to", "live", "there"], hint: "Раньше я жил там" },
  { id: 16, cefr: "B1", words: ["How", "do", "you", "deal", "with", "it"], hint: "Как ты с этим справляешься?" },
  { id: 17, cefr: "B2", words: ["To", "be", "honest", "I", "don't", "know"], hint: "Честно говоря, я не знаю" },
  { id: 18, cefr: "B2", words: ["In", "other", "words", "it", "failed"], hint: "Другими словами, это провалилось" },
  { id: 19, cefr: "B2", words: ["It", "goes", "without", "saying"], hint: "Само собой разумеется" },
  { id: 20, cefr: "B2", words: ["Having", "said", "that", "let's", "try"], hint: "Тем не менее, давай попробуем" },
  { id: 21, cefr: "B2", words: ["I", "couldn't", "agree", "more"], hint: "Полностью с этим согласен" },
  { id: 22, cefr: "B2", words: ["As", "far", "as", "I", "know", "it's", "fine"], hint: "Насколько я знаю, всё хорошо" },
];

// ─── SPEECH ──────────────────────────────────────────────────────────────────

function speakText(text, rate = 0.85) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "en-US";
  utt.rate = rate;
  utt.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang === "en-US" && v.name.includes("Google")) || voices.find(v => v.lang === "en-US") || voices[0];
  if (preferred) utt.voice = preferred;
  window.speechSynthesis.speak(utt);
}

function stopSpeak() { window.speechSynthesis?.cancel(); }

// ─── SRS ENGINE ──────────────────────────────────────────────────────────────

function getCardsDue(cards) {
  return cards.filter(c => c.nextReview <= Date.now());
}

function updateCard(card, quality) {
  const intervals = [1, 3, 7, 14, 30];
  const newLevel = quality === 0 ? 0 : Math.min((card.srsLevel || 0) + (quality - 1), 4);
  return { ...card, srsLevel: newLevel, nextReview: Date.now() + intervals[newLevel] * 24 * 3600 * 1000, reviewed: (card.reviewed || 0) + 1 };
}

// ─── HOOKS ───────────────────────────────────────────────────────────────────

const NEW_PER_DAY = 5;
function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }

function useSRS() {
  const [cards, setCards] = useState(() => {
    try { const s = localStorage.getItem("srs_v5"); if (s) return JSON.parse(s); } catch {}
    return FREQ_WORDS.map((w, i) => ({ ...w, id: i, srsLevel: 0, nextReview: Date.now() + 999 * 24 * 3600 * 1000, reviewed: 0, unlocked: false }));
  });

  const [unlockedToday, setUnlockedToday] = useState(() => {
    try { const s = localStorage.getItem("srs_daily"); if (s) { const d = JSON.parse(s); if (d.key === todayKey()) return d.count; } } catch {}
    return 0;
  });

  useEffect(() => { try { localStorage.setItem("srs_v5", JSON.stringify(cards)); } catch {} }, [cards]);
  useEffect(() => { try { localStorage.setItem("srs_daily", JSON.stringify({ key: todayKey(), count: unlockedToday })); } catch {} }, [unlockedToday]);

  const unlockNewCards = useCallback(() => {
    const canUnlock = NEW_PER_DAY - unlockedToday;
    if (canUnlock <= 0) return;
    let unlocked = 0;
    setCards(prev => {
      const next = [...prev];
      for (let i = 0; i < next.length && unlocked < canUnlock; i++) {
        if (!next[i].unlocked) { next[i] = { ...next[i], unlocked: true, nextReview: Date.now() }; unlocked++; }
      }
      return next;
    });
    setUnlockedToday(c => c + unlocked);
  }, [unlockedToday]);

  const reviewCard = useCallback((id, quality) => {
    setCards(prev => prev.map(c => c.id === id ? updateCard(c, quality) : c));
  }, []);

  const unlockedCards = cards.filter(c => c.unlocked);
  const due = getCardsDue(unlockedCards);
  const mastered = cards.filter(c => (c.srsLevel || 0) >= 4).length;
  const newAvailable = NEW_PER_DAY - unlockedToday;
  const totalUnlocked = unlockedCards.length;
  return { cards, unlockedCards, due, mastered, reviewCard, unlockNewCards, newAvailable, totalUnlocked };
}

function useMotivation() {
  const [data, setData] = useState(() => { try { const s = localStorage.getItem("motivation"); return s ? JSON.parse(s) : { streak: 0, lastDay: null }; } catch { return { streak: 0, lastDay: null }; } });
  const recordSession = useCallback(() => {
    const today = todayKey();
    setData(prev => {
      if (prev.lastDay === today) return prev;
      const d = new Date(); d.setDate(d.getDate() - 1);
      const yesterday = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const newStreak = prev.lastDay === yesterday ? prev.streak + 1 : 1;
      const next = { streak: newStreak, lastDay: today };
      localStorage.setItem("motivation", JSON.stringify(next));
      return next;
    });
  }, []);
  const daysSince = (() => {
    if (!data.lastDay) return null;
    const [y, m, d] = data.lastDay.split("-").map(Number);
    return Math.floor((new Date() - new Date(y, m, d)) / (24 * 3600 * 1000));
  })();
  return { streak: data.streak, daysSince, recordSession };
}

// ─── API ─────────────────────────────────────────────────────────────────────

async function callClaude(messages, system) {
  const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages, system }) });
  const data = await res.json();
  return data.reply || "Sorry, something went wrong.";
}

async function generateStory(phrases, topic) {
  const res = await fetch("/api/story", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phrases, topic }) });
  const data = await res.json();
  return data.story || "";
}

function splitIntoParagraphs(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const paragraphs = [];
  for (let i = 0; i < sentences.length; i += 2) {
    const para = sentences.slice(i, i + 2).join(" ").trim();
    if (para) paragraphs.push(para);
  }
  return paragraphs.length > 0 ? paragraphs : [text];
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────

function ProgressRing({ value, max, size = 56, color = "#00ff88" }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / Math.max(max, 1)) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a1a2e" strokeWidth="4" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
    </svg>
  );
}

function TipBanner() {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i + 1) % TIPS.length), 6000); return () => clearInterval(t); }, []);
  return (
    <div style={{ background: "linear-gradient(90deg,#0d1117,#161b22)", border: "1px solid #00ff8830", borderRadius: 12, padding: "10px 16px", fontSize: 12, color: "#00ff88", fontStyle: "italic", display: "flex", alignItems: "center", gap: 10 }}>
      <span>💡</span><span>{TIPS[idx]}</span>
    </div>
  );
}

function MotivationBanner({ streak, daysSince }) {
  if (!daysSince && streak === 0) return null;
  if (daysSince >= 7) return <div style={{ background: "#1a0a0a", border: "1px solid #ff444440", borderRadius: 12, padding: "10px 16px", fontSize: 12, color: "#ff8888", display: "flex", gap: 8 }}><span>😴</span><span>Давно не занимался. Начнём с 5 минут сегодня!</span></div>;
  if (daysSince >= 2) return <div style={{ background: "#1a1000", border: "1px solid #ff8c0040", borderRadius: 12, padding: "10px 16px", fontSize: 12, color: "#ffaa44", display: "flex", gap: 8 }}><span>👋</span><span>Пропустил {daysSince} дня. Карточки ждут!</span></div>;
  if (streak >= 7) return <div style={{ background: "#1a0a00", border: "1px solid #ff8c0060", borderRadius: 12, padding: "10px 16px", fontSize: 12, color: "#ff8c00", display: "flex", gap: 8 }}><span>🔥</span><span><b>{streak} дней подряд!</b> Так держать!</span></div>;
  if (streak >= 3) return <div style={{ background: "#0a1a00", border: "1px solid #00ff8830", borderRadius: 12, padding: "10px 16px", fontSize: 12, color: "#00cc66", display: "flex", gap: 8 }}><span>🌱</span><span><b>{streak} дня подряд.</b> Привычка формируется!</span></div>;
  return null;
}

// ─── PLACEMENT ───────────────────────────────────────────────────────────────

function PlacementAgent({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const q = PLACEMENT_QUESTIONS[step];
  const isLast = step === PLACEMENT_QUESTIONS.length - 1;

  const pick = (i) => {
    setSelected(i);
    setTimeout(() => {
      const newAnswers = [...answers, i];
      if (isLast) {
        const score = newAnswers.slice(0, 4).filter((a, idx) => a === PLACEMENT_QUESTIONS[idx].correct).length;
        const level = score <= 1 ? "A1" : score <= 2 ? "A2" : score <= 3 ? "B1" : "B2";
        onComplete({ level, selfLevel: ["A1","A2","B1","B2"][newAnswers[4]] || "A2" });
      } else { setAnswers(newAnswers); setSelected(null); setStep(s => s + 1); }
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 480, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ color: "#00ff88", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Тест уровня</div>
          <div style={{ color: "#fff", fontSize: 24, fontWeight: 900 }}>Placement Test</div>
          <div style={{ color: "#555", fontSize: 12, marginTop: 6 }}>Вопрос {step + 1} из {PLACEMENT_QUESTIONS.length}</div>
          <div style={{ marginTop: 12, height: 3, background: "#1a1a2e", borderRadius: 4 }}>
            <div style={{ height: "100%", background: "#00ff88", borderRadius: 4, width: `${(step / PLACEMENT_QUESTIONS.length) * 100}%`, transition: "width 0.4s ease" }} />
          </div>
          <button onClick={() => onComplete({ level: "A2", selfLevel: "A2", skipped: true })} style={{ marginTop: 14, background: "none", border: "none", color: "#333", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
            Пропустить тест → войти сразу
          </button>
        </div>
        <div style={{ background: "#0d1117", border: "1px solid #ffffff12", borderRadius: 20, padding: "22px 20px" }}>
          <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 20, lineHeight: 1.5 }}>{q.q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = q.correct !== -1 && i === q.correct;
              const isWrong = isSelected && !isCorrect && q.correct !== -1;
              return (
                <button key={i} onClick={() => selected === null && pick(i)} style={{ background: isSelected && isCorrect ? "#00ff8820" : isWrong ? "#ff444420" : isSelected ? "#4488ff20" : "#0a0a0f", border: `1px solid ${isSelected && isCorrect ? "#00ff8860" : isWrong ? "#ff444460" : isSelected ? "#4488ff60" : "#ffffff15"}`, borderRadius: 12, padding: "12px 16px", cursor: selected !== null ? "default" : "pointer", color: isSelected && isCorrect ? "#00ff88" : isWrong ? "#ff4444" : "#ccc", fontSize: 13, textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ background: "#ffffff08", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#555", flexShrink: 0 }}>{["A","B","C","D"][i]}</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SRS MODULE ──────────────────────────────────────────────────────────────

function SRSModule({ due, mastered, cards, reviewCard, unlockNewCards, newAvailable, totalUnlocked, recordSession }) {
  const [current, setCurrent] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => { if (due.length > 0 && !current) setCurrent(due[0]); }, [due, current]);

  const handleQuality = (q) => {
    reviewCard(current.id, q);
    recordSession();
    setSessionCount(s => s + 1);
    setFlipped(false);
    const remaining = due.filter(c => c.id !== current.id);
    setCurrent(remaining.length > 0 ? remaining[0] : null);
  };

  if (totalUnlocked === 0) return (
    <div style={{ textAlign: "center", padding: "30px 20px" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>👋</div>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Начнём учить фразы!</div>
      <div style={{ color: "#888", fontSize: 13, marginBottom: 24, lineHeight: 1.7 }}>Каждый день открываются <b style={{ color: "#00ff88" }}>5 новых фраз</b>.<br />Изучи → повтори → переходи в игру.</div>
      <button onClick={unlockNewCards} style={{ background: "linear-gradient(135deg,#00cc66,#008844)", border: "none", borderRadius: 14, padding: "14px 32px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
        🚀 Открыть первые {NEW_PER_DAY} фраз
      </button>
    </div>
  );

  if (!current) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ textAlign: "center", padding: "24px 20px" }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>✅</div>
        <div style={{ color: "#00ff88", fontSize: 19, fontWeight: 700, marginBottom: 6 }}>На сегодня всё повторено!</div>
        <div style={{ color: "#888", fontSize: 13 }}>Сессия: {sessionCount} карточек · Освоено: {mastered}/{cards.length}</div>
      </div>
      {newAvailable > 0 ? (
        <div style={{ background: "#0a1a0a", border: "1px solid #00ff8840", borderRadius: 16, padding: 20, textAlign: "center" }}>
          <div style={{ color: "#00ff88", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Готов к новым фразам?</div>
          <div style={{ color: "#888", fontSize: 12, marginBottom: 14 }}>Сегодня можно открыть ещё <b style={{ color: "#fff" }}>{newAvailable}</b> новых</div>
          <button onClick={unlockNewCards} style={{ background: "linear-gradient(135deg,#00cc66,#008844)", border: "none", borderRadius: 12, padding: "11px 24px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Открыть {newAvailable} новых</button>
        </div>
      ) : (
        <div style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 16, padding: 18, textAlign: "center" }}>
          <div style={{ color: "#555", fontSize: 13 }}>Лимит новых фраз на сегодня исчерпан</div>
          <div style={{ color: "#444", fontSize: 11, marginTop: 4 }}>Завтра откроется ещё {NEW_PER_DAY} новых фраз</div>
        </div>
      )}
      <div style={{ background: "#0d1117", border: "1px solid #ffffff08", borderRadius: 14, padding: "14px 18px" }}>
        <div style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Прогресс</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[{ label: "В работе", value: totalUnlocked, color: "#4488ff" }, { label: "Освоено", value: mastered, color: "#00ff88" }, { label: "Всего", value: cards.length, color: "#888" }].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ color: s.color, fontSize: 22, fontWeight: 800 }}>{s.value}</div>
              <div style={{ color: "#555", fontSize: 10 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#888", fontSize: 12 }}>Повторить: <b style={{ color: "#fff" }}>{due.length}</b></span>
        <span style={{ color: "#888", fontSize: 12 }}>В работе: <b style={{ color: "#4488ff" }}>{totalUnlocked}</b> · Освоено: <b style={{ color: "#00ff88" }}>{mastered}</b></span>
      </div>
      <div style={{ background: flipped ? "linear-gradient(135deg,#0a2a1a,#0d1a0d)" : "linear-gradient(135deg,#0a0a1a,#0d0d2a)", border: `1px solid ${flipped ? "#00ff8850" : "#ffffff15"}`, borderRadius: 20, padding: "26px 22px", minHeight: 170, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10, transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#555", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>фраза</span>
          {current.cefr && <span style={{ background: current.cefr === "A2" ? "#4488ff20" : current.cefr === "B1" ? "#00ff8820" : "#cc44ff20", color: current.cefr === "A2" ? "#4488ff" : current.cefr === "B1" ? "#00ff88" : "#cc44ff", borderRadius: 6, padding: "2px 7px", fontSize: 10, fontWeight: 700 }}>{current.cefr}</span>}
          {current.category && <span style={{ color: "#333", fontSize: 10 }}>{current.category}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, textAlign: "center", fontFamily: "Georgia,serif" }}>{current.word}</div>
          <button onClick={e => { e.stopPropagation(); speakText(current.word); }} style={{ background: "#4488ff20", border: "1px solid #4488ff40", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🔊</button>
        </div>
        <div style={{ color: "#4488ff", fontSize: 12, fontFamily: "monospace" }}>{current.transcription}</div>
        {!flipped && <div onClick={() => setFlipped(true)} style={{ color: "#333", fontSize: 12, cursor: "pointer", marginTop: 6 }}>👆 нажми чтобы увидеть перевод</div>}
        {flipped && (
          <>
            <div style={{ width: "100%", height: 1, background: "#ffffff10", margin: "4px 0" }} />
            <div style={{ color: "#00ff88", fontSize: 16, textAlign: "center" }}>{current.translation}</div>
            <div onClick={e => { e.stopPropagation(); speakText(current.example, 0.8); }} style={{ color: "#aaa", fontSize: 12, fontStyle: "italic", textAlign: "center", padding: "8px 14px", background: "#ffffff08", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <span>"{current.example}"</span><span style={{ fontSize: 13, opacity: 0.5 }}>🔊</span>
            </div>
          </>
        )}
      </div>
      {flipped && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          {[{ q: 0, label: "Не знаю", color: "#ff4444" }, { q: 1, label: "Сложно", color: "#ff8c00" }, { q: 2, label: "Знаю", color: "#4488ff" }, { q: 3, label: "Легко!", color: "#00ff88" }].map(({ q, label, color }) => (
            <button key={q} onClick={() => handleQuality(q)} style={{ background: color + "15", border: `1px solid ${color}40`, color, borderRadius: 12, padding: "11px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
              onMouseOver={e => e.currentTarget.style.background = color + "30"} onMouseOut={e => e.currentTarget.style.background = color + "15"}>{label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── QUIZ MODULE ─────────────────────────────────────────────────────────────

function shuffleArr(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function buildQuestion(words) {
  const correct = words[Math.floor(Math.random() * words.length)];
  const mode = Math.random() > 0.5 ? "en2ru" : "ru2en";
  const pool = words.filter(w => w.word !== correct.word);
  const wrong = shuffleArr(pool).slice(0, 3);
  const options = shuffleArr([correct, ...wrong]);
  if (mode === "en2ru") return { mode, prompt: correct.word, transcription: correct.transcription, example: correct.example, correctWord: correct.word, options: options.map(o => ({ label: o.translation, isCorrect: o.word === correct.word })) };
  return { mode, prompt: correct.translation, transcription: null, example: correct.example, correctWord: correct.word, options: options.map(o => ({ label: o.word, isCorrect: o.word === correct.word })) };
}

function QuizModule({ studiedCards }) {
  const safeCards = studiedCards && studiedCards.length >= 4 ? studiedCards : null;
  const [question, setQuestion] = useState(() => safeCards ? buildQuestion(safeCards) : null);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shake, setShake] = useState(false);
  const [mode, setMode] = useState("normal"); // "normal" | "timed"
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [points, setPoints] = useState(0);
  const [bestPoints, setBestPoints] = useState(() => { try { return parseInt(localStorage.getItem("quiz_best") || "0"); } catch { return 0; } });
  const timerRef = useRef(null);

  const clearTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };

  const startTimer = () => {
    clearTimer();
    setTimeLeft(10);
    setTimerActive(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearTimer();
          setTimerActive(false);
          // Time out = wrong answer
          setSelected({ isCorrect: false, timedOut: true });
          setTotal(tot => tot + 1);
          setStreak(0);
          setPoints(0);
          setShake(true);
          setTimeout(() => {
            setShake(false);
            setSelected(null);
            setQuestion(safeCards ? buildQuestion(safeCards) : null);
            startTimer();
          }, 1200);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (mode === "timed" && question && !selected) startTimer();
    return clearTimer;
  }, [mode, question]);

  useEffect(() => { return clearTimer; }, []);

  const next = () => { setSelected(null); setQuestion(safeCards ? buildQuestion(safeCards) : null); };

  const pick = (opt) => {
    if (selected !== null) return;
    clearTimer();
    setTimerActive(false);
    setSelected(opt);
    setTotal(t => t + 1);
    if (opt.isCorrect) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      speakText(question.correctWord, 0.9);
      if (mode === "timed") {
        const earned = timeLeft >= 8 ? 3 : timeLeft >= 5 ? 2 : 1;
        setPoints(p => {
          const np = p + earned;
          if (np > bestPoints) { setBestPoints(np); localStorage.setItem("quiz_best", String(np)); }
          return np;
        });
        setTimeout(() => { setSelected(null); setQuestion(safeCards ? buildQuestion(safeCards) : null); }, 800);
      } else {
        setTimeout(() => { setSelected(null); setQuestion(safeCards ? buildQuestion(safeCards) : null); }, 1000);
      }
    } else {
      setStreak(0);
      if (mode === "timed") setPoints(0);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        if (mode === "timed") { setSelected(null); setQuestion(safeCards ? buildQuestion(safeCards) : null); }
      }, 500);
    }
  };

  if (!safeCards) return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
      <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Сначала изучи карточки</div>
      <div style={{ color: "#888", fontSize: 13 }}>Перейди на вкладку <b style={{ color: "#00ff88" }}>🧠 Слова</b> и повтори хотя бы 4 фразы.</div>
    </div>
  );

  if (!question) return null;
  const accuracy = total > 0 ? Math.round(score / total * 100) : 0;
  const timerColor = timeLeft > 6 ? "#00ff88" : timeLeft > 3 ? "#ff8c00" : "#ff4444";

  const optionColor = opt => {
    if (!selected) return { bg: "#0d1117", border: "#ffffff15", color: "#ccc" };
    if (opt.isCorrect) return { bg: "#00ff8815", border: "#00ff8860", color: "#00ff88" };
    if (selected === opt && !opt.isCorrect) return { bg: "#ff444415", border: "#ff444460", color: "#ff4444" };
    return { bg: "#0d1117", border: "#ffffff08", color: "#444" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Mode selector */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { setMode("normal"); clearTimer(); setTimerActive(false); setSelected(null); setQuestion(safeCards ? buildQuestion(safeCards) : null); }}
          style={{ flex: 1, background: mode === "normal" ? "#00ff8820" : "#0d1117", border: `1px solid ${mode === "normal" ? "#00ff8860" : "#ffffff15"}`, borderRadius: 10, padding: "9px", color: mode === "normal" ? "#00ff88" : "#555", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
          🎮 Обычный
        </button>
        <button onClick={() => { setMode("timed"); setPoints(0); setScore(0); setTotal(0); setStreak(0); setSelected(null); setQuestion(safeCards ? buildQuestion(safeCards) : null); }}
          style={{ flex: 1, background: mode === "timed" ? "#ff8c0020" : "#0d1117", border: `1px solid ${mode === "timed" ? "#ff8c0060" : "#ffffff15"}`, borderRadius: 10, padding: "9px", color: mode === "timed" ? "#ff8c00" : "#555", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
          ⚡ На время
        </button>
      </div>

      {/* Timer bar (timed mode only) */}
      {mode === "timed" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ color: timerColor, fontSize: 13, fontWeight: 700 }}>⏱ {timeLeft} сек</span>
            <span style={{ color: "#ff8c00", fontSize: 13 }}>⚡ {points} очков {bestPoints > 0 && <span style={{ color: "#555", fontSize: 11 }}>· рекорд: {bestPoints}</span>}</span>
            <button onClick={() => { clearTimer(); setTimerActive(false); setMode("normal"); setSelected(null); setQuestion(safeCards ? buildQuestion(safeCards) : null); }}
              style={{ background: "#1a0a0a", border: "1px solid #ff444440", borderRadius: 8, padding: "4px 12px", color: "#ff6666", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              ⏹ Стоп
            </button>
          </div>
          <div style={{ height: 5, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", background: timerColor, borderRadius: 3, width: `${(timeLeft / 10) * 100}%`, transition: "width 1s linear, background 0.3s" }} />
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[{ label: "Правильно", value: score, color: "#00ff88" }, { label: "Точность", value: accuracy + "%", color: "#4488ff" }, { label: "🔥 Серия", value: streak, color: "#ff8c00" }].map(s => (
          <div key={s.label} style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
            <div style={{ color: s.color, fontSize: 20, fontWeight: 800 }}>{s.value}</div>
            <div style={{ color: "#555", fontSize: 10, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ background: question.mode === "en2ru" ? "#4488ff20" : "#cc44ff20", border: `1px solid ${question.mode === "en2ru" ? "#4488ff50" : "#cc44ff50"}`, color: question.mode === "en2ru" ? "#4488ff" : "#cc44ff", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
          {question.mode === "en2ru" ? "🇬🇧 → 🇷🇺" : "🇷🇺 → 🇬🇧"}
        </span>
        {streak >= 3 && <span style={{ color: "#ff8c00", fontSize: 11, fontWeight: 700 }}>🔥 {streak} подряд!</span>}
      </div>
      <div style={{ background: "linear-gradient(135deg,#0d1117,#161b22)", border: "1px solid #ffffff15", borderRadius: 20, padding: "24px 20px", textAlign: "center", animation: shake ? "shake 0.4s ease" : "none" }}>
        <div style={{ color: "#fff", fontSize: 21, fontWeight: 700, fontFamily: "Georgia,serif", marginBottom: 8 }}>{question.prompt}</div>
        {question.transcription && <div style={{ color: "#4488ff", fontSize: 12, fontFamily: "monospace", marginBottom: 8 }}>{question.transcription}</div>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <div style={{ color: "#555", fontSize: 11, fontStyle: "italic" }}>{question.example}</div>
          <button onClick={() => speakText(question.correctWord, 0.85)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, opacity: 0.5, padding: 0 }}>🔊</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {question.options.map((opt, i) => {
          const c = optionColor(opt);
          return (
            <button key={i} onClick={() => pick(opt)} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: "13px 16px", cursor: selected ? "default" : "pointer", color: c.color, fontSize: 14, textAlign: "left", fontWeight: selected && opt.isCorrect ? 700 : 400, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ background: "#ffffff08", borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, color: "#666" }}>{["A","B","C","D"][i]}</span>
              {opt.label}
              {selected && opt.isCorrect && <span style={{ marginLeft: "auto" }}>✓</span>}
              {selected === opt && !opt.isCorrect && <span style={{ marginLeft: "auto" }}>✗</span>}
            </button>
          );
        })}
      </div>
      {selected && !selected.isCorrect && (
        <button onClick={next} style={{ background: "linear-gradient(135deg,#333,#222)", border: "none", borderRadius: 14, padding: "13px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Понял, следующий →</button>
      )}
      {selected && selected.isCorrect && (
        <div style={{ textAlign: "center", color: "#00ff88", fontSize: 13, animation: "fadeIn 0.2s ease" }}>✓ Переходим дальше...</div>
      )}
    </div>
  );
}

// ─── BUILDER MODULE ───────────────────────────────────────────────────────────

function BuilderModule() {
  const [levelFilter, setLevelFilter] = useState("A2");
  const [current, setCurrent] = useState(null);
  const [wordBank, setWordBank] = useState([]);
  const [assembled, setAssembled] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [listened, setListened] = useState(false);
  const [errorCounts, setErrorCounts] = useState({});
  const [queue, setQueue] = useState([]);
  const [mistakeOnCurrent, setMistakeOnCurrent] = useState(false);

  const filtered = BUILDER_SENTENCES.filter(s => s.cefr === levelFilter);

  const buildQueue = (errors) => {
    const q = [];
    filtered.forEach(s => {
      const e = errors[s.id] || 0;
      const weight = e === 0 ? 1 : e === 1 ? 2 : 3;
      for (let i = 0; i < weight; i++) q.push(s);
    });
    return shuffleArr(q);
  };

  const loadFromQueue = (currentId, errors) => {
    let q = queue.filter(s => s.id !== currentId);
    if (q.length === 0) q = buildQueue(errors).filter(s => s.id !== currentId);
    const next = q[0];
    setQueue(q.slice(1));
    setCurrent(next);
    setWordBank(shuffleArr(next.words.map((w, i) => ({ w, key: i }))));
    setAssembled([]);
    setCompleted(false);
    setListened(false);
    setMistakeOnCurrent(false);
  };

  useEffect(() => {
    if (filtered.length > 0) {
      const q = buildQueue({});
      setQueue(q.slice(1));
      setCurrent(q[0]);
      setWordBank(shuffleArr(q[0].words.map((w, i) => ({ w, key: i }))));
      setAssembled([]);
      setCompleted(false);
      setMistakeOnCurrent(false);
      setErrorCounts({});
    }
  }, [levelFilter]);

  const getWordStatus = (item, idx) => {
    if (!current) return "neutral";
    const correct = current.words[idx];
    if (!correct) return "wrong";
    return item.w.toLowerCase() === correct.toLowerCase() ? "correct" : "wrong";
  };

  useEffect(() => {
    if (!current || assembled.length === 0) return;
    if (assembled.length === current.words.length) {
      const allCorrect = assembled.every((item, i) => item.w.toLowerCase() === current.words[i]?.toLowerCase());
      if (allCorrect) {
        setCompleted(true);
        setScore(s => s + 1);
        setTotal(t => t + 1);
        speakText(current.words.join(" "), 0.85);
        // Auto-advance after 1.2 seconds
        setTimeout(() => loadFromQueue(current.id, errorCounts), 1200);
      } else if (!mistakeOnCurrent) {
        setMistakeOnCurrent(true);
        setErrorCounts(prev => ({ ...prev, [current.id]: Math.min((prev[current.id] || 0) + 1, 3) }));
      }
    }
  }, [assembled, current]);

  const addWord = (item) => { if (completed) return; setAssembled(prev => [...prev, item]); setWordBank(prev => prev.filter(w => w.key !== item.key)); };
  const removeWord = (item) => { if (completed) return; setAssembled(prev => prev.filter(w => w.key !== item.key)); setWordBank(prev => shuffleArr([...prev, item])); };
  const reset = () => { setWordBank(shuffleArr(current.words.map((w, i) => ({ w, key: i })))); setAssembled([]); setCompleted(false); };

  if (!current) return <div style={{ color: "#555", textAlign: "center", padding: 40 }}>Загрузка...</div>;

  const accuracy = total > 0 ? Math.round(score / total * 100) : 0;
  const errCount = errorCounts[current.id] || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[{ label: "Правильно", value: score, color: "#00ff88" }, { label: "Точность", value: accuracy + "%", color: "#4488ff" }, { label: "Всего", value: total, color: "#888" }].map(s => (
          <div key={s.label} style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
            <div style={{ color: s.color, fontSize: 20, fontWeight: 800 }}>{s.value}</div>
            <div style={{ color: "#555", fontSize: 10, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {["A2","B1","B2"].map(lvl => {
          const lc = lvl === "A2" ? "#4488ff" : lvl === "B1" ? "#00ff88" : "#cc44ff";
          return <button key={lvl} onClick={() => setLevelFilter(lvl)} style={{ background: levelFilter === lvl ? lc + "20" : "#0d1117", border: `1px solid ${levelFilter === lvl ? lc + "60" : "#ffffff15"}`, borderRadius: 10, padding: "7px 16px", color: levelFilter === lvl ? lc : "#555", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>{lvl}</button>;
        })}
        <div style={{ marginLeft: "auto", color: "#555", fontSize: 11, display: "flex", alignItems: "center" }}>{filtered.length} предложений</div>
      </div>
      <div style={{ background: "#0d1117", border: "1px solid #ffffff08", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "#555", fontSize: 12 }}>🇷🇺 {current.hint}</span>
        {errCount > 0 && <span style={{ background: errCount >= 2 ? "#ff444420" : "#ff8c0020", border: `1px solid ${errCount >= 2 ? "#ff444440" : "#ff8c0040"}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: errCount >= 2 ? "#ff4444" : "#ff8c00", fontWeight: 700 }}>{errCount === 1 ? "⚠️ повторяем" : "🔥 прорабатываем"}</span>}
        <button onClick={() => { speakText(current.words.join(" "), 0.8); setListened(true); }} style={{ marginLeft: "auto", background: listened ? "#003300" : "#001a33", border: `1px solid ${listened ? "#00ff8840" : "#4488ff40"}`, borderRadius: 8, padding: "6px 12px", color: listened ? "#00ff88" : "#4488ff", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
          {listened ? "🔊 Ещё раз" : "▶ Слушать"}
        </button>
      </div>
      <div style={{ minHeight: 64, background: completed ? "#0a2a0a" : "#0a0a1a", border: `1px solid ${completed ? "#00ff8860" : "#ffffff15"}`, borderRadius: 16, padding: "14px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", transition: "all 0.3s" }}>
        {assembled.length === 0 && <span style={{ color: "#333", fontSize: 13 }}>Нажимай слова снизу чтобы собрать предложение...</span>}
        {assembled.map((item, i) => {
          const status = getWordStatus(item, i);
          const bg = status === "correct" ? "#00ff8820" : status === "wrong" ? "#ff444420" : "#1a1a2e";
          const border = status === "correct" ? "#00ff8860" : status === "wrong" ? "#ff444460" : "#4444aa60";
          const color = status === "correct" ? "#00ff88" : status === "wrong" ? "#ff4444" : "#aaaaff";
          return <button key={item.key} onClick={() => removeWord(item)} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "7px 12px", color, fontSize: 14, fontWeight: 600, cursor: completed ? "default" : "pointer", transition: "all 0.2s" }}>{item.w}</button>;
        })}
        {completed && <span style={{ marginLeft: "auto", fontSize: 20 }}>🎉</span>}
      </div>
      {completed && (
        <div style={{ background: "linear-gradient(135deg,#0a2a0a,#061406)", border: "1px solid #00ff8840", borderRadius: 14, padding: "14px 18px", animation: "fadeIn 0.3s ease" }}>
          <div style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Перевод</div>
          <div style={{ color: "#00ff88", fontSize: 18, fontWeight: 700 }}>{current.hint}</div>
          <div style={{ color: "#444", fontSize: 12, marginTop: 4 }}>{current.words.join(" ")}</div>
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, minHeight: 44 }}>
        {wordBank.map(item => (
          <button key={item.key} onClick={() => addWord(item)} style={{ background: "#161b22", border: "1px solid #ffffff20", borderRadius: 8, padding: "7px 12px", color: "#ddd", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: completed ? 0.3 : 1 }}
            onMouseOver={e => { if (!completed) { e.currentTarget.style.background = "#1e2530"; e.currentTarget.style.borderColor = "#4488ff50"; }}}
            onMouseOut={e => { e.currentTarget.style.background = "#161b22"; e.currentTarget.style.borderColor = "#ffffff20"; }}>{item.w}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {completed ? (
          <div style={{ textAlign: "center", color: "#00ff88", fontSize: 13, padding: "8px", animation: "fadeIn 0.2s ease" }}>✓ Отлично! Следующее...</div>
        ) : (
          <>
            <button onClick={reset} style={{ flex: 1, background: "#0d1117", border: "1px solid #333", borderRadius: 12, padding: "13px", color: "#666", cursor: "pointer", fontSize: 13 }}>↺ Сбросить</button>
            <button onClick={() => { setTotal(t => t + 1); loadFromQueue(current.id, errorCounts); }} style={{ background: "#0d1117", border: "1px solid #333", borderRadius: 12, padding: "13px 16px", color: "#444", cursor: "pointer", fontSize: 13 }}>Пропустить</button>
          </>
        )}
      </div>
      {!completed && assembled.length >= 3 && assembled.filter((item, i) => getWordStatus(item, i) === "wrong").length >= 2 && (
        <div style={{ background: "#0a0a1a", border: "1px solid #4444ff20", borderRadius: 12, padding: "12px 16px" }}>
          <div style={{ color: "#444", fontSize: 11, marginBottom: 6 }}>Подсказка:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {current.words.map((w, i) => <span key={i} style={{ background: "#00ff8808", border: "1px solid #00ff8820", borderRadius: 6, padding: "4px 10px", color: "#00ff8870", fontSize: 12 }}>{w}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── READING MODULE ───────────────────────────────────────────────────────────

function highlightPhrases(text, words) {
  const phrases = [...words].sort((a, b) => b.word.length - a.word.length);
  let segments = [{ text, phrase: null }];
  for (const w of phrases) {
    const newSegs = [];
    for (const seg of segments) {
      if (seg.phrase !== null) { newSegs.push(seg); continue; }
      const lw = w.word.toLowerCase();
      let rest = seg.text;
      while (true) {
        const found = rest.toLowerCase().indexOf(lw);
        if (found === -1) { newSegs.push({ text: rest, phrase: null }); break; }
        if (found > 0) newSegs.push({ text: rest.slice(0, found), phrase: null });
        newSegs.push({ text: rest.slice(found, found + w.word.length), phrase: w });
        rest = rest.slice(found + w.word.length);
      }
    }
    segments = newSegs;
  }
  return segments;
}

function ReadingModule({ studiedCards }) {
  const [topic, setTopic] = useState(null);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePhrase, setActivePhrase] = useState(null);
  const wordsToUse = studiedCards && studiedCards.length >= 4 ? studiedCards : null;

  const generate = async (t) => {
    setTopic(t);
    setStory(null);
    setActivePhrase(null);
    stopSpeak();
    setLoading(true);
    const s = await generateStory(wordsToUse, t.label);
    setStory(s);
    setLoading(false);
  };

  const handlePhraseClick = (phrase) => {
    setActivePhrase(prev => prev?.word === phrase.word ? null : phrase);
    speakText(phrase.word, 0.85);
  };

  if (!wordsToUse) return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
      <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Сначала изучи карточки</div>
      <div style={{ color: "#888", fontSize: 13, lineHeight: 1.7 }}>Перейди на вкладку <b style={{ color: "#00ff88" }}>🧠 Слова</b> и повтори хотя бы 4 фразы.</div>
    </div>
  );

  if (!topic) return (
    <div>
      <div style={{ color: "#888", fontSize: 13, marginBottom: 6 }}>Выбери тему — Claude напишет рассказ с твоими фразами:</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
        {READING_TOPICS.map(t => (
          <button key={t.id} onClick={() => generate(t)} style={{ background: "#0d1117", border: "1px solid #ffffff15", borderRadius: 14, padding: "16px 14px", cursor: "pointer", textAlign: "left" }}
            onMouseOver={e => { e.currentTarget.style.border = "1px solid #cc44ff50"; e.currentTarget.style.background = "#0d0a1a"; }}
            onMouseOut={e => { e.currentTarget.style.border = "1px solid #ffffff15"; e.currentTarget.style.background = "#0d1117"; }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{t.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const foundPhrases = story ? wordsToUse.filter(w => story.toLowerCase().includes(w.word.toLowerCase())) : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>{topic.icon}</span>
        <span style={{ color: "#fff", fontWeight: 700 }}>{topic.label}</span>
        <button onClick={() => setTopic(null)} style={{ marginLeft: "auto", background: "none", border: "1px solid #333", color: "#888", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>← темы</button>
        {story && <button onClick={() => generate(topic)} style={{ background: "none", border: "1px solid #cc44ff40", color: "#cc44ff", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>🔄 новый</button>}
      </div>
      {loading && <div style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 16, padding: 28, textAlign: "center" }}><div style={{ color: "#cc44ff", fontSize: 13 }}>✍️ Claude пишет рассказ...</div></div>}
      {story && !loading && (
        <>
          {splitIntoParagraphs(story).map((para, pi) => {
            const segs = highlightPhrases(para, wordsToUse);
            return (
              <div key={pi} style={{ background: "#0d1117", border: "1px solid #ffffff12", borderRadius: 16, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ color: "#333", fontSize: 10, fontFamily: "monospace" }}>#{pi + 1}</span>
                  <button onClick={() => speakText(para, 0.75)} style={{ background: "#cc44ff15", border: "1px solid #cc44ff30", borderRadius: 8, padding: "4px 12px", color: "#cc88ff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>▶ Читать</button>
                  <button onClick={stopSpeak} style={{ background: "#1a0a0a", border: "1px solid #ff444430", borderRadius: 8, padding: "4px 10px", color: "#ff6666", fontSize: 12, cursor: "pointer" }}>⏹ Стоп</button>
                  <button onClick={() => speakText(para, 0.55)} style={{ background: "#0a1a0a", border: "1px solid #00ff8820", borderRadius: 8, padding: "4px 10px", color: "#00ff8870", fontSize: 11, cursor: "pointer" }}>🐢 Медленно</button>
                </div>
                <div style={{ lineHeight: 2, fontSize: 15, color: "#ddd" }}>
                  {segs.map((seg, i) =>
                    seg.phrase ? (
                      <span key={i} onClick={() => handlePhraseClick(seg.phrase)} style={{ background: activePhrase?.word === seg.phrase.word ? "#cc44ff30" : "#cc44ff15", border: `1px solid ${activePhrase?.word === seg.phrase.word ? "#cc44ff80" : "#cc44ff40"}`, borderRadius: 6, padding: "1px 5px", cursor: "pointer", color: activePhrase?.word === seg.phrase.word ? "#fff" : "#cc88ff", fontWeight: 600 }}>{seg.text}</span>
                    ) : <span key={i}>{seg.text}</span>
                  )}
                </div>
              </div>
            );
          })}
          {activePhrase && (
            <div style={{ background: "linear-gradient(135deg,#1a0a2a,#0d0617)", border: "1px solid #cc44ff40", borderRadius: 14, padding: "14px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ color: "#cc88ff", fontWeight: 700, fontSize: 15 }}>{activePhrase.word}</span>
                <button onClick={() => speakText(activePhrase.word)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>🔊</button>
                <span style={{ color: "#666", fontSize: 12, fontFamily: "monospace" }}>{activePhrase.transcription}</span>
                <button onClick={() => setActivePhrase(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16 }}>×</button>
              </div>
              <div style={{ color: "#00ff88", fontSize: 13, marginBottom: 4 }}>{activePhrase.translation}</div>
              <div style={{ color: "#666", fontSize: 12, fontStyle: "italic" }}>{activePhrase.example}</div>
            </div>
          )}
          <div style={{ background: "#0a0a0f", border: "1px solid #ffffff08", borderRadius: 12, padding: "12px 16px" }}>
            <div style={{ color: "#555", fontSize: 10, marginBottom: 8, textTransform: "uppercase", letterSpacing: 2 }}>Фразы в тексте: {foundPhrases.length}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {foundPhrases.map(p => <span key={p.word} onClick={() => handlePhraseClick(p)} style={{ background: "#cc44ff15", border: "1px solid #cc44ff30", borderRadius: 8, padding: "3px 9px", fontSize: 11, color: "#cc88ff", cursor: "pointer" }}>{p.word}</span>)}
            </div>
          </div>

          <div style={{ background: "#0a0a1a", border: "1px solid #cc44ff20", borderRadius: 12, padding: "10px 16px", fontSize: 12, color: "#666", display: "flex", alignItems: "center", gap: 8 }}>
            <span>🎙️</span>
            <span>Shadowing: нажми ▶ и повторяй вслух за голосом — копируй ритм и интонацию</span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── DIARY MODULE ─────────────────────────────────────────────────────────────

function DiaryModule() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState(() => { try { return JSON.parse(localStorage.getItem("diary_entries") || "[]"); } catch { return []; } });
  const [addedPhrases, setAddedPhrases] = useState(() => { try { return JSON.parse(localStorage.getItem("diary_added") || "[]"); } catch { return []; } });
  const [view, setView] = useState("write");

  const isInDeck = (phrase) => {
    try {
      const existing = JSON.parse(localStorage.getItem("srs_v5") || "[]");
      return existing.some(c => c.word === phrase);
    } catch { return false; }
  };

  const addToCards = (phrase, translation) => {
    if (addedPhrases.includes(phrase)) return;
    const existing = JSON.parse(localStorage.getItem("srs_v5") || "[]");
    if (existing.some(c => c.word === phrase)) {
      // Already in deck — just mark as added so button shows correctly
      setAddedPhrases(prev => { const n = [...prev, phrase]; localStorage.setItem("diary_added", JSON.stringify(n)); return n; });
      return;
    }
    const ru = translation && translation !== phrase ? translation : "";
    const newCard = { word: phrase, transcription: "", translation: ru, example: phrase, cefr: "A2", category: "Мой дневник", id: Date.now() + Math.random(), srsLevel: 0, nextReview: Date.now(), reviewed: 0, unlocked: true };
    localStorage.setItem("srs_v5", JSON.stringify([...existing, newCard]));
    setAddedPhrases(prev => { const n = [...prev, phrase]; localStorage.setItem("diary_added", JSON.stringify(n)); return n; });
  };

  const save = (entry) => { const u = [entry, ...entries].slice(0, 30); setEntries(u); try { localStorage.setItem("diary_entries", JSON.stringify(u)); } catch {} };

  const submit = async () => {
    if (!text.trim() || text.trim().length < 10) return;
    setLoading(true); setFeedback(null);
    const sys = `You are a friendly English teacher correcting a Russian learner's diary entry.
Respond in this EXACT format:

✅ ОБЩАЯ ОЦЕНКА
[2-3 sentences in Russian praising what's good]

🔧 ИСПРАВЛЕНИЯ
[Each correction: ❌ original → ✅ corrected | RU: русский перевод исправленной фразы]
If no errors: Ошибок не найдено!

💬 УЛУЧШЕНИЯ СТИЛЯ
[2-3 suggestions in Russian with examples]

📝 ИСПРАВЛЕННЫЙ ТЕКСТ
[Full corrected version]`;
    const reply = await callClaude([{ role: "user", content: text }], sys);
    save({ date: new Date().toLocaleDateString("ru-RU"), text, feedback: reply });
    setFeedback(reply);
    setLoading(false);
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  if (view === "history") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => setView("write")} style={{ background: "none", border: "1px solid #333", color: "#888", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>← написать</button>
        <span style={{ color: "#fff", fontWeight: 700 }}>История ({entries.length})</span>
      </div>
      {entries.length === 0 && <div style={{ color: "#555", textAlign: "center", padding: 30 }}>Записей пока нет</div>}
      {entries.map((e, i) => (
        <div key={i} style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ color: "#555", fontSize: 11, marginBottom: 6 }}>{e.date}</div>
          <div style={{ color: "#ccc", fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>{e.text}</div>
          {e.feedback && <details><summary style={{ color: "#4488ff", fontSize: 12, cursor: "pointer" }}>Показать исправления</summary><div style={{ color: "#aaa", fontSize: 12, lineHeight: 1.8, marginTop: 8, whiteSpace: "pre-wrap" }}>{e.feedback}</div></details>}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div><div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Языковой дневник</div><div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>Пиши на английском — Claude исправит</div></div>
        {entries.length > 0 && <button onClick={() => setView("history")} style={{ background: "none", border: "1px solid #333", color: "#888", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 11 }}>История ({entries.length})</button>}
      </div>
      <div style={{ background: "#0d1117", border: "1px solid #ffffff08", borderRadius: 12, padding: "12px 14px" }}>
        <div style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Идеи для записи:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["Опиши своё утро", "Что ты узнал сегодня?", "Расскажи о своём проекте", "Твои планы на завтра", "Опиши свою музыку"].map(p => (
            <button key={p} onClick={() => setText(prev => prev ? prev + " " + p + "." : p + ". ")} style={{ background: "#161b22", border: "1px solid #ffffff10", borderRadius: 8, padding: "4px 10px", color: "#666", fontSize: 11, cursor: "pointer" }}>{p}</button>
          ))}
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write in English here... Even a few sentences is great!" style={{ width: "100%", minHeight: 130, background: "#0d1117", border: "1px solid #ffffff20", borderRadius: 14, padding: "12px 14px", color: "#fff", fontSize: 14, lineHeight: 1.7, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
        <div style={{ position: "absolute", bottom: 10, right: 12, color: wordCount >= 30 ? "#00ff88" : "#444", fontSize: 11 }}>{wordCount} слов {wordCount >= 30 ? "✓" : "(цель: 30)"}</div>
      </div>
      <button onClick={submit} disabled={loading || text.trim().length < 10} style={{ background: loading || text.trim().length < 10 ? "#1a1a1a" : "linear-gradient(135deg,#4444ff,#2222cc)", border: "none", borderRadius: 14, padding: "12px", color: loading || text.trim().length < 10 ? "#444" : "#fff", fontWeight: 700, cursor: loading || text.trim().length < 10 ? "not-allowed" : "pointer", fontSize: 14 }}>
        {loading ? "✍️ Claude проверяет..." : "📝 Получить обратную связь"}
      </button>
      {feedback && (
        <div style={{ background: "#0a0a1a", border: "1px solid #4444ff30", borderRadius: 16, padding: "16px", animation: "fadeIn 0.3s ease" }}>
          <div style={{ color: "#4488ff", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Обратная связь</div>
          <div style={{ color: "#bbb", fontSize: 13, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{feedback}</div>
          {(() => {
            const corrections = [];
            feedback.split("\n").forEach(line => {
              // Match: ❌ wrong → ✅ corrected | RU: перевод
              const m = line.match(/❌.+?→\s*✅\s*(.+?)(?:\s*\|\s*RU:\s*(.+?))?(?:\s*\(|$)/);
              if (m) {
                const phrase = m[1].trim().replace(/^["']|["']$/g, "");
                const translation = m[2] ? m[2].trim() : "";
                if (phrase.length > 2 && phrase.length < 80 && !phrase.includes("ОЦЕНКА") && !phrase.includes("ИСПРАВЛ")) {
                  corrections.push({ phrase, translation });
                }
              }
            });
            if (!corrections.length) return null;
            return (
              <div style={{ marginTop: 14, borderTop: "1px solid #ffffff10", paddingTop: 14 }}>
                <div style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Добавить в словарь:</div>
                {corrections.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "#0d1117", border: "1px solid #ffffff08", borderRadius: 10, padding: "8px 12px", marginBottom: 6 }}>
                    <span style={{ color: "#00ff88", fontSize: 13, flex: 1 }}>{c}</span>
                    <button onClick={() => addToCards(c)} disabled={addedPhrases.includes(c)} style={{ background: addedPhrases.includes(c) ? "#003300" : "#00ff8820", border: `1px solid ${addedPhrases.includes(c) ? "#00ff8860" : "#00ff8840"}`, borderRadius: 8, padding: "4px 12px", color: addedPhrases.includes(c) ? "#00ff88" : "#00cc66", fontSize: 11, fontWeight: 700, cursor: addedPhrases.includes(c) ? "default" : "pointer" }}>
                      {addedPhrases.includes(c) ? "✓ Добавлено" : "+ В словарь"}
                    </button>
                  </div>
                ))}
              </div>
            );
          })()}
          <button onClick={() => { setText(""); setFeedback(null); }} style={{ marginTop: 12, background: "none", border: "1px solid #333", color: "#666", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12 }}>Написать следующую запись</button>
        </div>
      )}
    </div>
  );
}

// ─── NEWS MODULE ──────────────────────────────────────────────────────────────

function NewsModule() {
  const [topic, setTopic] = useState(null);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retelling, setRetelling] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [checkLoading, setCheckLoading] = useState(false);
  const [addedWords, setAddedWords] = useState([]);

  const TOPICS = [
    { id: "tech", label: "Технологии", icon: "💻" },
    { id: "science", label: "Наука", icon: "🔬" },
    { id: "business", label: "Бизнес", icon: "📈" },
    { id: "ai", label: "AI", icon: "🤖" },
    { id: "world", label: "Мир", icon: "🌍" },
  ];

  const loadArticle = async (t) => {
    setTopic(t); setArticle(null); setFeedback(null); setRetelling(""); setLoading(true);
    const sys = `You are a news writer creating simplified English news for B1 learners.
Write a SHORT news article (4-5 sentences only) about: ${t.label}.
FORMAT exactly:
HEADLINE: [short headline]
TEXT: [4-5 simple sentences, B1 level]
KEY WORDS: [3-4 words: word — перевод]`;
    const reply = await callClaude([{ role: "user", content: "Write the news article now." }], sys);
    setArticle(reply); setLoading(false);
  };

  const checkRetelling = async () => {
    if (!retelling.trim() || retelling.trim().length < 10) return;
    setCheckLoading(true); setFeedback(null);
    const sys = `You are an English teacher. A B1 Russian learner read this article:\n${article}\nAnd wrote: "${retelling}"\n\nRespond in this EXACT format:\n✅ ПОНЯЛ ПРАВИЛЬНО\n[Russian, 1-2 sentences praising what they understood]\n\n🔧 ИСПРАВЛЕНИЯ\n[Each error: ❌ wrong phrase → ✅ corrected phrase (brief Russian explanation)]\nIf no errors write: Ошибок нет!\n\n💡 НОВЫЕ СЛОВА\n[2-3 useful phrases from the article: phrase — перевод]\n\nDo NOT add any retelling or rewrite of the text. Keep it short and focused.`;
    const reply = await callClaude([{ role: "user", content: retelling }], sys);
    setFeedback(reply); setCheckLoading(false);
  };

  const addToCards = (word, translation) => {
    if (addedWords.includes(word)) return;
    const existing = JSON.parse(localStorage.getItem("srs_v5") || "[]");
    const newCard = { word, transcription: "", translation, example: word, cefr: "B1", category: "Новости", id: Date.now() + Math.random(), srsLevel: 0, nextReview: Date.now(), reviewed: 0, unlocked: true };
    localStorage.setItem("srs_v5", JSON.stringify([...existing, newCard]));
    setAddedWords(prev => [...prev, word]);
  };

  const parseArticle = (text) => {
    const headline = text.match(/HEADLINE:\s*(.+)/)?.[1]?.trim() || "";
    const bodyMatch = text.match(/TEXT:\s*([\s\S]+?)(?=KEY WORDS:|$)/);
    const body = bodyMatch?.[1]?.trim() || "";
    const kwMatch = text.match(/KEY WORDS:\s*([\s\S]+?)$/);
    const kwRaw = kwMatch?.[1]?.trim() || "";
    const keyWords = kwRaw.split("\n")
      .filter(l => l.includes("—") && l.trim().length > 3)
      .slice(0, 4)
      .map(l => {
        const parts = l.split("—").map(s => s.trim().replace(/^[\d.\-\*\s]+/, ""));
        return { word: parts[0], translation: parts[1] || "" };
      })
      .filter(kw => kw.word && kw.word.length > 1 && kw.word.length < 40);
    return { headline, body, keyWords };
  };

  const wordCount = retelling.trim().split(/\s+/).filter(Boolean).length;

  if (!topic) return (
    <div>
      <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>📰 Новости</div>
      <div style={{ color: "#555", fontSize: 12, marginBottom: 18 }}>Читай короткие новости → пересказывай → получай исправления</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {TOPICS.map(t => (
          <button key={t.id} onClick={() => loadArticle(t)} style={{ background: "#0d1117", border: "1px solid #ffffff15", borderRadius: 14, padding: "16px 14px", cursor: "pointer", textAlign: "left" }}
            onMouseOver={e => { e.currentTarget.style.border = "1px solid #ff8c0050"; e.currentTarget.style.background = "#1a1000"; }}
            onMouseOut={e => { e.currentTarget.style.border = "1px solid #ffffff15"; e.currentTarget.style.background = "#0d1117"; }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{t.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) return <div style={{ textAlign: "center", padding: 40 }}><div style={{ color: "#ff8c00", fontSize: 13 }}>📰 Загружаю новость...</div></div>;

  const parsed = article ? parseArticle(article) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>{topic.icon}</span>
        <span style={{ color: "#fff", fontWeight: 700 }}>{topic.label}</span>
        <button onClick={() => setTopic(null)} style={{ marginLeft: "auto", background: "none", border: "1px solid #333", color: "#888", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>← темы</button>
        {article && <button onClick={() => loadArticle(topic)} style={{ background: "none", border: "1px solid #ff8c0040", color: "#ff8c00", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>🔄 новая</button>}
      </div>
      {parsed && (
        <>
          <div style={{ background: "#0d1117", border: "1px solid #ffffff12", borderRadius: 16, padding: "16px 18px" }}>
            <div style={{ color: "#ff8c00", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Новость</div>
            <div style={{ color: "#fff", fontSize: 16, fontWeight: 800, marginBottom: 10, lineHeight: 1.4 }}>{parsed.headline}</div>
            <div style={{ color: "#ddd", fontSize: 14, lineHeight: 1.9 }}>{parsed.body}</div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button onClick={() => speakText(parsed.headline + ". " + parsed.body, 0.8)} style={{ background: "#ff8c0015", border: "1px solid #ff8c0030", borderRadius: 8, padding: "5px 12px", color: "#ff8c00", fontSize: 12, cursor: "pointer" }}>▶ Читать</button>
              <button onClick={() => speakText(parsed.headline + ". " + parsed.body, 0.6)} style={{ background: "#0a1a0a", border: "1px solid #00ff8820", borderRadius: 8, padding: "5px 10px", color: "#00ff8870", fontSize: 11, cursor: "pointer" }}>🐢 Медленно</button>
              <button onClick={stopSpeak} style={{ background: "#1a0a0a", border: "1px solid #ff444430", borderRadius: 8, padding: "5px 10px", color: "#ff6666", fontSize: 11, cursor: "pointer" }}>⏹ Стоп</button>
            </div>
          </div>
          {parsed.keyWords.length > 0 && (
            <div style={{ background: "#0a0a0f", border: "1px solid #ffffff08", borderRadius: 12, padding: "12px 16px" }}>
              <div style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Ключевые слова</div>
              {parsed.keyWords.map((kw, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ color: "#ff8c00", fontWeight: 700, fontSize: 13, minWidth: 100 }}>{kw.word}</span>
                  <span style={{ color: "#666", fontSize: 12 }}>{kw.translation}</span>
                  <button onClick={() => addToCards(kw.word, kw.translation)} disabled={addedWords.includes(kw.word)} style={{ marginLeft: "auto", background: addedWords.includes(kw.word) ? "#003300" : "#00ff8810", border: `1px solid ${addedWords.includes(kw.word) ? "#00ff8840" : "#00ff8820"}`, borderRadius: 6, padding: "3px 10px", color: addedWords.includes(kw.word) ? "#00ff88" : "#00cc66", fontSize: 10, fontWeight: 700, cursor: addedWords.includes(kw.word) ? "default" : "pointer" }}>
                    {addedWords.includes(kw.word) ? "✓" : "+ в словарь"}
                  </button>
                </div>
              ))}
            </div>
          )}
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Перескажи своими словами</div>
            <div style={{ color: "#555", fontSize: 11, marginBottom: 10 }}>Не нужно точно — напиши что понял. Хоть 2-3 предложения.</div>
            <div style={{ position: "relative" }}>
              <textarea value={retelling} onChange={e => setRetelling(e.target.value)} placeholder="Write what you understood from the news..." style={{ width: "100%", minHeight: 90, background: "#0d1117", border: "1px solid #ffffff20", borderRadius: 14, padding: "12px 14px", color: "#fff", fontSize: 14, lineHeight: 1.7, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
              <div style={{ position: "absolute", bottom: 10, right: 12, color: wordCount >= 15 ? "#00ff88" : "#444", fontSize: 11 }}>{wordCount} слов</div>
            </div>
            <button onClick={checkRetelling} disabled={checkLoading || retelling.trim().length < 10} style={{ marginTop: 10, width: "100%", background: checkLoading || retelling.trim().length < 10 ? "#1a1a1a" : "linear-gradient(135deg,#ff8c00,#cc6600)", border: "none", borderRadius: 12, padding: "12px", color: checkLoading || retelling.trim().length < 10 ? "#444" : "#fff", fontWeight: 700, cursor: checkLoading || retelling.trim().length < 10 ? "not-allowed" : "pointer", fontSize: 14 }}>
              {checkLoading ? "✍️ Проверяю..." : "Проверить пересказ →"}
            </button>
          </div>
          {feedback && (
            <div style={{ background: "#0a0a1a", border: "1px solid #ff8c0020", borderRadius: 16, padding: "16px" }}>
              <div style={{ color: "#ff8c00", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Обратная связь</div>
              <div style={{ color: "#bbb", fontSize: 13, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{feedback}</div>

              {/* Add new words to deck */}
              {(() => {
                const newWords = [];
                const lines = feedback.split("\n");
                let inNewWords = false;
                lines.forEach(line => {
                  if (line.includes("💡") && line.includes("СЛОВА")) { inNewWords = true; return; }
                  if (line.includes("✅") || line.includes("🔧") || line.includes("📝") || line.trim() === "") { if (inNewWords && line.trim() !== "") inNewWords = false; }
                  if (inNewWords && line.includes("—")) {
                    const parts = line.split("—").map(s => s.trim().replace(/^[\d.\-\*\s]+/, ""));
                    if (parts[0] && parts[0].length > 1 && parts[0].length < 50) {
                      newWords.push({ word: parts[0], translation: parts[1] || "" });
                    }
                  }
                });
                if (!newWords.length) return null;
                return (
                  <div style={{ marginTop: 14, borderTop: "1px solid #ffffff10", paddingTop: 14 }}>
                    <div style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Сохранить новые слова:</div>
                    {newWords.map((w, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "#0d1117", border: "1px solid #ffffff08", borderRadius: 10, padding: "8px 12px", marginBottom: 6 }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ color: "#ff8c00", fontWeight: 700, fontSize: 13 }}>{w.word}</span>
                          {w.translation && <span style={{ color: "#666", fontSize: 12, marginLeft: 8 }}>{w.translation}</span>}
                        </div>
                        <button onClick={() => addToCards(w.word, w.translation)} disabled={addedWords.includes(w.word)}
                          style={{ background: addedWords.includes(w.word) ? "#003300" : "#00ff8810", border: `1px solid ${addedWords.includes(w.word) ? "#00ff8840" : "#00ff8820"}`, borderRadius: 8, padding: "4px 12px", color: addedWords.includes(w.word) ? "#00ff88" : "#00cc66", fontSize: 11, fontWeight: 700, cursor: addedWords.includes(w.word) ? "default" : "pointer" }}>
                          {addedWords.includes(w.word) ? "✓" : "+ в словарь"}
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
}


// ─── PHRASE HUNT MODULE ───────────────────────────────────────────────────────

// HUNT_TEXTS removed - now generated dynamically

function PhraseHuntModule({ studiedCards }) {
  const [huntText, setHuntText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState([]);
  const [finished, setFinished] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const wordsToUse = studiedCards && studiedCards.length >= 4 ? studiedCards : FREQ_WORDS.slice(0, 10);

  const generateHuntText = async () => {
    setLoading(true);
    setHuntText(null);
    setFound([]);
    setFinished(false);
    setShowResult(false);

    const phraseList = wordsToUse.map(w => `"${w.word}"`).join(", ");
    const sys = `You are writing a short English text for a language learning game.
Write a natural paragraph (5-6 sentences, B1 level) that includes AT LEAST 5 of these exact phrases: ${phraseList}
Use the phrases EXACTLY as written.
Output ONLY the paragraph text, nothing else.`;

    const reply = await callClaude([{ role: "user", content: "Write the paragraph now." }], sys);
    setHuntText(reply.trim());
    setLoading(false);
  };

  // Auto-generate on mount
  useEffect(() => { generateHuntText(); }, []);

  const hiddenPhrases = huntText
    ? wordsToUse.filter(w => huntText.toLowerCase().includes(w.word.toLowerCase()))
    : [];

  const tokenize = (text) => {
    if (!text) return [];
    const tokens = [];
    let i = 0;
    const sorted = [...hiddenPhrases].sort((a, b) => b.word.length - a.word.length);
    while (i < text.length) {
      let matched = null;
      for (const w of sorted) {
        if (text.slice(i).toLowerCase().startsWith(w.word.toLowerCase())) {
          matched = { text: text.slice(i, i + w.word.length), phrase: w };
          break;
        }
      }
      if (matched) {
        tokens.push(matched);
        i += matched.text.length;
      } else {
        if (tokens.length > 0 && !tokens[tokens.length - 1].phrase) {
          tokens[tokens.length - 1].text += text[i];
        } else {
          tokens.push({ text: text[i], phrase: null });
        }
        i++;
      }
    }
    return tokens;
  };

  const tokens = huntText ? tokenize(huntText) : [];

  const handleClick = (token) => {
    if (finished || !token.phrase) return;
    const word = token.phrase.word;
    if (found.includes(word)) return;
    const newFound = [...found, word];
    setFound(newFound);
    speakText(word, 0.85);
    if (newFound.length >= hiddenPhrases.length) {
      setTotalScore(prev => prev + newFound.length);
      setFinished(true);
      setShowResult(true);
    }
  };

  const nextText = () => { generateHuntText(); };

  const giveUp = () => {
    setTotalScore(prev => prev + found.length);
    setFinished(true);
    setShowResult(true);
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div style={{ color: "#ff8c00", fontSize: 13, animation: "pulse 1.2s infinite" }}>✍️ Генерирую текст с твоими фразами...</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>🔍 Найди фразу</div>
          <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>Нажимай на фразы которые узнаёшь</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ color: "#ff8c00", fontSize: 13, fontWeight: 700 }}>⚡ {totalScore}</div>
          <div style={{ color: "#555", fontSize: 10 }}>всего очков</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, height: 4, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#00ff88", borderRadius: 2, width: `${(found.length / Math.max(hiddenPhrases.length, 1)) * 100}%`, transition: "width 0.3s" }} />
        </div>
        <span style={{ color: "#00ff88", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
          {found.length} / {hiddenPhrases.length}
        </span>
      </div>

      {/* Text */}
      <div style={{ background: "#0d1117", border: "1px solid #ffffff12", borderRadius: 16, padding: "20px 18px", lineHeight: 2.2, fontSize: 15 }}>
        {tokens.map((token, i) => {
          const isFound = token.phrase && found.includes(token.phrase.word);
          const isHidden = token.phrase && !found.includes(token.phrase.word);
          const isFinishedHidden = finished && isHidden;

          return (
            <span
              key={i}
              onClick={() => handleClick(token)}
              style={{
                cursor: token.phrase && !found.includes(token.phrase?.word) && !finished ? "pointer" : "default",
                background: isFound ? "#00ff8825" : isFinishedHidden ? "#ff8c0015" : "transparent",
                border: isFound ? "1px solid #00ff8860" : isFinishedHidden ? "1px solid #ff8c0040" : "1px solid transparent",
                borderRadius: 6,
                padding: isFound || isFinishedHidden ? "1px 4px" : "1px 0",
                color: isFound ? "#00ff88" : isFinishedHidden ? "#ff8c0080" : "#ddd",
                fontWeight: isFound ? 700 : 400,
                transition: "all 0.2s",
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>

      {/* Result */}
      {showResult && (
        <div style={{ background: found.length === hiddenPhrases.length ? "#0a2a0a" : "#0a0a1a", border: `1px solid ${found.length === hiddenPhrases.length ? "#00ff8840" : "#ff8c0030"}`, borderRadius: 14, padding: "14px 18px", animation: "fadeIn 0.3s ease" }}>
          <div style={{ color: found.length === hiddenPhrases.length ? "#00ff88" : "#ff8c00", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
            {found.length === hiddenPhrases.length ? "🎉 Все фразы найдены!" : `Нашёл ${found.length} из ${hiddenPhrases.length}`}
          </div>
          {found.length < hiddenPhrases.length && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ color: "#555", fontSize: 11, marginBottom: 6 }}>Пропущенные фразы:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {hiddenPhrases.filter(p => !found.includes(p.word)).map(p => (
                  <span key={p.word} style={{ background: "#ff8c0015", border: "1px solid #ff8c0030", borderRadius: 8, padding: "3px 10px", fontSize: 12, color: "#ff8c00" }}>
                    {p.word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hint */}
      {!finished && hiddenPhrases.length > 0 && (
        <div style={{ background: "#0a0a0f", border: "1px solid #ffffff06", borderRadius: 10, padding: "8px 14px", fontSize: 11, color: "#444", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>В тексте спрятано {hiddenPhrases.length} твоих фраз</span>
          <button onClick={giveUp} style={{ background: "none", border: "none", color: "#333", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>Показать ответы</button>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        {finished ? (
          <button onClick={nextText} style={{ flex: 1, background: "linear-gradient(135deg,#00cc66,#008844)", border: "none", borderRadius: 12, padding: "13px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            Следующий текст →
          </button>
        ) : (
          <button onClick={nextText} style={{ flex: 1, background: "#0d1117", border: "1px solid #333", borderRadius: 12, padding: "13px", color: "#666", cursor: "pointer", fontSize: 13 }}>
            Другой текст
          </button>
        )}
      </div>

    </div>
  );
}

// ─── CHAT MODULE ──────────────────────────────────────────────────────────────

function ChatModule() {
  const [scenario, setScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const startScenario = async (sc) => {
    setScenario(sc); setMessages([]); setLoading(true);
    const sys = `You are an English language tutor helping a Russian-speaking adult learner. ${sc.prompt}\nRules:\n- Speak ONLY in English\n- After user responds add "💬 Correction:" if they made mistakes\n- Keep messages concise (2-4 sentences)\n- Be encouraging\n- Start immediately`;
    const reply = await callClaude([], sys);
    setMessages([{ role: "assistant", content: reply, sys }]); setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const history = [...messages, userMsg];
    setMessages(history); setInput(""); setLoading(true);
    const sys = messages[0]?.sys || "";
    const reply = await callClaude(history.map(m => ({ role: m.role, content: m.content })), sys);
    setMessages([...history, { role: "assistant", content: reply }]); setLoading(false);
  };

  if (!scenario) return (
    <div>
      <div style={{ color: "#888", fontSize: 13, marginBottom: 14 }}>Выбери сценарий для практики:</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {SCENARIOS.map(sc => (
          <button key={sc.id} onClick={() => startScenario(sc)} style={{ background: "#0d1117", border: "1px solid #ffffff15", borderRadius: 14, padding: "14px", cursor: "pointer", textAlign: "left" }}
            onMouseOver={e => { e.currentTarget.style.border = "1px solid #00ff8840"; e.currentTarget.style.background = "#0a1a0f"; }}
            onMouseOut={e => { e.currentTarget.style.border = "1px solid #ffffff15"; e.currentTarget.style.background = "#0d1117"; }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{sc.icon}</div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{sc.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 460 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #ffffff10" }}>
        <span style={{ fontSize: 18 }}>{scenario.icon}</span>
        <span style={{ color: "#fff", fontWeight: 700 }}>{scenario.label}</span>
        <button onClick={() => setScenario(null)} style={{ marginLeft: "auto", background: "none", border: "1px solid #333", color: "#888", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>← сценарии</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? "linear-gradient(135deg,#1a3a2a,#0d2a1a)" : "#161b22", border: m.role === "user" ? "1px solid #00ff8830" : "1px solid #ffffff10", color: "#e0e0e0", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ display: "flex" }}><div style={{ background: "#161b22", border: "1px solid #ffffff10", borderRadius: "16px 16px 16px 4px", padding: "10px 18px", color: "#555" }}>···</div></div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()} placeholder="Type in English... (Enter to send)" style={{ flex: 1, background: "#0d1117", border: "1px solid #ffffff20", borderRadius: 12, padding: "11px 14px", color: "#fff", fontSize: 14, outline: "none" }} />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background: loading ? "#1a2a1a" : "linear-gradient(135deg,#00cc66,#00aa44)", border: "none", borderRadius: 12, padding: "11px 18px", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: 18 }}>→</button>
      </div>
    </div>
  );
}

// ─── PLAN MODULE ─────────────────────────────────────────────────────────────

function PlanModule() {
  const [day, setDay] = useState(1);
  const [mode, setMode] = useState("60");

  const schedules = {
    "30": [
      { time: "10мин", act: "Anki — повторение карточек", tool: "вкладка Слова" },
      { time: "10мин", act: "Shadowing — повторяй вслух", tool: "вкладка Тень" },
      { time: "10мин", act: "Контент с субтитрами", tool: "YouTube / Netflix" },
    ],
    "60": [
      { time: "15мин", act: "Anki — повторение + новые", tool: "вкладка Слова" },
      { time: "15мин", act: "Shadowing или Сборка", tool: "вкладки Тень / Сборка" },
      { time: "15мин", act: "Игра или Текст", tool: "вкладки Игра / Текст" },
      { time: "15мин", act: "Диалог с AI", tool: "вкладка Диалог" },
    ],
    "90": [
      { time: "20мин", act: "Anki — повторение + новые", tool: "вкладка Слова" },
      { time: "15мин", act: "Shadowing", tool: "вкладка Тень" },
      { time: "15мин", act: "Игра en↔ru", tool: "вкладка Игра" },
      { time: "20мин", act: "Диалог с AI", tool: "вкладка Диалог" },
      { time: "10мин", act: "Дневник или Новости", tool: "вкладки Дневник / Новости" },
      { time: "10мин", act: "Self-talk вслух", tool: "без инструментов" },
    ],
  };

  const phases = [
    { days: "1–14", title: "Фундамент", color: "#4488ff", goal: "Привычка, первые 70 фраз", tasks: ["5 новых фраз каждый день", "Shadowing 10 мин утром", "Переключи телефон на английский", "BBC 6 Minute English — 1 выпуск в день"] },
    { days: "15–30", title: "База", color: "#00ff88", goal: "150 фраз, первые разговоры", tasks: ["Продолжай 5 фраз в день", "Игра каждый день en↔ru", "Self-talk: говори вслух что делаешь", "Первый диалог с AI"] },
    { days: "31–60", title: "Погружение", color: "#ff8c00", goal: "Свободный базовый разговор", tasks: ["Читай тексты во вкладке Текст", "Сериал с английскими субтитрами", "Дневник: 3-5 предложений в день", "Новости: читай и пересказывай"] },
    { days: "61–90", title: "Автономия", color: "#cc44ff", goal: "B1–B2, свободное общение", tasks: ["YouTube по AI-музыке на английском", "30 мин разговора с AI без подготовки", "Записывай себя раз в неделю", "Пиши посты на английском"] },
  ];

  const currentPhase = phases.find(p => { const [s, e] = p.days.split("–").map(Number); return day >= s && day <= e; });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 14, padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "#888", fontSize: 12 }}>День</span>
          <span style={{ color: "#fff", fontWeight: 700 }}>{day} / 90</span>
        </div>
        <input type="range" min={1} max={90} value={day} onChange={e => setDay(+e.target.value)} style={{ width: "100%", accentColor: currentPhase?.color || "#00ff88" }} />
      </div>
      {currentPhase && (
        <div style={{ background: currentPhase.color + "10", border: `1px solid ${currentPhase.color}40`, borderRadius: 16, padding: "16px 18px" }}>
          <div style={{ color: currentPhase.color, fontSize: 10, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>● Сейчас · Дни {currentPhase.days}</div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 17, marginBottom: 4 }}>{currentPhase.title}</div>
          <div style={{ color: "#888", fontSize: 12, marginBottom: 12 }}>{currentPhase.goal}</div>
          {currentPhase.tasks.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ color: currentPhase.color, fontSize: 12, flexShrink: 0 }}>✓</span>
              <span style={{ color: "#bbb", fontSize: 13, lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 16, padding: "16px 18px" }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Расписание дня</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[["30","30 мин"],["60","60 мин"],["90","90 мин"]].map(([val, label]) => (
            <button key={val} onClick={() => setMode(val)} style={{ background: mode === val ? "#00ff88" : "#161b22", border: `1px solid ${mode === val ? "#00ff88" : "#333"}`, borderRadius: 8, padding: "6px 14px", color: mode === val ? "#000" : "#888", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{label}</button>
          ))}
        </div>
        {schedules[mode].map((row, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "#0a0a0f", border: "1px solid #ffffff08", borderRadius: 10, padding: "9px 12px", marginBottom: 6 }}>
            <span style={{ color: "#ff8c00", fontSize: 11, fontFamily: "monospace", fontWeight: 700, minWidth: 36 }}>{row.time}</span>
            <span style={{ color: "#ddd", fontSize: 13, flex: 1 }}>{row.act}</span>
            <span style={{ color: "#444", fontSize: 11 }}>{row.tool}</span>
          </div>
        ))}
      </div>
      <div style={{ background: "#0a1a0a", border: "1px solid #00ff8820", borderRadius: 14, padding: 14 }}>
        <div style={{ color: "#00ff88", fontWeight: 700, marginBottom: 10, fontSize: 13 }}>Ожидаемые результаты</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {[["14 дн","70 фраз","#4488ff"],["30 дн","Разговор","#00ff88"],["60 дн","Свободно","#ff8c00"],["90 дн","B1–B2","#cc44ff"]].map(([time, label, color]) => (
            <div key={time} style={{ background: color + "10", border: `1px solid ${color}20`, borderRadius: 10, padding: "9px 6px", textAlign: "center" }}>
              <div style={{ color, fontWeight: 700, fontSize: 12 }}>{time}</div>
              <div style={{ color: "#888", fontSize: 10, marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("cards");
  const [placementDone, setPlacementDone] = useState(() => { try { return !!localStorage.getItem("placement_done"); } catch { return false; } });
  const [userLevel, setUserLevel] = useState(() => { try { return localStorage.getItem("user_level") || null; } catch { return null; } });

  const { cards, unlockedCards, due, mastered, reviewCard, unlockNewCards, newAvailable, totalUnlocked } = useSRS();
  const { streak, daysSince, recordSession } = useMotivation();

  const handlePlacementComplete = ({ level }) => {
    localStorage.setItem("placement_done", "1");
    localStorage.setItem("user_level", level);
    setPlacementDone(true);
    setUserLevel(level);
  };

  if (!placementDone) return <PlacementAgent onComplete={handlePlacementComplete} />;

  const studiedCards = unlockedCards.filter(c => (c.reviewed || 0) > 0);
  const isLocked = studiedCards.length < 4;

  const tabs = [
    { id: "cards", label: "Слова", icon: "🧠", badge: due.length },
    { id: "quiz", label: "Игра", icon: "🎮", locked: isLocked },
    { id: "builder", label: "Сборка", icon: "🔤", locked: isLocked },
    { id: "hunt", label: "Охота", icon: "🔍", locked: isLocked },
    { id: "reading", label: "Текст", icon: "📖", locked: isLocked },
    { id: "diary", label: "Дневник", icon: "✍️" },
    { id: "news", label: "Новости", icon: "📰" },
    { id: "chat", label: "Диалог", icon: "🗣️" },
    { id: "plan", label: "План", icon: "📅" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "system-ui,-apple-system,sans-serif", color: "#fff", paddingBottom: 40 }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        input::placeholder, textarea::placeholder { color: #555; }
        @keyframes pulse { 0%,100% { opacity: 0.4 } 50% { opacity: 1 } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-8px) } 75% { transform: translateX(8px) } }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(180deg,#0d1117 0%,#0a0a0f 100%)", borderBottom: "1px solid #ffffff08", padding: "18px 18px 14px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: "#00ff88", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", marginBottom: 2 }}>
                AI English Coach {userLevel && <span style={{ color: "#4488ff" }}>· {userLevel}</span>}
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.5 }}>English Coach</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <ProgressRing value={totalUnlocked} max={cards.length} size={50} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#00ff88", fontWeight: 700 }}>
                  {Math.round(totalUnlocked / Math.max(cards.length, 1) * 100)}%
                </div>
              </div>
              {streak > 0 && <div style={{ color: "#ff8c00", fontSize: 9, marginTop: 2 }}>🔥 {streak}</div>}
            </div>
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <MotivationBanner streak={streak} daysSince={daysSince} />
            <TipBanner />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "12px 16px 0" }}>
        {/* Row 1: main learning tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4, marginBottom: 4 }}>
          {tabs.slice(0, 5).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "linear-gradient(135deg,#00cc66,#008844)" : "#0d1117", border: tab === t.id ? "none" : "1px solid #ffffff10", borderRadius: 10, padding: "8px 2px", cursor: "pointer", color: tab === t.id ? "#fff" : t.locked ? "#2a2a2a" : "#555", fontSize: 9, fontWeight: 700, transition: "all 0.2s", position: "relative" }}>
              <div style={{ fontSize: 14, marginBottom: 2 }}>{t.icon}</div>
              {t.locked ? "🔒" : t.label}
              {t.badge > 0 && <span style={{ position: "absolute", top: 2, right: 2, background: "#ff4444", color: "#fff", borderRadius: "50%", width: 13, height: 13, fontSize: 7, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{t.badge > 9 ? "9+" : t.badge}</span>}
            </button>
          ))}
        </div>
        {/* Row 2: extra tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, marginBottom: 18 }}>
          {tabs.slice(5).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "linear-gradient(135deg,#00cc66,#008844)" : "#0d1117", border: tab === t.id ? "none" : "1px solid #ffffff10", borderRadius: 10, padding: "8px 2px", cursor: "pointer", color: tab === t.id ? "#fff" : t.locked ? "#2a2a2a" : "#555", fontSize: 9, fontWeight: 700, transition: "all 0.2s", position: "relative" }}>
              <div style={{ fontSize: 14, marginBottom: 2 }}>{t.icon}</div>
              {t.locked ? "🔒" : t.label}
              {t.badge > 0 && <span style={{ position: "absolute", top: 2, right: 2, background: "#ff4444", color: "#fff", borderRadius: "50%", width: 13, height: 13, fontSize: 7, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{t.badge > 9 ? "9+" : t.badge}</span>}
            </button>
          ))}
        </div>

        <div style={{ animation: "fadeIn 0.3s ease" }}>
          {tab === "cards" && <SRSModule due={due} mastered={mastered} cards={cards} reviewCard={reviewCard} unlockNewCards={unlockNewCards} newAvailable={newAvailable} totalUnlocked={totalUnlocked} recordSession={recordSession} />}
          {tab === "quiz" && <QuizModule studiedCards={studiedCards} />}
          {tab === "builder" && <BuilderModule />}
          {tab === "reading" && <ReadingModule studiedCards={studiedCards} />}
          {tab === "diary" && <DiaryModule />}
          {tab === "hunt" && <PhraseHuntModule studiedCards={studiedCards} />}
          {tab === "news" && <NewsModule />}
          {tab === "chat" && <ChatModule />}
          {tab === "plan" && <PlanModule />}
        </div>
      </div>
    </div>
  );
}
