import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const ALL_PHRASES = [
  // ── A2: ЗНАКОМСТВО И БАЗОВОЕ ОБЩЕНИЕ ─────────────────────────────────────
  { word: "Nice to meet you", transcription: "/naɪs tə miːt juː/", translation: "Приятно познакомиться", example: "Hi, I'm Alex. Nice to meet you!", cefr: "A2", category: "Знакомство" },
  { word: "Where are you from?", transcription: "/wɛr ɑːr juː frɒm/", translation: "Откуда вы?", example: "Where are you from? — I'm from Russia.", cefr: "A2", category: "Знакомство" },
  { word: "What do you do?", transcription: "/wɒt duː juː duː/", translation: "Чем вы занимаетесь?", example: "What do you do? — I work in music production.", cefr: "A2", category: "Знакомство" },
  { word: "How long have you been learning English?", transcription: "/haʊ lɒŋ həv juː bɪn ˈlɜːrnɪŋ/", translation: "Как давно вы учите английский?", example: "How long have you been learning English? — About 3 months.", cefr: "A2", category: "Знакомство" },
  { word: "My English isn't perfect", transcription: "/maɪ ˈɪŋɡlɪʃ ɪznt ˈpɜːrfɪkt/", translation: "Мой английский не идеален", example: "My English isn't perfect, but I'm working on it!", cefr: "A2", category: "Знакомство" },
  { word: "Could you speak slower?", transcription: "/kʊd juː spiːk ˈsloʊər/", translation: "Не могли бы вы говорить медленнее?", example: "Could you speak slower, please? I'm still learning.", cefr: "A2", category: "Знакомство" },
  { word: "Could you repeat that?", transcription: "/kʊd juː rɪˈpiːt ðæt/", translation: "Не могли бы вы повторить?", example: "Sorry, could you repeat that?", cefr: "A2", category: "Знакомство" },
  { word: "What do you mean?", transcription: "/wɒt duː juː miːn/", translation: "Что вы имеете в виду?", example: "What do you mean by that?", cefr: "A2", category: "Знакомство" },
  { word: "That's interesting!", transcription: "/ðæts ˈɪntrəstɪŋ/", translation: "Это интересно!", example: "That's interesting! Tell me more.", cefr: "A2", category: "Знакомство" },

  // ── A2: ПОВСЕДНЕВНЫЕ СИТУАЦИИ ─────────────────────────────────────────────
  { word: "I'd like to order", transcription: "/aɪd laɪk tə ˈɔːrdər/", translation: "Я бы хотел заказать", example: "I'd like to order the chicken salad, please.", cefr: "A2", category: "Быт" },
  { word: "How much does it cost?", transcription: "/haʊ mʌtʃ dʌz ɪt kɒst/", translation: "Сколько это стоит?", example: "Excuse me, how much does it cost?", cefr: "A2", category: "Быт" },
  { word: "Can I pay by card?", transcription: "/kæn aɪ peɪ baɪ kɑːrd/", translation: "Можно оплатить картой?", example: "Can I pay by card or is it cash only?", cefr: "A2", category: "Быт" },
  { word: "I'm looking for", transcription: "/aɪm ˈlʊkɪŋ fɔːr/", translation: "Я ищу", example: "I'm looking for the nearest pharmacy.", cefr: "A2", category: "Быт" },
  { word: "Excuse me, where is", transcription: "/ɪkˈskjuːz miː wɛr ɪz/", translation: "Извините, где находится", example: "Excuse me, where is the train station?", cefr: "A2", category: "Быт" },
  { word: "Can you help me?", transcription: "/kæn juː hɛlp miː/", translation: "Вы можете мне помочь?", example: "Can you help me find this address?", cefr: "A2", category: "Быт" },
  { word: "I need to reschedule", transcription: "/aɪ niːd tə ˌriːˈskɛdʒuːl/", translation: "Мне нужно перенести встречу", example: "I need to reschedule our meeting to Friday.", cefr: "A2", category: "Быт" },
  { word: "Sorry I'm late", transcription: "/ˈsɒri aɪm leɪt/", translation: "Извините, я опоздал", example: "Sorry I'm late, there was a lot of traffic.", cefr: "A2", category: "Быт" },
  { word: "It was great talking to you", transcription: "/ɪt wɒz ɡreɪt ˈtɔːkɪŋ tə juː/", translation: "Было приятно пообщаться", example: "It was great talking to you! See you next time.", cefr: "A2", category: "Быт" },

  // ── A2: БАЗОВЫЕ ПАТТЕРНЫ ──────────────────────────────────────────────────
  { word: "I'm working on it", transcription: "/aɪm ˈwɜːrkɪŋ ɒn ɪt/", translation: "Я работаю над этим", example: "Don't worry, I'm working on it.", cefr: "A2", category: "Паттерны" },
  { word: "I'm going to", transcription: "/aɪm ˈɡoʊɪŋ tə/", translation: "Я собираюсь", example: "I'm going to learn English this year.", cefr: "A2", category: "Паттерны" },
  { word: "I want to", transcription: "/aɪ wɒnt tə/", translation: "Я хочу", example: "I want to improve my English.", cefr: "A2", category: "Паттерны" },
  { word: "I need to", transcription: "/aɪ niːd tə/", translation: "Мне нужно", example: "I need to call him back.", cefr: "A2", category: "Паттерны" },
  { word: "I can't", transcription: "/aɪ kɑːnt/", translation: "Я не могу", example: "I can't make it tonight, sorry.", cefr: "A2", category: "Паттерны" },
  { word: "I think that", transcription: "/aɪ θɪŋk ðæt/", translation: "Я думаю, что", example: "I think that you're right.", cefr: "A2", category: "Паттерны" },
  { word: "There is / There are", transcription: "/ðɛr ɪz / ðɛr ɑːr/", translation: "Есть / Имеется", example: "There is a problem we need to discuss.", cefr: "A2", category: "Паттерны" },
  { word: "It's easy to", transcription: "/ɪts ˈiːzi tə/", translation: "Легко / Несложно", example: "It's easy to get lost in this city.", cefr: "A2", category: "Паттерны" },

  // ── B1: РАЗГОВОРНЫЕ БЛОКИ ─────────────────────────────────────────────────
  { word: "In my opinion", transcription: "/ɪn maɪ əˈpɪnjən/", translation: "На мой взгляд", example: "In my opinion, this is the best approach.", cefr: "B1", category: "Мнение" },
  { word: "Actually, I'm not sure", transcription: "/ˈæktʃuəli aɪm nɒt ʃʊər/", translation: "Честно говоря, я не уверен", example: "Actually, I'm not sure about that.", cefr: "B1", category: "Мнение" },
  { word: "That's a good point", transcription: "/ðæts ə ɡʊd pɔɪnt/", translation: "Это хорошее замечание", example: "That's a good point. I agree with you.", cefr: "B1", category: "Мнение" },
  { word: "Let me think about it", transcription: "/lɛt miː θɪŋk əˈbaʊt ɪt/", translation: "Дайте мне подумать", example: "Let me think about it for a second.", cefr: "B1", category: "Мнение" },
  { word: "I see your point, but", transcription: "/aɪ siː jɔːr pɔɪnt bʌt/", translation: "Я понимаю вашу точку зрения, но", example: "I see your point, but I disagree.", cefr: "B1", category: "Мнение" },
  { word: "So what you're saying is", transcription: "/soʊ wɒt jʊər ˈseɪɪŋ ɪz/", translation: "Итак, вы говорите, что", example: "So what you're saying is we need more time?", cefr: "B1", category: "Мнение" },
  { word: "By the way", transcription: "/baɪ ðə weɪ/", translation: "Кстати", example: "By the way, have you heard the news?", cefr: "B1", category: "Мнение" },
  { word: "Anyway, getting back to", transcription: "/ˈɛniweɪ ˈɡɛtɪŋ bæk tə/", translation: "В общем, возвращаясь к теме", example: "Anyway, getting back to the main topic.", cefr: "B1", category: "Мнение" },

  // ── B1: ФРАЗОВЫЕ ГЛАГОЛЫ ─────────────────────────────────────────────────
  { word: "go ahead", transcription: "/ɡoʊ əˈhɛd/", translation: "продолжай / давай", example: "Go ahead, I'm listening.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "go through", transcription: "/ɡoʊ θruː/", translation: "пережить / пройти через", example: "We went through a tough time.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "figure out", transcription: "/ˈfɪɡjər aʊt/", translation: "разобраться / понять", example: "I need to figure out this problem.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "come up with", transcription: "/kʌm ʌp wɪð/", translation: "придумать / предложить", example: "She came up with a great idea.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "get along", transcription: "/ɡɛt əˈlɒŋ/", translation: "ладить / уживаться", example: "We get along very well.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "put off", transcription: "/pʊt ɒf/", translation: "откладывать", example: "Don't put off until tomorrow.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "break down", transcription: "/breɪk daʊn/", translation: "сломаться / расстроиться", example: "My car broke down this morning.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "turn out", transcription: "/tɜːrn aʊt/", translation: "оказаться / выясниться", example: "It turned out to be a great day.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "bring up", transcription: "/brɪŋ ʌp/", translation: "поднять тему / воспитать", example: "He brought up an interesting point.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "set up", transcription: "/sɛt ʌp/", translation: "настроить / организовать", example: "Let's set up a meeting.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "deal with", transcription: "/diːl wɪð/", translation: "справляться / разбираться", example: "How do you deal with stress?", cefr: "B1", category: "Фразовые глаголы" },
  { word: "look forward to", transcription: "/lʊk ˈfɔːrwərd tuː/", translation: "с нетерпением ждать", example: "I look forward to meeting you.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "pick up", transcription: "/pɪk ʌp/", translation: "подхватить / забрать / освоить", example: "I picked up some English from movies.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "run out of", transcription: "/rʌn aʊt əv/", translation: "закончиться / исчерпать", example: "We ran out of time.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "look into", transcription: "/lʊk ˈɪntə/", translation: "изучить / исследовать", example: "I'll look into this issue.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "give up", transcription: "/ɡɪv ʌp/", translation: "сдаться / бросить", example: "Don't give up on your English!", cefr: "B1", category: "Фразовые глаголы" },
  { word: "take over", transcription: "/teɪk ˈoʊvər/", translation: "взять на себя / захватить", example: "She took over the project last week.", cefr: "B1", category: "Фразовые глаголы" },
  { word: "end up", transcription: "/ɛnd ʌp/", translation: "в итоге оказаться", example: "We ended up staying till midnight.", cefr: "B1", category: "Фразовые глаголы" },

  // ── B1: ПАТТЕРНЫ И ГРАММАТИКА ────────────────────────────────────────────
  { word: "I've been working", transcription: "/aɪv bɪn ˈwɜːrkɪŋ/", translation: "я работаю (уже какое-то время)", example: "I've been working on this for hours.", cefr: "B1", category: "Грамматика" },
  { word: "I used to", transcription: "/aɪ juːzd tə/", translation: "раньше я / бывало я", example: "I used to live in a small town.", cefr: "B1", category: "Грамматика" },
  { word: "I should have", transcription: "/aɪ ʃʊd həv/", translation: "мне следовало бы", example: "I should have called you earlier.", cefr: "B1", category: "Грамматика" },
  { word: "If I were you", transcription: "/ɪf aɪ wɜːr juː/", translation: "Если бы я был на вашем месте", example: "If I were you, I'd try again.", cefr: "B1", category: "Грамматика" },
  { word: "I'd rather", transcription: "/aɪd ˈrɑːðər/", translation: "Я бы предпочёл", example: "I'd rather stay home tonight.", cefr: "B1", category: "Грамматика" },
  { word: "It depends on", transcription: "/ɪt dɪˈpɛndz ɒn/", translation: "Это зависит от", example: "It depends on the weather.", cefr: "B1", category: "Грамматика" },

  // ── B1: РАБОТА И БИЗНЕС ──────────────────────────────────────────────────
  { word: "I'm working on a project", transcription: "/aɪm ˈwɜːrkɪŋ ɒn ə ˈprɒdʒɛkt/", translation: "Я работаю над проектом", example: "I'm working on a project related to AI music.", cefr: "B1", category: "Работа" },
  { word: "Let me get back to you", transcription: "/lɛt miː ɡɛt bæk tə juː/", translation: "Я вернусь к этому позже", example: "Let me get back to you on that tomorrow.", cefr: "B1", category: "Работа" },
  { word: "Could you send me the details?", transcription: "/kʊd juː sɛnd miː ðə ˈdiːteɪlz/", translation: "Не могли бы вы прислать детали?", example: "Could you send me the details by email?", cefr: "B1", category: "Работа" },
  { word: "I appreciate your help", transcription: "/aɪ əˈpriːʃieɪt jɔːr hɛlp/", translation: "Я ценю вашу помощь", example: "I appreciate your help with this task.", cefr: "B1", category: "Работа" },
  { word: "That sounds like a great idea", transcription: "/ðæt saʊndz laɪk ə ɡreɪt aɪˈdɪə/", translation: "Это звучит как отличная идея", example: "That sounds like a great idea! Let's try it.", cefr: "B1", category: "Работа" },
  { word: "I completely agree", transcription: "/aɪ kəmˈpliːtli əˈɡriː/", translation: "Я полностью согласен", example: "I completely agree with your approach.", cefr: "B1", category: "Работа" },

  // ── B2: ПРОДВИНУТЫЕ ВЫРАЖЕНИЯ ────────────────────────────────────────────
  { word: "To be honest", transcription: "/tə biː ˈɒnɪst/", translation: "Честно говоря", example: "To be honest, I don't know.", cefr: "B2", category: "Продвинутые" },
  { word: "In other words", transcription: "/ɪn ˈʌðər wɜːrdz/", translation: "Другими словами", example: "In other words, we failed.", cefr: "B2", category: "Продвинутые" },
  { word: "What I mean is", transcription: "/wɒt aɪ miːn ɪz/", translation: "Я имею в виду", example: "What I mean is we need more time.", cefr: "B2", category: "Продвинутые" },
  { word: "It's worth noting that", transcription: "/ɪts wɜːrθ ˈnoʊtɪŋ ðæt/", translation: "Стоит отметить, что", example: "It's worth noting that prices have risen.", cefr: "B2", category: "Продвинутые" },
  { word: "On the other hand", transcription: "/ɒn ðə ˈʌðər hænd/", translation: "С другой стороны", example: "On the other hand, it could work.", cefr: "B2", category: "Продвинутые" },
  { word: "As far as I know", transcription: "/æz fɑːr æz aɪ noʊ/", translation: "Насколько я знаю", example: "As far as I know, the project is on track.", cefr: "B2", category: "Продвинутые" },
  { word: "It goes without saying", transcription: "/ɪt ɡoʊz wɪˈðaʊt ˈseɪɪŋ/", translation: "Само собой разумеется", example: "It goes without saying that practice is key.", cefr: "B2", category: "Продвинутые" },
  { word: "I couldn't agree more", transcription: "/aɪ ˈkʊdnt əˈɡriː mɔːr/", translation: "Полностью с вами согласен", example: "I couldn't agree more with that statement.", cefr: "B2", category: "Продвинутые" },
  { word: "Having said that", transcription: "/ˈhævɪŋ sɛd ðæt/", translation: "Тем не менее / При этом", example: "Having said that, we should still try.", cefr: "B2", category: "Продвинутые" },
  { word: "It's a matter of", transcription: "/ɪts ə ˈmætər əv/", translation: "Это вопрос / дело в том, что", example: "It's a matter of time before it works.", cefr: "B2", category: "Продвинутые" },
  { word: "There's no doubt that", transcription: "/ðɛrz noʊ daʊt ðæt/", translation: "Нет никаких сомнений, что", example: "There's no doubt that English opens doors.", cefr: "B2", category: "Продвинутые" },
  { word: "I'd be happy to", transcription: "/aɪd biː ˈhæpi tə/", translation: "Я с удовольствием", example: "I'd be happy to help you with that.", cefr: "B2", category: "Продвинутые" },
  { word: "It turns out that", transcription: "/ɪt tɜːrnz aʊt ðæt/", translation: "Оказывается, что", example: "It turns out that I was right all along.", cefr: "B2", category: "Продвинутые" },
  { word: "What strikes me is", transcription: "/wɒt straɪks miː ɪz/", translation: "Что меня поражает — это", example: "What strikes me is how fast AI evolves.", cefr: "B2", category: "Продвинутые" },
];

// Filter by user level for display
const FREQ_WORDS = ALL_PHRASES;


const SCENARIOS = [
  { id: "daily", label: "Everyday Talk", icon: "☕", prompt: "Let's have a casual conversation about daily life. Ask me about my morning routine, hobbies, or what I did today. Keep it natural and friendly. I'm learning English, so please correct my mistakes gently after I respond." },
  { id: "business", label: "Business", icon: "💼", prompt: "Let's practice business English. Simulate a professional meeting scenario. I'm pitching a project idea. Ask me questions a manager would ask. Correct my grammar if needed." },
  { id: "travel", label: "Travel", icon: "✈️", prompt: "Simulate a travel situation — I'm at an airport or hotel. Play the role of staff. Keep it realistic. Gently correct my English mistakes." },
  { id: "music", label: "AI Music", icon: "🎵", prompt: "Let's discuss AI music production and Suno AI. You're a fellow creator. Ask me about my workflow, what music I make, and share your thoughts. This topic is close to my heart. Correct my English naturally." },
  { id: "interview", label: "Job Interview", icon: "🤝", prompt: "You're a job interviewer. Ask me 3-5 interview questions one at a time. After each answer, give brief feedback on my English and then move to the next question." },
  { id: "story", label: "Storytelling", icon: "📖", prompt: "Let's do a collaborative story. Start a short story and I'll continue it. We alternate. Gently correct my grammar and vocabulary. Keep the story fun and imaginative." },
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
  {
    q: "What does 'go ahead' mean?",
    options: ["остановиться", "продолжай", "вернуться", "подождать"],
    correct: 1,
  },
  {
    q: "Choose the correct sentence:",
    options: [
      "I am know this word.",
      "I have been working all day.",
      "She goed to the store.",
      "We was happy.",
    ],
    correct: 1,
  },
  {
    q: "Translate: 'It depends on the weather'",
    options: [
      "Это зависит от погоды",
      "Погода зависит от этого",
      "Мне нравится погода",
      "Погода хорошая",
    ],
    correct: 0,
  },
  {
    q: "Fill in: 'She ___ a great idea for the project.'",
    options: ["came up with", "went through", "put off", "broke down"],
    correct: 0,
  },
  {
    q: "What level describes you best?",
    options: [
      "Я почти не знаю английский (A1)",
      "Знаю базу, но говорю с трудом (A2)",
      "Могу объясниться, есть пробелы (B1)",
      "Говорю уверенно, хочу полировать (B2+)",
    ],
    correct: -1,
  },
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
  const preferred =
    voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ||
    voices.find((v) => v.lang === "en-US") ||
    voices[0];
  if (preferred) utt.voice = preferred;
  window.speechSynthesis.speak(utt);
}

// ─── SRS ENGINE ──────────────────────────────────────────────────────────────

function getCardsDue(cards) {
  const now = Date.now();
  return cards.filter((c) => c.nextReview <= now);
}

function updateCard(card, quality) {
  const intervals = [1, 3, 7, 14, 30];
  const newLevel =
    quality === 0 ? 0 : Math.min((card.srsLevel || 0) + (quality - 1), 4);
  const delay = intervals[newLevel] * 24 * 60 * 60 * 1000;
  return {
    ...card,
    srsLevel: newLevel,
    nextReview: Date.now() + delay,
    reviewed: (card.reviewed || 0) + 1,
  };
}

// ─── HOOKS ───────────────────────────────────────────────────────────────────

const NEW_PER_DAY = 5;

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function useSRS() {
  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem("srs_cards_v4");
      if (saved) return JSON.parse(saved);
    } catch {}
    return FREQ_WORDS.map((w, i) => ({
      ...w,
      id: i,
      srsLevel: 0,
      nextReview: Date.now() + 999 * 24 * 3600 * 1000,
      reviewed: 0,
      unlocked: false,
    }));
  });

  const [unlockedToday, setUnlockedToday] = useState(() => {
    try {
      const saved = localStorage.getItem("srs_daily");
      if (saved) {
        const d = JSON.parse(saved);
        if (d.key === todayKey()) return d.count;
      }
    } catch {}
    return 0;
  });

  useEffect(() => {
    try {
      localStorage.setItem("srs_cards_v4", JSON.stringify(cards));
    } catch {}
  }, [cards]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "srs_daily",
        JSON.stringify({ key: todayKey(), count: unlockedToday })
      );
    } catch {}
  }, [unlockedToday]);

  const unlockNewCards = useCallback(() => {
    const canUnlock = NEW_PER_DAY - unlockedToday;
    if (canUnlock <= 0) return;
    let unlocked = 0;
    setCards((prev) => {
      const next = [...prev];
      // Simple: just unlock first N locked cards in order
      for (let i = 0; i < next.length && unlocked < canUnlock; i++) {
        if (!next[i].unlocked) {
          next[i] = { ...next[i], unlocked: true, nextReview: Date.now() };
          unlocked++;
        }
      }
      return next;
    });
    if (unlocked > 0) {
      setUnlockedToday((c) => c + unlocked);
    }
  }, [unlockedToday]);

  const reviewCard = useCallback((id, quality) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? updateCard(c, quality) : c))
    );
  }, []);

  const unlockedCards = cards.filter((c) => c.unlocked);
  const due = getCardsDue(unlockedCards);
  const mastered = cards.filter((c) => (c.srsLevel || 0) >= 4).length;
  const newAvailable = NEW_PER_DAY - unlockedToday;
  const totalUnlocked = unlockedCards.length;

  return {
    cards,
    unlockedCards,
    due,
    mastered,
    reviewCard,
    unlockNewCards,
    newAvailable,
    totalUnlocked,
  };
}

