import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="main"
        options={{
          tabBarLabel: 'Main',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" color={color} size={size} />
          ),
          headerShown: false, 
        }}
      />
      <Tabs.Screen
        name="addnow"
        options={{
          tabBarLabel: 'Add Now',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="tags" color={color} size={size} />
          ),
          headerShown: false, 
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          tabBarLabel: 'Register',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="plus" color={color} size={size} />
          ),
          headerShown: false, 
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          tabBarLabel: 'Admin',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="cog" color={color} size={size} />
          ),
          headerShown: false, 
        }}
      />
    </Tabs>
  );
}
