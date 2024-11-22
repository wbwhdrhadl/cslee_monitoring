import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { Link } from 'expo-router'; 

const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <Link href="/main" style={styles.navItem}>
        <FontAwesome name="search" size={24} color="#333" />
        {/* <Text style={styles.navText}>Search</Text> */}
      </Link>

      <Link href="/register" style={styles.navItem}>
        <FontAwesome name="plus" size={24} color="#333" />
        {/* <Text style={styles.navText}>Register</Text> */}
      </Link>

      <Link href="/download" style={styles.navItem}>
        <FontAwesome name="download" size={24} color="#333" />
        {/* <Text style={styles.navText}>Download</Text> */}
      </Link>

      <Link href="/admin" style={styles.navItem}>
        <FontAwesome name="cog" size={24} color="#333" />
        {/* <Text style={styles.navText}>Admin</Text> */}
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: 'center'
  },
  navText: {
    fontSize: 12,
    color: '#333',
    marginTop: 8
  },
});

export default Navbar;
