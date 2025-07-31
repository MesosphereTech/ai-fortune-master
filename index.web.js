/**
 * AI算命大师 Web版本入口
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Web平台特定配置
if (typeof document !== 'undefined') {
  // 设置页面标题
  document.title = '🔮 AI算命大师 - 专业八字命理分析';
  
  // 添加页面图标
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔮</text></svg>';
  document.head.appendChild(favicon);
  
  // 移动端视口配置
  const viewport = document.createElement('meta');
  viewport.name = 'viewport';
  viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.head.appendChild(viewport);
  
  // 主题色配置
  const themeColor = document.createElement('meta');
  themeColor.name = 'theme-color';
  themeColor.content = '#2C3E50';
  document.head.appendChild(themeColor);
}

// 注册应用
AppRegistry.registerComponent(appName, () => App);

// Web平台启动
if (typeof document !== 'undefined') {
  AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('root'),
  });
}
 