// Motivation: track streak and last session
function useMotivation() {
  const [streak, setStreak] = useState(() => {
    try {
      const s = localStorage.getItem("motivation");
      return s ? JSON.parse(s) : { streak: 0, lastDay: null };
    } catch {}
    return { streak: 0, lastDay: null };
  });

  const recordSession = useCallback(() => {
    const today = todayKey();
    setStreak((prev) => {
      const yesterday = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })();
      if (prev.lastDay === today) return prev;
      const newStreak =
        prev.lastDay === yesterday ? prev.streak + 1 : 1;
      const next = { streak: newStreak, lastDay: today };
      localStorage.setItem("motivation", JSON.stringify(next));
      return next;
    });
  }, []);

  const daysSinceLastSession = (() => {
    if (!streak.lastDay) return null;
    const [y, m, d] = streak.lastDay.split("-").map(Number);
    const last = new Date(y, m, d);
    const now = new Date();
    return Math.floor((now - last) / (24 * 3600 * 1000));
  })();

  return { streak: streak.streak, daysSinceLastSession, recordSession };
}

// ─── API ─────────────────────────────────────────────────────────────────────

async function callClaude(messages, system) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system }),
  });
  const data = await res.json();
  return data.reply || "Sorry, something went wrong.";
}

async function generateStory(phrases, topic) {
  const res = await fetch("/api/story", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phrases, topic }),
  });
  const data = await res.json();
  return data.story || "";
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function ProgressRing({ value, max, size = 64, color = "#00ff88" }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / Math.max(max, 1)) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1a1a2e" strokeWidth="4" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease" }} />
    </svg>
  );
}

