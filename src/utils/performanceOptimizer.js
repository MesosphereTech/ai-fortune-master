/**
 * AI算命大师 - 性能优化工具
 * 优化应用启动速度、响应时间和内存使用
 */

class PerformanceOptimizer {
  constructor() {
    this.startTime = Date.now();
    this.metrics = {
      appLaunchTime: 0,
      apiResponseTimes: [],
      memoryUsage: [],
      errorCount: 0
    };
  }

  // 记录应用启动时间
  recordAppLaunch() {
    this.metrics.appLaunchTime = Date.now() - this.startTime;
    console.log(`🚀 应用启动时间: ${this.metrics.appLaunchTime}ms`);
    
    // 如果启动时间超过3秒，记录警告
    if (this.metrics.appLaunchTime > 3000) {
      console.warn('⚠️ 应用启动时间过长，需要优化');
    }
  }

  // 记录API响应时间
  recordAPIResponse(duration, apiName = 'Unknown') {
    this.metrics.apiResponseTimes.push({
      duration,
      apiName,
      timestamp: Date.now()
    });
    
    console.log(`🌐 ${apiName} API响应时间: ${duration}ms`);
    
    // 如果响应时间超过5秒，记录警告
    if (duration > 5000) {
      console.warn(`⚠️ ${apiName} API响应时间过长: ${duration}ms`);
    }
  }

  // 记录内存使用情况
  recordMemoryUsage() {
    if (performance && performance.memory) {
      const memory = {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
        timestamp: Date.now()
      };
      
      this.metrics.memoryUsage.push(memory);
      
      console.log(`💾 内存使用: ${memory.used}MB / ${memory.total}MB`);
      
      // 如果内存使用超过80%，记录警告
      if (memory.used / memory.limit > 0.8) {
        console.warn('⚠️ 内存使用率过高，可能需要优化');
      }
    }
  }

  // 记录错误
  recordError(error, context = 'Unknown') {
    this.metrics.errorCount++;
    console.error(`❌ 错误 #${this.metrics.errorCount} [${context}]:`, error);
    
    // 可以在这里添加错误上报逻辑
    this.reportError(error, context);
  }

  // 错误上报（可扩展为真实的错误报告服务）
  reportError(error, context) {
    // 这里可以集成Firebase Crashlytics或其他错误报告服务
    const errorReport = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // 暂时存储在本地，后续可以批量上报
    const errors = this.getStoredErrors();
    errors.push(errorReport);
    this.storeErrors(errors);
  }

  // 获取存储的错误
  getStoredErrors() {
    try {
      const stored = localStorage.getItem('fortunemaster_errors');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  // 存储错误
  storeErrors(errors) {
    try {
      // 只保留最近的50个错误
      const recentErrors = errors.slice(-50);
      localStorage.setItem('fortunemaster_errors', JSON.stringify(recentErrors));
    } catch (e) {
      console.warn('无法存储错误信息:', e);
    }
  }

  // 图像预加载优化
  preloadImages(imageUrls) {
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  // 防抖函数 - 用于优化频繁调用的函数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 节流函数 - 用于限制函数调用频率
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // 获取性能报告
  getPerformanceReport() {
    const avgApiResponse = this.metrics.apiResponseTimes.length > 0 
      ? this.metrics.apiResponseTimes.reduce((sum, item) => sum + item.duration, 0) / this.metrics.apiResponseTimes.length
      : 0;

    const latestMemory = this.metrics.memoryUsage.length > 0 
      ? this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1]
      : null;

    return {
      appLaunchTime: this.metrics.appLaunchTime,
      averageApiResponseTime: Math.round(avgApiResponse),
      totalApiCalls: this.metrics.apiResponseTimes.length,
      currentMemoryUsage: latestMemory,
      totalErrors: this.metrics.errorCount,
      performanceScore: this.calculatePerformanceScore()
    };
  }

  // 计算性能评分
  calculatePerformanceScore() {
    let score = 100;
    
    // 启动时间评分 (0-30分)
    if (this.metrics.appLaunchTime > 5000) score -= 30;
    else if (this.metrics.appLaunchTime > 3000) score -= 15;
    else if (this.metrics.appLaunchTime > 1000) score -= 5;
    
    // API响应时间评分 (0-30分)
    const avgApiResponse = this.metrics.apiResponseTimes.length > 0 
      ? this.metrics.apiResponseTimes.reduce((sum, item) => sum + item.duration, 0) / this.metrics.apiResponseTimes.length
      : 0;
    
    if (avgApiResponse > 10000) score -= 30;
    else if (avgApiResponse > 5000) score -= 15;
    else if (avgApiResponse > 3000) score -= 5;
    
    // 错误率评分 (0-25分)
    const errorRate = this.metrics.apiResponseTimes.length > 0 
      ? this.metrics.errorCount / this.metrics.apiResponseTimes.length 
      : 0;
    
    if (errorRate > 0.1) score -= 25;
    else if (errorRate > 0.05) score -= 15;
    else if (errorRate > 0.01) score -= 5;
    
    // 内存使用评分 (0-15分)
    const latestMemory = this.metrics.memoryUsage.length > 0 
      ? this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1]
      : null;
    
    if (latestMemory) {
      const memoryUsageRatio = latestMemory.used / latestMemory.limit;
      if (memoryUsageRatio > 0.9) score -= 15;
      else if (memoryUsageRatio > 0.7) score -= 8;
      else if (memoryUsageRatio > 0.5) score -= 3;
    }
    
    return Math.max(0, Math.round(score));
  }

  // 优化建议
  getOptimizationSuggestions() {
    const suggestions = [];
    const report = this.getPerformanceReport();
    
    if (report.appLaunchTime > 3000) {
      suggestions.push({
        type: 'launch',
        priority: 'high',
        message: '应用启动时间过长，建议优化初始化逻辑和减少启动时的同步操作'
      });
    }
    
    if (report.averageApiResponseTime > 5000) {
      suggestions.push({
        type: 'api',
        priority: 'high', 
        message: 'API响应时间过长，建议优化网络请求和添加缓存机制'
      });
    }
    
    if (report.totalErrors > 0) {
      suggestions.push({
        type: 'error',
        priority: 'medium',
        message: `发现${report.totalErrors}个错误，建议检查错误处理逻辑`
      });
    }
    
    if (report.currentMemoryUsage && report.currentMemoryUsage.used / report.currentMemoryUsage.limit > 0.7) {
      suggestions.push({
        type: 'memory',
        priority: 'medium',
        message: '内存使用率较高，建议优化内存管理和清理无用对象'
      });
    }
    
    return suggestions;
  }

  // 开始性能监控
  startMonitoring() {
    // 定期记录内存使用情况
    setInterval(() => {
      this.recordMemoryUsage();
    }, 30000); // 每30秒记录一次
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('📱 应用重新获得焦点');
      } else {
        console.log('📱 应用失去焦点');
      }
    });
    
    // 监听网络状态变化
    window.addEventListener('online', () => {
      console.log('🌐 网络连接恢复');
    });
    
    window.addEventListener('offline', () => {
      console.log('📵 网络连接断开');
    });
    
    console.log('🔍 性能监控已启动');
  }
}

// 创建全局性能监控实例
const performanceOptimizer = new PerformanceOptimizer();

// 自动启动监控
if (typeof window !== 'undefined') {
  performanceOptimizer.startMonitoring();
}

export default performanceOptimizer;