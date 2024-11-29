import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { useUser } from '../UserContext';

// 조회된 결과 제공 페이지
const ListItem = ({ item, isFavorite, onFavoritePress, onSelectItem }) => (
  <Pressable
    style={styles.listItem}
    onPress={() => {
      onSelectItem(item);
    }}
  >
    <Text style={styles.listItemText}>{item.title}</Text>
    <Text style={styles.listItemSubtitle}>{item.agency}</Text>
    <Text style={styles.listItemSubtitle}>{item.announcement_date}</Text>
    <Text style={styles.listItemSubtitle}>{item.budget}</Text>
    <Pressable
      onPress={(e) => {
        e.stopPropagation();
        onFavoritePress(item);
      }}
      style={styles.favoriteButton}
    >
      <FontAwesome name={isFavorite ? "star" : "star-o"} size={24} color="gray" />
    </Pressable>
  </Pressable>
);

const ResultPage = () => {
  const { userId } = useUser();
  const router = useRouter();
  const { results } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    if (results) {
      try {
        const parsedData = JSON.parse(results);
        const updatedData = parsedData.map((item, index) => ({
          ...item,
          id: item.id || index,
        }));
        setData(updatedData);

        const initialFavorites = updatedData.reduce((acc, item) => {
          acc[item.id] = false;
          return acc;
        }, {});
        setFavorites(initialFavorites);
      } catch (error) {
        console.error('Error parsing results:', error);
      }
    }
  }, [results]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  const handleFavorite = async (item) => {
    const isCurrentlyFavorite = favorites[item.id];

    try {

      if (isCurrentlyFavorite) {
        await removeFavorite(item, userId);
      } else {
        await addFavorite({ ...item, user_id: userId });
      }

      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [item.id]: !isCurrentlyFavorite,
      }));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', '즐겨찾기 상태를 업데이트할 수 없습니다.');
    }
  };

  const addFavorite = async (item) => {
    try {
      const response = await fetch('http://192.168.0.4:5001/favorites/add/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error adding favorite:', errorText);
        throw new Error('Failed to add favorite');
      }

    } catch (error) {
      console.error('Error in addFavorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (item, userId) => {
    try {
      if (!item.title) {
        throw new Error('Item title is missing');
      }

      const response = await fetch(
        `http://192.168.0.4:5001/favorites/delete/?user_id=${userId}&title=${encodeURIComponent(
          item.title
        )}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from server:', errorText);
        throw new Error('Failed to remove favorite');
      }

    } catch (error) {
      console.error('Error in removeFavorite:', error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.topCloseButton} onPress={() => router.back()}>
        <FontAwesome name="close" size={24} color="#333" />
      </Pressable>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>조회 결과</Text>
        {data.length > 0 ? (
          data.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              isFavorite={favorites[item.id]}
              onFavoritePress={handleFavorite}
              onSelectItem={handleSelectItem}
            />
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
    padding: 20,
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
    position: 'relative',
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
  favoriteButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
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
  // 프론트 수정전
  // smallDrawerButton: {
  //   position: 'absolute',
  //   bottom: 20, 
  //   right: 20, 
  //   width: 50, 
  //   height: 50, 
  //   backgroundColor: '#2563eb', 
  //   borderRadius: 25, 
  //   alignItems: 'center', 
  //   justifyContent: 'center', 
  //   elevation: 5, 
  // },
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
});

export default ResultPage;
