import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Pressable } from 'react-native';

const UserManagementPage = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [newDepartment, setNewDepartment] = useState('');
  const [newDepartmentPassword, setNewDepartmentPassword] = useState('');

  const [deleteDepartment, setDeleteDepartment] = useState('');

  const handlePasswordChange = async () => {
    if (!departmentName || !currentPassword || !newPassword) {
      Alert.alert('Error', '모든 필드를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.2:5001/api/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departmentName,
          oldPassword: currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('비밀번호 변경 성공!', "비밀번호가 성공적으로 변경되었습니다");
      } else {
        Alert.alert('오류 발생', "비밀번호 변경 중 오류가 발생하였습니다.");
      }
    } catch (error) {
      console.error('Error during password change:', error);
      Alert.alert('오류 발생', '서버에 문제가 발생했습니다.');
    }
  };


  const handleRegistration = async () => {
    if (!newDepartment || !newDepartmentPassword) {
      Alert.alert('오류 발생', '부서 이름과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.2:5001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departmentName: newDepartment,
          password: newDepartmentPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('회원 가입 성공!', "환영합니다");
      } else {
        Alert.alert('오류 발생', "회원 가입 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('오류 발생', '서버에 문제가 발생했습니다.');
    }
  };

  const handleDepartmentDeletion = async () => {
    if (!deleteDepartment) {
      Alert.alert('오류 발생', '부서 이름을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.2:5001/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departmentName: deleteDepartment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('부서가 삭제 성공!', "성공적으로 부서가 삭제되었습니다.");
      } else {
        Alert.alert('오류 발생', "부서 삭제중 오류가 발생햇습니다.");
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      Alert.alert('오류 발생', '서버에 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원 정보 관리</Text>


      <Text style={styles.sectionTitle}>비밀번호 변경</Text>
      <TextInput
        style={styles.input}
        placeholder="부서 이름"
        placeholderTextColor="#555"
        value={departmentName}
        onChangeText={setDepartmentName}
      />
      <TextInput
        style={styles.input}
        placeholder="현재 비밀번호"
        placeholderTextColor="#555"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="새 비밀번호"
        placeholderTextColor="#555"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Pressable style={styles.button} onPress={handlePasswordChange}>
        <Text style={styles.buttonText}>비밀번호 변경</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>회원가입</Text>
      <TextInput
        style={styles.input}
        placeholder="새 부서 이름"
        placeholderTextColor="#555"
        value={newDepartment}
        onChangeText={setNewDepartment}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        placeholderTextColor="#555"
        secureTextEntry
        value={newDepartmentPassword}
        onChangeText={setNewDepartmentPassword}
      />
      <Pressable style={styles.button} onPress={handleRegistration}>
        <Text style={styles.buttonText}>회원가입</Text>
      </Pressable>


      <Text style={styles.sectionTitle}>부서 삭제</Text>
      <TextInput
        style={styles.input}
        placeholder="삭제할 부서 이름"
        placeholderTextColor="#555"
        value={deleteDepartment}
        onChangeText={setDeleteDepartment}
      />
      <Pressable style={styles.button} onPress={handleDepartmentDeletion}>
        <Text style={styles.buttonText}>부서 삭제</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserManagementPage;
