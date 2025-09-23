// src/components/UsageInput.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { UsageRecord } from '../types';
import { formatDate, generateId } from '../utils';

interface UsageInputProps {
  onSave: (record: UsageRecord) => void;
}

export const UsageInput: React.FC<UsageInputProps> = ({ onSave }) => {
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('エラー', '有効な使用量を入力してください');
      return;
    }

    const record: UsageRecord = {
      id: generateId(),
      date: formatDate(new Date()),
      amount: numAmount,
      timestamp: Date.now(),
    };

    onSave(record);
    setAmount('');
    Alert.alert('保存完了', '使用量を記録しました！');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Amount of Usage</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="使用量 (g)"
          placeholderTextColor="#999"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
