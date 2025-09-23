// src/utils/index.ts
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { UsageRecord, WeeklyUsageData, DayOfWeek } from '../types';

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDateJapanese = (date: Date): string => {
  return format(date, 'M月d日(E)', { locale: ja });
};

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const getWeeklyUsageData = (usageRecords: UsageRecord[]): WeeklyUsageData => {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Start from Monday

  const weeklyData: WeeklyUsageData = {
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  };

  const dayMap: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  for (let i = 0; i < 7; i++) {
    const currentDay = addDays(weekStart, i);
    const dayKey = dayMap[i];

    const dayUsage = usageRecords
      .filter(record => isSameDay(new Date(record.date), currentDay))
      .reduce((sum, record) => sum + record.amount, 0);

    weeklyData[dayKey] = dayUsage;
  }

  return weeklyData;
};

export const calculateStreak = (usageRecords: UsageRecord[]): { currentStreak: number; longestStreak: number } => {
  if (usageRecords.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort records by date (most recent first)
  const sortedRecords = [...usageRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  for (const record of sortedRecords) {
    const recordDate = new Date(record.date);

    if (!lastDate) {
      tempStreak = 1;
      lastDate = recordDate;
    } else {
      const daysDiff = Math.floor((lastDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 1;
      }

      lastDate = recordDate;
    }
  }

  // Check if the most recent record is today or yesterday for current streak
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const mostRecentDate = new Date(sortedRecords[0].date);
  if (isSameDay(mostRecentDate, today) || isSameDay(mostRecentDate, yesterday)) {
    currentStreak = tempStreak;
  }

  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }

  return { currentStreak, longestStreak };
};

export const getDayNameJapanese = (dayKey: DayOfWeek): string => {
  const dayNames = {
    monday: '月',
    tuesday: '火',
    wednesday: '水',
    thursday: '木',
    friday: '金',
    saturday: '土',
    sunday: '日',
  };
  return dayNames[dayKey];
};
