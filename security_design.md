
# 化粧品使用量管理アプリ セキュリティ設計書

## 1. セキュリティ概要

### 1.1 セキュリティ方針
化粧品使用量管理アプリでは、**一般的なWebアプリケーションレベル**のセキュリティを実装し、
ユーザーの個人情報を適切に保護しつつ、軽量で使いやすいアプリケーションを目指します。

### 1.2 脅威モデル
- **データ漏洩**: 個人の使用データや肌状態情報の流出
- **不正アクセス**: 第三者による無断ログイン
- **データ改ざん**: 使用記録や分析結果の不正変更
- **プライバシー侵害**: 個人情報の不適切な利用

### 1.3 セキュリティレベル
医療系アプリケーションとは異なり、**消費者向けサービス**として適切なレベルのセキュリティを実装：
- 高度な暗号化は不要
- 複雑な監査機能は不要
- 基本的なプライバシー保護に重点

## 2. 認証・認可

### 2.1 ユーザー認証
**実装方式**: JWT (JSON Web Token)

**設定項目**:
```javascript
// JWT設定
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  accessTokenExpiration: '24h',    // 24時間
  refreshTokenExpiration: '30d',   // 30日間
  algorithm: 'HS256'               // 標準的なハッシュアルゴリズム
};
```

**パスワード管理**:
- **ハッシュ化**: bcrypt（ソルト付き、コスト係数10）
- **最小要件**: 8文字以上、英数字組み合わせ
- **リセット機能**: メール認証による安全なパスワードリセット

### 2.2 認可制御
**ロールベースアクセス制御（RBAC）**:
- `customer`: 一般消費者（自分のデータのみアクセス）
- `beauty_advisor`: 美容アドバイザー（担当顧客データアクセス）
- `brand_partner`: ブランド関係者（匿名統計データアクセス）
- `admin`: システム管理者（全データアクセス）

## 3. 通信セキュリティ

### 3.1 HTTPS通信
**設定要件**:
- **本番環境**: HTTPS必須（TLS 1.2以上）
- **開発環境**: HTTP許可（ローカル開発用）
- **証明書**: Let's Encrypt または商用SSL証明書

**Nginx設定例**:
```nginx
server {
    listen 443 ssl;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # セキュリティヘッダー
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
}
```

### 3.2 API セキュリティ
**レート制限**:
- 認証API: 5回/分/IP
- データ取得API: 100回/分/ユーザー
- アップロードAPI: 10回/分/ユーザー

**CORS設定**:
```javascript
const corsOptions = {
  origin: ['https://cosmetic-app.example.com'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

## 4. データ保護

### 4.1 個人データ管理
**収集データの分類**:
- **必須データ**: メールアドレス、パスワード、基本プロフィール
- **機能データ**: 使用記録、肌状態、写真（オプション）
- **分析データ**: 統計情報、傾向データ（匿名化）

**データ保存**:
- **暗号化**: 保存時暗号化は不要（標準的なDB暗号化のみ）
- **アクセス制御**: データベースレベルでの適切な権限管理
- **バックアップ**: 暗号化されたクラウドバックアップ

### 4.2 プライバシー設定
**ユーザー制御**:
- データ共有レベルの選択（公開/プライベート/アドバイザーのみ）
- データダウンロード機能（GDPR対応）
- アカウント削除時のデータ完全消去
- 分析データからの除外オプション

**データ匿名化**:
```javascript
// 統計処理用の匿名化
const anonymizeUser = (userData) => ({
  age_range: getAgeRange(userData.age),
  skin_type: userData.skin_type,
  region: userData.region,
  // 個人特定情報は除外
});
```

## 5. セキュリティ監視

### 5.1 ログ管理
**記録対象**:
- 認証の成功/失敗
- データアクセス（個人情報含む）
- 管理者操作
- システムエラー

**ログレベル**:
```javascript
// 簡素化されたログ設定
const logConfig = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: 'json',
  retention: '90days'  // 90日間保持
};
```

### 5.2 異常検知
**検知項目**:
- 短時間での大量リクエスト
- 異常なログイン試行
- データアクセスパターンの異常
- システムリソースの異常

**対応レベル**:
- アラート通知（管理者メール）
- 一時的なアカウントロック
- IP制限（重度の場合）

## 6. 脆弱性対策

### 6.1 一般的な脆弱性対策

**SQLインジェクション対策**:
- パラメータ化クエリの使用
- ORMによる自動エスケープ
- 入力値の検証・サニタイズ

**XSS対策**:
```javascript
// 入力サニタイズ
const DOMPurify = require('dompurify');
const sanitized = DOMPurify.sanitize(userInput);
```

**CSRF対策**:
- CSRFトークンの実装
- SameSite Cookieの使用
- Referrerヘッダーの確認

### 6.2 依存関係管理
**脆弱性スキャン**:
```bash
# 定期的な脆弱性チェック
npm audit
npm audit fix

# 依存関係の更新
npm update
```

**セキュリティツール**:
- ESLint Security Plugin
- Snyk（脆弱性スキャン）
- OWASP ZAP（ペネトレーションテスト）

## 7. セキュリティ運用

### 7.1 定期メンテナンス
**月次作業**:
- 依存関係の更新
- セキュリティパッチの適用
- ログの確認・分析
- バックアップの動作確認

**四半期作業**:
- セキュリティ監査
- アクセス権限の見直し
- 脆弱性スキャン
- 災害復旧テスト

### 7.2 インシデント対応
**対応フロー**:
1. インシデントの検知・報告
2. 影響範囲の特定
3. 応急処置の実施
4. 根本原因の調査
5. 恒久対策の実施
6. 事後レビューと改善

**連絡体制**:
- 緊急連絡先の設定
- エスカレーションルールの明確化
- 外部専門家との連携体制

## 8. コンプライアンス

### 8.1 適用法規
**日本国内**:
- 個人情報保護法
- 電気通信事業法
- 景品表示法（美容効果の表示）

**国際対応**:
- GDPR（EU一般データ保護規則）基本対応
- CCPA（カリフォルニア消費者プライバシー法）考慮

### 8.2 プライバシーポリシー
**記載項目**:
- 収集する情報の種類と目的
- データの利用・共有範囲
- 保存期間と削除方法
- ユーザーの権利と行使方法
- 問い合わせ先

## 9. セキュリティテスト

### 9.1 自動テスト
**CI/CD パイプライン組み込み**:
```yaml
# GitHub Actions例
security_scan:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v2
    - name: Security Audit
      run: |
        npm audit
        npm run security-scan
    - name: SAST Scan
      uses: securecodewarrior/github-action-add-sarif@v1
```

### 9.2 手動テスト
**定期実施項目**:
- 認証・認可のテスト
- 入力値検証のテスト
- セッション管理のテスト
- ファイルアップロードのテスト

この簡素化されたセキュリティ設計により、適切なレベルのセキュリティを確保しつつ、
軽量で開発・運用しやすいアプリケーションを実現します。
