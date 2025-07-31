import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import geminiService from '../services/geminiService';
import configService from '../services/configService';
import {
  addMessage,
  setLoading,
  setTyping,
  updateUserInfo,
  setError,
  startNewSession,
} from '../store/slices/chatSlice';

const ChatScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentSession, isLoading, isTyping } = useSelector(state => state.chat);
  
  const [inputText, setInputText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [collectionStep, setCollectionStep] = useState(0);
  const [userInfo, setUserInfoState] = useState({
    name: '',
    gender: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  });
  
  const scrollViewRef = useRef();

  // 信息收集步骤
  const collectionSteps = [
    { key: 'name', label: '请告诉我您的姓名', placeholder: '例如：张三' },
    { key: 'gender', label: '请选择您的性别', options: ['男', '女'] },
    { key: 'birthDate', label: '请输入您的出生日期', placeholder: '例如：1990年5月15日' },
    { key: 'birthTime', label: '请输入您的出生时间', placeholder: '例如：上午8点30分' },
    { key: 'birthPlace', label: '请输入您的出生地点', placeholder: '例如：北京市' },
  ];

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    // 自动滚动到底部
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [currentSession.messages]);

  const initializeChat = async () => {
    try {
      // 检查是否有API密钥
      const savedApiKey = await configService.getGeminiKey();
      if (!savedApiKey) {
        setShowApiInput(true);
        addWelcomeMessage();
      } else {
        setApiKey(savedApiKey);
        await initializeAI(savedApiKey);
      }
    } catch (error) {
      console.error('初始化聊天失败:', error);
      addSystemMessage('初始化失败，请重试');
    }
  };

  const initializeAI = async (key) => {
    try {
      dispatch(setLoading(true));
      const result = await geminiService.initialize(key);
      
      if (result.success) {
        await configService.saveGeminiKey(key);
        await configService.recordApiTest(result);
        dispatch(startNewSession());
        addWelcomeMessage();
        setShowApiInput(false);
      } else {
        Alert.alert('AI初始化失败', result.message);
        setShowApiInput(true);
      }
    } catch (error) {
      Alert.alert('错误', '无法连接AI服务，请检查网络和API密钥');
      setShowApiInput(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const addWelcomeMessage = () => {
    const welcomeMsg = {
      id: Date.now().toString(),
      role: 'assistant',
      content: '🔮 欢迎来到AI算命大师！\n\n我是您的专业命理顾问，精通传统八字、五行、紫薇等命理学说。\n\n为了给您提供准确的分析，请按照我的引导提供一些基本信息。\n\n让我们开始吧！请告诉我您的姓名。',
      timestamp: new Date().toISOString(),
    };
    dispatch(addMessage(welcomeMsg));
  };

  const addSystemMessage = (content) => {
    const systemMsg = {
      id: Date.now().toString(),
      role: 'system',
      content,
      timestamp: new Date().toISOString(),
    };
    dispatch(addMessage(systemMsg));
  };

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      Alert.alert('提示', '请输入Gemini API密钥');
      return;
    }
    
    if (!apiKey.startsWith('AIza')) {
      Alert.alert('错误', '无效的Gemini API密钥格式');
      return;
    }

    initializeAI(apiKey);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(userMsg));
    const currentInput = inputText.trim();
    setInputText('');

    // 处理信息收集流程
    if (collectionStep < collectionSteps.length) {
      handleInfoCollection(currentInput);
    } else {
      // 信息收集完成，进行AI对话
      handleAIConversation(currentInput);
    }
  };

  const handleInfoCollection = (input) => {
    const currentStepKey = collectionSteps[collectionStep].key;
    const newUserInfo = { ...userInfo, [currentStepKey]: input };
    setUserInfoState(newUserInfo);
    dispatch(updateUserInfo(newUserInfo));

    const nextStep = collectionStep + 1;
    setCollectionStep(nextStep);

    if (nextStep < collectionSteps.length) {
      // 继续收集信息
      setTimeout(() => {
        const nextStepInfo = collectionSteps[nextStep];
        const responseMsg = {
          id: Date.now().toString(),
          role: 'assistant',
          content: nextStepInfo.label,
          timestamp: new Date().toISOString(),
        };
        dispatch(addMessage(responseMsg));
      }, 1000);
    } else {
      // 信息收集完成，开始AI分析
      setTimeout(() => {
        startFortuneAnalysis(newUserInfo);
      }, 1000);
    }
  };

  const startFortuneAnalysis = async (userInfo) => {
    try {
      dispatch(setLoading(true));
      dispatch(setTyping(true));

      // 显示分析开始消息
      const analysisStartMsg = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '📊 正在为您进行专业的八字命理分析...\n\n✨ 分析您的生辰八字\n🔍 解读五行平衡\n💫 预测运势走向\n\n请稍候，AI大师正在施展法术...',
        timestamp: new Date().toISOString(),
      };
      dispatch(addMessage(analysisStartMsg));

      // 创建AI会话
      const session = await geminiService.createFortuneSession();
      
      // 发送用户信息进行分析
      const result = await geminiService.sendUserInfo(session.sessionId, userInfo);

      if (result.success) {
        const analysisMsg = {
          id: Date.now().toString(),
          role: 'assistant',
          content: result.analysis,
          timestamp: new Date().toISOString(),
          sessionId: session.sessionId,
        };
        dispatch(addMessage(analysisMsg));

        // 添加后续交互提示
        setTimeout(() => {
          const followUpMsg = {
            id: Date.now().toString(),
            role: 'assistant',
            content: '💬 分析完成！如果您对某个方面有特别的疑问，可以继续向我提问。比如：\n\n• "我的事业运势如何？"\n• "什么时候适合结婚？"\n• "如何改善财运？"\n\n我会为您提供更详细的解答。',
            timestamp: new Date().toISOString(),
          };
          dispatch(addMessage(followUpMsg));
        }, 2000);
      } else {
        throw new Error('AI分析失败');
      }
    } catch (error) {
      console.error('算命分析失败:', error);
      dispatch(setError(error.message));
      addSystemMessage('分析过程中出现错误，请重试或联系客服');
    } finally {
      dispatch(setLoading(false));
      dispatch(setTyping(false));
    }
  };

  const handleAIConversation = async (message) => {
    try {
      dispatch(setTyping(true));
      
      // 找到最后一个包含sessionId的消息
      const lastAIMessage = currentSession.messages
        .reverse()
        .find(msg => msg.role === 'assistant' && msg.sessionId);
      
      if (!lastAIMessage?.sessionId) {
        throw new Error('找不到有效的对话会话');
      }

      const result = await geminiService.continueConversation(
        lastAIMessage.sessionId, 
        message
      );

      if (result.success) {
        const responseMsg = {
          id: Date.now().toString(),
          role: 'assistant',
          content: result.analysis,
          timestamp: new Date().toISOString(),
          sessionId: lastAIMessage.sessionId,
        };
        dispatch(addMessage(responseMsg));
      } else {
        throw new Error('AI回复失败');
      }
    } catch (error) {
      console.error('AI对话失败:', error);
      addSystemMessage('回复过程中出现错误，请重试');
    } finally {
      dispatch(setTyping(false));
    }
  };

  const handleGenderSelect = (gender) => {
    setInputText(gender);
    handleSendMessage();
  };

  const renderMessage = (message) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    
    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.assistantMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : isSystem ? styles.systemBubble : styles.assistantBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userText : isSystem ? styles.systemText : styles.assistantText
          ]}>
            {message.content}
          </Text>
          <Text style={styles.messageTime}>
            {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
    );
  };

  const renderCurrentStepInput = () => {
    if (collectionStep >= collectionSteps.length) {
      // 信息收集完成，显示普通输入框
      return (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="请输入您的问题..."
            placeholderTextColor="#95A5A6"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>发送</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const currentStepInfo = collectionSteps[collectionStep];
    
    if (currentStepInfo.key === 'gender') {
      // 性别选择
      return (
        <View style={styles.optionsContainer}>
          {currentStepInfo.options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionButton}
              onPress={() => handleGenderSelect(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    // 普通文本输入
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={currentStepInfo.placeholder}
          placeholderTextColor="#95A5A6"
          maxLength={100}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>确定</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (showApiInput) {
    return (
      <LinearGradient colors={['#2C3E50', '#34495E']} style={styles.container}>
        <View style={styles.apiSetupContainer}>
          <Text style={styles.setupTitle}>🔮 AI算命大师设置</Text>
          <Text style={styles.setupSubtitle}>
            需要Google Gemini API密钥才能开启AI算命功能
          </Text>
          
          <View style={styles.apiInputContainer}>
            <Text style={styles.inputLabel}>Gemini API密钥:</Text>
            <TextInput
              style={styles.apiInput}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="AIzaSy..."
              placeholderTextColor="#BDC3C7"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
          
          <TouchableOpacity
            style={styles.setupButton}
            onPress={handleApiKeySubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.setupButtonText}>开始算命</Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.helpText}>
            💡 获取API密钥：访问 aistudio.google.com
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#2C3E50', '#34495E']} style={styles.header}>
        <Text style={styles.headerTitle}>🔮 AI算命大师</Text>
        <Text style={styles.headerSubtitle}>专业命理 • 智慧解读</Text>
      </LinearGradient>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {currentSession.messages.map(renderMessage)}
        
        {isTyping && (
          <View style={[styles.messageContainer, styles.assistantMessage]}>
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>AI大师正在思考</Text>
                <ActivityIndicator size="small" color="#E74C3C" />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputSection}>
        {renderCurrentStepInput()}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BDC3C7',
    textAlign: 'center',
    marginTop: 5,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageContainer: {
    marginVertical: 5,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 15,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#E74C3C',
    borderBottomRightRadius: 5,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  systemBubble: {
    backgroundColor: '#F39C12',
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#2C3E50',
  },
  systemText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  messageTime: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 8,
    textAlign: 'right',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  typingText: {
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 15,
    minWidth: 80,
    alignItems: 'center',
  },
  optionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  apiSetupContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  setupTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  setupSubtitle: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
    marginBottom: 40,
  },
  apiInputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: '500',
  },
  apiInput: {
    backgroundColor: '#34495E',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#5D6D7E',
  },
  setupButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  setupButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpText: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ChatScreen;
 