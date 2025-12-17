<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/2

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## i18n 国际化方案

### 概述
项目采用静态i18n配置方案，支持多语言切换，所有翻译文本统一管理，确保类型安全。

### 翻译文件结构

#### 1. 类型定义 (`types.ts`)
定义了`Translations`接口，约束所有翻译键的结构，确保类型安全：
```typescript
export interface Translations {
  title: string;
  subtitle: string;
  uploadText: string;
  // ... 其他翻译键
}
```

#### 2. 翻译文本 (`constants.ts`)
存储了所有支持语言的翻译文本，当前支持英语、简体中文、日语和阿拉伯语：
```typescript
export const I18N: Record<Language, Translations> = {
  en: {
    title: 'Sunsetology',
    subtitle: 'Turn your sunset moments into eternal art.',
    // ... 英文翻译
  },
  zh: {
    title: '暮色工坊',
    subtitle: '将日落瞬间凝固为永恒的色彩艺术。',
    // ... 中文翻译
  },
  // ... 其他语言
};
```

### 如何添加新的翻译键

1. **在`types.ts`中添加新的翻译键**：
   ```typescript
export interface Translations {
  // ... 现有翻译键
  newTranslationKey: string;
}
```

2. **在`constants.ts`中为所有语言添加翻译文本**：
   ```typescript
en: {
  // ... 现有翻译
  newTranslationKey: 'English translation',
},
zh: {
  // ... 现有翻译
  newTranslationKey: '中文翻译',
},
// ... 其他语言
```

### 如何在组件中使用翻译

1. **导入Translations类型**：
   ```typescript
import { Translations } from '../types';
```

2. **在组件props中添加翻译参数**：
   ```typescript
interface ComponentProps {
  // ... 其他props
  t: Translations;
}
```

3. **在组件中使用翻译文本**：
   ```typescript
<div>
  <h1>{t.title}</h1>
  <p>{t.subtitle}</p>
</div>
```

### 支持的语言
- 英语 (en)
- 简体中文 (zh)
- 日语 (ja)
- 阿拉伯语 (ar) (RTL支持)
