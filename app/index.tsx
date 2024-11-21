import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const HomePage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [password, setPassword] = useState('');
  const router = useRouter();

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
          <Picker.Item label="부서를 선택하세요" value="부서" />
          <Picker.Item label="데이터 컨설팅 부서" value="데이터 컨설팅 부서" />
          <Picker.Item label="QA부서" value="QA" />
          <Picker.Item label="CEO" value="CEO" />
          <Picker.Item label="빅데이터 부서" value="빅데이터" />
          <Picker.Item label="AI부서" value="AI" />
          <Picker.Item label="CEO" value="CEO" />
        </Picker>
      </View>

      {selectedDepartment && (
        <View style={styles.passwordContainer}>
          <Text style={styles.inputLabel}>
            {selectedDepartment} 부서 비밀번호를 입력하세요:
          </Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
          />
          <Button
            title="확인"
            onPress={() => router.push('/main')}
            disabled={!password} // Disable button if password is empty
          />
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
    color: '#000', // 글씨를 검은색으로 설정
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

export default HomePage;
