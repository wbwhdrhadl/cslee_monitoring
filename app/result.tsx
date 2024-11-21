import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Navbar from '../components/navbar';

const resultPage = () => {

  const csvData = [
    {
      구분: '나라장터',
      검색키워드: 'AI',
      업무: '용역',
      분류: '변경',
      공고일: '2024-10-22',
      공고명: '(24F058-G) AI기반 경계작전체계 통합관제 기술 실증',
      공고기관: '국방부 국군재정관리단',
      마감일시: '2024-10-29 10:00',
      사업예산: '797,555,260원',
      계약방법: '일반(총액)협상에의한계약',
      공고문URL: 'https://www.g2b.go.kr:8081/ep/invitation/publish/bidInfoDtl.do?bidno=20240909177&bidseq=01&releaseYn=Y&taskClCd=5',
    },
    {
      구분: '나라장터',
      검색키워드: 'AI',
      업무: '용역',
      분류: '일반',
      공고일: '2024-10-22',
      공고명: '재공고)혁신2유형 산학연동형 AIESG 플랫폼 및 모바일 앱 구축',
      공고기관: '신성대학',
      마감일시: '2024-10-30 10:30',
      사업예산: '200,000,000원',
      계약방법: '일반(총액)협상에의한계약',
      공고문URL: 'https://www.g2b.go.kr:8081/ep/invitation/publish/bidInfoDtl.do?bidno=20241023863&bidseq=00&releaseYn=Y&taskClCd=5',
    },

  ];

  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>키워드 포함 공고</Text>
        {csvData.map((item, index) => (
          <Pressable
            key={index}
            style={styles.listItem}
            onPress={() => handleSelectItem(item)}
          >
            <Text style={styles.listItemText}>{item.공고명}</Text>
            <Text style={styles.listItemSubtitle}>{item.공고기관}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* 팝업 */}
      {selectedItem && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>{selectedItem.공고명}</Text>
            <ScrollView>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>구분: </Text>
                {selectedItem.구분}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>검색 키워드: </Text>
                {selectedItem.검색키워드}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>업무: </Text>
                {selectedItem.업무}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>분류: </Text>
                {selectedItem.분류}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>공고일: </Text>
                {selectedItem.공고일}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>공고기관: </Text>
                {selectedItem.공고기관}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>마감일시: </Text>
                {selectedItem.마감일시}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>사업예산: </Text>
                {selectedItem.사업예산}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>계약방법: </Text>
                {selectedItem.계약방법}
              </Text>
              <Text style={styles.popupText}>
                <Text style={styles.popupLabel}>공고문 URL: </Text>
                {selectedItem.공고문URL}
              </Text>
            </ScrollView>
            <Pressable onPress={handleClosePopup} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </Pressable>
          </View>
        </View>
      )}

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
});

export default resultPage;
