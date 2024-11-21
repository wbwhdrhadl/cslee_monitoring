import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import Navbar from '../components/navbar';

const MainPage = () => {
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState([]); // 여러 키워드를 관리
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

    router.push('/result'); 
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

        {/* 추가된 키워드 리스트 */}
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

        {/* 기간 선택 */}
        <View style={styles.datePickerContainer}>
          <Text style={styles.sectionTitle}>기간을 선택해주세요</Text>
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
        <Pressable onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
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
    padding: 10,
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
    backgroundColor: '#555555', // 어두운 회색
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
  },
  searchButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default MainPage;
