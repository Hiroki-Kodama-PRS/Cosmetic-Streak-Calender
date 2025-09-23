import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { UsageInput } from './src/components/UsageInput';
import { DailyChart } from './src/components/DailyChart';
import { BadgeSystem } from './src/components/BadgeSystem';
import { DiarySection } from './src/components/DiarySection';
import { useUsageData } from './src/hooks/useUsageData';
import { useBadges } from './src/hooks/useBadges';
import { useDiary } from './src/hooks/useDiary';

export default function App() {
  // カスタムフックの初期化
  const {
    weeklyData,
    addUsageRecord,
    isLoading: usageLoading,
    error: usageError,
    usageRecords
  } = useUsageData();

  const {
    badges,
    streakData,
    updateBadgesAndStreak,
    isLoading: badgeLoading,
    error: badgeError
  } = useBadges();

  const {
    diaryEntries,
    saveDiaryEntry,
    isLoading: diaryLoading,
    error: diaryError
  } = useDiary();

  // 使用量記録時の処理
  const handleUsageRecord = async (amount: number) => {
    try {
      // 使用量記録を追加
      const updatedRecords = await addUsageRecord(amount);

      // バッジとStreakを更新
      const result = await updateBadgesAndStreak(updatedRecords);

      // 新しいバッジが獲得された場合の通知
      if (result.newlyEarnedBadges.length > 0) {
        Alert.alert(
          '🎉 バッジ獲得！',
          `${result.newlyEarnedBadges.join(', ')} を獲得しました！`,
          [{ text: 'OK' }]
        );
      }

      // Streakが更新された場合の通知
      if (result.streakData.currentStreak > 1) {
        Alert.alert(
          '🔥 連続記録中！',
          `${result.streakData.currentStreak}日連続で記録しています！`,
          [{ text: 'すごい！' }]
        );
      }
    } catch (error) {
      console.error('使用量記録エラー:', error);
      Alert.alert('エラー', '記録の保存に失敗しました');
    }
  };

  // エラー処理
  useEffect(() => {
    if (usageError || badgeError || diaryError) {
      const errors = [usageError, badgeError, diaryError]
        .filter(Boolean)
        .join('\n');
      Alert.alert('エラー', errors);
    }
  }, [usageError, badgeError, diaryError]);

  // ローディング状態
  if (usageLoading || badgeLoading || diaryLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <Text style={styles.loadingText}>読み込み中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Ointment Usage</Text>
        <Text style={styles.subtitle}>軟膏使用量記録アプリ</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 使用量入力セクション */}
        <UsageInput onSave={handleUsageRecord} />

        {/* 曜日別使用量グラフ */}
        <DailyChart weeklyData={weeklyData} />

        {/* 下部セクション（バッジ・日記を横並び配置） */}
        <View style={styles.bottomSection}>
          {/* バッジシステム（左側・幅広） */}
          <View style={styles.badgeContainer}>
            <BadgeSystem badges={badges} streakData={streakData} />
          </View>

          {/* 日記セクション（右側・コンパクト） */}
          <View style={styles.diaryContainer}>
            <DiarySection 
              diaryEntries={diaryEntries} 
              onSaveDiary={saveDiaryEntry}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#2962ff',
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2962ff',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bottomSection: {
    flexDirection: 'row',
    marginHorizontal: 8,
    marginTop: 8,
    gap: 8,
  },
  badgeContainer: {
    flex: 2,
  },
  diaryContainer: {
    flex: 1,
  },
});
