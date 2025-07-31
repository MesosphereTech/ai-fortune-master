/**
 * 配置管理服务
 * 处理API密钥、用户偏好等配置信息
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CONFIG_KEYS = {
  OPENAI_API_KEY: 'openai_api_key',
  GEMINI_API_KEY: 'gemini_api_key',
  AI_PROVIDER: 'ai_provider',
  USER_PREFERENCES: 'user_preferences',
  FIRST_TIME_USER: 'first_time_user',
  LAST_API_TEST: 'last_api_test',
};

class ConfigService {
  constructor() {
    this.cache = new Map();
  }

  /**
   * 保存OpenAI API密钥
   */
  async saveOpenAIKey(apiKey) {
    try {
      if (!apiKey || !apiKey.startsWith('sk-')) {
        throw new Error('无效的OpenAI API密钥格式');
      }

      await AsyncStorage.setItem(CONFIG_KEYS.OPENAI_API_KEY, apiKey);
      this.cache.set(CONFIG_KEYS.OPENAI_API_KEY, apiKey);
      
      console.log('✅ OpenAI API密钥已保存');
      return { success: true };
    } catch (error) {
      console.error('❌ 保存API密钥失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 保存Gemini API密钥
   */
  async saveGeminiKey(apiKey) {
    try {
      if (!apiKey || !apiKey.startsWith('AIza')) {
        throw new Error('无效的Gemini API密钥格式');
      }

      await AsyncStorage.setItem(CONFIG_KEYS.GEMINI_API_KEY, apiKey);
      this.cache.set(CONFIG_KEYS.GEMINI_API_KEY, apiKey);
      
      console.log('✅ Gemini API密钥已保存');
      return { success: true };
    } catch (error) {
      console.error('❌ 保存API密钥失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取OpenAI API密钥
   */
  async getOpenAIKey() {
    try {
      // 先从缓存获取
      if (this.cache.has(CONFIG_KEYS.OPENAI_API_KEY)) {
        return this.cache.get(CONFIG_KEYS.OPENAI_API_KEY);
      }

      // 从存储获取
      const apiKey = await AsyncStorage.getItem(CONFIG_KEYS.OPENAI_API_KEY);
      if (apiKey) {
        this.cache.set(CONFIG_KEYS.OPENAI_API_KEY, apiKey);
      }
      
      return apiKey;
    } catch (error) {
      console.error('❌ 获取API密钥失败:', error);
      return null;
    }
  }

  /**
   * 获取Gemini API密钥
   */
  async getGeminiKey() {
    try {
      // 先从缓存获取
      if (this.cache.has(CONFIG_KEYS.GEMINI_API_KEY)) {
        return this.cache.get(CONFIG_KEYS.GEMINI_API_KEY);
      }

      // 从存储获取
      const apiKey = await AsyncStorage.getItem(CONFIG_KEYS.GEMINI_API_KEY);
      if (apiKey) {
        this.cache.set(CONFIG_KEYS.GEMINI_API_KEY, apiKey);
      }
      
      return apiKey;
    } catch (error) {
      console.error('❌ 获取API密钥失败:', error);
      return null;
    }
  }

  /**
   * 检查是否有有效的API密钥
   */
  async hasValidApiKey() {
    const provider = await this.getAIProvider();
    if (provider === 'gemini') {
      const apiKey = await this.getGeminiKey();
      return apiKey && apiKey.startsWith('AIza') && apiKey.length > 20;
    } else {
      const apiKey = await this.getOpenAIKey();
      return apiKey && apiKey.startsWith('sk-') && apiKey.length > 20;
    }
  }

  /**
   * 清除API密钥
   */
  async clearApiKey() {
    try {
      await AsyncStorage.removeItem(CONFIG_KEYS.OPENAI_API_KEY);
      this.cache.delete(CONFIG_KEYS.OPENAI_API_KEY);
      console.log('🗑️ API密钥已清除');
      return { success: true };
    } catch (error) {
      console.error('❌ 清除API密钥失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 保存用户偏好
   */
  async saveUserPreferences(preferences) {
    try {
      const currentPrefs = await this.getUserPreferences();
      const updatedPrefs = { ...currentPrefs, ...preferences };
      
      await AsyncStorage.setItem(
        CONFIG_KEYS.USER_PREFERENCES, 
        JSON.stringify(updatedPrefs)
      );
      
      this.cache.set(CONFIG_KEYS.USER_PREFERENCES, updatedPrefs);
      console.log('✅ 用户偏好已保存');
      return { success: true };
    } catch (error) {
      console.error('❌ 保存用户偏好失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取用户偏好
   */
  async getUserPreferences() {
    try {
      // 先从缓存获取
      if (this.cache.has(CONFIG_KEYS.USER_PREFERENCES)) {
        return this.cache.get(CONFIG_KEYS.USER_PREFERENCES);
      }

      // 从存储获取
      const prefsStr = await AsyncStorage.getItem(CONFIG_KEYS.USER_PREFERENCES);
      if (prefsStr) {
        const prefs = JSON.parse(prefsStr);
        this.cache.set(CONFIG_KEYS.USER_PREFERENCES, prefs);
        return prefs;
      }

      // 返回默认偏好
      const defaultPrefs = {
        theme: 'dark',
        language: 'zh-CN',
        notifications: true,
        autoSave: true,
        analysisDetail: 'detailed', // 'simple' | 'detailed' | 'comprehensive'
        voiceEnabled: false,
      };
      
      return defaultPrefs;
    } catch (error) {
      console.error('❌ 获取用户偏好失败:', error);
      return {};
    }
  }

  /**
   * 设置AI提供商
   */
  async setAIProvider(provider) {
    try {
      await AsyncStorage.setItem(CONFIG_KEYS.AI_PROVIDER, provider);
      this.cache.set(CONFIG_KEYS.AI_PROVIDER, provider);
      console.log(`✅ AI提供商设置为: ${provider}`);
      return { success: true };
    } catch (error) {
      console.error('❌ 设置AI提供商失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取AI提供商
   */
  async getAIProvider() {
    try {
      if (this.cache.has(CONFIG_KEYS.AI_PROVIDER)) {
        return this.cache.get(CONFIG_KEYS.AI_PROVIDER);
      }

      const provider = await AsyncStorage.getItem(CONFIG_KEYS.AI_PROVIDER);
      if (provider) {
        this.cache.set(CONFIG_KEYS.AI_PROVIDER, provider);
        return provider;
      }

      // 默认使用Gemini
      return 'gemini';
    } catch (error) {
      console.error('❌ 获取AI提供商失败:', error);
      return 'gemini';
    }
  }

  /**
   * 检查是否首次使用
   */
  async isFirstTimeUser() {
    try {
      const firstTime = await AsyncStorage.getItem(CONFIG_KEYS.FIRST_TIME_USER);
      return firstTime === null; // 如果没有记录，说明是首次使用
    } catch (error) {
      console.error('❌ 检查首次使用失败:', error);
      return true;
    }
  }

  /**
   * 标记已完成首次设置
   */
  async markFirstTimeComplete() {
    try {
      await AsyncStorage.setItem(CONFIG_KEYS.FIRST_TIME_USER, 'false');
      console.log('✅ 首次设置已完成');
      return { success: true };
    } catch (error) {
      console.error('❌ 标记首次设置失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 记录最后一次API测试结果
   */
  async recordApiTest(result) {
    try {
      const testRecord = {
        timestamp: new Date().toISOString(),
        success: result.success,
        provider: await this.getAIProvider(),
        error: result.error || null,
      };

      await AsyncStorage.setItem(
        CONFIG_KEYS.LAST_API_TEST, 
        JSON.stringify(testRecord)
      );
      
      this.cache.set(CONFIG_KEYS.LAST_API_TEST, testRecord);
      console.log('📊 API测试记录已保存');
      return { success: true };
    } catch (error) {
      console.error('❌ 记录API测试失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取最后一次API测试结果
   */
  async getLastApiTest() {
    try {
      if (this.cache.has(CONFIG_KEYS.LAST_API_TEST)) {
        return this.cache.get(CONFIG_KEYS.LAST_API_TEST);
      }

      const testStr = await AsyncStorage.getItem(CONFIG_KEYS.LAST_API_TEST);
      if (testStr) {
        const test = JSON.parse(testStr);
        this.cache.set(CONFIG_KEYS.LAST_API_TEST, test);
        return test;
      }

      return null;
    } catch (error) {
      console.error('❌ 获取API测试记录失败:', error);
      return null;
    }
  }

  /**
   * 获取完整配置概览
   */
  async getConfigOverview() {
    try {
      const overview = {
        hasApiKey: await this.hasValidApiKey(),
        aiProvider: await this.getAIProvider(),
        isFirstTime: await this.isFirstTimeUser(),
        lastApiTest: await this.getLastApiTest(),
        userPreferences: await this.getUserPreferences(),
      };

      console.log('📋 配置概览:', overview);
      return overview;
    } catch (error) {
      console.error('❌ 获取配置概览失败:', error);
      return {};
    }
  }

  /**
   * 重置所有配置
   */
  async resetAllConfig() {
    try {
      const keys = Object.values(CONFIG_KEYS);
      await AsyncStorage.multiRemove(keys);
      this.cache.clear();
      
      console.log('🔄 所有配置已重置');
      return { success: true };
    } catch (error) {
      console.error('❌ 重置配置失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
    console.log('🧹 配置缓存已清除');
  }
}

// 创建全局实例
const configService = new ConfigService();

export default configService;
 