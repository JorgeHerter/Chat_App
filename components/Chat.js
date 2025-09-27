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
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

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

  // --- UI & NAVIGATION EFFECTS ---
  useLayoutEffect(() => {
    navigation.setOptions({
      title: name || 'Chat',
      headerStyle: { backgroundColor: selectedColor },
      headerTintColor: '#FFFFFF',
    });
  }, [navigation, name, selectedColor]);

  // --- CACHING FUNCTIONS ---

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

  // --- FIRESTORE / REAL-TIME MESSAGING ---
  useEffect(() => {
    loadCachedMessages();

    const messagesCollectionRef = collection(db, 'messages');
    const messagesQuery = query(messagesCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        _id: doc.id,
        text: doc.data().text,
        image: doc.data().image || null,
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
    if (!isConnected) {
      Alert.alert("Offline", "You are currently offline. Message will be sent when connection is restored.");
      return;
    }

    messagesToSend.forEach(async (message) => {
      try {
        await addDoc(collection(db, 'messages'), {
          text: message.text,
          createdAt: new Date(),
          user: { _id: userId, name: name },
        });
        console.log("Text message successfully sent to Firebase!");
      } catch (error) {
        console.error("Error sending message to Firestore: ", error);
        Alert.alert("Error", "Failed to send message.");
      }
    });
  }, [db, name, userId, isConnected]);

  // --- MEDIA HANDLERS ---

  const uploadAndSendMedia = async (uri) => {
    if (!isConnected) {
      Alert.alert("Offline", "Cannot send media while offline.");
      return;
    }

    const uniqueFileName = `${userId}-${Date.now()}.jpg`;

    try {
      Alert.alert("Uploading...", "Please wait while your media is being sent.");
      
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const storage = getStorage(db.app);
      const storageRef = ref(storage, uniqueFileName);
      
      await uploadBytes(storageRef, blob);
      const imageURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'messages'), {
        text: '',
        createdAt: new Date(),
        user: { _id: userId, name: name },
        image: imageURL,
      });

      console.log("Media successfully sent to Firebase!");
      Alert.alert("Success", "Media sent!");
    } catch (error) {
      console.error("Error uploading or sending media:", error);
      Alert.alert("Error", "Failed to send media. Check console for details.");
    }
  };

  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
      });

      if (!result.canceled) {
        await uploadAndSendMedia(result.assets[0].uri);
      }
    } else {
      Alert.alert("Permission Denied", "We need access to your photo library to send images.");
    }
  };

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
      });

      if (!result.canceled) {
        await uploadAndSendMedia(result.assets[0].uri);
      }
    } else {
      Alert.alert("Permission Denied", "We need camera access to take a photo.");
    }
  };

  // --- GIFTDED CHAT RENDER CUSTOMIZATIONS ---

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#007AFF" },
        left: { backgroundColor: "#FFFFFF" }
      }}
    />
  );

  const renderMessageImage = (props) => {
    if (props.currentMessage.image) {
      return (
        <Image
          style={styles.messageImage}
          source={{ uri: props.currentMessage.image }}
        />
      );
    }
    return null;
  };

  const renderInputToolbar = (props) => {
    if (!isConnected) {
      return null; // Hide input if offline
    }

    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbarContainer}
        textInputStyle={styles.inputToolbarText}
      />
    );
  };

  const renderActions = (props) => (
    <View style={styles.actionContainer}>
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="Opens options to send an image, take a photo, or send geolocation."
        accessibilityRole="button"
        onPress={() => {
          Alert.alert(
            "Send Media",
            "Choose a source for your media.",
            [
              { text: "Take Photo", onPress: takePhoto },
              { text: "Pick from Library", onPress: pickImage },
              { text: "Geolocation", onPress: () => Alert.alert("Feature", "Geolocation feature coming soon!") },
              { text: "Cancel", style: "cancel" }
            ]
          );
        }}
        style={styles.actionButton}
      >
        <Text style={styles.actionButtonText}>+</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Clear messages cache"
        accessibilityHint="Clears all local messages stored on the device."
        accessibilityRole="button"
        onPress={clearCache}
        style={styles.actionButton}
      >
        <Text style={styles.actionButtonText}>-</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Toggle debug mode"
        accessibilityHint="Shows detailed network information for debugging."
        accessibilityRole="button"
        onPress={() => setDebugMode(!debugMode)}
        style={[styles.actionButton, { backgroundColor: '#FF6B35' }]}
      >
        <Text style={styles.actionButtonText}>D</Text>
      </TouchableOpacity>
    </View>
  );

  // --- NETWORK STATUS DISPLAY ---

  const getNetworkStatus = () => {
    if (debugMode) {
      return `Debug: useNetInfo=${rawNetInfo?.isConnected}, effective=${isConnected}`;
    }
    if (isConnected === null) return 'Checking connection...';
    if (isConnected === false) return 'Offline - Messages cached locally';
    return `Online (${connectionType || 'unknown'})`;
  };

  const getNetworkStatusColor = () => {
    if (isConnected === null) return '#FFA500'; // Orange for checking
    if (isConnected === false) return '#FF4444'; // Red for offline
    return '#00AA00'; // Green for online
  };

  // --- MAIN RENDER ---
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/chat background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Network Status Bar */}
        <View style={[styles.networkStatusBar, { backgroundColor: getNetworkStatusColor() }]}>
          <Text style={styles.networkStatusText}>{getNetworkStatus()}</Text>
          {debugMode && (
            <Text style={[styles.networkStatusText, styles.debugDetailText]}>
              Type: {rawNetInfo?.type} | Details: {rawNetInfo?.details?.ssid || 'N/A'}
            </Text>
          )}
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{ _id: userId, name: name || "Anonymous" }}
            placeholder={isConnected ? "Type a message..." : "You are offline"}
            renderUsernameOnMessage={true}
            renderBubble={renderBubble}
            renderMessageImage={renderMessageImage}
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

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1
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
  debugDetailText: {
    fontSize: 10,
    marginTop: 2
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
  inputToolbarContainer: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
  },
  inputToolbarText: {
    color: '#000000',
  },
  messageImage: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3
  }
});

export default Chat;