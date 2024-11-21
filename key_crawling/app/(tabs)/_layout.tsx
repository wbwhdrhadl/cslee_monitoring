import React from 'react';
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index" // 메인 페이지
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => null, // 아이콘 설정 가능
        }}
      />
      <Tabs.Screen
        name="explore" // 추가 페이지
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}
