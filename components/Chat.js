import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, db, auth, userId }) => { // Added db, auth, userId props
  const { name, backgroundColor } = route.params;
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);

  // Use the userId from props for the current user's ID
  const currentUser = {
    _id: userId, // Use the authenticated user's ID
    name: name,  // Pass the name from route.params here
    // You can also add an avatar if you have one for the user
    // avatar: 'https://example.com/your-avatar.jpg',
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
      headerStyle: {
        backgroundColor: backgroundColor
      },
      headerTintColor: '#FFFFFF'
    });
  }, [navigation, name, backgroundColor]);

  useEffect(() => {
    // Initial messages can be loaded from Firestore here if desired
    // For now, keeping the static initial message for demonstration
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2, // A different user ID for the initial message
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

  const onSend = useCallback((messagesToSend = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messagesToSend));
    // Here you would typically save the messages to Firestore
    // Example:
    // messagesToSend.forEach(msg => {
    //   addDoc(collection(db, "messages"), {
    //     _id: msg._id,
    //     text: msg.text,
    //     createdAt: msg.createdAt.getTime(), // Store as timestamp
    //     user: {
    //       _id: msg.user._id,
    //       name: msg.user.name,
    //     },
    //   });
    // });
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#00FF00" // Example color for your messages
          },
          left: {
            backgroundColor: "#0000FF" // Example color for other users' messages
          }
        }}
      />
    );
  };

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
    <ImageBackground
      // Ensure this path is correct for your project
      source={require('../assets/images/Gemini_Generated_Image_ldim3zldim3zldim.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.chatContentContainer}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={currentUser} // <--- This is the key change: pass the currentUser object
          placeholder="Type a message..."
          renderUsernameOnMessage={true}
          renderBubble={renderBubble}
          renderActions={renderActions}
        />

        {/* Keyboard Avoiding View for Android to prevent keyboard from hiding input */}
        {Platform.OS === 'android' && (
          <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={Platform.select({ ios: 0, android: -500 })} />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  chatContentContainer: {
    flex: 1,
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