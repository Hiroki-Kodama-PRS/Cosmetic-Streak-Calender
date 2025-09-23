import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Badge, StreakData } from '../types';

interface BadgeSystemProps {
  badges: Badge[];
  streakData: StreakData;
}

export const BadgeSystem: React.FC<BadgeSystemProps> = ({ badges, streakData }) => {
  // 獲得済みバッジをフィルタリング
  const earnedBadges = badges.filter(badge => badge.earned);
  const unEarnedBadges = badges.filter(badge => !badge.earned);

  const renderBadge = (badge: Badge, isEarned: boolean = true) => (
    <View key={badge.id} style={[styles.badgeItem, !isEarned && styles.badgeItemUnearnded]}>
      <View style={[styles.badgeIcon, !isEarned && styles.badgeIconUnearned]}>
        <Text style={[styles.badgeIconText, !isEarned && styles.badgeIconTextUnearned]}>
          {getBadgeEmoji(badge.id)}
        </Text>
      </View>
      <View style={styles.badgeInfo}>
        <Text style={[styles.badgeName, !isEarned && styles.badgeNameUnearned]}>
          {badge.name}
        </Text>
        <Text style={[styles.badgeDescription, !isEarned && styles.badgeDescriptionUnearned]}>
          {badge.description}
        </Text>
        {isEarned && badge.earnedDate && (
          <Text style={styles.badgeDate}>
            取得日: {new Date(badge.earnedDate).toLocaleDateString('ja-JP')}
          </Text>
        )}
      </View>
    </View>
  );

  const getBadgeEmoji = (badgeId: string): string => {
    const emojiMap: { [key: string]: string } = {
      'first_record': '🎯',
      'streak_3': '🔥',
      'streak_7': '⭐',
      'streak_14': '💎',
      'streak_30': '👑',
      'consistent_user': '📅',
      'heavy_user': '💪',
      'milestone_100g': '🏆'
    };
    return emojiMap[badgeId] || '🏅';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>獲得バッジ</Text>

      {/* Streakセクション */}
      <View style={styles.streakContainer}>
        <View style={styles.streakItem}>
          <Text style={styles.streakLabel}>現在のStreak</Text>
          <Text style={styles.streakValue}>{streakData.currentStreak}日</Text>
          <Text style={styles.streakIcon}>🔥</Text>
        </View>
        <View style={styles.streakItem}>
          <Text style={styles.streakLabel}>最長Streak</Text>
          <Text style={styles.streakValue}>{streakData.longestStreak}日</Text>
          <Text style={styles.streakIcon}>👑</Text>
        </View>
      </View>

      {/* 獲得済みバッジ */}
      <Text style={styles.sectionTitle}>獲得済みバッジ ({earnedBadges.length})</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.badgeScrollView}
        contentContainerStyle={styles.badgeScrollContent}
      >
        {earnedBadges.length > 0 ? (
          earnedBadges.map(badge => renderBadge(badge, true))
        ) : (
          <View style={styles.noBadgesContainer}>
            <Text style={styles.noBadgesText}>まだバッジを獲得していません</Text>
            <Text style={styles.noBadgesSubText}>毎日記録してバッジを獲得しましょう！</Text>
          </View>
        )}
      </ScrollView>

      {/* 未獲得バッジ（次の目標として表示） */}
      {unEarnedBadges.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>次の目標バッジ</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.badgeScrollView}
            contentContainerStyle={styles.badgeScrollContent}
          >
            {unEarnedBadges.slice(0, 3).map(badge => renderBadge(badge, false))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2962ff',
    marginBottom: 16,
    textAlign: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  streakItem: {
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2962ff',
    marginBottom: 4,
  },
  streakIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 12,
    marginTop: 8,
  },
  badgeScrollView: {
    marginBottom: 16,
  },
  badgeScrollContent: {
    paddingHorizontal: 4,
  },
  badgeItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 140,
    borderWidth: 2,
    borderColor: '#2962ff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeItemUnearnded: {
    borderColor: '#dee2e6',
    backgroundColor: '#f8f9fa',
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2962ff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  badgeIconUnearned: {
    backgroundColor: '#adb5bd',
  },
  badgeIconText: {
    fontSize: 20,
    color: '#ffffff',
  },
  badgeIconTextUnearned: {
    opacity: 0.6,
  },
  badgeInfo: {
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2962ff',
    textAlign: 'center',
    marginBottom: 2,
  },
  badgeNameUnearned: {
    color: '#6c757d',
  },
  badgeDescription: {
    fontSize: 10,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 14,
  },
  badgeDescriptionUnearned: {
    color: '#adb5bd',
  },
  badgeDate: {
    fontSize: 9,
    color: '#28a745',
    marginTop: 4,
    textAlign: 'center',
  },
  noBadgesContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    width: 200,
  },
  noBadgesText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
    textAlign: 'center',
  },
  noBadgesSubText: {
    fontSize: 12,
    color: '#adb5bd',
    textAlign: 'center',
  },
});
