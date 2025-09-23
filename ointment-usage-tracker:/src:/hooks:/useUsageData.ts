import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UsageRecord, WeeklyUsageData } from '../types';
import { calculateWeeklyUsage, generateId } from '../utils';

const USAGE_DATA_KEY = 'ointment_usage_data';

export const useUsageData = () => {
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyUsageData>({
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データ読み込み
  const loadUsageData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const storedData = await AsyncStorage.getItem(USAGE_DATA_KEY);
      if (storedData) {
        const records: UsageRecord[] = JSON.parse(storedData);
        setUsageRecords(records);

        // 今週のデータを計算
        const weekly = calculateWeeklyUsage(records);
        setWeeklyData(weekly);
      }
    } catch (err) {
      console.error('使用量データの読み込みエラー:', err);
      setError('データの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // データ保存
  const saveUsageData = async (records: UsageRecord[]) => {
    try {
      await AsyncStorage.setItem(USAGE_DATA_KEY, JSON.stringify(records));
      setUsageRecords(records);

      // 週次データを更新
      const weekly = calculateWeeklyUsage(records);
      setWeeklyData(weekly);
    } catch (err) {
      console.error('使用量データの保存エラー:', err);
      setError('データの保存に失敗しました');
      throw err;
    }
  };

  // 新しい使用量記録を追加
  const addUsageRecord = async (amount: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // 今日の記録が既に存在するかチェック
      const existingRecordIndex = usageRecords.findIndex(
        record => record.date === today
      );

      let updatedRecords: UsageRecord[];

      if (existingRecordIndex >= 0) {
        // 既存の記録を更新
        updatedRecords = usageRecords.map((record, index) =>
          index === existingRecordIndex
            ? { ...record, amount: record.amount + amount, timestamp: Date.now() }
            : record
        );
      } else {
        // 新しい記録を追加
        const newRecord: UsageRecord = {
          id: generateId(),
          date: today,
          amount,
          timestamp: Date.now()
        };
        updatedRecords = [...usageRecords, newRecord];
      }

      await saveUsageData(updatedRecords);
      return updatedRecords;
    } catch (err) {
      console.error('使用量記録の追加エラー:', err);
      setError('記録の追加に失敗しました');
      throw err;
    }
  };

  // 使用量記録を編集
  const updateUsageRecord = async (recordId: string, newAmount: number) => {
    try {
      const updatedRecords = usageRecords.map(record =>
        record.id === recordId
          ? { ...record, amount: newAmount, timestamp: Date.now() }
          : record
      );

      await saveUsageData(updatedRecords);
      return updatedRecords;
    } catch (err) {
      console.error('使用量記録の更新エラー:', err);
      setError('記録の更新に失敗しました');
      throw err;
    }
  };

  // 使用量記録を削除
  const deleteUsageRecord = async (recordId: string) => {
    try {
      const updatedRecords = usageRecords.filter(record => record.id !== recordId);
      await saveUsageData(updatedRecords);
      return updatedRecords;
    } catch (err) {
      console.error('使用量記録の削除エラー:', err);
      setError('記録の削除に失敗しました');
      throw err;
    }
  };

  // 特定の日の使用量を取得
  const getUsageByDate = (date: string): number => {
    const record = usageRecords.find(r => r.date === date);
    return record ? record.amount : 0;
  };

  // 今日の使用量を取得
  const getTodayUsage = (): number => {
    const today = new Date().toISOString().split('T')[0];
    return getUsageByDate(today);
  };

  // 期間内の合計使用量を取得
  const getTotalUsageInPeriod = (startDate: string, endDate: string): number => {
    return usageRecords
      .filter(record => record.date >= startDate && record.date <= endDate)
      .reduce((total, record) => total + record.amount, 0);
  };

  // 月間使用量を取得
  const getMonthlyUsage = (year: number, month: number): number => {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // 月末
    return getTotalUsageInPeriod(startDate, endDate);
  };

  // 使用統計を取得
  const getUsageStats = () => {
    if (usageRecords.length === 0) {
      return {
        totalUsage: 0,
        averageDaily: 0,
        recordDays: 0,
        maxDaily: 0,
        minDaily: 0
      };
    }

    const totalUsage = usageRecords.reduce((sum, record) => sum + record.amount, 0);
    const recordDays = usageRecords.length;
    const averageDaily = totalUsage / recordDays;
    const amounts = usageRecords.map(r => r.amount);
    const maxDaily = Math.max(...amounts);
    const minDaily = Math.min(...amounts);

    return {
      totalUsage,
      averageDaily,
      recordDays,
      maxDaily,
      minDaily
    };
  };

  // 初期データ読み込み
  useEffect(() => {
    loadUsageData();
  }, []);

  return {
    usageRecords,
    weeklyData,
    isLoading,
    error,
    addUsageRecord,
    updateUsageRecord,
    deleteUsageRecord,
    getUsageByDate,
    getTodayUsage,
    getTotalUsageInPeriod,
    getMonthlyUsage,
    getUsageStats,
    reloadData: loadUsageData
  };
};
