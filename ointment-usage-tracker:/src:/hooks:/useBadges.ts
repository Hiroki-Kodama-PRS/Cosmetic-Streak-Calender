import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Badge, StreakData, UsageRecord } from '../types';
import { calculateStreak } from '../utils';

const BADGES_DATA_KEY = 'ointment_badges_data';
const STREAK_DATA_KEY = 'ointment_streak_data';

// 利用可能なバッジの定義
const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first_record',
    name: 'はじめの一歩',
    description: '初回記録達成',
    earned: false,
    earnedDate: null
  },
  {
    id: 'streak_3',
    name: '3日継続',
    description: '3日連続記録',
    earned: false,
    earnedDate: null
  },
  {
    id: 'streak_7',
    name: '1週間継続',
    description: '7日連続記録',
    earned: false,
    earnedDate: null
  },
  {
    id: 'streak_14',
    name: '2週間継続',
    description: '14日連続記録',
    earned: false,
    earnedDate: null
  },
  {
    id: 'streak_30',
    name: '1ヶ月継続',
    description: '30日連続記録',
    earned: false,
    earnedDate: null
  },
  {
    id: 'consistent_user',
    name: '習慣化マスター',
    description: '50回記録達成',
    earned: false,
    earnedDate: null
  },
  {
    id: 'heavy_user',
    name: 'ヘビーユーザー',
    description: '100回記録達成',
    earned: false,
    earnedDate: null
  },
  {
    id: 'milestone_100g',
    name: '100g到達',
    description: '累計100g使用',
    earned: false,
    earnedDate: null
  }
];

