import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'; // 아이콘 사용

const AdminPage = () => {
  const handleUserManagement = () => {
    alert('Navigating to User Management...');
  };

  const handleFileManagement = () => {
    alert('Navigating to File Management...');
  };

  const handleSettings = () => {
    alert('Navigating to Settings...');
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>관리자 페이지</Text>
      <Text style={styles.subTitle}>사용자 관리, 파일, 설정을 이용하세요.</Text>

      {/* 버튼 섹션 */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleUserManagement}>
          <FontAwesome name="users" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>User Management</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleFileManagement}>
          <MaterialIcons name="folder" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>File Management</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleSettings}>
          <MaterialIcons name="settings" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#333333', // 진한 회색
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default AdminPage;
