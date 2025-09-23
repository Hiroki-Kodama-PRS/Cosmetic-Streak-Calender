# 化粧品使用量管理アプリ - API仕様書

## 🎯 API概要

化粧品の使用量管理と美容効果追跡を目的としたRESTful API仕様です。医療系機能を削除し、化粧品・美容業界向けに最適化されています。

### 🔗 ベースURL
```
Production: https://api.cosmetic-tracker.com/v1
Development: http://localhost:3000/api/v1
```

### 🔒 認証方式
- **JWT Token** - 軽量認証システム
- **OAuth 2.0** - ソーシャルログイン対応
- **HTTPS** - 標準暗号化通信

## 📋 エンドポイント一覧

### 👤 ユーザー認証・管理

#### POST /auth/register
ユーザー新規登録

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "田中美咲",
  "skin_type": "混合肌",
  "birth_date": "1990-05-15"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "email": "user@example.com",
    "full_name": "田中美咲",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /auth/login
ユーザーログイン

#### GET /users/profile
プロフィール取得

#### PUT /users/profile
プロフィール更新

### 🧴 化粧品使用量管理

#### GET /cosmetics/usages
化粧品使用履歴取得

**Query Parameters:**
- `start_date`: 開始日 (YYYY-MM-DD)
- `end_date`: 終了日 (YYYY-MM-DD)  
- `product_type`: 製品タイプ (クリーム、美容液等)
- `brand_name`: ブランド名

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "usage_id": 1,
      "product_name": "モイスチャライジングクリーム",
      "product_type": "クリーム",
      "brand_name": "BeautyBrand",
      "usage_amount": 2.5,
      "usage_date": "2024-01-15",
      "usage_time": "08:30:00",
      "body_part": "顔",
      "notes": "朝のスキンケアルーチン"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "per_page": 20
  }
}
```

#### POST /cosmetics/usages
新規使用記録作成

**Request:**
```json
{
  "product_name": "ハイドレーティングセラム",
  "product_type": "美容液",
  "brand_name": "SkinCare Co.",
  "usage_amount": 1.2,
  "usage_date": "2024-01-15",
  "body_part": "顔",
  "is_manual_entry": true,
  "notes": "肌の調子が良い"
}
```

#### PUT /cosmetics/usages/{usage_id}
使用記録更新

#### DELETE /cosmetics/usages/{usage_id}
使用記録削除

### 📊 データ分析・可視化

#### GET /analytics/daily
日次使用量統計

#### GET /analytics/weekly  
週次使用パターン分析

#### GET /analytics/monthly
月次美容効果レポート

#### GET /analytics/products
製品別使用量分析

**Response:**
```json
{
  "success": true,
  "data": {
    "total_products": 5,
    "most_used_product": "モイスチャライジングクリーム",
    "usage_trends": [
      {
        "product_name": "モイスチャライジングクリーム",
        "total_amount": 75.5,
        "frequency": 30,
        "average_daily": 2.5
      }
    ]
  }
}
```

### 🏆 ゲーミフィケーション・達成機能

#### GET /achievements
達成バッジ一覧取得

#### POST /achievements/check
新規達成チェック

#### GET /achievements/leaderboard
使用継続ランキング

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "achievement_id": 1,
      "badge_type": "consistent_use",
      "badge_name": "7日連続使用",
      "description": "7日間連続でスキンケアを実践しました",
      "earned_date": "2024-01-15",
      "streak_count": 7
    }
  ]
}
```

### 📸 肌状態記録・美容効果追跡

#### GET /skin-conditions
肌状態履歴取得

#### POST /skin-conditions
新規肌状態記録

**Request:**
```json
{
  "record_date": "2024-01-15",
  "skin_moisture_level": 7,
  "skin_elasticity": 6,
  "visible_improvement": "毛穴が目立たなくなった",
  "problem_areas": "額の乾燥",
  "satisfaction_rating": 4,
  "notes": "2週間使用後、明らかな改善を実感"
}
```

#### POST /skin-conditions/{condition_id}/photo
肌写真アップロード

### 💄 美容アドバイザー連携

#### GET /advisors
利用可能な美容アドバイザー一覧

#### POST /reports/share
美容アドバイザーとレポート共有

#### GET /reports/shared
共有レポート一覧

#### POST /reports/{report_id}/response
アドバイザーからの返信

### 🔔 リマインダー・通知

#### GET /reminders
リマインダー設定取得

#### POST /reminders
新規リマインダー作成

#### PUT /reminders/{reminder_id}
リマインダー更新

#### GET /notifications
通知履歴取得

### 📱 IoTデバイス連携

#### GET /devices
登録デバイス一覧

#### POST /devices/register
新規デバイス登録

#### POST /devices/{device_id}/sync
デバイスデータ同期

#### GET /devices/{device_id}/measurements
デバイス測定値履歴

## 🚨 エラーハンドリング

### エラーレスポンス形式
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "使用量は0.1g以上である必要があります",
    "details": {
      "field": "usage_amount",
      "value": 0.05
    }
  }
}
```

### エラーコード一覧
- `INVALID_REQUEST` - リクエストパラメータエラー
- `UNAUTHORIZED` - 認証エラー
- `FORBIDDEN` - 権限エラー  
- `NOT_FOUND` - リソース未検出
- `DEVICE_OFFLINE` - IoTデバイス接続エラー
- `UPLOAD_FAILED` - ファイルアップロードエラー

## 🔄 レート制限

- **認証済みユーザー**: 100リクエスト/分
- **未認証**: 20リクエスト/分
- **ファイルアップロード**: 10リクエスト/分

## 📝 データ形式

### 日付・時刻
- 日付: `YYYY-MM-DD` (ISO 8601)
- 時刻: `HH:MM:SS` (24時間表記)
- タイムスタンプ: `YYYY-MM-DDTHH:MM:SSZ` (UTC)

### 使用量単位
- 重量: グラム (g) - 小数点第2位まで
- 容量: ミリリットル (ml) - 液体製品用

### 画像形式
- 対応形式: JPEG, PNG
- 最大サイズ: 5MB
- 推奨解像度: 1080x1080 (正方形)

---

**🎨 美容データの科学的管理を実現する、次世代スキンケアAPI**

Built with ❤️ by Dariush & Hiroki Team
