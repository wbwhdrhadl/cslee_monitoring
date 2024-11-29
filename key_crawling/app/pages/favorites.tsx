import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '../UserContext';
import { Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

type FavoriteItem = {
  id: number;
  site_name: string;
  keyword: string;
  category: string;
  task: string;
  announcement_date: string;
  title: string;
  agency: string;
  deadline: string;
  budget: string;
  contract_method: string;
  url: string;
  created_at: string;
};

const FavoritesPage: React.FC = () => {
  const { userId } = useUser();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<FavoriteItem | null>(null);

  // API 호출 함수
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.0.4:5001/favorites?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const data = await response.json();
      setFavorites(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      Alert.alert('Error', '즐겨찾기 데이터를 불러올 수 없습니다.');
      setLoading(false);
    }
  };

  // 항목 삭제
  const deleteFavorite = async (item: FavoriteItem) => {
    try {
      const response = await fetch(
        `http://192.168.0.4:5001/favorites/delete/?user_id=${userId}&title=${encodeURIComponent(
          item.title
        )}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to delete favorite');
      }

      Alert.alert('Success', '항목이 삭제되었습니다.');
      // 삭제 후 목록 새로고침
      fetchFavorites();
    } catch (error) {
      console.error('Error deleting favorite:', error);
      Alert.alert('Error', '항목을 삭제할 수 없습니다.');
    }
  };

  // 페이지 focus 시 API 호출
  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [userId])
  );

  const closeModal = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.topCloseButton} onPress={() => router.back()}>
        <FontAwesome name="close" size={24} color="#333" />
      </Pressable>
      <Text style={styles.title}>즐겨찾기 목록</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {favorites.length > 0 ? (
          favorites.map((item) => (
            <View key={item.id} style={styles.listItem}>
              <View>
                <Text style={styles.listItemText}>{item.title}</Text>
                <Text style={styles.listItemSubtitle}>키워드: {item.keyword}</Text>
                <Text style={styles.listItemSubtitle}>사이트명: {item.site_name}</Text>
                <Text style={styles.listItemSubtitle}>공고기관: {item.agency}</Text>
                <Text style={styles.listItemSubtitle}>예산: {item.budget}</Text>
                <View style={styles.actionButtons}>
                  <Pressable
                    onPress={() => setSelectedItem(item)}
                    style={styles.detailButton}
                  >
                    <Text style={styles.detailButtonText}>자세히 보기</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => deleteFavorite(item)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>삭제하기</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>즐겨찾기에 등록된 항목이 없습니다.</Text>
        )}
      </ScrollView>

      {selectedItem && (
        <Modal transparent={true} animationType="slide" visible={!!selectedItem}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedItem.title}</Text>
              <ScrollView>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>사이트명:</Text> {selectedItem.site_name}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>키워드:</Text> {selectedItem.keyword}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>업무:</Text> {selectedItem.task}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>분류:</Text> {selectedItem.category}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>공고일:</Text> {selectedItem.announcement_date}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>공고기관:</Text> {selectedItem.agency}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>마감일시:</Text> {selectedItem.deadline}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>예산:</Text> {selectedItem.budget}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>계약방법:</Text> {selectedItem.contract_method}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>공고문 링크:</Text>{' '}
                  <Text
                    style={styles.link}
                    onPress={() => selectedItem.url && Linking.openURL(selectedItem.url)}
                  >
                    {selectedItem.url}
                  </Text>
                </Text>
              </ScrollView>
              <Pressable style={styles.closeModalButton} onPress={closeModal}>
                <Text style={styles.closeModalButtonText}>닫기</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  scrollContent: {
    width: '100%',
    padding: 20,
  },
  listItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  listItemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#4b5563',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  detailButton: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#ff5c5c',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  noData: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  topCloseButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#4b5563',
  },
  modalLabel: {
    fontWeight: 'bold',
  },
  link: {
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FavoritesPage;



