# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## UI UX Pro Max (Skill)

UI UX Pro Max is an AI-powered design intelligence toolkit providing searchable databases of UI styles, color palettes, font pairings, chart types, and UX guidelines. It works as a skill/workflow for AI coding assistants (Claude Code, Windsurf, Cursor, etc.).

### Search Command

```bash
python3 src/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> [-n <max_results>]
```

**Domain search:**
- `product` - Product type recommendations (SaaS, e-commerce, portfolio)
- `style` - UI styles (glassmorphism, minimalism, brutalism) + AI prompts and CSS keywords
- `typography` - Font pairings with Google Fonts imports
- `color` - Color palettes by product type
- `landing` - Page structure and CTA strategies
- `chart` - Chart types and library recommendations
- `ux` - Best practices and anti-patterns
- `icons` - Icon recommendations with import code (Phosphor, Heroicons, Lucide)
- `react` - React/Next.js performance patterns
- `web` - App interface guidelines (iOS/Android/React Native)
- `google-fonts` - Individual Google Fonts lookup
- `gsap` - GSAP animation skeletons by intensity tier (hover, scroll reveal, stagger, page transition, parallax, loading)

**Design dials (optional, only with `--design-system`):**
```bash
python3 src/ui-ux-pro-max/scripts/search.py "<query>" --design-system --variance <1-10> --motion <1-10> --density <1-10>
```

**Note:** On Windows, use `python` instead of `python3` to run the scripts.

---

## BLISSS.ENG — Сайт онлайн-школи англійської мови

### Проект

Односторінковий сайт для онлайн-школи англійської мови **BLISSS.ENG**, заснованої Андріаною.
Сайт зібраний на чистому HTML/CSS/JS (без фреймворків), використовує Lenis для smooth scroll.

- **Домен:** blisss-eng.com (куплений на hosting.ua, DNS A-записи → 76.76.21.21)
- **Хостинг:** Vercel (проект `blisss-eng`, ID: `prj_LDe9pJUGn4UzEinjEPKCSE9muSOI`, team: `team_clzZkoVjOpRRJbuE8mroCAOG`)
- **Репозиторій:** github.com/andriy010203040506070809-del/blisss-eng.git (гілка `master`)
- **SSL:** Сертифікат видано через Vercel API (cert_UI0e2R3hr16Vx9UOY7Hr2xBW)
- **Деплой:** автоматичний при push в master

### Структура файлів

```
index.html      — головна (і єдина) сторінка
styles.css      — всі стилі
script.js       — вся логіка (Lenis, quiz, FAQ, форми, модалки, тощо)
sitemap.xml     — карта сайту для Google
robots.txt      — дозвіл індексації
assets/         — локальні зображення (блоб, стрілка)
```

### Секції сайту (порядок зверху вниз)

1. **Header** — фіксований, логотип BLISSS.ENG, навігація (desktop), бургер-меню (mobile, z-index: 101)
2. **Hero** — заголовок, опис, CTA-кнопка "Безкоштовний пробний урок", статистика (5+ років, 200+ учнів, 4 формати), блоб з фото
3. **Marquee** — біжучий рядок
4. **About** — блок "Про нас" з сертифікатами
5. **Quiz** — 5-кроковий квіз + форма збору заявок (відправка на Google Apps Script)
6. **Founder** — блок про Андріану (засновницю)
7. **Formats** — формати навчання (індивідуальні, парні, групові, корпоративні)
8. **Teachers** — 3 картки викладачів (Андріана, Дарія, Анастасія), кнопки "Відео знайомство" з Cloudinary відео
9. **Pricing** — 4 таби: Дорослі A1-B1 (active за замовчуванням), Дорослі B2-C1, Діти, Підготовка до екзаменів (IELTS/CAE/FCE/НМТ)
10. **Reviews** — 3 ряди відгуків:
    - Ряд 1: Назар (фото + play), Елізавета (фото + play), Ванесса (фото) — розгорнуті
    - Ряд 2: Вероніка, Валерія, Оксана, Дмитро — компактні
    - Ряд 3: Аліна, Максим, Софія — компактні з fade
    - Кнопка "Усі відгуки" → Instagram highlights
    - Play кнопки на Назарі/Елізаветі ведуть на Google Drive з відео
