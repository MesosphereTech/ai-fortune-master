import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { setTheme } from '../store/slices/appSlice';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // 设置状态栏
    StatusBar.setBarStyle('light-content');
    
    // 启动动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStartJourney = () => {
    navigation.navigate('Main');
  };

  return (
    <LinearGradient
      colors={['#2C3E50', '#34495E', '#5D6D7E']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* 主标题 */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>AI算命大师</Text>
          <Text style={styles.subtitle}>智慧千年，算尽天机</Text>
        </View>

        {/* 装饰性元素 */}
        <View style={styles.decorationContainer}>
          <View style={styles.circle} />
          <View style={[styles.circle, styles.circleSecond]} />
          <View style={[styles.circle, styles.circleThird]} />
        </View>

        {/* 功能介绍 */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featureTitle}>专业算命服务</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>🔮 传统八字命理分析</Text>
            <Text style={styles.featureItem}>🌟 AI智能运势预测</Text>
            <Text style={styles.featureItem}>📊 详细人生指导</Text>
            <Text style={styles.featureItem}>💫 个性化建议方案</Text>
          </View>
        </View>

        {/* 开始按钮 */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartJourney}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#E74C3C', '#C0392B']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>开始算命之旅</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* 底部提示 */}
        <Text style={styles.disclaimer}>
          * 仅供娱乐，理性对待命理文化
        </Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#BDC3C7',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  decorationContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    marginBottom: 50,
  },
  circle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    top: 20,
    left: 20,
  },
  circleSecond: {
    width: 100,
    height: 100,
    borderRadius: 50,
    top: 10,
    left: 10,
    borderColor: 'rgba(231, 76, 60, 0.5)',
  },
  circleThird: {
    width: 120,
    height: 120,
    borderRadius: 60,
    top: 0,
    left: 0,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featuresContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  featureTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 20,
  },
  featureList: {
    alignItems: 'flex-start',
  },
  featureItem: {
    fontSize: 16,
    color: '#ECF0F1',
    marginBottom: 8,
    textAlign: 'left',
  },
  startButton: {
    width: width * 0.7,
    height: 56,
    marginBottom: 30,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 12,
    color: '#95A5A6',
    textAlign: 'center',
    fontStyle: 'italic',
    position: 'absolute',
    bottom: 30,
  },
});

export default WelcomeScreen;
 