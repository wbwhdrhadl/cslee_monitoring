import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Linking } from 'react-native'; 

const ResultPage = () => {
  const router = useRouter(); // router 정의
  const { results } = useLocalSearchParams(); // 전달받은 params에서 데이터 추출
  const [data, setData] = useState([]);

  useEffect(() => {
    if (results) {
      setData(JSON.parse(results)); // JSON 문자열을 객체로 변환
    }
  }, [results]);

  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.topCloseButton} onPress={() => router.back()}>
        <FontAwesome name="close" size={24} color="#333" />
      </Pressable>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>조회 결과</Text>
        {data.length > 0 ? (
          data.map((item, index) => (
            <Pressable
              key={index}
              style={styles.listItem}
              onPress={() => handleSelectItem(item)}
            >
              <Text style={styles.listItemText}>{item.title}</Text>
              <Text style={styles.listItemSubtitle}>{item.agency}</Text>
              <Text style={styles.listItemSubtitle}>{item.announcement_date}</Text>
              <Text style={styles.listItemSubtitle}>{item.budget}</Text>
            </Pressable>
          ))
        ) : (
          <Text style={styles.noData}>조회된 데이터가 없습니다.</Text>
        )}
      </ScrollView>

      {selectedItem && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>{selectedItem.title}</Text>
            <ScrollView>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>구분: </Text>
                {selectedItem.site_name}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>검색 키워드: </Text>
                {selectedItem.keyword}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>업무: </Text>
                {selectedItem.task}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>분류: </Text>
                {selectedItem.category}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>공고일: </Text>
                {selectedItem.announcement_date}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>공고기관: </Text>
                {selectedItem.agency}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>마감일시: </Text>
                {selectedItem.deadline}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>사업예산: </Text>
                {selectedItem.budget}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>계약방법: </Text>
                {selectedItem.contract_method}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>공고문 URL: </Text>
                <Text
                  style={{ color: 'blue', textDecorationLine: 'underline' }} // 링크 스타일 추가
                  onPress={() => Linking.openURL(selectedItem.url)} // URL 클릭 시 이동
                >
                  {selectedItem.url}
                </Text>
            </Text>
            </ScrollView>
            <Pressable onPress={handleClosePopup} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </Pressable>
          </View>
        </View>
      )}
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
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1f2937',
    textAlign: 'center',
  },
  listItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    elevation: 2,
  },
  listItemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 5,
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 15,
  },
  popupText: {
    fontSize: 16,
    marginBottom: 10,
  },
  popupLabel: {
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#555555',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topCloseButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  noData: {
    textAlign: 'center',
    fontSize: 18,
    color: '#999',
    marginTop: 20,
  },
});

export default ResultPage;
