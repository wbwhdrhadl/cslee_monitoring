import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import Checkbox from 'expo-checkbox'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons'; // 달력 이모티콘 추가

const MainPage = () => {
  const [keyword, setKeyword] = useState('');
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

  const handleSearch = () => {
    const selectedSources = Object.keys(checked).filter((key) => checked[key]);
    alert(
      `Keyword: ${keyword}\nSources: ${selectedSources.join(', ')}\nStart Date: ${startDate.toDateString()}\nEnd Date: ${endDate.toDateString()}`
    );
  };

  return (
    <View style={styles.container}>
      {/* 제목 */}
      <Text style={styles.title}>키워드 검색</Text>

      {/* 키워드 입력 */}
      <TextInput
        style={styles.input}
        placeholder="검색할 키워드를 입력해주세요"
        placeholderTextColor="#888"
        value={keyword}
        onChangeText={setKeyword}
      />

      {/* 체크박스 섹션 */}
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

      {/* 기간 선택 */}
      <View style={styles.datePickerContainer}>
        <Text style={styles.sectionTitle}>Select Period</Text>
        <View style={styles.dateRow}>
          {/* 시작 날짜 */}
          <Pressable style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
            <Text style={styles.dateText}>Start: {startDate.toDateString()}</Text>
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

          {/* 종료 날짜 */}
          <Pressable style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
            <Text style={styles.dateText}>End: {endDate.toDateString()}</Text>
            <MaterialIcons name="calendar-today" size={24} color="#333333" />
          </Pressable>
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}
        </View>
      </View>

      {/* 검색 버튼 */}
      <Pressable onPress={handleSearch} style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Search</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1f2937',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
  },
  checkboxContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#111827',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#4b5563',
  },
  datePickerContainer: {
    marginVertical: 20,
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
  },
  searchButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default MainPage;
