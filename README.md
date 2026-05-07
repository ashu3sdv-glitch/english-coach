# AI English Coach

Приложение для изучения английского с интервальным повторением, AI-диалогами и генерацией текстов.

## Деплой на Vercel

### 1. Загрузи проект на GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ТВО_ИМЯПОЛЬЗОВАТЕЛЯ/english-coach.git
git push -u origin main
```

### 2. Подключи к Vercel

1. Зайди на [vercel.com](https://vercel.com)
2. New Project → Import из GitHub → выбери english-coach
3. Framework Preset: **Vite**
4. Root Directory: оставь пустым (или `.`)
5. Build Command: `npm run build`
6. Output Directory: `dist`

### 3. Добавь API-ключ

В Vercel → Settings → Environment Variables:

```
ANTHROPIC_API_KEY = sk-ant-...твой ключ...
```

### 4. Деплой

Нажми Deploy. Через 1-2 минуты приложение будет доступно по адресу типа `english-coach.vercel.app`.

---

## Структура проекта

```
/
├── api/
│   ├── chat.js       # Serverless: диалоги с Claude
│   └── story.js      # Serverless: генерация текстов
├── src/
│   ├── App.jsx       # Всё приложение
│   ├── main.jsx      # Точка входа
│   └── index.html    # HTML шаблон
├── package.json
├── vite.config.js
└── vercel.json
```

## Агенты

| Агент | Роль |
|-------|------|
| Placement Agent | Тест уровня при первом входе |
| SRS Agent | Интервальное повторение (5 фраз/день) |
| Quiz Agent | Игра en↔ru с множественным выбором |
| Reading Agent | Генерация текстов с подсветкой фраз |
| Chat Agent | Живые диалоги с коррекцией ошибок |
| Motivation Agent | Трекер streak и напоминания |
