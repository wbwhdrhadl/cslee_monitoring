import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView,Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter,useLocalSearchParams } from 'expo-router'; 
import { useUser } from '../UserContext'; 

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
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const router = useRouter(); 
  const { user_id } = useLocalSearchParams();
  const { setUserId, userId } = useUser();

  useEffect(() => {
    if (user_id) {
      setUserId(user_id); // 전달받은 user_id를 UserContext에 설정
    }
  }, [user_id, setUserId]);

  const handleAddKeyword = () => {
    if (keyword.trim()) {
      setKeywords((prevKeywords) => [...prevKeywords, keyword.trim()]);
      setKeyword('');
    }
  };

  const handleDeleteKeyword = (index) => {
    setKeywords((prevKeywords) => prevKeywords.filter((_, i) => i !== index));
  };

  const handleSearch = async () => {
    const selectedSites = Object.keys(checked).filter((site) => checked[site]);
  
    if (keywords.length === 0 || selectedSites.length === 0) {
      Alert.alert('오류 발생', '키워드와 사이트를 선택해주세요.');
      return;
    }
  
    try {
      const queryParams = new URLSearchParams({
        user_id: userId || '',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      });
  
      const response = await fetch(
        `http://192.168.0.4:5001/search_results/?${queryParams.toString()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            keywords, // request body
            site_names: selectedSites, // request body
          }),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        router.push({
          pathname: '/result',
          params: {
            results: JSON.stringify(data), 
          },
        });
      } else {
        Alert.alert('조회 실패', data.detail || '데이터를 조회할 수 없습니다.');
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      Alert.alert('오류 발생', '서버에 문제가 발생했습니다.');
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>키워드 조회</Text>

        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="조회할 키워드를 입력해주세요"
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
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
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
  },
  searchButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default MainPage;