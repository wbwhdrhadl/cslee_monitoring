import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Router 사용


const AdminPage = () => {
  const router = useRouter(); // Router 사용

  const handleUserManagement = () => {
    router.push('/department'); // department 페이지로 이동
  };

  const handleFileManagement = () => {
    alert('Navigating to File Management...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>관리자 페이지</Text>
      <Text style={styles.subTitle}>관리자를 위한 페이지 입니다</Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleUserManagement}>
          <FontAwesome name="users" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>회원 정보 관리</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleFileManagement}>
          <MaterialIcons name="folder" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Q&A</Text>
        </Pressable>
      </View>
      {/* <Navbar /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#333333',
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
