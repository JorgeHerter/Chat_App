// components/Chat.js
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Bubble,
  GiftedChat,
  InputToolbar, // *** IMPORTANT: Make sure to import InputToolbar ***
} from "react-native-gifted-chat";

// Removed all Firebase/Firestore imports as per your request to not fetch from Firestore yet

const Chat = ({ route, userId }) => { // Removed 'db' prop as it's not used in this version
  // Get user info and selected background color from route parameters
  const { name, selectedColor } = route.params; // Using selectedColor for consistency with Start.js
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);

  // Log props to ensure they are passed correctly. Check your terminal for these logs.
  useEffect(() => {
    console.log("Chat.js - userId received:", userId);
    console.log("Chat.js - userName received:", name);
  }, [userId, name]);

  // Current user object for Gifted Chat
  const currentUser = {
    _id: userId, // The authenticated user's ID
    name: name || "Anonymous", // The name entered on the Start screen, or default
  };

  // Set header options for the chat screen
  useLayoutEffect(() => {
    navigation.setOptions({
      title: name || 'Chat',
      headerStyle: {
        backgroundColor: selectedColor, // Use selectedColor for header background
      },
      headerTintColor: '#FFFFFF',
    });
  }, [navigation, name, selectedColor]);

  // Initial messages (static for now, as we're not fetching from Firestore)
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

  // --- onSend function: Handles messages locally (no Firestore yet) ---
  const onSend = useCallback((messagesToSend = []) => {
    // Append new messages to the existing list of messages
    setMessages(previousMessages => GiftedChat.append(previousMessages, messagesToSend));
    console.log("Message sent locally:", messagesToSend[0].text);
  }, []);


  // --- Custom Renderers for Gifted Chat ---

  // Customize message bubbles
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { // Messages sent by the current user
            backgroundColor: "#007AFF", // Example: A common iOS blue
          },
          left: { // Messages sent by other users
            backgroundColor: "#FFFFFF", // Example: White background
          }
        }}
      />
    );
  };

  // *** THIS IS CRUCIAL FOR NATIVE KEYBOARD INPUT ***
  // Render a custom InputToolbar. Explicitly rendering this helps with native issues.
  const renderInputToolbar = (props) => {
    // We are not using `db` for conditional rendering here, so it should always render.
    return <InputToolbar {...props} />;
  };

  // Render custom actions button
  const renderActions = (props) => {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="Lets you choose to send an image or your geolocation."
        accessibilityRole="button"
        onPress={() => {
          Alert.alert(
            "More Options",
            "Choose to send an image or your geolocation.",
            [
              { text: "Image", onPress: () => console.log("Send Image Pressed") },
              { text: "Geolocation", onPress: () => console.log("Send Geolocation Pressed") },
              { text: "Cancel", style: "cancel" }
            ]
          );
        }}
        style={styles.actionButton}
      >
        <View>
          <Text style={styles.actionButtonText}>+</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        // Ensure this path is correct for your project
        source={require('../assets/images/Gemini_Generated_Image_ldim3zldim3zldim.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={currentUser}
          placeholder="Type a message..."
          renderUsernameOnMessage={true}
          renderBubble={renderBubble}
          renderActions={renderActions}
          renderInputToolbar={renderInputToolbar} // *** Pass the custom InputToolbar renderer here ***
          // GiftedChat handles KeyboardAvoidingView internally.
          // Setting keyboardAvoidingViewEnabled to true can help on iOS, but it's true by default.
          // For Android, no specific setting needed usually.
          // keyboardAvoidingViewProps={{ enabled: Platform.OS === 'ios', behavior: 'padding' }}
        />
        {/* Removed external KeyboardAvoidingView to prevent conflicts.
            GiftedChat has its own internal handling for this. */}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#757083',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 5,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Chat;