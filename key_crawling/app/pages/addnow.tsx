import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 

// 직접 실행 페이지
const MainPage = () => {
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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResultButton, setShowResultButton] = useState(false);

  const router = useRouter(); 

  const handleAddKeyword = () => {
    if (keyword.trim()) {
      setKeywords((prevKeywords) => [...prevKeywords, keyword.trim()]);
      setKeyword('');
    }
  };

  const handleDeleteKeyword = (index) => {
    setKeywords((prevKeywords) => prevKeywords.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    setIsLoading(true); 
    setTimeout(() => {
      setIsLoading(false); 
      setShowResultButton(true); 
      Alert.alert('키워드 검색 완료', '키워드가 검색되었습니다.');
    }, 3000); 
  };

  const navigateToRegister = () => {
    router.push('../result'); 
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>키워드 검색</Text>

        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="검색할 키워드를 입력해주세요"
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

        {/* 사이트 선택 */}
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

        <View style={styles.datePickerContainer}>
          <Text style={styles.sectionTitle}>기간을 선택해주세요</Text>
          <View style={styles.dateRow}>
            <Pressable style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
              <Text style={styles.dateText}>{startDate.toDateString()}</Text>
              <MaterialIcons name="calendar-today" size={24} color="#333333" />
            </Pressable>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);
                  if (selectedDate) setStartDate(selectedDate);
                }}
              />
            )}

            <Pressable
              style={[styles.dateButton, { backgroundColor: '#e5e7eb' }]} // 비활성화 버튼 스타일
              onPress={() => {
                Alert.alert('알림', '종료 날짜 변경은 현재 기능 개선 중입니다.');
              }}
            >
              <Text style={styles.dateText}>{endDate.toDateString()}</Text>
              <MaterialIcons name="calendar-today" size={24} color="#333333" />
            </Pressable>
          </View>
        </View>

        <Pressable onPress={handleSearch} style={styles.searchButton}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.searchButtonText}>키워드 검색</Text>
          )}
        </Pressable>

        {showResultButton && (
          <Pressable onPress={navigateToRegister} style={styles.resultButton}>
            <Text style={styles.resultButtonText}>검색 결과 보러가기</Text>
          </Pressable>
        )}
      </ScrollView>
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
    fontSize: 25,
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
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
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
    fontSize: 15,
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
  datePickerContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#374151',
    marginRight: 5,
  },
  searchButton: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  resultButton: {
    backgroundColor: '#555555',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  resultButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default MainPage;
