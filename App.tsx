import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import SummaryScreen from './src/screens/SummaryScreen';

export type RootStackParamList = {
  Home: undefined;
  Summary: { liked: string[]; disliked: string[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [dark, setDark] = useState(false);
  const theme: Theme = dark ? DarkTheme : DefaultTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerTitle: 'Swipe Deck',
              headerRight: () => (
                <Button
                  title={dark ? 'Light' : 'Dark'}
                  onPress={() => setDark((prev) => !prev)}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Summary"
            component={SummaryScreen}
            options={{ headerTitle: 'Summary' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
