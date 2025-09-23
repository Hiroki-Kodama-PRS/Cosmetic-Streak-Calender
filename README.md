# 化粧品使用量管理アプリ (Cosmetic Usage Tracker)

🧴 **DariushとHirokiによる共同起業プロジェクト**

## 📝 プロジェクト概要

化粧品の使用量を自動で測定・記録し、美容効果を最大化するためのスマートアプリケーションです。IoTデバイスと連携して、スキンケアルーチンの効果を科学的に追跡・分析します。

## ✨ 主要機能

### 🎯 コア機能
- **📊 自動使用量記録**: IoTデバイス連携による化粧品使用量の自動測定
- **📈 美容効果追跡**: 肌状態の変化を写真とデータで記録
- **🏆 モチベーション機能**: 継続使用の達成バッジとゲーミフィケーション
- **💄 美容アドバイザー連携**: プロフェッショナルとの情報共有
- **⏰ スマートリマインダー**: 個人に最適化された使用タイミング通知
- **🔍 使用パターン分析**: 効果的なスキンケアルーチンの提案

### 🎨 対象製品
- フェイスクリーム・保湿クリーム
- 美容液・セラム
- ローション・化粧水
- 乳液・エマルジョン
- アイクリーム・スペシャルケア製品

## 🏗️ 技術スタック

### 📱 フロントエンド (モバイルアプリ)
- **React Native + Expo**: クロスプラットフォーム開発
- **TypeScript**: 型安全な開発
- **React Navigation**: ナビゲーション管理
- **Reanimated**: スムーズなアニメーション

### 🔧 バックエンド
- **Node.js + Express**: RESTful API サーバー
- **TypeScript**: サーバーサイド型安全性
- **JWT**: 軽量認証システム
- **PostgreSQL**: メインデータベース

### 🌐 IoTデバイス連携
- **Bluetooth Low Energy (BLE)**: 低消費電力通信
- **重量センサー**: 高精度使用量測定
- **リアルタイムデータ同期**: 自動記録システム

### ☁️ インフラ
- **Docker**: コンテナ化デプロイ
- **Firebase FCM**: プッシュ通知
- **HTTPS/TLS**: 標準暗号化通信

## 🚀 クイックスタート

### 前提条件
- Node.js 18+
- PostgreSQL 14+
- Expo CLI
- React Native開発環境

### インストール手順

```bash
# プロジェクトクローン
git clone https://github.com/dariush-hiroki/cosmetic-usage-tracker.git
cd cosmetic-usage-tracker

# 依存関係インストール
npm install

# バックエンド依存関係
cd backend && npm install && cd ..

# 環境設定
cp .env.example .env
# .envファイルを編集して設定値を入力

# データベースセットアップ
npm run db:migrate
npm run db:seed

# 開発サーバー起動
npm run dev

# モバイルアプリ起動
npm run mobile:start
```

## 📁 プロジェクト構造

```
cosmetic-usage-tracker/
├── 📱 mobile/                 # React Nativeアプリ
│   ├── src/screens/          # 画面コンポーネント
│   ├── src/components/       # 再利用可能コンポーネント
│   ├── src/services/         # API通信・BLE連携
│   └── src/assets/           # 画像・アイコン
├── 🔧 backend/               # Node.js API サーバー
│   ├── src/routes/           # APIルート
│   ├── src/models/           # データベースモデル
│   ├── src/middleware/       # 認証・検証
│   └── src/services/         # ビジネスロジック
├── 🗄️ database/              # データベース関連
│   ├── migrations/           # スキーマ変更
│   ├── seeds/               # 初期データ
│   └── schema.sql           # DDL定義
├── 📖 docs/                  # ドキュメンテーション
│   ├── design/              # 設計書
│   ├── api/                 # API仕様
│   └── user-guide/          # ユーザーガイド
└── 🚀 deployment/           # デプロイ設定
```

## 👥 開発チーム

### 💼 Dariush (Investor & Business Development)
- 🏦 投資・資金調達
- 🤝 ビジネス機会の創出
- 🏪 プライベートクリニック・美容サロン提供
- 🏆 ビジネスコンテスト参加機会の提供

### 💻 Hiroki (Manager & Technical Lead)
- 📜 特許取得・知的財産管理
- 👩‍💻 開発チーム編成・管理
- ⚙️ プロトタイプ開発・技術実装
- 🔬 製品テスト・品質保証

## 📊 開発ステータス

- ✅ **基本設計完了**: システム設計・DB設計
- 🔄 **プロトタイプ開発中**: IoTデバイス連携
- ⏳ **UI/UX設計**: モバイルアプリインターフェース
- ⏳ **API開発**: バックエンドサービス

## 🔒 セキュリティ & プライバシー

- **標準認証**: JWT + OAuth 2.0
- **通信暗号化**: HTTPS/TLS 1.3
- **データ保護**: 一般的なWebアプリケーションレベル
- **プライバシー**: 個人情報保護法準拠

## 📞 サポート & フィードバック

- **Issue報告**: GitHub Issues
- **機能要望**: GitHub Discussions
- **ドキュメント**: `/docs` ディレクトリ参照

---

**🎨 美しい肌のための、科学的なスキンケア体験を。**

Built with ❤️ by Dariush & Hiroki
