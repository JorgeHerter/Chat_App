// Chat.js
// This file defines the Chat component that displays a chat screen
import React, { useLayoutEffect } from 'react'; // Import useLayoutEffect
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const Chat = ({ route }) => {
  // Get the name and background color from the navigation parameters
  const { name, backgroundColor } = route.params;

  const navigation = useNavigation(); // Get the navigation object

  // Set the background color of the chat screen and title dynamically
  useLayoutEffect(() => {
    navigation.setOptions({
      title: name, // Display user's name in navigation bar
      headerStyle: {
        backgroundColor: backgroundColor // Set navigation bar background
      },
      headerTintColor: '#FFFFFF' // Make title text white for better contrast
    });
  }, [navigation, name, backgroundColor]); // Dependencies for useLayoutEffect

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <Text>Hello {name}!</Text>
      <Text>Your chat background is: {backgroundColor}</Text>
      {/* Gifted Chat component will go here later */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chat;