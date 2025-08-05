// Chat.js
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
  InputToolbar,
} from "react-native-gifted-chat";
// Re-importing Firebase/Firestore modules to enable database interactions
import { addDoc, collection, onSnapshot } from 'firebase/firestore';

// The Chat component now needs to receive the Firestore database instance (db) as a prop
const Chat = ({ route, db }) => {
  const { name, selectedColor, userId } = route.params;

  const navigation = useNavigation();
  // Using useState to hold the messages fetched from Firestore
  const [messages, setMessages] = useState([]);

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

  // Set up a real-time listener for the messages collection
  useEffect(() => {
    const messagesCollectionRef = collection(db, 'messages');
    
    const unsubscribe = onSnapshot(messagesCollectionRef, (snapshot) => {
      // Check if the chat is empty. If so, add a welcome message.
      // This is a one-time check to ensure a greeting exists.
      if (snapshot.empty) {
        addDoc(messagesCollectionRef, {
          text: `Hello, ${name}! Welcome to the chat.`,
          createdAt: new Date(),
          user: {
            _id: 'system', // A unique ID for the system message
            name: 'System',
          },
        }).then(() => {
          console.log("Welcome message added to Firestore.");
        }).catch((error) => {
          console.error("Error adding welcome message: ", error);
        });
      }

      // Map the Firestore documents to the format required by GiftedChat
      const fetchedMessages = snapshot.docs.map(doc => ({
        _id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().createdAt.toDate(), // Convert Firestore Timestamp to JS Date
        user: doc.data().user,
      }));

      // Sort the messages by date in memory (descending order)
      fetchedMessages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Update the state with the new messages
      setMessages(fetchedMessages);
    }, (error) => {
      console.error("Error listening for messages:", error);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [db, name]); // The effect now also depends on the user's name

  // Function to send a new message to Firestore
  const onSend = useCallback((messagesToSend = []) => {
    // Iterate over each new message to add it to Firestore
    messagesToSend.forEach(async (message) => {
      try {
        await addDoc(collection(db, 'messages'), {
          _id: message._id, // GiftedChat provides a unique ID
          text: message.text,
          createdAt: new Date(), // Set the current timestamp
          user: {
            _id: userId,
            name: name,
          },
        });
        console.log("Message successfully sent to Firebase!");
      } catch (error) {
        console.error("Error sending message to Firestore: ", error);
      }
    });
  }, [db, name, userId]); // Dependency array to ensure onSend is stable

  // Custom Renderers for Gifted Chat
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#007AFF",
          },
          left: {
            backgroundColor: "#FFFFFF",
          }
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: '#FFFFFF',
        }}
        textInputStyle={{
          color: '#000000',
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
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/Gemini_Generated_Image_ldim3zldim3zldim.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: userId, name: name || "Anonymous" }}
          placeholder="Type a message..."
          renderUsernameOnMessage={true}
          renderBubble={renderBubble}
          renderActions={renderActions}
          renderInputToolbar={renderInputToolbar}
          keyboardShouldPersistTaps="always"
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
        />
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