export const useBadges = () => {
  const [badges, setBadges] = useState<Badge[]>(AVAILABLE_BADGES);
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastUsedDate: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // バッジデータを読み込み
  const loadBadges = async () => {
    try {
      const storedBadges = await AsyncStorage.getItem(BADGES_DATA_KEY);
      if (storedBadges) {
        const parsedBadges: Badge[] = JSON.parse(storedBadges);
        setBadges(parsedBadges);
      }
    } catch (err) {
      console.error('バッジデータの読み込みエラー:', err);
      setError('バッジデータの読み込みに失敗しました');
    }
  };

  // Streakデータを読み込み
  const loadStreakData = async () => {
    try {
      const storedStreak = await AsyncStorage.getItem(STREAK_DATA_KEY);
      if (storedStreak) {
        const parsedStreak: StreakData = JSON.parse(storedStreak);
        setStreakData(parsedStreak);
      }
    } catch (err) {
      console.error('Streakデータの読み込みエラー:', err);
      setError('Streakデータの読み込みに失敗しました');
    }
  };

  // データを保存
  const saveBadges = async (badgesToSave: Badge[]) => {
    try {
      await AsyncStorage.setItem(BADGES_DATA_KEY, JSON.stringify(badgesToSave));
      setBadges(badgesToSave);
    } catch (err) {
      console.error('バッジデータの保存エラー:', err);
      throw err;
    }
  };

  const saveStreakData = async (streakToSave: StreakData) => {
    try {
      await AsyncStorage.setItem(STREAK_DATA_KEY, JSON.stringify(streakToSave));
      setStreakData(streakToSave);
    } catch (err) {
      console.error('Streakデータの保存エラー:', err);
      throw err;
    }
  };

  // バッジ獲得処理
  const earnBadge = async (badgeId: string) => {
    try {
      const updatedBadges = badges.map(badge =>
        badge.id === badgeId && !badge.earned
          ? {
              ...badge,
              earned: true,
              earnedDate: new Date().toISOString()
            }
          : badge
      );

      if (JSON.stringify(updatedBadges) !== JSON.stringify(badges)) {
        await saveBadges(updatedBadges);
        return badges.find(b => b.id === badgeId)?.name || 'バッジ';
      }
      return null;
    } catch (err) {
      console.error('バッジ獲得処理エラー:', err);
      throw err;
    }
  };

  // 使用量記録に基づいてバッジとStreakを更新
  const updateBadgesAndStreak = async (usageRecords: UsageRecord[]) => {
    try {
      setError(null);

      // Streak計算
      const newStreakData = calculateStreak(usageRecords);

      // Streakデータを更新
      if (JSON.stringify(newStreakData) !== JSON.stringify(streakData)) {
        await saveStreakData(newStreakData);
      }

      // 新しく獲得したバッジを追跡
      const newlyEarnedBadges: string[] = [];

      // 各バッジの獲得条件をチェック
      const updatedBadges = badges.map(badge => {
        if (badge.earned) return badge; // 既に獲得済み

        let shouldEarn = false;

        switch (badge.id) {
          case 'first_record':
            shouldEarn = usageRecords.length >= 1;
            break;

          case 'streak_3':
            shouldEarn = newStreakData.currentStreak >= 3 || newStreakData.longestStreak >= 3;
            break;

          case 'streak_7':
            shouldEarn = newStreakData.currentStreak >= 7 || newStreakData.longestStreak >= 7;
            break;

          case 'streak_14':
            shouldEarn = newStreakData.currentStreak >= 14 || newStreakData.longestStreak >= 14;
            break;

          case 'streak_30':
            shouldEarn = newStreakData.currentStreak >= 30 || newStreakData.longestStreak >= 30;
            break;

          case 'consistent_user':
            shouldEarn = usageRecords.length >= 50;
            break;

          case 'heavy_user':
            shouldEarn = usageRecords.length >= 100;
            break;

          case 'milestone_100g':
            const totalUsage = usageRecords.reduce((sum, record) => sum + record.amount, 0);
            shouldEarn = totalUsage >= 100;
            break;
        }

        if (shouldEarn) {
          newlyEarnedBadges.push(badge.name);
          return {
            ...badge,
            earned: true,
            earnedDate: new Date().toISOString()
          };
        }

        return badge;
      });

      // バッジデータを更新
      if (JSON.stringify(updatedBadges) !== JSON.stringify(badges)) {
        await saveBadges(updatedBadges);
      }

      return {
        newlyEarnedBadges,
        streakData: newStreakData
      };
    } catch (err) {
      console.error('バッジ・Streak更新エラー:', err);
      setError('バッジ・Streakの更新に失敗しました');
      throw err;
    }
  };

  // 獲得済みバッジ数を取得
  const getEarnedBadgeCount = (): number => {
    return badges.filter(badge => badge.earned).length;
  };

  // 進捗率を計算
  const getProgressPercentage = (): number => {
    const totalBadges = badges.length;
    const earnedBadges = getEarnedBadgeCount();
    return totalBadges > 0 ? Math.round((earnedBadges / totalBadges) * 100) : 0;
  };

  // 次に獲得可能なバッジを取得
  const getNextBadge = (): Badge | null => {
    return badges.find(badge => !badge.earned) || null;
  };

  // バッジをリセット（開発・テスト用）
  const resetBadges = async () => {
    try {
      const resetBadges = AVAILABLE_BADGES.map(badge => ({
        ...badge,
        earned: false,
        earnedDate: null
      }));

      const resetStreak: StreakData = {
        currentStreak: 0,
        longestStreak: 0,
        lastUsedDate: null
      };

      await saveBadges(resetBadges);
      await saveStreakData(resetStreak);
    } catch (err) {
      console.error('バッジリセットエラー:', err);
      throw err;
    }
  };

  // 初期データ読み込み
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([loadBadges(), loadStreakData()]);
    } catch (err) {
      console.error('初期データ読み込みエラー:', err);
      setError('初期データの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return {
    badges,
    streakData,
    isLoading,
    error,
    updateBadgesAndStreak,
    earnBadge,
    getEarnedBadgeCount,
    getProgressPercentage,
    getNextBadge,
    resetBadges,
    reloadData: loadInitialData
  };
};
