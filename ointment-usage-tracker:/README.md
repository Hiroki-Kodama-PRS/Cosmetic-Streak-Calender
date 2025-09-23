# Ointment Usage Tracker

軟膏使用量記録アプリのReact Native + Expoプロトタイプです。

## 🎯 概要

日々の軟膏使用量を記録し、習慣化をサポートするヘルスケアアプリです。使用量の可視化、継続記録（Streak）、バッジ獲得機能により、ユーザーのモチベーション維持を図ります。

## ✨ 主要機能

### 📊 ホーム画面レイアウト
1. **Ointment Usage** タイトル
2. **Amount of Usage** - 使用量入力・保存
3. **Daily Usage** - 曜日別棒グラフ表示
4. **獲得バッジ表示** - Streak機能付き
5. **日記機能** - 右側配置、肌の状態記録

### 🏆 バッジ・Streakシステム
- **初回記録**: はじめの一歩
- **継続記録**: 3日、7日、14日、30日継続バッジ
- **習慣化**: 50回・100回記録達成
- **使用量**: 累計100g到達マイルストーン

### 📝 日記機能
- 気分・肌状態の絵文字選択
- 自由記述テキスト入力
- 過去記録のサムネイル表示

## 🛠️ 技術構成

- **フレームワーク**: React Native + Expo
- **言語**: TypeScript
- **データ永続化**: AsyncStorage
- **グラフ表示**: react-native-chart-kit
- **日付処理**: date-fns

## 📱 対応プラットフォーム

- iOS
- Android  
- Web

## 🚀 セットアップ

### 前提条件
- Node.js >= 16.0.0
- npm >= 8.0.0
- Expo CLI

### インストール手順

1. **依存関係のインストール**
```bash
npm install
```

2. **開発サーバー起動**
```bash
npm start
```

3. **プラットフォーム別実行**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📁 プロジェクト構造

```
ointment-usage-tracker/
├── App.tsx                    # メインアプリファイル
├── src/
│   ├── components/           # UIコンポーネント
│   │   ├── UsageInput.tsx   # 使用量入力
│   │   ├── DailyChart.tsx   # 曜日別グラフ
│   │   ├── BadgeSystem.tsx  # バッジシステム
│   │   └── DiarySection.tsx # 日記機能
│   ├── hooks/               # カスタムフック
│   │   ├── useUsageData.ts  # 使用量データ管理
│   │   ├── useBadges.ts     # バッジシステム
│   │   └── useDiary.ts      # 日記管理
│   ├── types/               # TypeScript型定義
│   │   └── index.ts
│   └── utils/               # ユーティリティ関数
│       └── index.ts
├── package.json             # 依存関係・スクリプト
├── app.json                 # Expo設定
├── tsconfig.json           # TypeScript設定
└── babel.config.js         # Babel設定
```

## 💾 データ構造

### 使用量記録
```typescript
interface UsageRecord {
  id: string;
  date: string;       // YYYY-MM-DD
  amount: number;     // グラム単位
  timestamp: number;  // 記録時刻
}
```

### バッジシステム
```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedDate: string | null;
}
```

### 日記エントリー
```typescript
interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood?: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
  skinCondition?: 'excellent' | 'good' | 'fair' | 'poor' | 'irritated';
}
```

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm start

# 型チェック
npm run type-check

# ESLint実行
npm run lint

# テスト実行
npm test

# Android APKビルド
npm run build:android

# iOSビルド
npm run build:ios
```

## 🎨 デザイン指針

- **配色**: 医療系に適した青 (#2962ff) と白ベース
- **UI**: 清潔で直感的なインターフェース
- **レスポンシブ**: 各種デバイスサイズ対応
- **アクセシビリティ**: 日本語対応・わかりやすいアイコン

## 📈 今後の拡張予定

- [ ] データエクスポート機能
- [ ] クラウド同期
- [ ] プッシュ通知
- [ ] IoTスケール連携
- [ ] 複数薬品対応
- [ ] 医療従事者共有機能

## 📄 ライセンス

MIT License

## 👥 貢献

プルリクエストやissueでのフィードバックを歓迎します。

---

**Ointment Usage Tracker** - あなたの健康習慣をサポートします 💙
