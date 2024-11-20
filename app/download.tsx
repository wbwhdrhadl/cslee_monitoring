import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import Navbar from '../components/navbar'; 
const DownloadPage = () => {
  const fileName = 'example_file.png';

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

      <Text style={styles.fileName}>File Name: {fileName}</Text>

      <Pressable style={styles.downloadButton} onPress={handleDownload}>
        <Text style={styles.downloadButtonText}>다운로드하기</Text>
      </Pressable>
      <Navbar/>
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
    backgroundColor: '#333333', // 진한 회색
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  downloadButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default DownloadPage;
