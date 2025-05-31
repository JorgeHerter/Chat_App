// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// Create a Stack navigator
const Stack = createNativeStackNavigator();

// Main App component
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({ route }) => ({
            title: route.params?.name || 'Chat',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
