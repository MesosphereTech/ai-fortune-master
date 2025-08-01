/**
 * AI算命大师 - 主应用入口
 * @format
 */

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';

import { store, persistor } from './src/store/store';

import WelcomeScreen from './src/screens/WelcomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ResultScreen from './src/screens/ResultScreen';

import MainTabNavigator from './src/navigation/MainTabNavigator';
import LoadingScreen from './src/components/LoadingScreen';

const Stack = createStackNavigator();

const App = (): React.JSX.Element => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar
              barStyle="light-content"
              backgroundColor="#2C3E50"
              translucent={false}
            />
            <Stack.Navigator
              initialRouteName="Welcome"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#2C3E50',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                gestureEnabled: true,
              }}>
              <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{
                  title: 'AI算命大师',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Main"
                component={MainTabNavigator}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                  title: '智能算命师',
                  headerBackTitle: '',
                }}
              />
              <Stack.Screen
                name="Result"
                component={ResultScreen}
                options={{
                  title: '算命结果',
                  headerBackTitle: '',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;


