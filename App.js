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
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';

// 1. Firebase imports
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 2. Import AsyncStorage for React Native persistence
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Import your screen components
import Chat from './components/Chat';
import Start from './components/Start';

// Create the navigator stack
const Stack = createNativeStackNavigator();

// 3. Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMDBGdZ7fKht-o7ih3I73RqU7Z5OPCRnc",
  authDomain: "chatapp-ab5ff.firebaseapp.com",
  projectId: "chatapp-ab5ff",
  storageBucket: "chatapp-ab5ff.firebasestorage.app",
  messagingSenderId: "381447591909",
  appId: "1:381447591909:web:bc572a5a7bbb431893010c"
};

// 4. Initialize Firebase app and services safely for hot-reloading
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let auth;
let db;

// This is a robust pattern to handle hot-reloading. We check if the auth service has been initialized
// before attempting to get it. This prevents the configuration-not-found error.
if (!getApps()[0]._isAuthInitialized) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  getApps()[0]._isAuthInitialized = true;
} else {
  auth = getAuth(app);
}

db = getFirestore(app);


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        {/* Start Screen Configuration */}
        <Stack.Screen name="Start" options={{ headerShown: false }}>
          {props => <Start {...props} auth={auth} />}
        </Stack.Screen>

        {/* Chat Screen Configuration */}
        <Stack.Screen name="Chat">
          {props => <Chat {...props} db={db} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

registerRootComponent(App);



