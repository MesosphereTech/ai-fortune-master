/**
 * Gemini API 快速测试脚本
 * 验证API密钥和服务连接
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyD0WA88gjRFXPPHLyvacvKu_wlY8149Slc';

async function testGeminiAPI() {
  try {
    console.log('🔮 开始测试Gemini API...');
    console.log('📱 API密钥:', API_KEY.substring(0, 10) + '...');
    
    // 初始化Gemini AI
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // 获取模型 - 使用Flash版本（更高免费配额）
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "你是一个专业的中国传统八字命理研究专家。",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 20,
        maxOutputTokens: 800,
      }
    });

    console.log('✅ Gemini AI 初始化成功');

    // 发送测试消息
    console.log('📤 发送测试消息...');
    const result = await model.generateContent("你好，请简单介绍一下你自己，以及你能为用户提供什么算命服务？");
    
    const response = result.response;
    const text = response.text();

    console.log('📥 AI回复成功！');
    console.log('🔮 AI算命大师回复:');
    console.log('─'.repeat(50));
    console.log(text);
    console.log('─'.repeat(50));
    
    // 测试算命功能
    console.log('\n🎯 测试算命分析功能...');
    
    // 等待2秒避免API速率限制
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const fortuneResult = await model.generateContent(
      "请简单分析一下1990年5月15日上午8点出生的男性的性格特点，100字以内。"
    );
    
    const fortuneResponse = fortuneResult.response;
    const fortuneText = fortuneResponse.text();
    
    console.log('🎉 算命分析测试成功！');
    console.log('📊 分析结果预览:');
    console.log('─'.repeat(50));
    console.log(fortuneText.substring(0, 200) + '...');
    console.log('─'.repeat(50));
    
    console.log('\n✅ 所有测试通过！');
    console.log('🚀 您的Gemini API密钥工作正常，可以开始使用AI算命大师了！');
    
    return {
      success: true,
      message: 'Gemini API测试成功',
      responseLength: text.length,
      fortuneLength: fortuneText.length
    };
    
  } catch (error) {
    console.error('❌ Gemini API测试失败:');
    console.error('错误详情:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('💡 解决方案: 请检查API密钥是否正确');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.error('💡 解决方案: 请检查API密钥权限或账户状态');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      console.error('💡 解决方案: API配额已用完，请等待重置或升级账户');
    } else {
      console.error('💡 解决方案: 请检查网络连接和API密钥格式');
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行测试
if (require.main === module) {
  testGeminiAPI()
    .then(result => {
      if (result.success) {
        console.log('\n🎊 测试完成！准备启动您的AI算命大师应用！');
        process.exit(0);
      } else {
        console.log('\n❌ 测试失败，请检查配置后重试。');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ 测试脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = { testGeminiAPI };
 