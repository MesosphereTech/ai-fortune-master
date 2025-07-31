/**
 * AI算命大师 - 简化版Android应用
 * @format
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

const App = (): React.JSX.Element => {
  const handleFortunePress = () => {
    Alert.alert(
      'AI算命大师',
      '恭喜！您的Android APK构建成功！\n\n这是一个简化版本，证明React Native Android环境配置正确。',
      [{ text: '确定', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#2C3E50"
        translucent={false}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        
        {/* 标题区域 */}
        <View style={styles.header}>
          <Text style={styles.title}>🔮 AI算命大师</Text>
          <Text style={styles.subtitle}>专业中国传统八字命理分析</Text>
        </View>

        {/* 主要内容 */}
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>✅ APK构建成功</Text>
            <Text style={styles.cardText}>
              恭喜！您的React Native Android应用已成功构建。
              这证明了所有环境配置都是正确的。
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎯 功能特点</Text>
            <Text style={styles.cardText}>
              • 中国传统八字命理分析{'\n'}
              • AI智能算命师{'\n'}
              • 专业运势预测{'\n'}
              • 现代化用户界面
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.fortuneButton}
            onPress={handleFortunePress}
          >
            <Text style={styles.fortuneButtonText}>
              🔮 开始算命
            </Text>
          </TouchableOpacity>

          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>📊 构建状态</Text>
            <Text style={styles.statusText}>
              ✅ React Native: 0.73.2{'\n'}
              ✅ Android Gradle: 8.6.1{'\n'}
              ✅ Gradle Wrapper: 8.10.2{'\n'}
              ✅ CompileSDK: 35{'\n'}
              ✅ GitHub Actions: 配置成功
            </Text>
          </View>
        </View>

        {/* 底部信息 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 AI算命大师
          </Text>
          <Text style={styles.footerSubtext}>
            传统文化与AI技术的完美结合
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A252F',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2C3E50',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#2C3E50',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  fortuneButton: {
    backgroundColor: '#FFD700',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fortuneButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statusCard: {
    backgroundColor: '#27AE60',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#34495E',
  },
  footerText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 4,
  },
});

export default App;


