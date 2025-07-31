import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

// 临时屏幕组件
const ChatScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>聊天界面开发中...</Text>
  </View>
);

const HistoryScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>历史记录开发中...</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>个人设置开发中...</Text>
  </View>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#2C3E50',
          borderTopColor: '#34495E',
        },
        tabBarActiveTintColor: '#E74C3C',
        tabBarInactiveTintColor: '#BDC3C7',
        headerStyle: {
          backgroundColor: '#2C3E50',
        },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          title: '算命师',
          tabBarLabel: '算命师',
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          title: '历史记录',
          tabBarLabel: '历史',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: '个人设置',
          tabBarLabel: '设置',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
  },
  text: {
    fontSize: 18,
    color: '#2C3E50',
    fontWeight: '500',
  },
});

export default MainTabNavigator;
 