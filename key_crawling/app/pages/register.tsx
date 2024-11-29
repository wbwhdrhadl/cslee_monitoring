import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../UserContext'; 

// 사이트별 키워드 등록 페이지
const KeywordRegistrationPage = () => {
  const { userId } = useUser(); 
  const [keywordsBySite, setKeywordsBySite] = useState({
    나라장터: [],
    나라장터사전공고: [],
    정보통신산업진흥원: [],
    중소벤처기업부: [],
    농촌진흥청: [],
    한국농업기술진흥원: [],
    범부처통합연구지원시스템: [],
    기업마당: [],
    스마트공장사업관리시스템: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const [currentKeyword, setCurrentKeyword] = useState('');
  const [selectedSite, setSelectedSite] = useState('');

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await fetch(`http://192.168.0.4:5001/keywords/?user_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          const groupedKeywords = data.reduce((acc, item) => {
            if (!acc[item.site_name]) acc[item.site_name] = [];
            acc[item.site_name].push(item.keyword);
            return acc;
          }, {});

          setKeywordsBySite((prevState) => ({
            ...prevState,
            ...groupedKeywords,
          }));
        } else {
          Alert.alert('오류', '키워드를 가져오는 중 문제가 발생했습니다.');
        }
      } catch (error) {
        console.error('Error fetching keywords:', error);
        Alert.alert('오류', '키워드를 가져오는 중 문제가 발생했습니다.');
      }
    };

    fetchKeywords();
  }, [userId]);

  const handleAddKeywordAPI = async (site, keyword) => {
    try {
      const response = await fetch('http://192.168.0.4:5001/keyword_add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          site_name: site,
          keyword,
        }),
      });

      if (!response.ok) {
        Alert.alert('오류', '키워드 추가 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error adding keyword:', error);
      Alert.alert('오류', '키워드 추가 중 문제가 발생했습니다.');
    }
  };

  const handleDeleteKeywordAPI = async (site, keyword) => {
    try {
      const response = await fetch('http://192.168.0.4:5001/keyword_delete/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          site_name: site,
          keyword,
        }),
      });

      if (!response.ok) {
        Alert.alert('오류', '키워드 삭제 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error deleting keyword:', error);
      Alert.alert('오류', '키워드 삭제 중 문제가 발생했습니다.');
    }
  };

  const handleAddKeyword = (site) => {
    if (currentKeyword.trim()) {
      setKeywordsBySite((prevState) => ({
        ...prevState,
        [site]: [...prevState[site], currentKeyword.trim()],
      }));
      handleAddKeywordAPI(site, currentKeyword.trim());
      setCurrentKeyword('');
    }
  };

  const handleDeleteKeyword = (site, index) => {
    const keywordToDelete = keywordsBySite[site][index];
    setKeywordsBySite((prevState) => ({
      ...prevState,
      [site]: prevState[site].filter((_, i) => i !== index),
    }));
    handleDeleteKeywordAPI(site, keywordToDelete);
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
    const hasKeywords = Object.values(keywordsBySite).some((keywords) => keywords.length > 0);

    if (!hasKeywords) {
      Alert.alert('오류', '최소 하나의 키워드를 추가해주세요.');
      return;
    }

    simulateProgress();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>사이트별 키워드 관리</Text>

        {Object.keys(keywordsBySite).map((site) => (
          <View key={site} style={styles.siteContainer}>
            <Text style={styles.siteTitle}>{site}</Text>

            <View style={styles.searchInputContainer}>
              <FontAwesome name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput
                style={styles.input}
                placeholder={`${site}에 추가할 키워드 입력`}
                placeholderTextColor="#888"
                value={selectedSite === site ? currentKeyword : ''}
                onFocus={() => setSelectedSite(site)}
                onChangeText={setCurrentKeyword}
              />
              <Pressable
                style={styles.addButton}
                onPress={() => handleAddKeyword(site)}
                disabled={selectedSite !== site || currentKeyword.trim() === ''}
              >
                <Text style={styles.addButtonText}>추가</Text>
              </Pressable>
            </View>

            <View style={styles.keywordListContainer}>
              {keywordsBySite[site].map((keyword, index) => (
                <View key={index} style={styles.keywordItem}>
                  <Text style={styles.keywordText}>{keyword}</Text>
                  <Pressable onPress={() => handleDeleteKeyword(site, index)}>
                    <MaterialIcons name="delete" size={20} color="#f87171" />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ))}

        <Pressable onPress={handleRegister} style={styles.registerButton} disabled={isLoading}>
          <Text style={styles.registerButtonText}>
            {isLoading ? '업데이트 중...' : '모든 키워드 업데이트'}
          </Text>
        </Pressable>

        {isLoading && (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.progressText}>업데이트 진행 중... {progress}%</Text>
          </View>
        )}

        {isComplete && (
          <View style={styles.completeContainer}>
            <Text style={styles.completeText}>🎉 모든 키워드가 성공적으로 업데이트 되었습니다.</Text>
          </View>
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
  siteContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  siteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 10,
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
  keywordListContainer: {
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
    textAlign: 'center',
  },
});

export default KeywordRegistrationPage;