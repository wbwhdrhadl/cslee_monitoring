import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const LoginPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [password, setPassword] = useState('');
  const router = useRouter();


  const handleLogin = async () => {
    if (!selectedDepartment || !password) {
      Alert.alert('Error', '부서와 비밀번호를 입력하세요.');
      return;
    }
  
    try {
      const url = `http://192.168.0.4:5001/departments_auth/?department_name=${encodeURIComponent(
        selectedDepartment
      )}&password=${encodeURIComponent(password)}`;
  
      const response = await fetch(url, {
        method: 'POST', // POST 요청, 쿼리 매개변수를 URL에 포함
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        Alert.alert(
          'cslee 직원 여러분 안녕하세요😀',
          "오늘도 좋은 하루 보내세요",
          [
            {
              text: 'OK',
              onPress: async () => {
                try {
                  const userIdResponse = await fetch(
                    `http://192.168.0.4:5001/get_user_id/?department_name=${encodeURIComponent(
                      selectedDepartment
                    )}`
                  );
                  const userIdData = await userIdResponse.json();
  
                  if (userIdResponse.ok) {
                    // user_id를 router에 전달하여 페이지 이동
                    router.push({
                      pathname: '/pages/main',
                      params: {
                        user_id: userIdData.user_id, // user_id 전달
                      },
                    });
                  } else {
                    Alert.alert('Error', userIdData.detail || 'user_id를 가져오는 데 실패했습니다.');
                  }
                } catch (userIdError) {
                  console.error('Error fetching user_id:', userIdError);
                  Alert.alert('Error', 'user_id를 가져오는 중 문제가 발생했습니다.');
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('비밀번호를 확인해주세요', '문제가 계속 발생 시 AI바우처 부서로 문의해주세요');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', '서버에 문제가 발생했습니다.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Keyword Crawling</Text>
      <Text style={styles.subtitle}>키워드를 크롤링해주는 앱입니다.</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>부서를 선택하세요:</Text>
        <Picker
          selectedValue={selectedDepartment}
          onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="부서를 선택하세요" value={null} />
          <Picker.Item label="데이터 컨설팅 부서" value="데이터 컨설팅 부서" />
          <Picker.Item label="QA부서" value="QA" />
          <Picker.Item label="CEO" value="CEO" />
          <Picker.Item label="빅데이터 부서" value="빅데이터 부서" />
          <Picker.Item label="AI부서" value="AI부서" />
          <Picker.Item label="관리자" value="관리자" />
        </Picker>
      </View>

      {selectedDepartment && (
        <View style={styles.passwordContainer}>
          <Text style={styles.inputLabel}>
            {selectedDepartment} 부서 비밀번호를 입력하세요
          </Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
          />
          <Button title="로그인" onPress={handleLogin} disabled={!password} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 20,
    width: '80%',
  },
  pickerLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#fff',
  },
  pickerItem: {
    color: '#000',
    fontSize: 16,
  },
  passwordContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    width: '80%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
});

export default LoginPage;