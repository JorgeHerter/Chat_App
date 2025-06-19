// Chat.js
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route }) => {
  const { name, backgroundColor } = route.params;
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);

  // Sets the header options for the chat screen
  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
      headerStyle: {
        backgroundColor: backgroundColor
      },
      headerTintColor: '#FFFFFF' // Ensures text color is white for readability on colored backgrounds
    });
  }, [navigation, name, backgroundColor]);

  // Initializes the chat with predefined messages when the component mounts
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  // Callback function to handle sending new messages
  const onSend = useCallback((messagesToSend = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messagesToSend));
  }, []);

  return (
    // Use ImageBackground as the main container for the chat screen
    <ImageBackground
      source={require('../assets/images/Gemini_Generated_Image_ldim3zldim3zldim.png')}
      style={styles.backgroundImage}
      resizeMode="cover" // Use 'cover' to fill the background, or 'contain' to show the whole image
    >
      {/* The inner View will act as an overlay for your chat content */}
      <View style={styles.chatContentContainer}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: 1,
          }}
          placeholder="Type a message..."
          renderUsernameOnMessage={true}
        />

        {/* KeyboardAvoidingView to prevent keyboard from obscuring input on Android */}
        {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%', // Ensure it takes full width
    height: '100%', // Ensure it takes full height
    // You might want to add a subtle tint/overlay here if the image makes text hard to read
    // For example:
    // tintColor: 'rgba(0,0,0,0.4)', // This doesn't apply to ImageBackground directly for tinting.
    // Instead, consider an inner View with a semi-transparent background.
  },
  chatContentContainer: {
    flex: 1,
    // If you want a semi-transparent overlay over the background image
    // to make text more readable, you can add a background color here:
    // backgroundColor: 'rgba(255, 255, 255, 0.2)', // Example: a light, slightly transparent overlay
  },
  // Keep your existing styles as they were for consistency with the rest of your app
  // (e.g., any specific styling for GiftedChat elements if you have them)
});

export default Chat;