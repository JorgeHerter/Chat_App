import { useState } from 'react';
import {
  Alert,
  ImageBackground, // Import Platform for KeyboardAvoidingView
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#090C08'); // Default color

  // Array of background color options as per brief
  const colors = [
    '#090C08', // Black
    '#474056', // Purple
    '#8A95A5', // Grey
    '#B9C6AE', // Greenish-Grey
  ];

  const handleStartChatting = () => {
    if (name.trim() === '') {
      Alert.alert('Please enter your name to start chatting!');
    } else {
      // Navigate to Chat screen, passing name and chosen background color
      navigation.navigate('Chat', { name: name.trim(), backgroundColor: backgroundColor });
    }
  };

  return (
    // ImageBackground is used here to set the background image
    <ImageBackground
      // Corrected path with forward slashes
      source={require('../assets/images/Background Image.png')}
      style={styles.backgroundImage}
      resizeMode="cover" // This will cover the entire screen, cropping if necessary
    >
      <View style={styles.container}>
        {/* App Title */}
        <Text style={styles.appTitle}>ChatApp</Text>

        {/* Input and Options Box */}
        <View style={styles.inputOptionsBox}>
          {/* Your Name Input */}
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#757083" // 50% opacity color
            accessibilityLabel="Your name"
            accessibilityHint="Enter your name to join the chat."
            accessibilityRole="text"
          />

          {/* Choose Background Color */}
          <Text style={styles.chooseColorText}>Choose Background Color:</Text>

          {/* Color Options */}
          <View style={styles.colorOptionsContainer}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  backgroundColor === color && styles.selectedColorOption, // Highlight selected
                ]}
                onPress={() => setBackgroundColor(color)}
                accessibilityLabel={`Set chat background to ${color}`}
                accessibilityRole="button"
              />
            ))}
          </View>

          {/* Start Chatting Button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartChatting}
            accessibilityLabel="Start Chatting"
            accessibilityHint="Navigates to the chat screen."
            accessibilityRole="button"
          >
            <Text style={styles.startButtonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Keyboard Avoiding View for Android to prevent keyboard from hiding input */}
      {Platform.OS === 'android' && (
        <KeyboardAvoidingView behavior="height" />
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // Ensures the ImageBackground takes up the full screen
    width: '100%', // Explicitly set width to 100%
    height: '100%', // Explicitly set height to 100%
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',     // Center content horizontally
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between', // Push title to top, box to bottom
    alignItems: 'center',
    paddingBottom: '6%', // Roughly 6% padding from bottom for the input box
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: '15%', // Roughly 15% from top for title
  },
  inputOptionsBox: {
    width: '88%', // 88% width as per common designs for input forms
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
    opacity: 0.5, // 50% opacity
    marginBottom: 20,
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1, // 100% opacity
    marginBottom: 10,
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%', // Adjust width to spread circles
    marginBottom: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25, // Half of width/height for a perfect circle
    borderWidth: 2, // Add a border to easily see selected state
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#000000', // Highlight color for selected option
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

export default Start;