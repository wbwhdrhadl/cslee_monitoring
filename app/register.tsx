import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import Checkbox from 'expo-checkbox';
import { MaterialIcons } from '@expo/vector-icons';
import Navbar from '../components/navbar';

const KeywordRegistrationPage = () => {
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [checked, setChecked] = useState({
    나라장터: false,
    나라장터사전공고: false,
    정보통신산업진흥원: false,
    중소벤처기업부: false,
    농촌진흥청: false,
    한국농업기술진흥원: false,
    범부처통합연구지원시스템: false,
    기업마당: false,
    스마트공장사업관리시스템: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleAddKeyword = () => {
    if (keyword.trim()) {
      setKeywords((prevKeywords) => [...prevKeywords, keyword.trim()]);
      setKeyword('');
    }
  };

  const handleDeleteKeyword = (index) => {
    setKeywords((prevKeywords) => prevKeywords.filter((_, i) => i !== index));
  };

  const simulateProgress = () => {
    let progressValue = 0;
    setIsLoading(true);
    setIsComplete(false);
    setProgress(progressValue);

    const interval = setInterval(() => {
      progressValue += 10;
      setProgress(progressValue);

      if (progressValue >= 100) {
        clearInterval(interval);
        setIsLoading(false);
        setIsComplete(true);
      }
    }, 300); 
  };

  const handleRegister = () => {
    const selectedSources = Object.keys(checked).filter((key) => checked[key]);

    if (keywords.length === 0 || selectedSources.length === 0) {
      alert('키워드와 사이트를 선택해주세요.');
      return;
    }

    simulateProgress(); 
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>키워드 등록</Text>


        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="등록할 키워드를 입력해주세요"
            placeholderTextColor="#888"
            value={keyword}
            onChangeText={setKeyword}
          />
          <Pressable style={styles.addButton} onPress={handleAddKeyword}>
            <Text style={styles.addButtonText}>추가</Text>
          </Pressable>
        </View>

        <View style={styles.keywordListContainer}>
          <Text style={styles.sectionTitle}>추가된 키워드</Text>
          <View style={styles.keywordGrid}>
            {keywords.map((item, index) => (
              <View key={index} style={styles.keywordItem}>
                <Text style={styles.keywordText}>{item}</Text>
                <Pressable onPress={() => handleDeleteKeyword(index)}>
                  <MaterialIcons name="delete" size={20} color="#f87171" />
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.checkboxContainer}>
          <Text style={styles.sectionTitle}>포함할 사이트를 선택해주세요</Text>
          {Object.keys(checked).map((source) => (
            <View key={source} style={styles.checkboxRow}>
              <Checkbox
                value={checked[source]}
                onValueChange={(value) =>
                  setChecked((prevChecked) => ({
                    ...prevChecked,
                    [source]: value,
                  }))
                }
                color={checked[source] ? '#2563eb' : undefined}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxLabel}>{source}</Text>
            </View>
          ))}
        </View>

        <Pressable onPress={handleRegister} style={styles.registerButton} disabled={isLoading}>
          <Text style={styles.registerButtonText}>
            {isLoading ? '등록 중...' : '키워드 등록'}
          </Text>
        </Pressable>

        {isLoading && (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.progressText}>등록 진행 중... {progress}%</Text>
          </View>
        )}

        {isComplete && (
          <View style={styles.completeContainer}>
            <Text style={styles.completeText}>🎉 키워드 등록이 완료되었습니다!</Text>
            <Text style={styles.completeText}>다운로드함을 확인하세요</Text>
          </View>
        )}
      </ScrollView>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1f2937',
    textAlign: 'center',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#555555',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#111827',
  },
  keywordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  keywordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  keywordText: {
    fontSize: 16,
    color: '#4b5563',
    marginRight: 5,
  },
  checkboxContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#4b5563',
  },
  registerButton: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2563eb',
  },
  completeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  completeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
});

export default KeywordRegistrationPage;
