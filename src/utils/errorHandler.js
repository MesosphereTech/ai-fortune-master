/**
 * AI算命大师 - 全局错误处理系统
 * 统一处理网络错误、API错误、用户输入错误等
 */

import performanceOptimizer from './performanceOptimizer';

class ErrorHandler {
  constructor() {
    this.errorTypes = {
      NETWORK_ERROR: 'NETWORK_ERROR',
      API_ERROR: 'API_ERROR',
      VALIDATION_ERROR: 'VALIDATION_ERROR',
      PERMISSION_ERROR: 'PERMISSION_ERROR',
      QUOTA_ERROR: 'QUOTA_ERROR',
      UNKNOWN_ERROR: 'UNKNOWN_ERROR'
    };
    
    this.setupGlobalErrorHandling();
  }

  // 设置全局错误处理
  setupGlobalErrorHandling() {
    // 捕获未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      console.error('未处理的Promise拒绝:', event.reason);
      this.handleError(event.reason, 'UnhandledPromiseRejection');
      event.preventDefault();
    });

    // 捕获全局JavaScript错误
    window.addEventListener('error', (event) => {
      console.error('全局JavaScript错误:', event.error);
      this.handleError(event.error, 'GlobalJavaScriptError');
    });
  }

  // 主要错误处理方法
  handleError(error, context = 'Unknown', userMessage = null) {
    const errorInfo = this.analyzeError(error);
    
    // 记录错误到性能监控
    performanceOptimizer.recordError(error, context);
    
    // 根据错误类型返回适当的用户提示
    const userFriendlyMessage = userMessage || this.getUserFriendlyMessage(errorInfo);
    
    console.group(`🔥 错误处理 [${context}]`);
    console.error('原始错误:', error);
    console.log('错误分析:', errorInfo);
    console.log('用户提示:', userFriendlyMessage);
    console.groupEnd();
    
    return {
      success: false,
      error: errorInfo,
      userMessage: userFriendlyMessage,
      shouldRetry: this.shouldRetry(errorInfo),
      retryDelay: this.getRetryDelay(errorInfo)
    };
  }

  // 分析错误类型和原因
  analyzeError(error) {
    if (!error) {
      return {
        type: this.errorTypes.UNKNOWN_ERROR,
        message: '未知错误',
        code: null
      };
    }

    const message = error.message || error.toString();
    const lowerMessage = message.toLowerCase();

    // 网络相关错误
    if (lowerMessage.includes('network') || 
        lowerMessage.includes('fetch') ||
        lowerMessage.includes('connection') ||
        error.name === 'NetworkError') {
      return {
        type: this.errorTypes.NETWORK_ERROR,
        message: '网络连接异常',
        code: error.code || 'NETWORK_ERROR'
      };
    }

    // API配额错误
    if (lowerMessage.includes('quota') || 
        lowerMessage.includes('rate limit') ||
        lowerMessage.includes('too many requests') ||
        (error.response && error.response.status === 429)) {
      return {
        type: this.errorTypes.QUOTA_ERROR,
        message: 'API使用配额已用完',
        code: error.response?.status || 'QUOTA_EXCEEDED'
      };
    }

    // API权限错误
    if (lowerMessage.includes('unauthorized') || 
        lowerMessage.includes('forbidden') ||
        lowerMessage.includes('invalid api key') ||
        (error.response && [401, 403].includes(error.response.status))) {
      return {
        type: this.errorTypes.PERMISSION_ERROR,
        message: 'API密钥无效或权限不足',
        code: error.response?.status || 'PERMISSION_DENIED'
      };
    }

    // 输入验证错误
    if (lowerMessage.includes('validation') || 
        lowerMessage.includes('invalid input') ||
        lowerMessage.includes('required field')) {
      return {
        type: this.errorTypes.VALIDATION_ERROR,
        message: '输入信息不正确',
        code: 'VALIDATION_FAILED'
      };
    }

    // 通用API错误
    if (error.response || lowerMessage.includes('api')) {
      return {
        type: this.errorTypes.API_ERROR,
        message: 'API服务异常',
        code: error.response?.status || 'API_ERROR'
      };
    }

    // 默认未知错误
    return {
      type: this.errorTypes.UNKNOWN_ERROR,
      message: message || '未知错误',
      code: error.code || 'UNKNOWN'
    };
  }

  // 获取用户友好的错误提示
  getUserFriendlyMessage(errorInfo) {
    switch (errorInfo.type) {
      case this.errorTypes.NETWORK_ERROR:
        return {
          title: '网络连接异常',
          message: '请检查您的网络连接，然后重试',
          action: '重试',
          icon: '📶'
        };

      case this.errorTypes.API_ERROR:
        return {
          title: 'AI服务暂时不可用',
          message: '算命大师正在休息，请稍后再试',
          action: '重试',
          icon: '🔮'
        };

      case this.errorTypes.PERMISSION_ERROR:
        return {
          title: 'API密钥问题',
          message: '请检查您的API密钥是否正确，或联系客服获取帮助',
          action: '重新设置',
          icon: '🔑'
        };

      case this.errorTypes.QUOTA_ERROR:
        return {
          title: 'API使用次数已用完',
          message: '今日免费算命次数已用完，请明天再来或升级到付费版本',
          action: '了解付费版本',
          icon: '📊'
        };

      case this.errorTypes.VALIDATION_ERROR:
        return {
          title: '输入信息有误',
          message: '请检查您输入的信息是否完整和正确',
          action: '重新输入',
          icon: '📝'
        };

      default:
        return {
          title: '出现了一些问题',
          message: '算命大师遇到了一些困难，请稍后重试',
          action: '重试',
          icon: '⚠️'
        };
    }
  }

  // 判断是否应该自动重试
  shouldRetry(errorInfo) {
    switch (errorInfo.type) {
      case this.errorTypes.NETWORK_ERROR:
      case this.errorTypes.API_ERROR:
        return true;
      
      case this.errorTypes.QUOTA_ERROR:
      case this.errorTypes.PERMISSION_ERROR:
      case this.errorTypes.VALIDATION_ERROR:
        return false;
      
      default:
        return false;
    }
  }

  // 获取重试延迟时间（毫秒）
  getRetryDelay(errorInfo) {
    switch (errorInfo.type) {
      case this.errorTypes.NETWORK_ERROR:
        return 2000; // 2秒
      
      case this.errorTypes.API_ERROR:
        return 5000; // 5秒
      
      default:
        return 3000; // 3秒
    }
  }

  // 带重试机制的异步操作包装器
  async withRetry(asyncOperation, maxRetries = 3, context = 'AsyncOperation') {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 尝试执行 [${context}] - 第${attempt}次`);
        const result = await asyncOperation();
        
        if (attempt > 1) {
          console.log(`✅ [${context}] 重试成功`);
        }
        
        return { success: true, data: result };
        
      } catch (error) {
        lastError = error;
        console.warn(`❌ [${context}] 第${attempt}次尝试失败:`, error.message);
        
        const errorInfo = this.analyzeError(error);
        
        // 如果不应该重试，直接返回错误
        if (!this.shouldRetry(errorInfo)) {
          console.log(`🚫 [${context}] 错误类型不支持重试`);
          break;
        }
        
        // 如果不是最后一次尝试，等待后重试
        if (attempt < maxRetries) {
          const delay = this.getRetryDelay(errorInfo);
          console.log(`⏳ [${context}] 等待${delay}ms后重试`);
          await this.sleep(delay);
        }
      }
    }
    
    // 所有重试都失败了，返回错误处理结果
    return this.handleError(lastError, context);
  }

  // 延迟函数
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // AI API专用错误处理
  handleAIError(error, context = 'AI API') {
    // 特殊处理AI相关的错误
    const errorInfo = this.analyzeError(error);
    
    // 如果是配额错误，给出特殊提示
    if (errorInfo.type === this.errorTypes.QUOTA_ERROR) {
      return {
        success: false,
        error: errorInfo,
        userMessage: {
          title: '今日算命次数已用完',
          message: '免费用户每日有使用限制，明天可以继续使用，或升级到付费版本获得无限制服务',
          action: '查看付费方案',
          icon: '🔮'
        },
        shouldRetry: false
      };
    }
    
    // 如果是API密钥问题
    if (errorInfo.type === this.errorTypes.PERMISSION_ERROR) {
      return {
        success: false,
        error: errorInfo,
        userMessage: {
          title: 'API密钥验证失败',
          message: '请检查您的API密钥是否正确。如果您是第一次使用，请按照指南正确设置API密钥',
          action: '重新设置API密钥',
          icon: '🔑'
        },
        shouldRetry: false
      };
    }
    
    return this.handleError(error, context);
  }

  // 网络状态检查
  isOnline() {
    return navigator.onLine;
  }

  // 获取错误统计
  getErrorStats() {
    const errors = performanceOptimizer.getStoredErrors();
    const stats = {
      total: errors.length,
      byType: {},
      recent24h: 0
    };
    
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    errors.forEach(error => {
      // 按类型统计
      const errorType = this.analyzeError({ message: error.message }).type;
      stats.byType[errorType] = (stats.byType[errorType] || 0) + 1;
      
      // 统计24小时内的错误
      if (new Date(error.timestamp).getTime() > oneDayAgo) {
        stats.recent24h++;
      }
    });
    
    return stats;
  }

  // 清除错误记录
  clearErrorHistory() {
    localStorage.removeItem('fortunemaster_errors');
    console.log('🧹 错误记录已清除');
  }
}

// 创建全局错误处理实例
const errorHandler = new ErrorHandler();

export default errorHandler;