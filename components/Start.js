// components/Start.js
/*import { useState } from 'react';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// 1. Import signInAnonymously
import { signInAnonymously } from 'firebase/auth';

// FIX: Move styles definition to be before the component.
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '6%',
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: '15%',
  },
  inputOptionsBox: {
    width: '88%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
  },
  nameInput: {
    width: '100%',
    height: 50,
    borderColor: '#757083',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 0.5,
    marginBottom: 20,
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1,
    marginBottom: 10,
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#000000',
  },
  startButton: {
    backgroundColor: '#757083',
    width: '100%',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

// 2. Accept the 'auth' prop from App.js
const Start = ({ navigation, auth }) => {
  const [name, setName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#090C08');

  const colors = [
    '#090C08',
    '#474056',
    '#8A95A5',
    '#B9C6AE',
  ];

  // 3. Rewrite the function to handle Firebase Anonymous Auth
  const handleStartChatting = async () => {
    if (name.trim() === '') {
      Alert.alert('Please enter your name to start chatting!');
      return;
    }

    try {
      // Use signInAnonymously to log in the user
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      if (user) {
        // If a user is successfully logged in, navigate to the Chat screen
        navigation.navigate('Chat', {
          name: name.trim(),
          selectedColor: backgroundColor,
          userId: user.uid, // Pass the Firebase user ID
        });
        console.log("Signed in anonymously. User ID:", user.uid);
      } else {
        // Handle the case where the user object is not returned
        Alert.alert("Authentication Failed", "Could not get user ID. Please try again.");
      }
    } catch (error) {
      // Handle any errors during sign-in
      console.error("Sign-in error:", error);
      Alert.alert("Sign-in Failed", error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/Background Image.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.appTitle}>ChatApp</Text>

        <View style={styles.inputOptionsBox}>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#757083"
          />

          <Text style={styles.chooseColorText}>Choose Background Color:</Text>

          <View style={styles.colorOptionsContainer}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  backgroundColor === color && styles.selectedColorOption,
                ]}
                onPress={() => setBackgroundColor(color)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartChatting}
          >
            <Text style={styles.startButtonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Start;*/
import { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Start = ({ navigation, isConnected, connectionType }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#090C08');

  // Define the colors to choose from
  const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  const handleStartChat = () => {
    if (name.trim() !== '') {
      navigation.navigate('Chat', { name, selectedColor });
    } else {
      alert('Please enter your name.');
    }
  };

  // Function to get network status display text
  const getNetworkStatus = () => {
    if (isConnected === null) return 'Checking connection...';
    if (isConnected === false) return 'Offline';
    return `Online (${connectionType || 'unknown'})`;
  };

  // Function to get network status color
  const getNetworkStatusColor = () => {
    if (isConnected === null) return '#FFA500'; // Orange for checking
    if (isConnected === false) return '#FF4444'; // Red for offline
    return '#00AA00'; // Green for online
  };

  return (
    <ImageBackground
      source={require('../assets/images/Background Image.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Chat App</Text>
        
        {/* Network Status Display */}
        <View style={styles.networkStatusContainer}>
          <Text style={[styles.networkStatus, { color: getNetworkStatusColor() }]}>
            {getNetworkStatus()}
          </Text>
        </View>
        
        <View style={styles.box}>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.chooseColorText}>Choose Background Color:</Text>
          <View style={styles.colorPalette}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleStartChat}>
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '88%',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  networkStatusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 30,
  },
  networkStatus: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  box: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#757083',
    padding: 10,
    marginBottom: 20,
    color: '#757083',
    fontSize: 16,
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 10,
  },
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#000000',
    borderWidth: 2,
  },
  button: {
    backgroundColor: '#757083',
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default Start;