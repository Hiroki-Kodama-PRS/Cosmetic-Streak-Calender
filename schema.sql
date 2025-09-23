-- 化粧品使用量管理アプリ - データベーススキーマ
-- 軽量化・化粧品特化版 (医療系要件削除)

-- ユーザーテーブル (簡素化)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) DEFAULT 'customer' CHECK (user_type IN ('customer', 'beauty_advisor')),
    full_name VARCHAR(100),
    phone VARCHAR(20),
    birth_date DATE,
    skin_type VARCHAR(50), -- 肌質情報 (乾燥肌、脂性肌、混合肌、敏感肌)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IoTデバイステーブル (化粧品用)
CREATE TABLE iot_devices (
    device_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    device_serial VARCHAR(100) UNIQUE NOT NULL,
    device_name VARCHAR(100),
    device_type VARCHAR(50) DEFAULT 'cosmetic_dispenser',
    bluetooth_address VARCHAR(17),
    battery_level INTEGER DEFAULT 100,
    calibration_weight DECIMAL(6,2), -- グラム単位
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 化粧品使用量テーブル (軟膏→化粧品)
CREATE TABLE cosmetic_usages (
    usage_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    device_id INTEGER REFERENCES iot_devices(device_id),
    product_name VARCHAR(100), -- 化粧品名
    product_type VARCHAR(50), -- クリーム、ローション、美容液等
    brand_name VARCHAR(100), -- ブランド名
    usage_amount DECIMAL(6,2) NOT NULL, -- 使用量(グラム)
    usage_date DATE NOT NULL,
    usage_time TIME,
    body_part VARCHAR(50), -- 使用部位 (顔、首、手等)
    is_manual_entry BOOLEAN DEFAULT false,
    notes TEXT, -- 使用感メモ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IoTデバイス測定値 (リアルタイムデータ)
CREATE TABLE device_measurements (
    measurement_id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES iot_devices(device_id) ON DELETE CASCADE,
    weight_before DECIMAL(6,2), -- 使用前重量
    weight_after DECIMAL(6,2), -- 使用後重量
    temperature DECIMAL(4,1), -- 環境温度
    humidity DECIMAL(4,1), -- 環境湿度
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 肌状態記録 (美容効果追跡)
CREATE TABLE skin_conditions (
    condition_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    skin_moisture_level INTEGER CHECK (skin_moisture_level BETWEEN 1 AND 10),
    skin_elasticity INTEGER CHECK (skin_elasticity BETWEEN 1 AND 10),
    visible_improvement TEXT,
    problem_areas TEXT,
    photo_url VARCHAR(255), -- 肌写真URL
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 達成バッジ・ゲーミフィケーション
CREATE TABLE achievements (
    achievement_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL, -- 'consistent_use', 'skin_improvement', 'product_trial'
    badge_name VARCHAR(100),
    description TEXT,
    earned_date DATE DEFAULT CURRENT_DATE,
    streak_count INTEGER DEFAULT 0, -- 連続使用日数
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- リマインダー設定
CREATE TABLE reminders (
    reminder_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    reminder_type VARCHAR(50), -- 'morning_routine', 'evening_routine', 'weekly_analysis'
    reminder_time TIME,
    is_active BOOLEAN DEFAULT true,
    custom_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 美容アドバイザー共有レポート
CREATE TABLE shared_reports (
    report_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(user_id),
    advisor_id INTEGER REFERENCES users(user_id),
    report_title VARCHAR(200),
    report_content TEXT,
    usage_period_start DATE,
    usage_period_end DATE,
    recommendations TEXT, -- 美容アドバイス
    shared_date DATE DEFAULT CURRENT_DATE,
    is_read BOOLEAN DEFAULT false
);

-- 通知履歴
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(200),
    message TEXT,
    notification_type VARCHAR(50), -- 'reminder', 'achievement', 'report'
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成 (パフォーマンス最適化)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_cosmetic_usages_user_date ON cosmetic_usages(user_id, usage_date);
CREATE INDEX idx_cosmetic_usages_product ON cosmetic_usages(product_name, brand_name);
CREATE INDEX idx_device_measurements_device ON device_measurements(device_id, measured_at);
CREATE INDEX idx_skin_conditions_user_date ON skin_conditions(user_id, record_date);
CREATE INDEX idx_achievements_user ON achievements(user_id, earned_date);
CREATE INDEX idx_notifications_user ON notifications(user_id, sent_at);

-- サンプルデータ挿入
INSERT INTO users (email, password_hash, user_type, full_name, skin_type) VALUES
('user@example.com', '$2b$10$example_hash', 'customer', 'テストユーザー', '混合肌'),
('advisor@beauty.com', '$2b$10$advisor_hash', 'beauty_advisor', '美容アドバイザー', null);

-- 化粧品カテゴリのサンプル
INSERT INTO cosmetic_usages (user_id, product_name, product_type, brand_name, usage_amount, usage_date, body_part) VALUES
(1, 'モイスチャライジングクリーム', 'クリーム', 'BeautyBrand', 2.5, CURRENT_DATE, '顔'),
(1, 'ハイドレーティングセラム', '美容液', 'SkinCare Co.', 1.2, CURRENT_DATE, '顔'),
(1, 'ナイトクリーム', 'クリーム', 'Premium Beauty', 3.0, CURRENT_DATE - 1, '顔・首');

COMMENT ON TABLE users IS '化粧品ユーザー・美容アドバイザー情報';
COMMENT ON TABLE cosmetic_usages IS '化粧品使用量記録 (軟膏から化粧品に変更)';
COMMENT ON TABLE skin_conditions IS '肌状態記録 (美容効果追跡用)';
COMMENT ON TABLE shared_reports IS '美容アドバイザーとの共有レポート';
