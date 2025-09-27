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
import {
  Alert, // Import Alert for better UX
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker

const Start = ({ navigation, isConnected, connectionType }) => {
  const forceOnline = true;
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#090C08');
  // 1. State to temporarily hold the image data
  const [image, setImage] = useState(null); 

  // Define the colors to choose from
  const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  // 2. Function to handle image selection from the library
  const pickImage = async () => {
    // Request media library permissions
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissions?.granted) {
      // Launch the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        // FIX: Replaced deprecated MediaTypeOptions.Images with MediaType.Images
        mediaTypes: ImagePicker.MediaType.Images, 
        allowsEditing: true, // Allow user to crop/edit
        quality: 1,
      });

      // Check if the user didn't cancel the operation
      if (!result.canceled) {
        // Set the image state with the asset information
        setImage(result.assets[0]);
        console.log("Image URI picked:", result.assets[0].uri);
      } else {
        Alert.alert("Image Picking", "Image selection cancelled.");
      }
    } else {
      Alert.alert("Permission Denied", "We need access to your photo library to pick images.");
    }
  };

  // 3. Placeholder for taking a photo (as requested in prompt)
  const takePhoto = () => {
    Alert.alert("Feature Disabled", "The 'Take a Photo' feature is not yet implemented.");
  };

  const handleStartChat = () => {
    if (name.trim() !== '') {
      // Navigate to Chat, passing name and color
      navigation.navigate('Chat', { name, selectedColor });
    } else {
      // Replace alert with Alert.alert
      Alert.alert('Name Required', 'Please enter your name to start chatting.');
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
            accessibilityLabel="Your Name Input"
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
                accessibilityLabel={`Select color ${color}`}
              />
            ))}
          </View>
          
          {/* New Media Buttons */}
          <View style={styles.mediaContainer}>
            <TouchableOpacity 
              style={[
                styles.mediaButton, 
                { backgroundColor: isConnected ? '#DDDDDD' : '#AAAAAA' } // Visually indicate disabled state
              ]} 
              onPress={pickImage}
              disabled={!isConnected} // Disable if offline
              accessibilityLabel="Pick an image from the library"
            >
              <Text style={styles.mediaButtonText}>Pick an image from the library</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.mediaButton, 
                { backgroundColor: isConnected ? '#DDDDDD' : '#AAAAAA' }
              ]} 
              onPress={takePhoto}
              disabled={!isConnected} // Disable if offline
              accessibilityLabel="Take a photo (currently disabled)"
            >
              <Text style={styles.mediaButtonText}>Take a photo</Text>
            </TouchableOpacity>
          </View>

          {/* Conditional Image Display */}
          {image && (
            <Image 
              source={{ uri: image.uri }} 
              style={styles.previewImage} 
              accessibilityLabel="Preview of selected image"
            />
          )}

          <TouchableOpacity style={[styles.button, { backgroundColor: selectedColor }]} onPress={handleStartChat}>
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
    justifyContent: 'flex-end', // Align contents to the bottom
    alignItems: 'center',
    width: '88%',
    paddingBottom: '20%', 
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    position: 'absolute', 
    top: 100,
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
    borderRadius: 15, // Added rounded corners
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
    borderRadius: 8, 
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
    borderColor: '#757083',
    borderWidth: 3,
  },
  // Styles for media section
  mediaContainer: {
    width: '100%',
    marginBottom: 10,
  },
  mediaButton: {
    padding: 15,
    width: '100%',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757083',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#757083',
  },
  button: {
    padding: 15,
    width: '100%',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default Start;
