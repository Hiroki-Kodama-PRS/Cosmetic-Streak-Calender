import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { WeeklyUsageData } from '../types';

interface DailyChartProps {
  weeklyData: WeeklyUsageData;
}

export const DailyChart: React.FC<DailyChartProps> = ({ weeklyData }) => {
  const screenWidth = Dimensions.get('window').width;

  // 曜日のラベル（月〜日）
  const dayLabels = ['月', '火', '水', '木', '金', '土', '日'];

  // 週のデータを配列として取得
  const usageData = [
    weeklyData.monday,
    weeklyData.tuesday,
    weeklyData.wednesday,
    weeklyData.thursday,
    weeklyData.friday,
    weeklyData.saturday,
    weeklyData.sunday
  ];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#f8f9fa',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1, // 小数点以下1桁まで表示
    color: (opacity = 1) => `rgba(41, 98, 255, ${opacity})`, // 医療系の青色
    labelColor: (opacity = 1) => `rgba(52, 58, 64, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#2962ff'
    },
    barPercentage: 0.7,
    fillShadowGradient: '#2962ff',
    fillShadowGradientOpacity: 0.8,
  };

  const data = {
    labels: dayLabels,
    datasets: [
      {
        data: usageData,
        color: (opacity = 1) => `rgba(41, 98, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // 最大使用量を計算（Y軸の範囲設定用）
  const maxUsage = Math.max(...usageData);
  const yAxisMax = maxUsage > 0 ? Math.ceil(maxUsage * 1.2) : 10;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Usage</Text>
      <Text style={styles.subtitle}>今週の使用量（g）</Text>

      {maxUsage > 0 ? (
        <BarChart
          data={data}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix="g"
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero={true}
          showValuesOnTopOfBars={true}
          withInnerLines={true}
          segments={4}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>まだ使用量の記録がありません</Text>
          <Text style={styles.noDataSubText}>使用量を入力して記録を開始しましょう</Text>
        </View>
      )}

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>今週の合計</Text>
          <Text style={styles.summaryValue}>
            {usageData.reduce((sum, value) => sum + value, 0).toFixed(1)}g
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>1日平均</Text>
          <Text style={styles.summaryValue}>
            {(usageData.reduce((sum, value) => sum + value, 0) / 7).toFixed(1)}g
          </Text>
        </View>
      </View>
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
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginVertical: 8,
  },
  noDataText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
    fontWeight: '500',
  },
  noDataSubText: {
    fontSize: 14,
    color: '#adb5bd',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2962ff',
  },
});
