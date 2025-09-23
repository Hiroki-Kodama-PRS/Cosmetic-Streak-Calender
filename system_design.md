
# 化粧品使用量管理システム 設計書

## 1. プロジェクト概要

### 1.1 目的
化粧品（クリーム、ローション、美容液等）の使用量を自動で記録・管理し、ユーザーの美容ルーティン最適化をサポートするモバイルアプリケーション

### 1.2 対象ユーザー
- **メインユーザー**: 美容・スキンケアに関心のある一般消費者
- **サブユーザー**: 美容アドバイザー、化粧品カウンセラー、エステティシャン

### 1.3 主要機能
- IoT体重センサーを用いた化粧品使用量の自動測定
- 肌状態の記録と効果追跡
- 美容アドバイザーとの情報共有
- パーソナライズされた美容アドバイス
- 使用パターンの分析・可視化

## 2. システム構成

### 2.1 アーキテクチャ概要
```
[モバイルアプリ] ← BLE → [IoTデバイス]
       ↓ HTTPS/JWT
[API Gateway] → [認証サービス]
       ↓
[アプリケーションサーバー]
       ↓
[PostgreSQL Database]
```

### 2.2 技術スタック

#### フロントエンド (モバイルアプリ)
- **React Native + Expo**: クロスプラットフォーム開発
- **React Native BLE Manager**: Bluetoothデバイス連携
- **Async Storage**: ローカルデータ保存
- **React Navigation**: 画面遷移管理

#### バックエンド
- **Node.js + Express**: APIサーバー
- **JWT (JSON Web Token)**: 認証・認可
- **PostgreSQL**: メインデータベース
- **Firebase Cloud Messaging**: プッシュ通知

#### インフラ
- **Docker**: コンテナ化
- **AWS/GCP**: クラウドホスティング
- **HTTPS/TLS**: 通信暗号化（基本レベル）

## 3. セキュリティ設計

### 3.1 認証・認可
- **JWT Token**: アクセストークン（有効期限: 24時間）
- **Refresh Token**: 長期認証（有効期限: 30日）
- **パスワードハッシュ**: bcrypt（ソルト付き）

### 3.2 通信セキュリティ
- **HTTPS/TLS 1.2+**: API通信の暗号化
- **API Rate Limiting**: DoS攻撃対策
- **CORS設定**: クロスオリジン制御

### 3.3 データ保護
- **個人情報の最小化**: 必要最小限のデータのみ収集
- **データ匿名化**: 統計処理時の個人特定防止
- **定期バックアップ**: データ損失防止

## 4. データベース設計

### 4.1 主要テーブル

#### users (ユーザー)
- id (UUID, Primary Key)
- email (varchar, unique)
- password_hash (varchar)
- name (varchar)
- skin_type (enum: dry, oily, combination, sensitive)
- user_type (enum: customer, beauty_advisor)

#### cosmetic_products (化粧品製品)
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- product_name (varchar)
- brand_name (varchar)
- product_type (enum: cream, lotion, serum, cleanser, etc.)
- initial_weight (decimal)
- current_weight (decimal)

#### cosmetic_usages (使用記録)
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- product_id (UUID, Foreign Key)
- usage_amount (decimal)
- body_part (varchar)
- usage_datetime (timestamp)
- satisfaction_rating (integer, 1-5)

#### skin_conditions (肌状態記録)
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- condition_date (date)
- condition_type (varchar)
- severity_level (integer, 1-5)
- notes (text)

## 5. API設計

### 5.1 認証エンドポイント
- POST /auth/register - ユーザー登録
- POST /auth/login - ログイン
- POST /auth/refresh - トークン更新
- POST /auth/logout - ログアウト

### 5.2 化粧品管理エンドポイント
- GET /cosmetics/products - 製品一覧取得
- POST /cosmetics/products - 製品登録
- PUT /cosmetics/products/:id - 製品更新
- DELETE /cosmetics/products/:id - 製品削除

### 5.3 使用記録エンドポイント
- GET /cosmetics/usages - 使用記録一覧
- POST /cosmetics/usages - 使用記録追加
- GET /cosmetics/usages/analytics - 使用分析データ

### 5.4 肌状態管理エンドポイント
- GET /skin-conditions - 肌状態履歴取得
- POST /skin-conditions - 肌状態記録追加
- GET /skin-conditions/trends - 肌状態トレンド分析

## 6. IoTデバイス連携

### 6.1 デバイス仕様
- **通信方式**: Bluetooth Low Energy (BLE)
- **測定精度**: 0.1g単位
- **バッテリー**: 充電式リチウムイオン電池
- **防水性能**: IPX5（生活防水）

### 6.2 データ連携フロー
1. アプリがBLEでデバイスをスキャン・接続
2. デバイスから重量データを取得
3. 使用前後の重量差から使用量を算出
4. 使用記録をローカル保存後、APIに送信

## 7. ユーザーインターフェース設計

### 7.1 主要画面
- **ホーム画面**: 今日の使用状況、肌状態サマリー
- **製品管理画面**: 登録済み化粧品の一覧・管理
- **測定画面**: IoTデバイス連携・使用量記録
- **分析画面**: 使用パターン・効果の可視化
- **設定画面**: プロフィール・通知・プライバシー設定

### 7.2 UX考慮事項
- **シンプルな操作**: 2タップ以内で主要機能にアクセス
- **視覚的フィードバック**: 使用量・効果をグラフで表示
- **ゲーミフィケーション**: 継続使用の達成バッジ・ストリーク

## 8. 運用・保守

### 8.1 監視・ログ
- **アプリケーションログ**: エラー・パフォーマンス監視
- **アクセスログ**: API使用状況の分析
- **ユーザー行動ログ**: アプリ使用パターンの分析

### 8.2 バックアップ・災害対策
- **日次バックアップ**: データベース完全バックアップ
- **増分バックアップ**: リアルタイムデータ保護
- **クラウド冗長化**: 複数リージョンでのデータ複製

### 8.3 スケーラビリティ
- **水平スケーリング**: APIサーバーの負荷分散
- **データベース最適化**: インデックス設計・クエリ最適化
- **CDN活用**: 静的コンテンツの配信最適化

## 9. 開発・デプロイメント

### 9.1 開発環境
- **Docker Compose**: ローカル開発環境の統一
- **Git**: バージョン管理
- **VS Code**: 統合開発環境
- **ESLint/Prettier**: コード品質管理

### 9.2 CI/CD パイプライン
- **GitHub Actions**: 自動テスト・ビルド
- **Jest**: ユニットテスト
- **Detox**: E2Eテスト（モバイル）
- **自動デプロイ**: ステージング・本番環境への自動展開

### 9.3 品質管理
- **コードレビュー**: Pull Request必須
- **テストカバレッジ**: 80%以上を目標
- **セキュリティ監査**: 定期的な脆弱性スキャン