11. **FAQ** — розкриваються по кліку (акордеон)
12. **Form CTA** — друга форма збору заявок
13. **Footer** — контакти, соцмережі, лого

### Ключові технічні деталі

#### Бібліотеки
- **Lenis** — smooth scroll (CDN). При відкритті модалок треба `lenis.stop()` + `stopPropagation` на wheel/touchmove

#### Форми
- Обидві форми (quiz + CTA) відправляють на Google Apps Script:
  `https://script.google.com/macros/s/AKfycbwh5CA5Zbw_d5ggfPcbynuCtXtdCIWRLquWNF-Nh6rKCVpMiMRY-GMmO1gKW2ZovnL-/exec`
- Контактні таби: Telegram / Instagram / Телефон
- Після відправки — повідомлення "You did it! 🎉"

#### Зображення
- Фото викладачів і відгуків — Cloudinary (q_auto, f_auto, w_120/w_600, c_fill, g_face)
- Відео викладачів — Cloudinary (mp4/mov)
- Прапорці в hero badge — Twemoji SVG з jsdelivr CDN (не емоджі, бо Windows не рендерить правильно)

#### SEO
- JSON-LD: EducationalOrganization + FAQPage
- Canonical URL: https://blisss-eng.com
- Open Graph теги (title, description, image з Cloudinary)
- Twitter Card теги
- Meta keywords
- Alt-теги на зображеннях
- sitemap.xml + robots.txt
- Google Search Console: верифікація через DNS TXT запис

#### Модальні вікна
- **Відео модалка** — відтворює Cloudinary відео в 9:16 форматі, закриття по хрестику/бекдропу/Escape
- **Політика конфіденційності** — попап з повним текстом, відкривається по кліку "політикою конфіденційності" під формами. На мобільних відкривається знизу як sheet. Скрол: `lenis.stop()` + `e.stopPropagation()` на wheel + `touchmove` обробка

#### Мобільна версія (responsive)
- Breakpoints: 1024px, 768px, 480px
- Font-size: 18px (desktop) → 17px (768px) → 16px (480px)
- Container padding: 24px (desktop) → 28px (768px) → 20px (480px)
- Бургер-меню (z-index: 101, вище хедера з z-index: 100)
- Плашка "Англійська нарешті в кайф" прихована на mobile
- Кнопка hero на всю ширину, текст по центру
- Кнопка "Відео знайомство" на всю ширину (`.video-play-btn:not(.video-play-btn--filled)` для правильної специфічності)
- Картки викладачів: gap 32px
- Call button: 48x48 (замість 56x56)

### Кольорова палітра (CSS змінні)

- `--yellow: #fff7cc` — основний фон, акцентний колір
- `--blue: #7da6d6` — вторинний
- `--light-blue: #eff6fd` — світлий фон карток
- `--dark: #30485f` — темний фон, текст
- `--black: #000000`

### Шрифти

- Заголовки: **Unbounded** (Google Fonts)
- Тіло: **Nunito** (Google Fonts)

### Деплой

```bash
git add <файли>
git commit -m "Опис змін"
git push origin master
# Vercel автоматично підхоплює і деплоїть
```

### Відомі особливості

- Lenis перехоплює wheel-події — при модалках обов'язково `lenis.stop()` + `stopPropagation`
- Windows не рендерить прапорці-емоджі — використовуємо Twemoji SVG
- `.video-play-btn` базовий стиль (48x48, border-radius: 50%) перебиває `--filled` модифікатор на мобільних через порядок CSS — вирішено через `:not()` селектор
- Mob menu z-index має бути вищим за header (101 > 100)
