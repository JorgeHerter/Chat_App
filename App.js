/*import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { registerRootComponent } from 'expo';

// React Navigation imports
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screen components (ensure these files exist in your 'components' folder)
// Double-check the casing of your actual files on disk (e.g., Screen1.js vs screen1.js)
import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';

// Create the navigator stack
const Stack = createNativeStackNavigator();

// --- START: HomeScreenContent component ---
const HomeScreenContent = () => {
  const [text, setText] = useState(''); // useState is correctly imported and used here
  const [message, setMessage] = useState('');

  const navigation = useNavigation();

  const handlePress = () => {
    setMessage(`You tapped the TouchableOpacity! Current text: "${text}"`);
  };

  return (
    <View style={styles.container}>
     
      <View style={styles.inputSection}>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={setText}
          placeholder='Type Something Here'
        />
        <Text style={styles.textDisplay}>You wrote: {text}</Text>

        <TouchableOpacity
          style={styles.touchableButton}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Tap Me</Text>
        </TouchableOpacity>

        
        {message ? <Text style={styles.messageText}>{message}</Text> : null}

        
        <TouchableOpacity
          style={[styles.touchableButton, styles.navigateButton]}
          onPress={() => navigation.navigate('Screen1')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Go to Screen 1</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.touchableButton, styles.navigateButton]}
          onPress={() => navigation.navigate('Screen2')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Go to Screen 2</Text>
        </TouchableOpacity>

      </View>
      
    </View>
  );
};
// --- END: HomeScreenContent component ---

// --- START: Main App component for Navigation ---
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreenContent} options={{ title: 'My App Home' }} />
        <Stack.Screen name="Screen1" component={Screen1} />
        <Stack.Screen name="Screen2" component={Screen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
// --- END: Main App component for Navigation ---


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  inputSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  textInput: {
    width: 250,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 50,
    padding: 10,
    marginBottom: 20,
  },
  textDisplay: {
    height: 50,
    lineHeight: 50,
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  touchableButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigateButton: {
    backgroundColor: '#28a745',
    marginTop: 15,
    width: 200,
    alignItems: 'center',
  },
  messageText: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
  // Removed scrollView and bigText styles
});

export default App;
registerRootComponent(App);*/
// App.js
import { useNetInfo } from "@react-native-community/netinfo";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth';
import { disableNetwork, enableNetwork, getFirestore } from 'firebase/firestore';

import Chat from './components/Chat';
import Start from './components/Start';

// --- 1. FIREBASE CONFIG & INITIALIZATION ---

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMDBGdZ7fKht-o7ih3I73RqU7Z5OPCRnc",
  authDomain: "chatapp-ab5ff.firebaseapp.com",
  projectId: "chatapp-ab5ff",
  storageBucket: "chatapp-ab5ff.firebasestorage.app",
  messagingSenderId: "381447591909",
  appId: "1:381447591909:web:bc572a5a7bbb431893010c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Auth with the correct persistence
const persistence =
  Platform.OS === 'web'
    ? browserLocalPersistence
    : getReactNativePersistence(AsyncStorage);
const auth = initializeAuth(app, { persistence });


// --- 2. CUSTOM HOOK FOR NETWORK STATUS ---

/**
 * Custom hook to provide enhanced network status, combining useNetInfo
 * with an actual connectivity test and managing Firestore network state.
 */
const useEnhancedNetworkStatus = (db) => {
  const connectionStatus = useNetInfo();
  const [actualNetworkState, setActualNetworkState] = useState(null);
  
  // Memoize the connectivity test function to prevent unnecessary re-creation
  const testActualConnectivity = useCallback(async () => {
    try {
      // Use a standard public favicon to test actual internet connection
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      
      const isOnline = response.ok;
      setActualNetworkState(isOnline);
      console.log(`Connectivity test: ${isOnline ? 'ONLINE' : 'OFFLINE (bad response)'}`);
    } catch (error) {
      setActualNetworkState(false);
      console.log("Connectivity test: OFFLINE (fetch failed)");
    }
  }, []); // Empty dependency array means this function is created once

  // Run connectivity test on initial load and whenever useNetInfo state changes
  useEffect(() => {
    if (connectionStatus.isConnected !== null) {
      testActualConnectivity();
    }
  }, [connectionStatus.isConnected, testActualConnectivity]);

  // Periodically re-test connectivity every 10 seconds
  useEffect(() => {
    const interval = setInterval(testActualConnectivity, 10000);
    return () => clearInterval(interval);
  }, [testActualConnectivity]);

  // Determine the final, effective connection state
  const effectiveConnection = actualNetworkState !== null ? actualNetworkState : connectionStatus.isConnected;

  // Manage Firestore network state based on effective connection
  useEffect(() => {
    if (effectiveConnection === false) {
      Alert.alert("Connection Lost", "Messages will be saved locally and sent when you are back online.");
      disableNetwork(db).catch(e => console.error("Error disabling network:", e));
    } else if (effectiveConnection === true) {
      enableNetwork(db).catch(e => console.error("Error enabling network:", e));
    }
  }, [effectiveConnection, db]); // Include db as a dependency, though it's static here

  return {
    isConnected: effectiveConnection,
    connectionType: connectionStatus.type,
    rawNetInfo: connectionStatus,
    actualNetworkState // For debugging purposes
  };
};

// --- 3. MAIN APPLICATION COMPONENT ---

const Stack = createNativeStackNavigator();

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the custom hook to manage network state
  const network = useEnhancedNetworkStatus(db);
  const { isConnected, connectionType, rawNetInfo } = network;

  // Handles Anonymous Sign-in
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // User signed in (either new anonymous or previously persisted)
        setUser(authUser);
        console.log("Auth state changed. User ID:", authUser.uid);
        setIsLoading(false);
      } else {
        // No user signed in, proceed with anonymous sign-in
        console.log("No user signed in. Signing in anonymously...");
        signInAnonymously(auth)
          .then((userCredential) => {
            setUser(userCredential.user);
            console.log("Anonymous sign-in successful. User ID:", userCredential.user.uid);
          })
          .catch((error) => {
            console.error("Anonymous sign-in failed:", error);
            // Optionally, show a critical error to the user
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    });

    return () => unsubscribeAuth();
  }, []); // Run only once on mount

  if (isLoading) {
    return null; // Show a loading screen or splash component here if needed
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start">
          {(props) => (
            <Start 
              {...props} 
              isConnected={isConnected}
              connectionType={connectionType}
              rawNetInfo={rawNetInfo}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat 
              {...props} 
              db={db} 
              auth={auth} 
              userId={user.uid} 
              isConnected={isConnected}
              connectionType={connectionType}
              rawNetInfo={rawNetInfo}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);