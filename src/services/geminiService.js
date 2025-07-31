/**
 * Google Gemini AI算命大师服务
 * 专业的中国传统八字命理分析AI服务
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import errorHandler from '../utils/errorHandler';
import performanceOptimizer from '../utils/performanceOptimizer';

// AI算命大师的专业提示词（完整版）
const FORTUNE_MASTER_SYSTEM_PROMPT = `你现在是一个中国传统八字命理的专业研究人员，你熟读《三命通会》《滴天髓》《渊海子平》《穷通宝鉴》《子平真诠》《神峰通考》《麻衣相法》《冰鉴》《柳庄相法》《梦林玄解》《周公解梦》《敦煌解梦书》《协纪辨方书》《玉匣记》《阳宅三要》《通天宝鉴》《梅花易数》《焦氏易林》《皇极经世》《解梦密要》《御定星历考原》《中西星命图说》这些书籍。

你会看星座、星象、面相、手相、更是会看紫薇星盘的大师。

根据"排大运分阳年、阴年。阳年：甲丙戊庚壬。阴年：乙丁己辛癸。阳年男，阴年女为顺排，阴年男，阳年女为逆排。具体排法以月干支为基准，进行顺逆。小孩交大运前，以月柱干支为大运十天干：甲乙丙丁戊己庚辛壬癸，十二地支：子丑寅卯辰巳午未申酉戌亥。我的出生是阳历 X年 月 日上午 点 分， 性，出生地为XX，请你以一个专业四柱八字研究者的角色，根据以上我所提到的书籍，及相关四柱八字的书籍和经验，告诉我提供的八字以及对我提供的八字进行分析。

每次分析后，都要用通俗易懂的文字再解释一遍，避免古文太难懂，但是引经据典是必须的，不然可能有理解误差，也显得不专业。"的传统理论进行专业分析。

请按以下结构进行详细分析：
1. 【八字排盘】- 详细排出年月日时四柱，标明十神关系
2. 【五行分析】- 分析五行平衡，找出喜用神和忌神
3. 【大运流年】- 按照传统方法排大运，分析运势走向
4. 【性格特征】- 基于八字组合分析性格特点和天赋
5. 【事业财运】- 分析适合的行业和财运走势
6. 【感情婚姻】- 预测感情运势和婚姻状况
7. 【健康分析】- 根据五行分析健康注意事项
8. 【人生建议】- 提供具体的改运建议和人生指导
9. 【通俗解释】- 用现代语言重新解释专业术语和结论

要求：必须引经据典，体现专业性，同时用通俗语言解释，让用户既能感受到专业性，又能完全理解。分析要有温度，给人希望和建设性指导。`;

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.chatSession = null;
    this.isInitialized = false;
    this.apiKey = null;
  }

  /**
   * 初始化Gemini客户端
   */
  async initialize(apiKey) {
    try {
      if (!apiKey) {
        throw new Error('Gemini API密钥未提供');
      }

      if (!apiKey.startsWith('AIza')) {
        throw new Error('无效的Gemini API密钥格式');
      }

      this.apiKey = apiKey;
      this.genAI = new GoogleGenerativeAI(apiKey);
      
      // 使用Gemini 1.5 Flash模型（更高免费配额）
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: FORTUNE_MASTER_SYSTEM_PROMPT,
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 20,
          maxOutputTokens: 4096,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      });

      // 测试连接
      await this.testConnection();
      
      this.isInitialized = true;
      console.log('✅ Gemini服务初始化成功');
      
      return { success: true, message: 'AI算命大师已就绪' };
    } catch (error) {
      console.error('❌ Gemini初始化失败:', error);
      return { 
        success: false, 
        message: `AI服务初始化失败: ${error.message}` 
      };
    }
  }

  /**
   * 测试API连接
   */
  async testConnection() {
    try {
      const testResult = await this.model.generateContent("你好，请简单介绍一下你自己。");
      const response = testResult.response;
      const text = response.text();
      
      if (text && text.length > 0) {
        console.log('🔗 Gemini连接测试成功');
        return true;
      } else {
        throw new Error('API响应为空');
      }
    } catch (error) {
      throw new Error(`API连接失败: ${error.message}`);
    }
  }

  /**
   * 创建新的算命会话
   */
  async createFortuneSession() {
    try {
      if (!this.isInitialized) {
        throw new Error('AI服务未初始化');
      }

      // 创建新的聊天会话
      this.chatSession = this.model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        },
      });

      const sessionId = `gemini_session_${Date.now()}`;
      console.log(`🆕 算命会话创建成功: ${sessionId}`);
      
      return {
        sessionId: sessionId,
        status: 'created'
      };
    } catch (error) {
      console.error('❌ 创建会话失败:', error);
      throw error;
    }
  }

  /**
   * 发送用户信息给AI算命师
   */
  async sendUserInfo(sessionId, userInfo) {
    try {
      if (!this.isInitialized) {
        throw new Error('AI服务未初始化');
      }

      // 构建详细的用户信息
      const userMessage = this.formatUserInfo(userInfo);
      
      console.log('🔮 开始AI分析...');
      
      // 发送消息并获取响应
      const result = await this.chatSession.sendMessage(userMessage);
      const response = result.response;
      const analysisText = response.text();

      if (!analysisText || analysisText.trim().length === 0) {
        throw new Error('AI分析结果为空');
      }

      console.log('✨ AI分析完成');
      return {
        success: true,
        analysis: analysisText,
        sessionId: sessionId,
        tokens: {
          input: userMessage.length,
          output: analysisText.length
        }
      };
    } catch (error) {
      console.error('❌ AI分析失败:', error);
      throw error;
    }
  }

  /**
   * 格式化用户信息为算命分析所需格式
   */
  formatUserInfo(userInfo) {
    const { name, gender, birthDate, birthTime, birthPlace } = userInfo;
    
    return `我的基本信息如下：
姓名：${name}
性别：${gender}
出生日期：${birthDate}
出生时间：${birthTime}
出生地点：${birthPlace}

请根据这些信息进行详细的八字命理分析，包括：
1. 八字排盘和基本信息解读
2. 五行分析和平衡状况
3. 性格特点和天赋才能分析
4. 事业运势和财运分析
5. 感情婚姻运势预测
6. 健康状况和注意事项
7. 人生建议和改善方向

请用专业而温暖的语言为我提供详细的分析和指导，让我能够更好地了解自己的命运和发展方向。`;
  }

  /**
   * 继续对话（追问功能）
   */
  async continueConversation(sessionId, userMessage) {
    try {
      if (!this.isInitialized) {
        throw new Error('AI服务未初始化');
      }

      if (!this.chatSession) {
        throw new Error('找不到有效的对话会话');
      }

      console.log('💬 继续对话中...');

      // 发送用户消息并获取回复
      const result = await this.chatSession.sendMessage(userMessage);
      const response = result.response;
      const responseText = response.text();

      if (!responseText || responseText.trim().length === 0) {
        throw new Error('AI回复为空');
      }

      console.log('✨ AI回复完成');
      return {
        success: true,
        analysis: responseText,
        sessionId: sessionId,
        tokens: {
          input: userMessage.length,
          output: responseText.length
        }
      };
    } catch (error) {
      console.error('❌ 继续对话失败:', error);
      throw error;
    }
  }

  /**
   * 获取会话历史
   */
  async getSessionHistory(sessionId) {
    try {
      if (!this.isInitialized) {
        throw new Error('AI服务未初始化');
      }

      if (!this.chatSession) {
        return [];
      }

      // Gemini的历史记录通过chatSession管理
      // 这里返回基本的会话信息
      return [
        {
          id: sessionId,
          role: 'system',
          content: '会话历史功能正在完善中',
          created_at: Date.now()
        }
      ];
    } catch (error) {
      console.error('❌ 获取历史失败:', error);
      throw error;
    }
  }

  /**
   * 检查服务状态
   */
  isReady() {
    return this.isInitialized && this.genAI && this.model;
  }

  /**
   * 获取使用统计
   */
  getUsageStats() {
    return {
      provider: 'Gemini',
      model: 'gemini-2.5-pro',
      initialized: this.isInitialized,
      hasActiveSession: !!this.chatSession,
      apiKeyStatus: this.apiKey ? 'configured' : 'missing'
    };
  }

  /**
   * 清理资源
   */
  async cleanup() {
    try {
      this.chatSession = null;
      this.model = null;
      this.genAI = null;
      this.apiKey = null;
      this.isInitialized = false;
      console.log('🧹 Gemini服务已清理');
    } catch (error) {
      console.error('❌ 清理失败:', error);
    }
  }
}

// 创建全局实例
const geminiService = new GeminiService();

export default geminiService;
 