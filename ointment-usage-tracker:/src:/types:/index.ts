// src/types/index.ts
export interface UsageRecord {
  id: string;
  date: string;
  amount: number;
  timestamp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: number;
}

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood?: 'good' | 'normal' | 'bad';
  skinCondition?: 'improved' | 'stable' | 'worsened';
  timestamp: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastUsedDate?: string;
}

export interface WeeklyUsageData {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

export interface AppTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
