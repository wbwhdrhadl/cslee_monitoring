import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../UserContext';
import { useFocusEffect } from '@react-navigation/native';

const AdminPage = () => {
  const { userId } = useUser(); // UserContext에서 userId 가져오기
  const router = useRouter(); // Router 사용

  useFocusEffect(
    useCallback(() => {
      // 페이지가 화면에 포커스될 때마다 실행
      if (userId !== '6') {
        Alert.alert(
          '접근 불가',
          '관리자 로그인 후 이용해주세요.',
          [
            {
              text: '확인',
              onPress: () => router.push('./main'), // 메인 페이지로 이동
            },
          ],
          { cancelable: false } // Alert를 반드시 처리하게 함
        );
      } else {
        Alert.alert('환영합니다', '관리자 페이지에 접속하셨습니다.');
      }
    }, [userId, router]) // 의존성 배열에 userId와 router 추가
  );

  const handleUserManagement = () => {
    router.push('/department'); // department 페이지로 이동
  };

  const handleFileManagement = () => {
    alert('Navigating to File Management...');
  };

  const handleResetDatabase = async () => {
    try {
      // API 호출
      const response = await fetch('http://192.168.0.4:5001/admin/reset-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        Alert.alert('성공', '결과 데이터베이스가 초기화되었습니다.');
      } else {
        const errorText = await response.text();
        console.error('Error resetting database:', errorText);
        Alert.alert('실패', '데이터베이스 초기화에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error in handleResetDatabase:', error);
      Alert.alert('에러', '서버와 연결할 수 없습니다.');
    }
  };

  return (
    <View style={styles.container}>
      {userId === '6' && ( // user_id가 6일 경우에만 페이지 렌더링
        <>
          <Text style={styles.title}>관리자 페이지</Text>
          <Text style={styles.subTitle}>관리자를 위한 페이지 입니다</Text>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={handleUserManagement}>
              <FontAwesome name="users" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>회원 정보 관리</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={handleResetDatabase}>
              <FontAwesome name="database" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>결과 데이터베이스 초기화</Text>
            </Pressable>
          </View>
        </>
      )}
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
