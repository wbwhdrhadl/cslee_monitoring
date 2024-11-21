import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import Navbar from '../components/navbar'; 

const DownloadPage = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const files = [
    { csv_id: '1', user_id: '101', file_name: 'document1.csv', save_time: '2024-11-20 10:30:00' },
    { csv_id: '2', user_id: '102', file_name: 'data_analysis.csv', save_time: '2024-11-20 11:00:00' },
    { csv_id: '3', user_id: '103', file_name: 'export_file.csv', save_time: '2024-11-20 12:45:00' },
  ];

  const handleDownload = () => {
    alert('Downloading file...'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>파일이 저장되었습니다</Text>
      <Text style={styles.subTitle}>파일이 성공적으로 저장되었습니다. 다운로드후 이용하세요</Text>

      <View style={styles.iconContainer}>
        <MaterialIcons name="insert-drive-file" size={100} color="#555" />
      </View>

      <Text style={styles.fileName}>File Name: example_file.png</Text>

      <Pressable style={styles.downloadButton} onPress={handleDownload}>
        <Text style={styles.downloadButtonText}>다운로드하기</Text>
      </Pressable>

      {/* 서랍 아이콘 */}
      <TouchableOpacity 
        style={styles.drawerIconContainer}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="folder" size={28} color="#fff" />
      </TouchableOpacity>

      {/* 팝업 창 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>저장된 파일 목록</Text>
            <FlatList
              data={files}
              keyExtractor={(item) => item.csv_id}
              renderItem={({ item }) => (
                <View style={styles.fileItem}>
                  <Text style={styles.fileDetail}>CSV ID: {item.csv_id}</Text>
                  <Text style={styles.fileDetail}>User ID: {item.user_id}</Text>
                  <Text style={styles.fileDetail}>File Name: {item.file_name}</Text>
                  <Text style={styles.fileDetail}>Save Time: {item.save_time}</Text>
                </View>
              )}
            />
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#e5e5e5',
    marginBottom: 20,
  },
  fileName: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  downloadButton: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    marginBottom: 50,
  },
  downloadButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  drawerIconContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#333',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  fileItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  fileDetail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DownloadPage;
