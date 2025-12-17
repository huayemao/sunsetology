import { Language, Translations } from './types';

export const LANGUAGES: { code: Language; label: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'zh', label: '简体中文', dir: 'ltr' },
  { code: 'ja', label: '日本語', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];

export const I18N: Record<Language, Translations> = {
  en: {
    title: 'Sunsetology',
    subtitle: 'Turn your sunset moments into eternal art.',
    uploadText: 'Drop your sunset here',
    uploadSubtext: 'Support JPG, PNG, WEBP. Privacy focused.',
    analyzing: 'Extracting light...',
    palette: 'Chromatic DNA',
    gradient: 'Atmosphere',
    cardView: 'Share Card',
    download: 'Save Art',
    reset: 'New Capture',
    shareTitle: 'Sunset Palette',
    quotes: [
      "Sunsets are proof that no matter what happens, every day can end beautifully.",
      "The sky broke like an egg into full sunset and the water caught fire.",
      "Every sunset brings the promise of a new dawn.",
      "Softly the evening came with the sunset."
    ]
  },
  zh: {
    title: '暮色工坊',
    subtitle: '将日落瞬间凝固为永恒的色彩艺术。',
    uploadText: '拖入你的日落照片',
    uploadSubtext: '支持 JPG, PNG, WEBP。本地处理，隐私安全。',
    analyzing: '正在解析光影...',
    palette: '色彩基因',
    gradient: '氛围渐变',
    cardView: '分享卡片',
    download: '保存创作',
    reset: '重新制作',
    shareTitle: '日落色卡',
    quotes: [
      "日落跌进昭昭星野，人间忽晚，山河已秋。",
      "落日余晖，待你而归。",
      "云朵偷喝了我放在屋顶的酒，于是它脸红变成了晚霞。",
      "晓看天色暮看云，行也思君，坐也思君。"
    ]
  },
  ja: {
    title: '夕暮れのアトリエ',
    subtitle: '夕日の瞬間を、永遠のアートカラーへ。',
    uploadText: 'ここに写真をドロップ',
    uploadSubtext: 'JPG, PNG, WEBP 対応。サーバーにはアップロードされません。',
    analyzing: '光を抽出中...',
    palette: '色彩パレット',
    gradient: 'グラデーション',
    cardView: 'シェアカード',
    download: '保存する',
    reset: '新規作成',
    shareTitle: '夕暮れパレット',
    quotes: [
      "夕焼けは、明日への希望の色。",
      "空が燃えるような、美しい別れ。",
      "一日が静かに幕を下ろす。",
      "黄昏時は、魔法の時間。"
    ]
  },
  ar: {
    title: 'ألوان الغروب',
    subtitle: 'حول لحظات الغروب إلى فنوني أبدية.',
    uploadText: 'أسقط صورة الغروب هنا',
    uploadSubtext: 'يدعم JPG, PNG, WEBP. خصوصية تامة.',
    analyzing: 'جارٍ استخراج الضوء...',
    palette: 'لوحة الألوان',
    gradient: 'تدرج لوني',
    cardView: 'بطاقة المشاركة',
    download: 'حفظ العمل',
    reset: 'صورة جديدة',
    shareTitle: 'لوحة الغروب',
    quotes: [
      "الغروب هو الدليل على أن النهايات يمكن أن تكون جميلة أيضًا.",
      "كل غروب يأتي بوعد لشروق جديد.",
      "تتحدث السماء بألوان عند الغروب.",
      "هدوء المساء يبدأ مع الغروب."
    ]
  }
};
