// Chat.js
/*import { useNavigation } from '@react-navigation/native';
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
        source={require('C:/Users/Jorge Herter/ChatApp/assets/images/Gemini_Generated_Image_ldim3zldim3zldim.png')}
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

export default Chat;*/
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import {
  Bubble,
  GiftedChat,
  InputToolbar,
} from "react-native-gifted-chat";

const Chat = ({ route, db, auth, userId, isConnected, connectionType, rawNetInfo }) => {
  const { name, selectedColor } = route.params;

  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [debugMode, setDebugMode] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name || 'Chat',
      headerStyle: {
        backgroundColor: selectedColor,
      },
      headerTintColor: '#FFFFFF',
    });
  }, [navigation, name, selectedColor]);

  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem('chat_messages');
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
        console.log("Messages loaded from cache.");
      }
    } catch (error) {
      console.error("Error loading cached messages:", error);
    }
  };

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('chat_messages', JSON.stringify(messagesToCache));
      console.log("Messages successfully cached.");
    } catch (error) {
      console.error("Error caching messages:", error);
    }
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem('chat_messages');
      setMessages([]);
      Alert.alert("Success", "Messages have been cleared from cache.");
      console.log("Cache cleared successfully.");
    } catch (error) {
      console.error("Error clearing cache:", error);
      Alert.alert("Error", "Failed to clear messages from cache.");
    }
  };

  useEffect(() => {
    loadCachedMessages();

    const messagesCollectionRef = collection(db, 'messages');
    const messagesQuery = query(messagesCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        _id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().createdAt.toDate(),
        user: doc.data().user,
      }));
      setMessages(fetchedMessages);
      cacheMessages(fetchedMessages);
    }, (error) => {
      console.error("Error listening for messages:", error);
    });

    return () => unsubscribe();
  }, [db]);

  const onSend = useCallback((messagesToSend = []) => {
    // If offline, show alert and don't send
    if (!isConnected) {
      Alert.alert("Offline", "You are currently offline. Message will be sent when connection is restored.");
      return;
    }

    messagesToSend.forEach(async (message) => {
      try {
        await addDoc(collection(db, 'messages'), {
          text: message.text,
          createdAt: new Date(),
          user: {
            _id: userId,
            name: name,
          },
        });
        console.log("Message successfully sent to Firebase!");
      } catch (error) {
        console.error("Error sending message to Firestore: ", error);
        Alert.alert("Error", "Failed to send message.");
      }
    });
  }, [db, name, userId, isConnected]);

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
    // Don't render input toolbar if offline
    if (!isConnected) {
      return null;
    }
    
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: '#FFFFFF',
          elevation: 0,
        }}
        textInputStyle={{
          color: '#000000',
        }}
      />
    );
  };

  const renderActions = (props) => {
    return (
      <View style={styles.actionContainer}>
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
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Clear messages cache"
          accessibilityHint="Clears all local messages stored on the device."
          accessibilityRole="button"
          onPress={clearCache}
          style={styles.actionButton}
        >
          <View>
            <Text style={styles.actionButtonText}>-</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Toggle debug mode"
          accessibilityHint="Shows detailed network information for debugging."
          accessibilityRole="button"
          onPress={() => setDebugMode(!debugMode)}
          style={[styles.actionButton, { backgroundColor: '#FF6B35' }]}
        >
          <View>
            <Text style={styles.actionButtonText}>D</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Function to get network status display text
  const getNetworkStatus = () => {
    if (debugMode) {
      return `Debug: useNetInfo=${rawNetInfo?.isConnected}, effective=${isConnected}`;
    }
    
    if (isConnected === null) return 'Checking connection...';
    if (isConnected === false) return 'Offline - Messages cached locally';
    return `Online (${connectionType || 'unknown'})`;
  };

  // Function to get network status color
  const getNetworkStatusColor = () => {
    if (isConnected === null) return '#FFA500'; // Orange for checking
    if (isConnected === false) return '#FF4444'; // Red for offline
    return '#00AA00'; // Green for online
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/chat background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Network Status Bar */}
        <View style={[styles.networkStatusBar, { backgroundColor: getNetworkStatusColor() }]}>
          <Text style={styles.networkStatusText}>
            {getNetworkStatus()}
          </Text>
          {debugMode && (
            <Text style={[styles.networkStatusText, { fontSize: 10, marginTop: 2 }]}>
              Type: {rawNetInfo?.type} | Details: {rawNetInfo?.details?.ssid || 'N/A'}
            </Text>
          )}
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{ _id: userId, name: name || "Anonymous" }}
            placeholder={isConnected ? "Type a message..." : "You are offline"}
            renderUsernameOnMessage={true}
            renderBubble={renderBubble}
            renderActions={renderActions}
            renderInputToolbar={renderInputToolbar}
            keyboardShouldPersistTaps="always"
            showUserAvatar={true}
            showAvatarForEveryMessage={true}
          />
        </KeyboardAvoidingView>
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
  networkStatusBar: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    elevation: 0,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Chat;