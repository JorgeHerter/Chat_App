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
import React from 'react';
import { StyleSheet, View, Text } from 'react-native'; // Removed unused imports like TextInput, TouchableOpacity, ScrollView
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your Start and Chat screen components
import Start from './components/Start';
import Chat from './components/Chat';

// Create the navigator stack
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        {/* Start Screen Configuration */}
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ headerShown: false }} // Hide header for the start screen as per design
        />
        {/* Chat Screen Configuration */}
        <Stack.Screen
          name="Chat"
          component={Chat}
          // The title and background will be set dynamically by Chat.js
          // via navigation.setOptions in a useLayoutEffect hook
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// You can keep your general styles here, though they might not be used directly in App.js now
const styles = StyleSheet.create({
  // You might not need styles here directly unless for a root view,
  // as screen components will have their own styles.
});

export default App;
registerRootComponent(App);