function TipBanner() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TIPS.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background: "linear-gradient(90deg, #0d1117, #161b22)", border: "1px solid #00ff8830", borderRadius: 12, padding: "12px 18px", fontSize: 13, color: "#00ff88", fontStyle: "italic", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 16 }}>💡</span>
      <span>{TIPS[idx]}</span>
    </div>
  );
}

// ─── PLACEMENT AGENT ─────────────────────────────────────────────────────────

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
        // Score: count correct answers (skip self-assessment Q5)
        const score = newAnswers.slice(0, 4).filter(
          (a, idx) => a === PLACEMENT_QUESTIONS[idx].correct
        ).length;
        const level = score <= 1 ? "A1" : score <= 2 ? "A2" : score <= 3 ? "B1" : "B2";
        const selfLevel = ["A1", "A2", "B1", "B2"][newAnswers[4]] || "A2";
        onComplete({ score, level, selfLevel });
      } else {
        setAnswers(newAnswers);
        setSelected(null);
        setStep((s) => s + 1);
      }
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 480, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ color: "#00ff88", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Тест уровня</div>
          <div style={{ color: "#fff", fontSize: 24, fontWeight: 900, fontFamily: "'Unbounded', sans-serif" }}>
            Placement Test
          </div>
          <div style={{ color: "#555", fontSize: 13, marginTop: 8 }}>
            Вопрос {step + 1} из {PLACEMENT_QUESTIONS.length}
          </div>
          <div style={{ marginTop: 12, height: 3, background: "#1a1a2e", borderRadius: 4 }}>
            <div style={{ height: "100%", background: "#00ff88", borderRadius: 4, width: `${((step) / PLACEMENT_QUESTIONS.length) * 100}%`, transition: "width 0.4s ease" }} />
          </div>
        </div>

        <div style={{ background: "#0d1117", border: "1px solid #ffffff12", borderRadius: 20, padding: "24px 22px", marginBottom: 20 }}>
          <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, marginBottom: 24, lineHeight: 1.5 }}>{q.q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = q.correct !== -1 && i === q.correct;
              const isWrong = isSelected && !isCorrect && q.correct !== -1;
              return (
                <button key={i} onClick={() => selected === null && pick(i)} style={{
                  background: isSelected && isCorrect ? "#00ff8820" : isWrong ? "#ff444420" : isSelected ? "#4488ff20" : "#0a0a0f",
                  border: `1px solid ${isSelected && isCorrect ? "#00ff8860" : isWrong ? "#ff444460" : isSelected ? "#4488ff60" : "#ffffff15"}`,
                  borderRadius: 12, padding: "13px 18px", cursor: selected !== null ? "default" : "pointer",
                  color: isSelected && isCorrect ? "#00ff88" : isWrong ? "#ff4444" : "#ccc",
                  fontSize: 14, textAlign: "left", fontWeight: isSelected ? 700 : 400, transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <span style={{ background: "#ffffff08", borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#555", flexShrink: 0 }}>
                    {["A", "B", "C", "D"][i]}
                  </span>
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

// ─── MOTIVATION BANNER ────────────────────────────────────────────────────────

function MotivationBanner({ streak, daysSince }) {
  if (!daysSince && streak === 0) return null;

  if (daysSince >= 7) {
    return (
      <div style={{ background: "#1a0a0a", border: "1px solid #ff444440", borderRadius: 12, padding: "12px 18px", fontSize: 13, color: "#ff8888", display: "flex", alignItems: "center", gap: 10 }}>
        <span>😴</span>
        <span>Давно не занимался. Начнём с лёгкого — всего 5 минут сегодня!</span>
      </div>
    );
  }

  if (daysSince >= 2) {
    return (
      <div style={{ background: "#1a1000", border: "1px solid #ff8c0040", borderRadius: 12, padding: "12px 18px", fontSize: 13, color: "#ffaa44", display: "flex", alignItems: "center", gap: 10 }}>
        <span>👋</span>
        <span>Пропустил {daysSince} дня. Карточки ждут — вернёмся?</span>
      </div>
    );
  }

  if (streak >= 7) {
    return (
      <div style={{ background: "#1a0a00", border: "1px solid #ff8c0060", borderRadius: 12, padding: "12px 18px", fontSize: 13, color: "#ff8c00", display: "flex", alignItems: "center", gap: 10 }}>
        <span>🔥</span>
        <span><b>{streak} дней подряд!</b> Отличная серия — так держать!</span>
      </div>
    );
  }

  if (streak >= 3) {
    return (
      <div style={{ background: "#0a1a00", border: "1px solid #00ff8830", borderRadius: 12, padding: "12px 18px", fontSize: 13, color: "#00cc66", display: "flex", alignItems: "center", gap: 10 }}>
        <span>🌱</span>
        <span><b>{streak} дня подряд.</b> Привычка формируется!</span>
      </div>
    );
  }

  return null;
}

// ─── SRS MODULE ──────────────────────────────────────────────────────────────

function SRSModule({ due, mastered, cards, reviewCard, unlockNewCards, newAvailable, totalUnlocked, recordSession }) {
  const [current, setCurrent] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    if (due.length > 0 && !current) setCurrent(due[0]);
  }, [due, current]);

  const handleQuality = (q) => {
    reviewCard(current.id, q);
    recordSession();
    setSessionCount((s) => s + 1);
    setFlipped(false);
    const remaining = due.filter((c) => c.id !== current.id);
    setCurrent(remaining.length > 0 ? remaining[0] : null);
  };

  if (totalUnlocked === 0) return (
    <div style={{ textAlign: "center", padding: "30px 20px" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>👋</div>
      <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Начнём учить фразы!</div>
      <div style={{ color: "#888", fontSize: 13, marginBottom: 24, lineHeight: 1.7 }}>
        Каждый день открываются <b style={{ color: "#00ff88" }}>5 новых фраз</b>.<br />
        Изучи их → повтори → переходи в игру и текст.
      </div>
      <button onClick={unlockNewCards} style={{ background: "linear-gradient(135deg, #00cc66, #008844)", border: "none", borderRadius: 14, padding: "14px 32px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
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
          <div style={{ color: "#00ff88", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Готов к новым фразам?</div>
          <div style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>
            Сегодня можно открыть ещё <b style={{ color: "#fff" }}>{newAvailable}</b> новых фраз
          </div>
          <button onClick={unlockNewCards} style={{ background: "linear-gradient(135deg, #00cc66, #008844)", border: "none", borderRadius: 12, padding: "12px 28px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            + Открыть {newAvailable} новых фраз
          </button>
        </div>
      ) : (
        <div style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 16, padding: 20, textAlign: "center" }}>
          <div style={{ color: "#555", fontSize: 13 }}>Лимит новых фраз на сегодня исчерпан</div>
          <div style={{ color: "#444", fontSize: 12, marginTop: 6 }}>Завтра откроется ещё {NEW_PER_DAY} новых фраз</div>
        </div>
      )}
      <div style={{ background: "#0d1117", border: "1px solid #ffffff08", borderRadius: 14, padding: "14px 18px" }}>
        <div style={{ color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Прогресс</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "В работе", value: totalUnlocked, color: "#4488ff" },
            { label: "Освоено", value: mastered, color: "#00ff88" },
            { label: "Всего", value: cards.length, color: "#888" },
          ].map((s) => (
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
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#888", fontSize: 13 }}>Повторить: <b style={{ color: "#fff" }}>{due.length}</b></span>
        <span style={{ color: "#888", fontSize: 12 }}>
          <b style={{ color: "#4488ff" }}>{cards.filter(c=>c.unlocked&&c.cefr==="A2").length}</b><span style={{color:"#333"}}>/</span>
          <b style={{ color: "#00ff88" }}>{cards.filter(c=>c.unlocked&&c.cefr==="B1").length}</b><span style={{color:"#333"}}>/</span>
          <b style={{ color: "#cc44ff" }}>{cards.filter(c=>c.unlocked&&c.cefr==="B2").length}</b>
          <span style={{color:"#555", fontSize:10}}> A2/B1/B2</span>
        </span>
      </div>

      <div style={{ background: flipped ? "linear-gradient(135deg, #0a2a1a, #0d1a0d)" : "linear-gradient(135deg, #0a0a1a, #0d0d2a)", border: `1px solid ${flipped ? "#00ff8850" : "#ffffff15"}`, borderRadius: 20, padding: "28px 24px", minHeight: 180, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10, transition: "all 0.3s", userSelect: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#555", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>фраза</span>
          {current.cefr && <span style={{ background: current.cefr === "A2" ? "#4488ff20" : current.cefr === "B1" ? "#00ff8820" : "#cc44ff20", color: current.cefr === "A2" ? "#4488ff" : current.cefr === "B1" ? "#00ff88" : "#cc44ff", borderRadius: 6, padding: "2px 7px", fontSize: 10, fontWeight: 700 }}>{current.cefr}</span>}
          {current.category && <span style={{ color: "#333", fontSize: 10 }}>{current.category}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ color: "#fff", fontSize: 24, fontWeight: 700, textAlign: "center", fontFamily: "Georgia, serif" }}>{current.word}</div>
          <button onClick={(e) => { e.stopPropagation(); speakText(current.word); }} style={{ background: "#4488ff20", border: "1px solid #4488ff40", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🔊</button>
        </div>
        <div style={{ color: "#4488ff", fontSize: 13, fontFamily: "monospace", letterSpacing: 0.5 }}>{current.transcription}</div>
        {!flipped && <div onClick={() => setFlipped(true)} style={{ color: "#333", fontSize: 13, cursor: "pointer", marginTop: 8 }}>👆 нажми чтобы увидеть перевод</div>}
        {flipped && (
          <>
            <div style={{ width: "100%", height: 1, background: "#ffffff10", margin: "4px 0" }} />
            <div style={{ color: "#00ff88", fontSize: 17, textAlign: "center" }}>{current.translation}</div>
            <div onClick={(e) => { e.stopPropagation(); speakText(current.example, 0.8); }} style={{ color: "#aaa", fontSize: 13, fontStyle: "italic", textAlign: "center", padding: "10px 16px", background: "#ffffff08", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <span>"{current.example}"</span>
              <span style={{ fontSize: 14, flexShrink: 0, opacity: 0.6 }}>🔊</span>
            </div>
          </>
        )}
      </div>

      {flipped && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          {[
            { q: 0, label: "Не знаю", color: "#ff4444" },
            { q: 1, label: "Сложно", color: "#ff8c00" },
            { q: 2, label: "Знаю", color: "#4488ff" },
            { q: 3, label: "Легко!", color: "#00ff88" },
          ].map(({ q, label, color }) => (
            <button key={q} onClick={() => handleQuality(q)} style={{ background: color + "15", border: `1px solid ${color}40`, color, borderRadius: 12, padding: "12px 6px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={(e) => (e.currentTarget.style.background = color + "30")}
              onMouseOut={(e) => (e.currentTarget.style.background = color + "15")}
            >{label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── QUIZ MODULE ─────────────────────────────────────────────────────────────

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function buildQuestion(words) {
  const correct = words[Math.floor(Math.random() * words.length)];
  const mode = Math.random() > 0.5 ? "en2ru" : "ru2en";
  const pool = words.filter((w) => w.word !== correct.word);
  const wrong = shuffle(pool).slice(0, 3);
  const options = shuffle([correct, ...wrong]);
  if (mode === "en2ru") {
    return { mode, prompt: correct.word, transcription: correct.transcription, example: correct.example, correctWord: correct.word, options: options.map((o) => ({ label: o.translation, isCorrect: o.word === correct.word })) };
  }
  return { mode, prompt: correct.translation, transcription: null, example: correct.example, correctWord: correct.word, options: options.map((o) => ({ label: o.word, isCorrect: o.word === correct.word })) };
}

function QuizModule({ studiedCards }) {
  const safeCards = studiedCards && studiedCards.length >= 4 ? studiedCards : null;
  const [question, setQuestion] = useState(() => safeCards ? buildQuestion(safeCards) : null);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [shake, setShake] = useState(false);

  const next = () => { setSelected(null); setQuestion(safeCards ? buildQuestion(safeCards) : null); };

  const pick = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    setTotal((t) => t + 1);
    if (opt.isCorrect) {
      setScore((s) => s + 1);
      setStreak((s) => { const ns = s + 1; setBestStreak((b) => Math.max(b, ns)); return ns; });
      speakText(question.correctWord, 0.9);
    } else {
      setStreak(0);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (!safeCards) return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
      <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Сначала изучи карточки</div>
      <div style={{ color: "#888", fontSize: 13, lineHeight: 1.7 }}>Перейди на вкладку <b style={{ color: "#00ff88" }}>🧠 Слова</b> и повтори хотя бы 4 фразы.</div>
    </div>
  );

  if (!question) return null;
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  const optionColor = (opt) => {
    if (!selected) return { bg: "#0d1117", border: "#ffffff15", color: "#ccc" };
    if (opt.isCorrect) return { bg: "#00ff8815", border: "#00ff8860", color: "#00ff88" };
    if (selected === opt && !opt.isCorrect) return { bg: "#ff444415", border: "#ff444460", color: "#ff4444" };
    return { bg: "#0d1117", border: "#ffffff08", color: "#444" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[{ label: "Правильно", value: score, color: "#00ff88" }, { label: "Точность", value: accuracy + "%", color: "#4488ff" }, { label: "🔥 Серия", value: streak, color: "#ff8c00" }].map((s) => (
          <div key={s.label} style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
            <div style={{ color: s.color, fontSize: 20, fontWeight: 800 }}>{s.value}</div>
            <div style={{ color: "#555", fontSize: 10, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ background: question.mode === "en2ru" ? "#4488ff20" : "#cc44ff20", border: `1px solid ${question.mode === "en2ru" ? "#4488ff50" : "#cc44ff50"}`, color: question.mode === "en2ru" ? "#4488ff" : "#cc44ff", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
          {question.mode === "en2ru" ? "🇬🇧 → 🇷🇺 Переведи на русский" : "🇷🇺 → 🇬🇧 Переведи на английский"}
        </span>
        {streak >= 3 && <span style={{ color: "#ff8c00", fontSize: 12, fontWeight: 700 }}>🔥 {streak} подряд!</span>}
      </div>

      <div style={{ background: "linear-gradient(135deg, #0d1117, #161b22)", border: "1px solid #ffffff15", borderRadius: 20, padding: "28px 24px", textAlign: "center", animation: shake ? "shake 0.4s ease" : "none" }}>
        <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, fontFamily: "Georgia, serif", marginBottom: 8 }}>{question.prompt}</div>
        {question.transcription && <div style={{ color: "#4488ff", fontSize: 13, fontFamily: "monospace", marginBottom: 8 }}>{question.transcription}</div>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <div style={{ color: "#555", fontSize: 12, fontStyle: "italic" }}>{question.example}</div>
          <button onClick={() => speakText(question.correctWord, 0.85)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, opacity: 0.5, padding: 0 }}>🔊</button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {question.options.map((opt, i) => {
          const c = optionColor(opt);
          return (
            <button key={i} onClick={() => pick(opt)} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: "14px 18px", cursor: selected ? "default" : "pointer", color: c.color, fontSize: 14, textAlign: "left", fontWeight: selected && opt.isCorrect ? 700 : 400, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ background: "#ffffff08", borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, color: "#666" }}>
                {["A", "B", "C", "D"][i]}
              </span>
              {opt.label}
              {selected && opt.isCorrect && <span style={{ marginLeft: "auto" }}>✓</span>}
              {selected === opt && !opt.isCorrect && <span style={{ marginLeft: "auto" }}>✗</span>}
            </button>
          );
        })}
      </div>

      {selected && (
        <button onClick={next} style={{ background: selected.isCorrect ? "linear-gradient(135deg, #00cc66, #008844)" : "linear-gradient(135deg, #333, #222)", border: "none", borderRadius: 14, padding: "14px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          {selected.isCorrect ? "Отлично! Следующий →" : "Попробуем ещё →"}
        </button>
      )}
    </div>
  );
}


// ─── SENTENCE BUILDER MODULE ──────────────────────────────────────────────────

const BUILDER_SENTENCES = [
  // A2
  { id: 1, cefr: "A2", words: ["Go", "ahead", "I'm", "listening"], hint: "Продолжай, я слушаю" },
  { id: 2, cefr: "A2", words: ["I", "need", "to", "figure", "out", "this", "problem"], hint: "Мне нужно разобраться с этой проблемой" },
  { id: 3, cefr: "A2", words: ["Could", "you", "repeat", "that", "please"], hint: "Не могли бы вы повторить?" },
  { id: 4, cefr: "A2", words: ["I'm", "going", "to", "learn", "English", "this", "year"], hint: "Я собираюсь учить английский в этом году" },
  { id: 5, cefr: "A2", words: ["It", "depends", "on", "the", "weather"], hint: "Это зависит от погоды" },
  { id: 6, cefr: "A2", words: ["Can", "you", "help", "me", "please"], hint: "Вы можете мне помочь?" },
  { id: 7, cefr: "A2", words: ["I'm", "looking", "for", "the", "train", "station"], hint: "Я ищу железнодорожную станцию" },
  { id: 8, cefr: "A2", words: ["Sorry", "I'm", "late", "there", "was", "traffic"], hint: "Извините, я опоздал, были пробки" },
  // B1
  { id: 9, cefr: "B1", words: ["She", "came", "up", "with", "a", "great", "idea"], hint: "Она придумала отличную идею" },
  { id: 10, cefr: "B1", words: ["We", "went", "through", "a", "tough", "time"], hint: "Мы пережили тяжёлые времена" },
  { id: 11, cefr: "B1", words: ["It", "turned", "out", "to", "be", "a", "great", "day"], hint: "Оказалось, что это был отличный день" },
  { id: 12, cefr: "B1", words: ["I've", "been", "working", "on", "this", "for", "hours"], hint: "Я работаю над этим уже несколько часов" },
  { id: 13, cefr: "B1", words: ["Let", "me", "get", "back", "to", "you", "on", "that"], hint: "Я вернусь к этому позже" },
  { id: 14, cefr: "B1", words: ["That", "sounds", "like", "a", "great", "idea"], hint: "Это звучит как отличная идея" },
  { id: 15, cefr: "B1", words: ["I", "used", "to", "live", "in", "a", "small", "town"], hint: "Раньше я жил в маленьком городе" },
  { id: 16, cefr: "B1", words: ["How", "do", "you", "deal", "with", "stress"], hint: "Как вы справляетесь со стрессом?" },
  // B2
  { id: 17, cefr: "B2", words: ["To", "be", "honest", "I", "don't", "know"], hint: "Честно говоря, я не знаю" },
  { id: 18, cefr: "B2", words: ["In", "other", "words", "we", "need", "more", "time"], hint: "Другими словами, нам нужно больше времени" },
  { id: 19, cefr: "B2", words: ["It", "goes", "without", "saying", "that", "practice", "is", "key"], hint: "Само собой разумеется, что практика — это ключ" },
  { id: 20, cefr: "B2", words: ["Having", "said", "that", "we", "should", "still", "try"], hint: "Тем не менее, нам всё равно стоит попробовать" },
  { id: 21, cefr: "B2", words: ["As", "far", "as", "I", "know", "the", "project", "is", "on", "track"], hint: "Насколько я знаю, проект идёт по плану" },
  { id: 22, cefr: "B2", words: ["I", "couldn't", "agree", "more", "with", "that"], hint: "Я полностью с этим согласен" },
];

function shuffleArr(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function BuilderModule() {
  const [levelFilter, setLevelFilter] = useState("A2");
  const [current, setCurrent] = useState(null);
  const [wordBank, setWordBank] = useState([]);
  const [assembled, setAssembled] = useState([]);
  const [result, setResult] = useState(null); // null | "correct" | "wrong"
  const [wrongIdx, setWrongIdx] = useState([]);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [listened, setListened] = useState(false);
  const [shake, setShake] = useState(false);

  const filtered = BUILDER_SENTENCES.filter(s => s.cefr === levelFilter);

  const loadNew = (excludeId) => {
    const pool = filtered.filter(s => s.id !== excludeId);
    const next = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(next);
    setWordBank(shuffleArr(next.words.map((w, i) => ({ w, key: i }))));
    setAssembled([]);
    setResult(null);
    setWrongIdx([]);
    setListened(false);
  };

  useEffect(() => {
    if (filtered.length > 0) loadNew(null);
  }, [levelFilter]);

  const listen = () => {
    if (!current) return;
    speakText(current.words.join(" "), 0.8);
    setListened(true);
  };

  const addWord = (item) => {
    if (result) return;
    setAssembled(prev => [...prev, item]);
    setWordBank(prev => prev.filter(w => w.key !== item.key));
  };

  const removeWord = (item) => {
    if (result) return;
    setAssembled(prev => prev.filter(w => w.key !== item.key));
    setWordBank(prev => shuffleArr([...prev, item]));
  };

  const check = () => {
    if (assembled.length === 0 || !current) return;
    const userWords = assembled.map(w => w.w);
    const correct = current.words;
    const wrong = [];
    let isCorrect = userWords.length === correct.length;
    userWords.forEach((w, i) => {
      if (w.toLowerCase() !== correct[i]?.toLowerCase()) {
        isCorrect = false;
        wrong.push(i);
      }
    });
    setWrongIdx(wrong);
    setResult(isCorrect ? "correct" : "wrong");
    setTotal(t => t + 1);
    if (isCorrect) {
      setScore(s => s + 1);
      speakText(current.words.join(" "), 0.85);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const retry = () => {
    setWordBank(shuffleArr([...assembled.map(w => w), ...wordBank]));
    setAssembled([]);
    setResult(null);
    setWrongIdx([]);
  };

  if (!current) return <div style={{ color: "#555", textAlign: "center", padding: 40 }}>Загрузка...</div>;

  const accuracy = total > 0 ? Math.round(score / total * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Правильно", value: score, color: "#00ff88" },
          { label: "Точность", value: accuracy + "%", color: "#4488ff" },
          { label: "Всего", value: total, color: "#888" },
        ].map(s => (
          <div key={s.label} style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
            <div style={{ color: s.color, fontSize: 20, fontWeight: 800 }}>{s.value}</div>
            <div style={{ color: "#555", fontSize: 10, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Level selector */}
      <div style={{ display: "flex", gap: 8 }}>
        {["A2", "B1", "B2"].map(lvl => {
          const lc = lvl === "A2" ? "#4488ff" : lvl === "B1" ? "#00ff88" : "#cc44ff";
          return (
            <button key={lvl} onClick={() => setLevelFilter(lvl)} style={{
              background: levelFilter === lvl ? lc + "20" : "#0d1117",
              border: `1px solid ${levelFilter === lvl ? lc + "60" : "#ffffff15"}`,
              borderRadius: 10, padding: "7px 16px", color: levelFilter === lvl ? lc : "#555",
              fontWeight: 700, fontSize: 12, cursor: "pointer"
            }}>{lvl}</button>
          );
        })}
        <div style={{ marginLeft: "auto", color: "#555", fontSize: 11, display: "flex", alignItems: "center" }}>
          {filtered.length} предложений
        </div>
      </div>

      {/* Hint */}
      <div style={{ background: "#0d1117", border: "1px solid #ffffff08", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "#555", fontSize: 12 }}>🇷🇺 {current.hint}</span>
        <button onClick={listen} style={{
          marginLeft: "auto", background: listened ? "#003300" : "#001a33",
          border: `1px solid ${listened ? "#00ff8840" : "#4488ff40"}`,
          borderRadius: 8, padding: "6px 12px", color: listened ? "#00ff88" : "#4488ff",
          fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0
        }}>
          {listened ? "🔊 Ещё раз" : "▶ Слушать"}
        </button>
      </div>

      {/* Assembly area */}
      <div style={{
        minHeight: 64, background: result === "correct" ? "#0a2a0a" : result === "wrong" ? "#1a0a0a" : "#0a0a1a",
        border: `1px solid ${result === "correct" ? "#00ff8850" : result === "wrong" ? "#ff444450" : "#ffffff15"}`,
        borderRadius: 16, padding: "14px 14px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
        transition: "all 0.3s", animation: shake ? "shake 0.4s ease" : "none", cursor: assembled.length > 0 && !result ? "default" : "default"
      }}>
        {assembled.length === 0 && !result && (
          <span style={{ color: "#333", fontSize: 13 }}>Нажимай слова снизу чтобы собрать предложение...</span>
        )}
        {assembled.map((item, i) => (
          <button key={item.key} onClick={() => removeWord(item)} style={{
            background: result === "correct" ? "#00ff8820" : wrongIdx.includes(i) ? "#ff444420" : "#1a1a2e",
            border: `1px solid ${result === "correct" ? "#00ff8860" : wrongIdx.includes(i) ? "#ff444460" : "#4444aa60"}`,
            borderRadius: 8, padding: "7px 12px", color: result === "correct" ? "#00ff88" : wrongIdx.includes(i) ? "#ff4444" : "#aaaaff",
            fontSize: 14, fontWeight: 600, cursor: result ? "default" : "pointer", transition: "all 0.15s"
          }}>{item.w}</button>
        ))}
      </div>

      {/* Word bank */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, minHeight: 48 }}>
        {wordBank.map(item => (
          <button key={item.key} onClick={() => addWord(item)} style={{
            background: "#161b22", border: "1px solid #ffffff20", borderRadius: 8,
            padding: "7px 12px", color: "#ddd", fontSize: 14, fontWeight: 600,
            cursor: "pointer", transition: "all 0.15s"
          }}
            onMouseOver={e => { e.currentTarget.style.background = "#1e2530"; e.currentTarget.style.borderColor = "#4488ff50"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#161b22"; e.currentTarget.style.borderColor = "#ffffff20"; }}
          >{item.w}</button>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        {!result ? (
          <>
            <button onClick={check} disabled={assembled.length === 0}
              style={{ flex: 2, background: assembled.length === 0 ? "#1a1a1a" : "linear-gradient(135deg, #00cc66, #008844)", border: "none", borderRadius: 12, padding: "13px", color: assembled.length === 0 ? "#444" : "#fff", fontWeight: 700, cursor: assembled.length === 0 ? "not-allowed" : "pointer", fontSize: 14 }}>
              Проверить ✓
            </button>
            <button onClick={() => { setAssembled([]); setWordBank(shuffleArr(current.words.map((w, i) => ({ w, key: i })))); }}
              style={{ background: "#0d1117", border: "1px solid #333", borderRadius: 12, padding: "13px 14px", color: "#555", cursor: "pointer", fontSize: 13 }}>
              ↺
            </button>
          </>
        ) : result === "correct" ? (
          <button onClick={() => loadNew(current.id)} style={{ flex: 1, background: "linear-gradient(135deg, #00cc66, #008844)", border: "none", borderRadius: 12, padding: "13px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            Отлично! Следующее →
          </button>
        ) : (
          <>
            <button onClick={retry} style={{ flex: 1, background: "#1a0a0a", border: "1px solid #ff444440", borderRadius: 12, padding: "13px", color: "#ff6666", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
              ↺ Попробовать ещё раз
            </button>
            <button onClick={() => loadNew(current.id)} style={{ flex: 1, background: "#0d1117", border: "1px solid #333", borderRadius: 12, padding: "13px", color: "#666", cursor: "pointer", fontSize: 13 }}>
              Пропустить →
            </button>
          </>
        )}
      </div>

      {/* Correct answer on wrong */}
      {result === "wrong" && (
        <div style={{ background: "#0a0a1a", border: "1px solid #4444ff30", borderRadius: 12, padding: "12px 16px", animation: "fadeIn 0.3s ease" }}>
          <div style={{ color: "#555", fontSize: 11, marginBottom: 6 }}>Правильный порядок:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {current.words.map((w, i) => (
              <span key={i} style={{ background: "#00ff8810", border: "1px solid #00ff8830", borderRadius: 6, padding: "4px 10px", color: "#00ff88", fontSize: 13, fontWeight: 600 }}>{w}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SHADOWING MODULE ────────────────────────────────────────────────────────

const SHADOWING_TEXTS = [
  {
    id: 1, cefr: "A2", topic: "Знакомство", duration: "~30 сек",
    text: "Hi! My name is Alex. I'm from Russia. I work in music production — I create songs using AI tools. It's a really exciting field right now. I've been learning English for a few months, and I'm making good progress. Nice to meet you!",
    focus: "Интонация приветствия, ритм простых предложений",
  },
  {
    id: 2, cefr: "A2", topic: "Мой день", duration: "~35 сек",
    text: "Every morning I wake up at eight o'clock. I make coffee and check my phone. Then I start working on my music projects. I usually spend about three hours creating new tracks. In the evening I watch videos in English to improve my listening skills.",
    focus: "Present Simple, ударения на ключевых словах",
  },
  {
    id: 3, cefr: "B1", topic: "AI и музыка", duration: "~40 сек",
    text: "Artificial intelligence is completely changing the music industry. Tools like Suno allow anyone to create professional-sounding tracks in minutes. What I find fascinating is how AI can figure out different musical styles and genres. I've been working with these tools for over a year now, and the results are incredible.",
    focus: "Фразовые глаголы, Present Perfect, беглость",
  },
  {
    id: 4, cefr: "B1", topic: "Планы и цели", duration: "~40 сек",
    text: "I'm going to focus on learning English this year because it opens so many doors. To be honest, I used to think it was too difficult, but now I realise it just takes consistency. If you practise every single day, even for twenty minutes, you'll make real progress. It depends on how committed you are.",
    focus: "Разговорные блоки, интонация уверенности",
  },
  {
    id: 5, cefr: "B1", topic: "Технологии", duration: "~45 сек",
    text: "The way we learn languages has changed dramatically. In the past, you had to find a native speaker or move abroad. Now you can practise with AI twenty-four hours a day. What I mean is — the barriers have completely broken down. Anyone can go ahead and start learning from anywhere in the world. It turns out that consistency matters more than expensive courses.",
    focus: "Фразы из карточек в живом тексте",
  },
  {
    id: 6, cefr: "B2", topic: "Бизнес и творчество", duration: "~50 сек",
    text: "Building a creative business in the digital age requires both artistic vision and technical skills. Having said that, the most successful creators I've come across are those who come up with original ideas and deal with challenges without giving up. In other words, resilience matters as much as talent. It goes without saying that in today's market, you also need to set up a strong online presence.",
    focus: "B2 коллокации, естественный темп",
  },
];

const SHADOWING_STEPS = [
  { id: 1, icon: "👂", label: "Слушай", desc: "Прослушай текст целиком — просто знакомься, не повторяй" },
  { id: 2, icon: "👄", label: "Шёпот", desc: "Слушай и шёпотом повторяй вслед — без текста" },
  { id: 3, icon: "🗣️", label: "Вслух", desc: "Читай текст и говори одновременно с озвучкой" },
  { id: 4, icon: "⚡", label: "Без текста", desc: "Закрой текст — говори только на слух" },
];

function ShadowingModule() {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [showText, setShowText] = useState(true);
  const [completed, setCompleted] = useState([]);

  const speak = (text, rate = 0.8) => {
    setSpeaking(true);
    speakText(text, rate);
    const est = (text.split(" ").length / 2.5) * 1000;
    setTimeout(() => setSpeaking(false), est);
  };

  const stopSpeak = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  const handleStep = (s) => {
    setStep(s);
    setShowText(s !== 3);
    stopSpeak();
    if (s === 0 || s === 1) {
      setTimeout(() => speak(selected.text, s === 0 ? 0.75 : 0.8), 300);
    }
  };

  const finish = () => {
    setCompleted(prev => [...new Set([...prev, selected.id])]);
    setSelected(null);
    setStep(0);
    stopSpeak();
  };

  if (!selected) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ color: "#888", fontSize: 13, lineHeight: 1.7 }}>
        Shadowing — повторяй вслед за носителем с той же интонацией и ритмом.<br/>
        <span style={{ color: "#555", fontSize: 11 }}>Выбери текст по уровню и следуй 4 шагам протокола.</span>
      </div>

      {SHADOWING_TEXTS.map(t => {
        const done = completed.includes(t.id);
        const levelColor = t.cefr === "A2" ? "#4488ff" : t.level === "B1" ? "#00ff88" : "#cc44ff";
        return (
          <button key={t.id} onClick={() => { setSelected(t); setStep(0); setShowText(true); }}
            style={{ background: done ? "#0a1a0a" : "#0d1117", border: `1px solid ${done ? "#00ff8830" : "#ffffff12"}`, borderRadius: 14, padding: "16px 18px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
            onMouseOver={e => e.currentTarget.style.border = `1px solid ${levelColor}50`}
            onMouseOut={e => e.currentTarget.style.border = `1px solid ${done ? "#00ff8830" : "#ffffff12"}`}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ background: levelColor + "20", color: levelColor, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{t.level}</span>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{t.topic}</span>
              <span style={{ color: "#444", fontSize: 11, marginLeft: "auto" }}>{t.duration}</span>
              {done && <span style={{ color: "#00ff88", fontSize: 12 }}>✓</span>}
            </div>
            <div style={{ color: "#555", fontSize: 11 }}>Фокус: {t.focus}</div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => { setSelected(null); stopSpeak(); }} style={{ background: "none", border: "1px solid #333", color: "#888", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>← тексты</button>
        <span style={{ color: "#fff", fontWeight: 700 }}>{selected.topic}</span>
        <span style={{ color: "#444", fontSize: 11, marginLeft: "auto" }}>Фокус: {selected.focus}</span>
      </div>

      {/* Steps */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
        {SHADOWING_STEPS.map((s, i) => (
          <button key={i} onClick={() => handleStep(i)} style={{
            background: step === i ? "#00ff8815" : "#0d1117",
            border: `1px solid ${step === i ? "#00ff8850" : "#ffffff10"}`,
            borderRadius: 12, padding: "10px 6px", cursor: "pointer", textAlign: "center",
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ color: step === i ? "#00ff88" : "#888", fontSize: 11, fontWeight: 700 }}>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Step description */}
      <div style={{ background: "#0a1a0a", border: "1px solid #00ff8820", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#aaa" }}>
        <b style={{ color: "#00ff88" }}>Шаг {step + 1}: {SHADOWING_STEPS[step].label}</b> — {SHADOWING_STEPS[step].desc}
      </div>

      {/* Text */}
      <div style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 16, padding: "20px 18px", lineHeight: 2, fontSize: 15, color: showText ? "#ddd" : "#1a1a2a", userSelect: showText ? "text" : "none", transition: "color 0.3s", position: "relative", minHeight: 120 }}>
        {selected.text}
        {!showText && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#333", fontSize: 13 }}>
            Текст скрыт — говори на слух 🎧
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => speak(selected.text, step === 0 ? 0.7 : 0.85)} disabled={speaking}
          style={{ flex: 1, background: speaking ? "#1a2a1a" : "linear-gradient(135deg, #004488, #002244)", border: "none", borderRadius: 12, padding: "12px", color: speaking ? "#00ff88" : "#4488ff", fontWeight: 700, cursor: speaking ? "not-allowed" : "pointer", fontSize: 14 }}>
          {speaking ? "🔊 Играет..." : "▶ Прослушать"}
        </button>
        {speaking && (
          <button onClick={stopSpeak} style={{ background: "#1a0a0a", border: "1px solid #ff444440", borderRadius: 12, padding: "12px 16px", color: "#ff4444", cursor: "pointer", fontSize: 14 }}>⏹</button>
        )}
        <button onClick={() => setShowText(s => !s)}
          style={{ background: "#0d1117", border: "1px solid #ffffff15", borderRadius: 12, padding: "12px 16px", color: "#888", cursor: "pointer", fontSize: 14 }}>
          {showText ? "🙈" : "👁️"}
        </button>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10 }}>
        {step > 0 && (
          <button onClick={() => handleStep(step - 1)} style={{ flex: 1, background: "#0d1117", border: "1px solid #ffffff15", borderRadius: 12, padding: "11px", color: "#888", cursor: "pointer", fontSize: 13 }}>← Предыдущий шаг</button>
        )}
        {step < 3 ? (
          <button onClick={() => handleStep(step + 1)} style={{ flex: 2, background: "linear-gradient(135deg, #00cc66, #008844)", border: "none", borderRadius: 12, padding: "11px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            Следующий шаг →
          </button>
        ) : (
          <button onClick={finish} style={{ flex: 2, background: "linear-gradient(135deg, #00cc66, #008844)", border: "none", borderRadius: 12, padding: "11px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            ✓ Готово!
          </button>
        )}
      </div>
    </div>
  );
}

// ─── DIARY MODULE ─────────────────────────────────────────────────────────────

function DiaryModule() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("diary_entries") || "[]"); } catch { return []; }
  });
  const [view, setView] = useState("write"); // write | history

  const save = (entry) => {
    const updated = [entry, ...entries].slice(0, 30);
    setEntries(updated);
    try { localStorage.setItem("diary_entries", JSON.stringify(updated)); } catch {}
  };

  const submit = async () => {
    if (!text.trim() || text.trim().length < 10) return;
    setLoading(true);
    setFeedback(null);

    const sys = `You are a friendly English teacher correcting a Russian learner's diary entry. 

Analyze the text and respond in this EXACT format (use these exact headers):

✅ ОБЩАЯ ОЦЕНКА
[2-3 sentences in Russian praising what's good]

🔧 ИСПРАВЛЕНИЯ
[List each correction as: ❌ original → ✅ corrected (brief Russian explanation)]
If no errors, write "Ошибок не найдено! Отличный текст."

💬 УЛУЧШЕНИЯ СТИЛЯ
[2-3 suggestions in Russian for more natural phrasing, with examples]

📝 ИСПРАВЛЕННЫЙ ТЕКСТ
[The full corrected version of their text]

Keep feedback encouraging and constructive. Focus on patterns, not just individual mistakes.`;

    const reply = await callClaude([{ role: "user", content: text }], sys);
    const entry = { date: new Date().toLocaleDateString("ru-RU"), text, feedback: reply };
    save(entry);
    setFeedback(reply);
    setLoading(false);
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  if (view === "history") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <button onClick={() => setView("write")} style={{ background: "none", border: "1px solid #333", color: "#888", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>← написать</button>
        <span style={{ color: "#fff", fontWeight: 700 }}>История записей ({entries.length})</span>
      </div>
      {entries.length === 0 && <div style={{ color: "#555", textAlign: "center", padding: 30 }}>Записей пока нет</div>}
      {entries.map((e, i) => (
        <div key={i} style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ color: "#555", fontSize: 11, marginBottom: 8 }}>{e.date}</div>
          <div style={{ color: "#ccc", fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>{e.text}</div>
          {e.feedback && (
            <details>
              <summary style={{ color: "#4488ff", fontSize: 12, cursor: "pointer" }}>Показать обратную связь</summary>
              <div style={{ color: "#aaa", fontSize: 12, lineHeight: 1.8, marginTop: 10, whiteSpace: "pre-wrap" }}>{e.feedback}</div>
            </details>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Языковой дневник</div>
          <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>Пиши на английском — Claude исправит и объяснит</div>
        </div>
        {entries.length > 0 && (
          <button onClick={() => setView("history")} style={{ background: "none", border: "1px solid #333", color: "#888", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 11 }}>
            История ({entries.length})
          </button>
        )}
      </div>

      {/* Prompts */}
      <div style={{ background: "#0d1117", border: "1px solid #ffffff08", borderRadius: 12, padding: "12px 14px" }}>
        <div style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Идеи для записи сегодня:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[
            "Опиши своё утро",
            "Что ты узнал сегодня?",
            "Расскажи о своём проекте",
            "Что тебя сегодня удивило?",
            "Твои планы на завтра",
            "Опиши свою музыку",
          ].map(p => (
            <button key={p} onClick={() => setText(prev => prev ? prev + " " + p + "." : p + ". ")}
              style={{ background: "#161b22", border: "1px solid #ffffff10", borderRadius: 8, padding: "4px 10px", color: "#666", fontSize: 11, cursor: "pointer" }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Text area */}
      <div style={{ position: "relative" }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write in English here... Even a few sentences is great! Try to use phrases you've learned."
          style={{ width: "100%", minHeight: 140, background: "#0d1117", border: "1px solid #ffffff20", borderRadius: 14, padding: "14px 16px", color: "#fff", fontSize: 14, lineHeight: 1.7, outline: "none", resize: "vertical", fontFamily: "inherit" }}
        />
        <div style={{ position: "absolute", bottom: 10, right: 12, color: wordCount >= 30 ? "#00ff88" : "#444", fontSize: 11 }}>
          {wordCount} слов {wordCount >= 30 ? "✓" : `(цель: 30)`}
        </div>
      </div>

      <button onClick={submit} disabled={loading || text.trim().length < 10}
        style={{ background: loading || text.trim().length < 10 ? "#1a1a1a" : "linear-gradient(135deg, #4444ff, #2222cc)", border: "none", borderRadius: 14, padding: "13px", color: loading || text.trim().length < 10 ? "#444" : "#fff", fontWeight: 700, cursor: loading || text.trim().length < 10 ? "not-allowed" : "pointer", fontSize: 14 }}>
        {loading ? "✍️ Claude проверяет..." : "📝 Получить обратную связь"}
      </button>

      {/* Feedback */}
      {feedback && (
        <div style={{ background: "#0a0a1a", border: "1px solid #4444ff30", borderRadius: 16, padding: "18px 18px", animation: "fadeIn 0.3s ease" }}>
          <div style={{ color: "#4488ff", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Обратная связь от Claude</div>
          <div style={{ color: "#bbb", fontSize: 13, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{feedback}</div>
          <button onClick={() => { setText(""); setFeedback(null); }}
            style={{ marginTop: 14, background: "none", border: "1px solid #333", color: "#666", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12 }}>
            Написать следующую запись
          </button>
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
    const newSegments = [];
    for (const seg of segments) {
      if (seg.phrase !== null) { newSegments.push(seg); continue; }
      const lw = w.word.toLowerCase();
      let rest = seg.text;
      while (true) {
        const found = rest.toLowerCase().indexOf(lw);
        if (found === -1) { newSegments.push({ text: rest, phrase: null }); break; }
        if (found > 0) newSegments.push({ text: rest.slice(0, found), phrase: null });
        newSegments.push({ text: rest.slice(found, found + w.word.length), phrase: w });
        rest = rest.slice(found + w.word.length);
      }
    }
    segments = newSegments;
  }
  return segments;
}

function ReadingModule({ studiedCards }) {
  const [topic, setTopic] = useState(null);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePhrase, setActivePhrase] = useState(null);

  const wordsToUse = studiedCards && studiedCards.length >= 4 ? studiedCards : null;

  const hasEnough = !!wordsToUse;

  const generate = async (t) => {
    setTopic(t);
    setStory(null);
    setActivePhrase(null);
    setLoading(true);
    const story = await generateStory(wordsToUse, t.label);
    setStory(story);
    setLoading(false);
  };

  const handlePhraseClick = (phrase) => {
    setActivePhrase((prev) => (prev?.word === phrase.word ? null : phrase));
    speakText(phrase.word, 0.85);
  };

  if (!hasEnough) return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
      <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Сначала изучи карточки</div>
      <div style={{ color: "#888", fontSize: 13, lineHeight: 1.7 }}>Перейди на вкладку <b style={{ color: "#00ff88" }}>🧠 Слова</b> и повтори хотя бы 4 фразы.<br />Тогда Claude напишет рассказ именно с ними.</div>
    </div>
  );

  if (!topic) return (
    <div>
      <div style={{ color: "#888", fontSize: 13, marginBottom: 6 }}>Выбери тему — Claude напишет рассказ с твоими фразами:</div>
      <div style={{ color: "#555", fontSize: 11, marginBottom: 16 }}>Фразы из карточек будут подсвечены прямо в тексте</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {READING_TOPICS.map((t) => (
          <button key={t.id} onClick={() => generate(t)} style={{ background: "#0d1117", border: "1px solid #ffffff15", borderRadius: 14, padding: "18px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
            onMouseOver={(e) => { e.currentTarget.style.border = "1px solid #cc44ff50"; e.currentTarget.style.background = "#0d0a1a"; }}
            onMouseOut={(e) => { e.currentTarget.style.border = "1px solid #ffffff15"; e.currentTarget.style.background = "#0d1117"; }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{t.icon}</div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{t.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const segments = story ? highlightPhrases(story, wordsToUse) : [];
  const foundPhrases = story ? wordsToUse.filter((w) => story.toLowerCase().includes(w.word.toLowerCase())) : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{topic.icon}</span>
        <span style={{ color: "#fff", fontWeight: 700 }}>{topic.label}</span>
        <button onClick={() => setTopic(null)} style={{ marginLeft: "auto", background: "none", border: "1px solid #333", color: "#888", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>← темы</button>
        {story && <button onClick={() => generate(topic)} style={{ background: "none", border: "1px solid #cc44ff40", color: "#cc44ff", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>🔄 новый</button>}
      </div>

      {loading && <div style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 16, padding: 32, textAlign: "center" }}><div style={{ color: "#cc44ff", fontSize: 13 }}>✍️ Claude пишет рассказ...</div></div>}

      {story && !loading && (
        <>
          <div style={{ background: "#0d1117", border: "1px solid #ffffff12", borderRadius: 16, padding: "22px 20px", lineHeight: 2, fontSize: 15, color: "#ddd" }}>
            {segments.map((seg, i) =>
              seg.phrase ? (
                <span key={i} onClick={() => handlePhraseClick(seg.phrase)} style={{ background: activePhrase?.word === seg.phrase.word ? "#cc44ff30" : "#cc44ff15", border: `1px solid ${activePhrase?.word === seg.phrase.word ? "#cc44ff80" : "#cc44ff40"}`, borderRadius: 6, padding: "1px 5px", cursor: "pointer", color: activePhrase?.word === seg.phrase.word ? "#fff" : "#cc88ff", fontWeight: 600, transition: "all 0.15s" }}>{seg.text}</span>
              ) : <span key={i}>{seg.text}</span>
            )}
          </div>

          {activePhrase && (
            <div style={{ background: "linear-gradient(135deg, #1a0a2a, #0d0617)", border: "1px solid #cc44ff40", borderRadius: 14, padding: "14px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ color: "#cc88ff", fontWeight: 700, fontSize: 15 }}>{activePhrase.word}</span>
                <button onClick={() => speakText(activePhrase.word)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>🔊</button>
                <span style={{ color: "#666", fontSize: 12, fontFamily: "monospace" }}>{activePhrase.transcription}</span>
                <button onClick={() => setActivePhrase(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16 }}>×</button>
              </div>
              <div style={{ color: "#00ff88", fontSize: 13, marginBottom: 6 }}>{activePhrase.translation}</div>
              <div style={{ color: "#666", fontSize: 12, fontStyle: "italic" }}>{activePhrase.example}</div>
            </div>
          )}

          <div style={{ background: "#0a0a0f", border: "1px solid #ffffff08", borderRadius: 12, padding: "12px 16px" }}>
            <div style={{ color: "#555", fontSize: 11, marginBottom: 10, textTransform: "uppercase", letterSpacing: 2 }}>Фразы в тексте: {foundPhrases.length}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {foundPhrases.map((p) => (
                <span key={p.word} onClick={() => handlePhraseClick(p)} style={{ background: "#cc44ff15", border: "1px solid #cc44ff30", borderRadius: 8, padding: "3px 9px", fontSize: 11, color: "#cc88ff", cursor: "pointer" }}>{p.word}</span>
              ))}
            </div>
          </div>

          <button onClick={() => speakText(story, 0.8)} style={{ background: "linear-gradient(135deg, #cc44ff20, #8822cc20)", border: "1px solid #cc44ff40", borderRadius: 14, padding: "12px", color: "#cc88ff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            🔊 Прочитать весь текст вслух
          </button>
        </>
      )}
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
    setScenario(sc);
    setMessages([]);
    setLoading(true);
    const sys = `You are an English language tutor helping a Russian-speaking adult learner. ${sc.prompt}\n\nRules:\n- Speak ONLY in English (unless briefly explaining a correction in Russian)\n- After the user responds, add a short "💬 Correction:" block at the end if they made mistakes\n- Keep your messages concise (2-4 sentences max)\n- Be encouraging and warm\n- Start the conversation immediately`;
    const reply = await callClaude([], sys);
    setMessages([{ role: "assistant", content: reply, sys }]);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);
    const sys = messages[0]?.sys || "";
    const reply = await callClaude(history.map((m) => ({ role: m.role, content: m.content })), sys);
    setMessages([...history, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  if (!scenario) return (
    <div>
      <div style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>Выбери сценарий для практики:</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {SCENARIOS.map((sc) => (
          <button key={sc.id} onClick={() => startScenario(sc)} style={{ background: "#0d1117", border: "1px solid #ffffff15", borderRadius: 14, padding: "16px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
            onMouseOver={(e) => { e.currentTarget.style.border = "1px solid #00ff8840"; e.currentTarget.style.background = "#0a1a0f"; }}
            onMouseOut={(e) => { e.currentTarget.style.border = "1px solid #ffffff15"; e.currentTarget.style.background = "#0d1117"; }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{sc.icon}</div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{sc.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 480 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #ffffff10" }}>
        <span style={{ fontSize: 20 }}>{scenario.icon}</span>
        <span style={{ color: "#fff", fontWeight: 700 }}>{scenario.label}</span>
        <button onClick={() => setScenario(null)} style={{ marginLeft: "auto", background: "none", border: "1px solid #333", color: "#888", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>← сценарии</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingRight: 4 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "82%", padding: "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "linear-gradient(135deg, #1a3a2a, #0d2a1a)" : "#161b22", border: m.role === "user" ? "1px solid #00ff8830" : "1px solid #ffffff10", color: "#e0e0e0", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ display: "flex", justifyContent: "flex-start" }}><div style={{ background: "#161b22", border: "1px solid #ffffff10", borderRadius: "18px 18px 18px 4px", padding: "12px 20px", color: "#555" }}>···</div></div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()} placeholder="Type in English... (Enter to send)" style={{ flex: 1, background: "#0d1117", border: "1px solid #ffffff20", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" }} />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background: loading ? "#1a2a1a" : "linear-gradient(135deg, #00cc66, #00aa44)", border: "none", borderRadius: 12, padding: "12px 20px", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: 18 }}>→</button>
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
      { time: "10мин", act: "Shadowing — повторяй за носителем вслух", tool: "BBC Learning English" },
      { time: "10мин", act: "Просмотр контента с субтитрами", tool: "YouTube / Netflix" },
    ],
    "60": [
      { time: "15мин", act: "Anki — повторение + новые карточки", tool: "вкладка Слова" },
      { time: "15мин", act: "Shadowing — 2 отрывка вслух", tool: "YouTube с субтитрами" },
      { time: "15мин", act: "Игра или Текст", tool: "вкладки Игра / Текст" },
      { time: "15мин", act: "Диалог с AI — выбери сценарий", tool: "вкладка Диалог" },
    ],
    "90": [
      { time: "20мин", act: "Anki — повторение + новые слова", tool: "вкладка Слова" },
      { time: "15мин", act: "Shadowing — интенсивный блок", tool: "TED-Ed / BBC" },
      { time: "15мин", act: "Игра en↔ru без подглядывания", tool: "вкладка Игра" },
      { time: "20мин", act: "Диалог с AI — полный сценарий", tool: "вкладка Диалог" },
      { time: "10мин", act: "Текст: читай рассказ с фразами вслух", tool: "вкладка Текст" },
      { time: "10мин", act: "Self-talk: опиши свой день вслух", tool: "без инструментов" },
    ],
  };

  const phases = [
    {
      days: "1–14", title: "Фундамент", color: "#4488ff",
      goal: "Настроить слух, запустить привычку, первые 70 фраз",
      tasks: [
        "Открывай 5 новых фраз каждый день (вкладка Слова)",
        "Shadowing 10–15 мин: повторяй за носителем вслух",
        "Переключи телефон на английский язык",
        "Смотри 6 Minute English (BBC) — 1 выпуск в день",
        "Метрика дня 14: 70 фраз в работе, понимаешь медленную речь",
      ],
    },
    {
      days: "15–30", title: "База", color: "#00ff88",
      goal: "1000 слов, первые разговоры, паттерны речи",
      tasks: [
        "Продолжай открывать 5 фраз в день (уже B1 уровень)",
        "Добавь Игру: тренируй en→ru и ru→en каждый день",
        "Self-talk: говори вслух что делаешь (I'm making coffee...)",
        "Первый диалог с AI: сценарий Everyday Talk",
        "Метрика дня 30: 150 фраз, можешь представиться и поговорить о себе",
      ],
    },
    {
      days: "31–60", title: "Погружение", color: "#ff8c00",
      goal: "Свободный базовый разговор, понимание 60% аудио",
      tasks: [
        "Читай рассказы во вкладке Текст — нажимай на фразы",
        "Смотри сериал с английскими субтитрами (не русскими!)",
        "Диалог с AI каждый день — меняй сценарии",
        "Языковой дневник: 3–5 предложений в день на английском",
        "Метрика дня 60: говоришь 5–10 мин без остановок, понимаешь подкасты",
      ],
    },
    {
      days: "61–90", title: "Автономия", color: "#cc44ff",
      goal: "Свободное общение, B1–B2, 2000+ фраз",
      tasks: [
        "Смотри YouTube по AI-музыке на английском без субтитров",
        "Пиши описания треков и посты на английском",
        "30 мин разговора с AI без подготовки — любые темы",
        "Записывай себя на аудио раз в неделю — сравнивай прогресс",
        "Метрика дня 90: говоришь на любую тему, понимаешь 80%+ аудио",
      ],
    },
  ];

  const currentPhase = phases.find(p => {
    const [s, e] = p.days.split("–").map(Number);
    return day >= s && day <= e;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Day slider */}
      <div style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 14, padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "#888", fontSize: 12 }}>День прогресса</span>
          <span style={{ color: "#fff", fontWeight: 700 }}>{day} / 90</span>
        </div>
        <input type="range" min={1} max={90} value={day} onChange={e => setDay(+e.target.value)} style={{ width: "100%", accentColor: currentPhase?.color || "#00ff88" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          {phases.map(p => (
            <span key={p.days} style={{ fontSize: 9, color: currentPhase?.days === p.days ? currentPhase.color : "#333", fontWeight: 700 }}>{p.days}</span>
          ))}
        </div>
      </div>

      {/* Current phase */}
      {currentPhase && (
        <div style={{ background: currentPhase.color + "10", border: `1px solid ${currentPhase.color}40`, borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ color: currentPhase.color, fontSize: 10, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>● Сейчас · Дни {currentPhase.days}</span>
          </div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{currentPhase.title}</div>
          <div style={{ color: "#888", fontSize: 12, marginBottom: 14 }}>{currentPhase.goal}</div>
          {currentPhase.tasks.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ color: currentPhase.color, fontSize: 12, marginTop: 1, flexShrink: 0 }}>✓</span>
              <span style={{ color: "#bbb", fontSize: 13, lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </div>
      )}

      {/* Daily schedule by mode */}
      <div style={{ background: "#0d1117", border: "1px solid #ffffff10", borderRadius: 16, padding: "18px 20px" }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Расписание дня</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[["30", "30 мин"], ["60", "60 мин"], ["90", "90 мин"]].map(([val, label]) => (
            <button key={val} onClick={() => setMode(val)} style={{
              background: mode === val ? "#00ff88" : "#161b22",
              border: `1px solid ${mode === val ? "#00ff88" : "#333"}`,
              borderRadius: 8, padding: "6px 14px", color: mode === val ? "#000" : "#888",
              fontSize: 12, fontWeight: 700, cursor: "pointer"
            }}>{label}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {schedules[mode].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "#0a0a0f", border: "1px solid #ffffff08", borderRadius: 10, padding: "10px 14px" }}>
              <span style={{ color: "#ff8c00", fontSize: 11, fontFamily: "monospace", fontWeight: 700, minWidth: 36 }}>{row.time}</span>
              <span style={{ color: "#ddd", fontSize: 13, flex: 1 }}>{row.act}</span>
              <span style={{ color: "#444", fontSize: 11 }}>{row.tool}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ background: "#0a1a0a", border: "1px solid #00ff8820", borderRadius: 14, padding: 16 }}>
        <div style={{ color: "#00ff88", fontWeight: 700, marginBottom: 12, fontSize: 13 }}>Ожидаемые результаты</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {[
            ["14 дн", "70 фраз", "#4488ff"],
            ["30 дн", "Базовый разговор", "#00ff88"],
            ["60 дн", "Свободная речь", "#ff8c00"],
            ["90 дн", "B1–B2", "#cc44ff"],
          ].map(([time, label, color]) => (
            <div key={time} style={{ background: color + "10", border: `1px solid ${color}20`, borderRadius: 10, padding: "10px 6px", textAlign: "center" }}>
              <div style={{ color, fontWeight: 700, fontSize: 12 }}>{time}</div>
              <div style={{ color: "#888", fontSize: 10, marginTop: 4, lineHeight: 1.4 }}>{label}</div>
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
  const [placementDone, setPlacementDone] = useState(() => {
    try { return !!localStorage.getItem("placement_done"); } catch { return false; }
  });
  const [userLevel, setUserLevel] = useState(() => {
    try { return localStorage.getItem("user_level") || null; } catch { return null; }
  });

  const { cards, unlockedCards, due, mastered, reviewCard, unlockNewCards, newAvailable, totalUnlocked } = useSRS();
  const { streak, daysSinceLastSession, recordSession } = useMotivation();

  const handlePlacementComplete = ({ level, selfLevel }) => {
    localStorage.setItem("placement_done", "1");
    localStorage.setItem("user_level", level);
    setPlacementDone(true);
    setUserLevel(level);
  };

  if (!placementDone) return <PlacementAgent onComplete={handlePlacementComplete} />;

  const studiedCards = unlockedCards.filter((c) => (c.reviewed || 0) > 0);
  const isLocked = studiedCards.length < 4;

  const tabs = [
    { id: "cards", label: "Слова", icon: "🧠", badge: due.length },
    { id: "quiz", label: "Игра", icon: "🎮", locked: isLocked },
    { id: "builder", label: "Сборка", icon: "🔤", locked: isLocked },
    { id: "reading", label: "Текст", icon: "📖", locked: isLocked },
    { id: "shadow", label: "Тень", icon: "🎙️" },
    { id: "diary", label: "Дневник", icon: "✍️" },
    { id: "chat", label: "Диалог", icon: "🗣️" },
    { id: "plan", label: "План", icon: "📅" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "system-ui, -apple-system, sans-serif", color: "#fff", paddingBottom: 40 }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        input::placeholder { color: #555; }
        @keyframes pulse { 0%,100% { opacity: 0.4 } 50% { opacity: 1 } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-8px) } 75% { transform: translateX(8px) } }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(180deg, #0d1117 0%, #0a0a0f 100%)", borderBottom: "1px solid #ffffff08", padding: "20px 20px 16px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: "#00ff88", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 3 }}>
                AI English Coach {userLevel && <span style={{ color: "#4488ff" }}>· {userLevel}</span>}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5, fontFamily: "'Unbounded', sans-serif" }}>English Coach</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <ProgressRing value={totalUnlocked} max={cards.length} size={52} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#00ff88", fontWeight: 700 }}>
                  {Math.round((totalUnlocked / Math.max(cards.length, 1)) * 100)}%
                </div>
              </div>
              {streak > 0 && <div style={{ color: "#ff8c00", fontSize: 10, marginTop: 2 }}>🔥 {streak}</div>}
            </div>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <MotivationBanner streak={streak} daysSince={daysSinceLastSession} />
            <TipBanner />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "14px 20px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4, marginBottom: 22 }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "linear-gradient(135deg, #00cc66, #008844)" : "#0d1117", border: tab === t.id ? "none" : "1px solid #ffffff10", borderRadius: 12, padding: "9px 4px", cursor: "pointer", color: tab === t.id ? "#fff" : t.locked ? "#333" : "#666", fontSize: 10, fontWeight: 700, transition: "all 0.2s", position: "relative" }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{t.icon}</div>
              {t.locked ? "🔒" : t.label}
              {t.badge > 0 && (
                <span style={{ position: "absolute", top: 3, right: 3, background: "#ff4444", color: "#fff", borderRadius: "50%", width: 15, height: 15, fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>
                  {t.badge > 9 ? "9+" : t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ animation: "fadeIn 0.3s ease" }}>
          {tab === "cards" && <SRSModule due={due} mastered={mastered} cards={cards} reviewCard={reviewCard} unlockNewCards={unlockNewCards} newAvailable={newAvailable} totalUnlocked={totalUnlocked} recordSession={recordSession} />}
          {tab === "quiz" && <QuizModule studiedCards={studiedCards} />}
          {tab === "builder" && <BuilderModule />}
          {tab === "reading" && <ReadingModule studiedCards={studiedCards} />}
          {tab === "shadow" && <ShadowingModule />}
          {tab === "diary" && <DiaryModule />}
          {tab === "chat" && <ChatModule />}
          {tab === "plan" && <PlanModule />}
        </div>
      </div>
    </div>
  );
}
