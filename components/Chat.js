import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert // <--- Make sure this is imported (for the example Alert)
  ,




  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat"; // <--- Make sure Bubble is imported

const Chat = ({ route }) => {
  const { name, backgroundColor } = route.params;
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
      headerStyle: {
        backgroundColor: backgroundColor
      },
      headerTintColor: '#FFFFFF'
    });
  }, [navigation, name, backgroundColor]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  const onSend = useCallback((messagesToSend = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messagesToSend));
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#00FF00"
          },
          left: {
            backgroundColor: "#0000FF"
          }
        }}
      />
    );
  };

  // --- START of the code block where syntax errors often occur if miscopied ---
  const renderActions = (props) => {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="Lets you choose to send an image or your geolocation."
        accessibilityRole="button"
        onPress={() => {
          Alert.alert( // <--- Check for missing ')' or '}' if error is around here
            "More Options",
            "Choose to send an image or your geolocation.",
            [
              { text: "Image", onPress: () => console.log("Send Image Pressed") },
              { text: "Geolocation", onPress: () => console.log("Send Geolocation Pressed") },
              { text: "Cancel", style: "cancel" }
            ]
          );
        }}
        style={styles.actionButton} // <--- Check for missing comma if you added another prop below this
      >
        <View>
          <Text style={styles.actionButtonText}>+</Text>
        </View>
      </TouchableOpacity>
    );
  };
  // --- END of the code block where syntax errors often occur ---

  return (
    <ImageBackground
      source={require('../assets/images/chat background.png')} // <--- Ensure the path is correct
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.chatContentContainer}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: 1,
          }}
          placeholder="Type a message..."
          renderUsernameOnMessage={true}
          renderBubble={renderBubble}
          renderActions={renderActions} // <--- Ensure there's a comma after this line if you add another prop below it!
        />

        {Platform.OS === 'android' && (
          <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={Platform.select({ ios: 0, android: -500 })} />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  chatContentContainer: {
    flex: 1,
  },
  actionButton: { // <--- Ensure these styles are correctly within the 'styles' object
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