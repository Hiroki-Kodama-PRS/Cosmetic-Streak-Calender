import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Alert 
} from 'react-native';
import { DiaryEntry } from '../types';
import { formatDateForDisplay } from '../utils';

interface DiarySectionProps {
  diaryEntries: DiaryEntry[];
  onSaveDiary: (entry: DiaryEntry) => void;
}

export const DiarySection: React.FC<DiarySectionProps> = ({ 
  diaryEntries, 
  onSaveDiary 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    content: '',
    mood: undefined,
    skinCondition: undefined,
  });

  // 最新の日記エントリーを取得（サムネイル表示用）
  const recentEntries = diaryEntries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const moodEmojis = {
    'excellent': '😊',
    'good': '🙂',
    'fair': '😐',
    'poor': '😞',
    'terrible': '😫'
  };

  const skinConditionEmojis = {
    'excellent': '✨',
    'good': '😌',
    'fair': '😐',
    'poor': '😰',
    'irritated': '😣'
  };

  const handleNewEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = diaryEntries.find(entry => entry.date === today);

    if (existingEntry) {
      setCurrentEntry(existingEntry);
    } else {
      setCurrentEntry({
        id: '',
        date: today,
        content: '',
        mood: undefined,
        skinCondition: undefined,
      });
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!currentEntry.content.trim()) {
      Alert.alert('エラー', '日記の内容を入力してください');
      return;
    }

    const entryToSave: DiaryEntry = {
      ...currentEntry,
      id: currentEntry.id || `diary_${Date.now()}`,
    };

    onSaveDiary(entryToSave);
    setModalVisible(false);
    setCurrentEntry({
      id: '',
      date: new Date().toISOString().split('T')[0],
      content: '',
      mood: undefined,
      skinCondition: undefined,
    });
  };

  const renderDiaryThumbnail = (entry: DiaryEntry) => (
    <TouchableOpacity 
      key={entry.id} 
      style={styles.thumbnailItem}
      onPress={() => {
        setCurrentEntry(entry);
        setModalVisible(true);
      }}
    >
      <Text style={styles.thumbnailDate}>
        {formatDateForDisplay(entry.date)}
      </Text>
      <Text style={styles.thumbnailContent} numberOfLines={2}>
        {entry.content}
      </Text>
      <View style={styles.thumbnailMeta}>
        {entry.mood && (
          <Text style={styles.thumbnailEmoji}>
            {moodEmojis[entry.mood]}
          </Text>
        )}
        {entry.skinCondition && (
          <Text style={styles.thumbnailEmoji}>
            {skinConditionEmojis[entry.skinCondition]}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>肌の記録</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleNewEntry}>
          <Text style={styles.addButtonText}>+ 新規</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.thumbnailsContainer}
        showsVerticalScrollIndicator={false}
      >
        {recentEntries.length > 0 ? (
          recentEntries.map(renderDiaryThumbnail)
        ) : (
          <View style={styles.noEntriesContainer}>
            <Text style={styles.noEntriesText}>まだ日記がありません</Text>
            <Text style={styles.noEntriesSubText}>
              肌の状態や気づきを記録してみましょう
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 日記編集モーダル */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {formatDateForDisplay(currentEntry.date)} の記録
            </Text>
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={handleSave}
            >
              <Text style={styles.modalSaveText}>保存</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* 気分選択 */}
            <Text style={styles.sectionLabel}>今日の気分</Text>
            <View style={styles.optionContainer}>
              {Object.entries(moodEmojis).map(([key, emoji]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionButton,
                    currentEntry.mood === key && styles.optionButtonSelected
                  ]}
                  onPress={() => setCurrentEntry({...currentEntry, mood: key as any})}
                >
                  <Text style={styles.optionEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 肌状態選択 */}
            <Text style={styles.sectionLabel}>肌の状態</Text>
            <View style={styles.optionContainer}>
              {Object.entries(skinConditionEmojis).map(([key, emoji]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionButton,
                    currentEntry.skinCondition === key && styles.optionButtonSelected
                  ]}
                  onPress={() => setCurrentEntry({...currentEntry, skinCondition: key as any})}
                >
                  <Text style={styles.optionEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 日記内容 */}
            <Text style={styles.sectionLabel}>今日の記録</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={8}
              placeholder="肌の状態、使用した薬品、気づいたことなどを記録してください..."
              value={currentEntry.content}
              onChangeText={(text) => setCurrentEntry({...currentEntry, content: text})}
              textAlignVertical="top"
            />
          </ScrollView>
        </View>
      </Modal>
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
    height: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2962ff',
  },
  addButton: {
    backgroundColor: '#2962ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  thumbnailsContainer: {
    flex: 1,
  },
  thumbnailItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2962ff',
  },
  thumbnailDate: {
    fontSize: 12,
    color: '#2962ff',
    fontWeight: '600',
    marginBottom: 4,
  },
  thumbnailContent: {
    fontSize: 14,
    color: '#343a40',
    lineHeight: 18,
    marginBottom: 8,
  },
  thumbnailMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  thumbnailEmoji: {
    fontSize: 16,
    marginLeft: 8,
  },
  noEntriesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noEntriesText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
    textAlign: 'center',
  },
  noEntriesSubText: {
    fontSize: 12,
    color: '#adb5bd',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 18,
    color: '#6c757d',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
  },
  modalSaveButton: {
    backgroundColor: '#2962ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  modalSaveText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 12,
    marginTop: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  optionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    borderColor: '#2962ff',
    backgroundColor: '#e3f2fd',
  },
  optionEmoji: {
    fontSize: 24,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: '#ffffff',
  },
});
