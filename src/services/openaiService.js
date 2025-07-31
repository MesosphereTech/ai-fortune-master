/**
 * OpenAI AI算命大师服务
 * 专业的中国传统八字命理分析AI服务
 */

import OpenAI from 'openai';

// AI算命大师的专业提示词（基于您提供的完整提示词）
const FORTUNE_MASTER_PROMPT = `你现在是一个中国传统八字命理的专业研究人员，你熟读《三命通会》《滴天髓》《渊海子平》《穷通宝鉴》《子平真诠》《神峰通考》《麻衣相法》《冰鉴》《柳庄相法》《梦林玄解》《周公解梦》《敦煌解梦书》《协纪辨方书》《玉匣记》《阳宅三要》《通天宝鉴》《梅花易数》《焦氏易林》《皇极经世》《解梦密要》《御定星历考原》《中西星命图说》这些书籍。

你会看星座、星象、面相、手相、更是会看紫薇星盘的大师。

根据"排大运分阳年、阴年。阳年：甲丙戊庚壬。阴年：乙丁己辛癸。阳年男，阴年女为顺排，阴年女，阳年男为逆排。具体排法以月干支为基准，进行顺逆。小孩交大运前，以月柱干支为大运十天干：甲乙丙丁戊己庚辛壬癸，十二地支：子丑寅卯辰巳午未申酉戌亥。"的传统理论，请你以一个专业四柱八字研究者的角色，根据以上我所提到的书籍，及相关四柱八字的书籍和经验，告诉我提供的八字以及对我提供的八字进行详细分析。

请用专业、易懂、有建设性的语言进行回复，分析要全面深入，包括：
1. 基本八字信息解读
2. 五行分析和平衡状况
3. 性格特点和天赋才能
4. 事业财运分析
5. 感情婚姻运势
6. 健康状况分析
7. 人生建议和改善方向

回复要有温度，既要专业准确，也要给人希望和指导。`;

class OpenAIService {
  constructor() {
    this.client = null;
    this.assistant = null;
    this.isInitialized = false;
  }

  /**
   * 初始化OpenAI客户端
   */
  async initialize(apiKey) {
    try {
      if (!apiKey) {
        throw new Error('OpenAI API密钥未提供');
      }

      this.client = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // React Native环境需要
      });

      // 测试连接
      await this.testConnection();
      
      // 创建或获取算命大师Assistant
      await this.setupFortuneAssistant();
      
      this.isInitialized = true;
      console.log('✅ OpenAI服务初始化成功');
      
      return { success: true, message: 'AI算命大师已就绪' };
    } catch (error) {
      console.error('❌ OpenAI初始化失败:', error);
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
      const response = await this.client.models.list();
      console.log('🔗 OpenAI连接测试成功');
      return true;
    } catch (error) {
      throw new Error(`API连接失败: ${error.message}`);
    }
  }

  /**
   * 创建算命大师Assistant
   */
  async setupFortuneAssistant() {
    try {
      // 创建专门的算命助手
      this.assistant = await this.client.beta.assistants.create({
        name: "AI算命大师",
        instructions: FORTUNE_MASTER_PROMPT,
        model: "gpt-4-turbo-preview",
        tools: [
          {
            type: "code_interpreter"
          }
        ],
        metadata: {
          type: "fortune_teller",
          version: "1.0",
          created_by: "AI算命大师团队"
        }
      });

      console.log(`✨ 算命大师Assistant创建成功: ${this.assistant.id}`);
      return this.assistant;
    } catch (error) {
      throw new Error(`Assistant创建失败: ${error.message}`);
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

      const thread = await this.client.beta.threads.create({
        metadata: {
          type: "fortune_telling",
          created_at: new Date().toISOString()
        }
      });

      console.log(`🆕 算命会话创建成功: ${thread.id}`);
      return {
        sessionId: thread.id,
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
      
      // 发送消息到会话
      await this.client.beta.threads.messages.create(sessionId, {
        role: "user",
        content: userMessage
      });

      // 运行Assistant分析
      const run = await this.client.beta.threads.runs.create(sessionId, {
        assistant_id: this.assistant.id,
        instructions: "请根据用户提供的信息进行专业的八字命理分析。"
      });

      console.log(`🔮 AI分析开始: ${run.id}`);
      return await this.waitForRunCompletion(sessionId, run.id);
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
1. 八字排盘
2. 五行分析
3. 性格特点
4. 事业运势
5. 财运分析
6. 感情运势
7. 健康状况
8. 人生建议

请用专业而温暖的语言为我提供详细的分析和指导。`;
  }

  /**
   * 等待AI分析完成
   */
  async waitForRunCompletion(sessionId, runId, maxAttempts = 30) {
    try {
      let attempts = 0;
      
      while (attempts < maxAttempts) {
        const run = await this.client.beta.threads.runs.retrieve(sessionId, runId);
        
        console.log(`🔄 AI分析状态: ${run.status} (${attempts + 1}/${maxAttempts})`);
        
        if (run.status === 'completed') {
          // 获取AI的回复
          const messages = await this.client.beta.threads.messages.list(sessionId);
          const assistantMessage = messages.data.find(
            msg => msg.role === 'assistant' && msg.run_id === runId
          );
          
          if (assistantMessage) {
            const content = assistantMessage.content[0]?.text?.value || '';
            console.log('✨ AI分析完成');
            return {
              success: true,
              analysis: content,
              sessionId: sessionId,
              runId: runId
            };
          }
        } else if (run.status === 'failed' || run.status === 'cancelled') {
          throw new Error(`AI分析失败: ${run.status}`);
        }
        
        // 等待2秒后重试
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
      }
      
      throw new Error('AI分析超时');
    } catch (error) {
      console.error('❌ 等待分析完成失败:', error);
      throw error;
    }
  }

  /**
   * 继续对话（追问功能）
   */
  async continueConversation(sessionId, userMessage) {
    try {
      if (!this.isInitialized) {
        throw new Error('AI服务未初始化');
      }

      // 添加用户消息
      await this.client.beta.threads.messages.create(sessionId, {
        role: "user",
        content: userMessage
      });

      // 运行Assistant
      const run = await this.client.beta.threads.runs.create(sessionId, {
        assistant_id: this.assistant.id
      });

      return await this.waitForRunCompletion(sessionId, run.id);
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

      const messages = await this.client.beta.threads.messages.list(sessionId);
      
      return messages.data.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content[0]?.text?.value || '',
        created_at: msg.created_at
      }));
    } catch (error) {
      console.error('❌ 获取历史失败:', error);
      throw error;
    }
  }

  /**
   * 检查服务状态
   */
  isReady() {
    return this.isInitialized && this.client && this.assistant;
  }

  /**
   * 清理资源
   */
  async cleanup() {
    try {
      // 这里可以添加清理逻辑，比如删除临时Assistant等
      this.client = null;
      this.assistant = null;
      this.isInitialized = false;
      console.log('🧹 OpenAI服务已清理');
    } catch (error) {
      console.error('❌ 清理失败:', error);
    }
  }
}

// 创建全局实例
const openaiService = new OpenAIService();

export default openaiService;
 