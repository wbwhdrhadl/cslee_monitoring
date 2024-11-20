import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

const HomePage = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>keyword crawling</Text>
      <Text style={styles.subtitle}>키워드를 크롤링해주는 정부과제 앱입니다.</Text>
      <Button
        title="로그인 하러가기"
        onPress={() => router.push('/login')} 
      />
      <Button
        title="비회원 이용"
        onPress={() => router.push('/main')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomePage;
