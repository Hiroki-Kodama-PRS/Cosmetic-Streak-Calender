import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry } from '../types';
import { generateId } from '../utils';

const DIARY_DATA_KEY = 'ointment_diary_data';

export const useDiary = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 日記データを読み込み
  const loadDiaryEntries = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const storedData = await AsyncStorage.getItem(DIARY_DATA_KEY);
      if (storedData) {
        const entries: DiaryEntry[] = JSON.parse(storedData);
        setDiaryEntries(entries);
      }
    } catch (err) {
      console.error('日記データの読み込みエラー:', err);
      setError('日記データの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 日記データを保存
  const saveDiaryEntries = async (entries: DiaryEntry[]) => {
    try {
      await AsyncStorage.setItem(DIARY_DATA_KEY, JSON.stringify(entries));
      setDiaryEntries(entries);
    } catch (err) {
      console.error('日記データの保存エラー:', err);
      setError('日記データの保存に失敗しました');
      throw err;
    }
  };

  // 日記エントリーを保存または更新
  const saveDiaryEntry = async (entry: DiaryEntry) => {
    try {
      const entryWithId = {
        ...entry,
        id: entry.id || generateId()
      };

      const existingIndex = diaryEntries.findIndex(
        e => e.id === entryWithId.id || e.date === entryWithId.date
      );

      let updatedEntries: DiaryEntry[];

      if (existingIndex >= 0) {
        // 既存エントリーを更新
        updatedEntries = diaryEntries.map((e, index) =>
          index === existingIndex ? entryWithId : e
        );
      } else {
        // 新しいエントリーを追加
        updatedEntries = [...diaryEntries, entryWithId];
      }

      await saveDiaryEntries(updatedEntries);
      return entryWithId;
    } catch (err) {
      console.error('日記エントリーの保存エラー:', err);
      setError('日記の保存に失敗しました');
      throw err;
    }
  };

  // 日記エントリーを削除
  const deleteDiaryEntry = async (entryId: string) => {
    try {
      const updatedEntries = diaryEntries.filter(entry => entry.id !== entryId);
      await saveDiaryEntries(updatedEntries);
      return updatedEntries;
    } catch (err) {
      console.error('日記エントリーの削除エラー:', err);
      setError('日記の削除に失敗しました');
      throw err;
    }
  };

  // 特定の日付の日記エントリーを取得
  const getDiaryByDate = (date: string): DiaryEntry | undefined => {
    return diaryEntries.find(entry => entry.date === date);
  };

  // 初期データ読み込み
  useEffect(() => {
    loadDiaryEntries();
  }, []);

  return {
    diaryEntries,
    isLoading,
    error,
    saveDiaryEntry,
    deleteDiaryEntry,
    getDiaryByDate,
    reloadData: loadDiaryEntries
  };
};
