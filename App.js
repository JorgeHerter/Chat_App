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
import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import Chat from './components/Chat';
import Start from './components/Start';

// Import all necessary Firebase/Firestore modules
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

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMDBGdZ7fKht-o7ih3I73RqU7Z5OPCRnc",
  authDomain: "chatapp-ab5ff.firebaseapp.com",
  projectId: "chatapp-ab5ff",
  storageBucket: "chatapp-ab5ff.firebasestorage.app",
  messagingSenderId: "381447591909",
  appId: "1:381447591909:web:bc572a5a7bbb431893010c"
};

// Initialize Firebase App
console.log("Initializing Firebase App...");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Determine the correct persistence method based on the platform
const persistence =
  Platform.OS === 'web'
    ? browserLocalPersistence
    : getReactNativePersistence(AsyncStorage);

// Initialize Firebase Auth with the correct persistence
console.log("Initializing Firebase Auth with platform-specific persistence...");
const auth = initializeAuth(app, { persistence });

const Stack = createNativeStackNavigator();

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actualNetworkState, setActualNetworkState] = useState(null);

  // Use useNetInfo() to get network connection status
  const connectionStatus = useNetInfo();

  // Enhanced network state that combines useNetInfo with actual connectivity test
  useEffect(() => {
    const testActualConnectivity = async () => {
      try {
        // Try to fetch from a reliable endpoint with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          signal: controller.signal,
          cache: 'no-cache'
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log("Connectivity test: ONLINE");
          setActualNetworkState(true);
        } else {
          console.log("Connectivity test: OFFLINE (bad response)");
          setActualNetworkState(false);
        }
      } catch (error) {
        console.log("Connectivity test: OFFLINE (fetch failed)", error.message);
        setActualNetworkState(false);
      }
    };

    // Test connectivity when useNetInfo changes
    if (connectionStatus.isConnected !== null) {
      testActualConnectivity();
    }

    // Also test connectivity every 10 seconds
    const interval = setInterval(testActualConnectivity, 10000);
    return () => clearInterval(interval);
  }, [connectionStatus.isConnected]);

  // Determine effective connection state
  const effectiveConnection = actualNetworkState !== null ? actualNetworkState : connectionStatus.isConnected;

  // Debug logging
  useEffect(() => {
    console.log("Network Status Debug:");
    console.log("- useNetInfo isConnected:", connectionStatus.isConnected);
    console.log("- useNetInfo type:", connectionStatus.type);
    console.log("- Actual connectivity test:", actualNetworkState);
    console.log("- Effective connection:", effectiveConnection);
  }, [connectionStatus.isConnected, connectionStatus.type, actualNetworkState, effectiveConnection]);

  // useEffect to handle network status changes and manage Firestore network state
  useEffect(() => {
    // Alert the user if connection is lost
    if (effectiveConnection === false) {
      Alert.alert("Connection Lost!");
      // Disable Firestore network access
      disableNetwork(db).catch(console.error);
    } else if (effectiveConnection === true) {
      // Re-enable Firestore network access
      enableNetwork(db).catch(console.error);
    }
  }, [effectiveConnection]);

  useEffect(() => {
    // This listener will fire whenever the auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // A user is signed in.
        setUser(authUser);
        console.log("Auth state changed. User ID:", authUser.uid);
        setIsLoading(false);
      } else {
        // No user is signed in, so we sign in anonymously.
        console.log("No user signed in. Signing in anonymously...");
        signInAnonymously(auth)
          .then((userCredential) => {
            setUser(userCredential.user);
            console.log("Anonymous sign-in successful. User ID:", userCredential.user.uid);
          })
          .catch((error) => {
            console.error("Anonymous sign-in failed:", error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribeAuth();
  }, [auth]);

  if (isLoading) {
    return null;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start">
          {(props) => <Start 
            {...props} 
            // Pass the effective connection status as props
            isConnected={effectiveConnection}
            connectionType={connectionStatus.type}
            rawNetInfo={connectionStatus} // For debugging
          />}
        </Stack.Screen>
        <Stack.Screen name="Chat">
          {(props) => <Chat 
            {...props} 
            db={db} 
            auth={auth} 
            userId={user.uid} 
            // Pass the effective connection status as props
            isConnected={effectiveConnection}
            connectionType={connectionStatus.type}
            rawNetInfo={connectionStatus} // For debugging
          />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);