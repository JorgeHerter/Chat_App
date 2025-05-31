// components/Chat.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Chat = ({ route }) => {
  const { name, bgColor } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.text}>Hello, {name}! This is the chat screen.</Text>
    </View>
  );
};

export default Chat;

// Basic chat screen styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 18,
  },
});
