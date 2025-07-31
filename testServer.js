/**
 * AI算命大师 - 快速测试服务器
 * 用于立即测试AI功能和界面
 */

const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 8080;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// 主页HTML
const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔮 AI算命大师 - 专业八字命理分析</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%);
            min-height: 100vh;
            color: white;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .title {
            font-size: 2.5em;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #E74C3C, #F39C12);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .chat-container {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
        }
        
        .messages {
            height: 400px;
            overflow-y: auto;
            margin-bottom: 20px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
        }
        
        .message {
            margin-bottom: 15px;
            padding: 12px;
            border-radius: 10px;
            max-width: 80%;
        }
        
        .user-message {
            background: linear-gradient(135deg, #3498DB, #2980B9);
            margin-left: auto;
            text-align: right;
        }
        
        .ai-message {
            background: linear-gradient(135deg, #E74C3C, #C0392B);
            margin-right: auto;
        }
        
        .input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .input-field {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            font-size: 16px;
        }
        
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            background: linear-gradient(135deg, #E74C3C, #C0392B);
            color: white;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
        }
        
        .api-setup {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
        }
        
        .setup-title {
            font-size: 1.5em;
            margin-bottom: 15px;
            color: #F39C12;
        }
        
        .loading {
            text-align: center;
            padding: 20px;
            font-style: italic;
            color: #BDC3C7;
        }
        
        .gender-buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .gender-btn {
            flex: 1;
            padding: 10px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            background: transparent;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .gender-btn.active {
            background: linear-gradient(135deg, #E74C3C, #C0392B);
            border-color: #E74C3C;
        }
        
        .status {
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .status.success {
            background: rgba(46, 204, 113, 0.2);
            border: 1px solid #2ECC71;
        }
        
        .status.error {
            background: rgba(231, 76, 60, 0.2);
            border: 1px solid #E74C3C;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">🔮 AI算命大师</h1>
            <p>专业中国传统八字命理分析系统</p>
        </div>
        
        <div class="api-setup">
            <h2 class="setup-title">🔑 API密钥设置</h2>
            <div class="input-group">
                <input type="text" id="apiKey" class="input-field" placeholder="请输入您的Gemini API密钥 (AIza...)" value="AIzaSyD0WA88gjRFXPPHLyvacvKu_wlY8149Slc">
                <button onclick="setupAPI()" class="btn">连接AI大师</button>
            </div>
            <div id="apiStatus"></div>
        </div>
        
        <div class="chat-container">
            <h2 class="setup-title">💬 与AI算命大师对话</h2>
            <div id="messages" class="messages">
                <div class="message ai-message">
                    🔮 欢迎来到AI算命大师！我将为您提供专业的中国传统八字命理分析。<br><br>
                    首先，请设置您的API密钥，然后我们开始您的算命之旅！
                </div>
            </div>
            
            <div id="inputArea">
                <div class="input-group">
                    <input type="text" id="messageInput" class="input-field" placeholder="请输入您的消息..." disabled>
                    <button onclick="sendMessage()" id="sendBtn" class="btn" disabled>发送</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        let isAPIConnected = false;
        let currentStep = 'name'; // name, gender, birthDate, birthTime, birthPlace, analysis
        let userInfo = {};
        
        async function setupAPI() {
            const apiKey = document.getElementById('apiKey').value.trim();
            const statusDiv = document.getElementById('apiStatus');
            
            if (!apiKey) {
                statusDiv.innerHTML = '<div class="status error">❌ 请输入API密钥</div>';
                return;
            }
            
            if (!apiKey.startsWith('AIza')) {
                statusDiv.innerHTML = '<div class="status error">❌ API密钥格式不正确，应以AIza开头</div>';
                return;
            }
            
            statusDiv.innerHTML = '<div class="loading">🔄 正在连接AI大师...</div>';
            
            try {
                const response = await fetch('/api/test-connection', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ apiKey })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    isAPIConnected = true;
                    statusDiv.innerHTML = '<div class="status success">✅ AI算命大师连接成功！</div>';
                    document.getElementById('messageInput').disabled = false;
                    document.getElementById('sendBtn').disabled = false;
                    
                    addAIMessage('🎉 太好了！AI算命大师已经准备就绪。现在，让我们开始您的专业八字分析！\\n\\n请告诉我您的姓名：');
                } else {
                    statusDiv.innerHTML = \`<div class="status error">❌ 连接失败：\${result.error}</div>\`;
                }
            } catch (error) {
                statusDiv.innerHTML = \`<div class="status error">❌ 连接错误：\${error.message}</div>\`;
            }
        }
        
        async function sendMessage() {
            if (!isAPIConnected) {
                alert('请先设置API密钥！');
                return;
            }
            
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            addUserMessage(message);
            input.value = '';
            
            // 处理用户信息收集
            await handleUserInput(message);
        }
        
        async function handleUserInput(message) {
            switch (currentStep) {
                case 'name':
                    userInfo.name = message;
                    currentStep = 'gender';
                    addAIMessage(\`很高兴认识您，\${userInfo.name}！现在请选择您的性别：\`);
                    addGenderButtons();
                    break;
                    
                case 'birthDate':
                    userInfo.birthDate = message;
                    currentStep = 'birthTime';
                    addAIMessage('请告诉我您的出生时间（如：上午8点30分）：');
                    break;
                    
                case 'birthTime':
                    userInfo.birthTime = message;
                    currentStep = 'birthPlace';
                    addAIMessage('最后，请告诉我您的出生地点（如：北京市）：');
                    break;
                    
                case 'birthPlace':
                    userInfo.birthPlace = message;
                    currentStep = 'analysis';
                    await performAnalysis();
                    break;
                    
                case 'analysis':
                    await askAI(message);
                    break;
            }
        }
        
        function addGenderButtons() {
            const messagesDiv = document.getElementById('messages');
            const buttonDiv = document.createElement('div');
            buttonDiv.className = 'message ai-message';
            buttonDiv.innerHTML = \`
                <div class="gender-buttons">
                    <button class="gender-btn" onclick="selectGender('男')">👨 男</button>
                    <button class="gender-btn" onclick="selectGender('女')">👩 女</button>
                </div>
            \`;
            messagesDiv.appendChild(buttonDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        function selectGender(gender) {
            userInfo.gender = gender;
            addUserMessage(\`性别：\${gender}\`);
            currentStep = 'birthDate';
            addAIMessage('请告诉我您的出生日期（如：1990年5月15日）：');
        }
        
        async function performAnalysis() {
            addAIMessage('🔮 正在为您进行专业八字分析，请稍候...');
            
            const analysisPrompt = \`请为\${userInfo.name}进行详细八字分析：
出生日期：\${userInfo.birthDate}
出生时间：\${userInfo.birthTime}
性别：\${userInfo.gender}
出生地点：\${userInfo.birthPlace}\`;
            
            await askAI(analysisPrompt);
            
            addAIMessage('✨ 分析完成！您可以继续向我提问，比如："我的事业运势如何？"、"什么时候适合结婚？"等等。');
        }
        
        async function askAI(message) {
            try {
                const response = await fetch('/api/fortune-telling', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        message,
                        apiKey: document.getElementById('apiKey').value,
                        userInfo
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    addAIMessage(result.response);
                } else {
                    addAIMessage(\`❌ 抱歉，分析过程中出现了问题：\${result.error}\`);
                }
            } catch (error) {
                addAIMessage(\`❌ 网络错误：\${error.message}\`);
            }
        }
        
        function addUserMessage(message) {
            const messagesDiv = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user-message';
            messageDiv.textContent = message;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        function addAIMessage(message) {
            const messagesDiv = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ai-message';
            messageDiv.innerHTML = message.replace(/\\n/g, '<br>');
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        // 回车发送
        document.getElementById('messageInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
</body>
</html>
`;

// 主页路由
app.get('/', (req, res) => {
    res.send(htmlContent);
});

// 测试API连接
app.post('/api/test-connection', async (req, res) => {
    try {
        const { apiKey } = req.body;
        
        if (!apiKey) {
            return res.json({ success: false, error: 'API密钥不能为空' });
        }
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "请简单回复'连接成功'四个字。",
        });
        
        const result = await model.generateContent("测试连接");
        const response = await result.response;
        
        res.json({ 
            success: true, 
            message: '连接成功',
            response: response.text()
        });
    } catch (error) {
        console.error('API连接测试失败:', error);
        res.json({ 
            success: false, 
            error: error.message || '连接失败'
        });
    }
});

// 算命分析API
app.post('/api/fortune-telling', async (req, res) => {
    try {
        const { message, apiKey, userInfo } = req.body;
        
        if (!apiKey) {
            return res.json({ success: false, error: 'API密钥不能为空' });
        }
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: FORTUNE_MASTER_SYSTEM_PROMPT,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE",
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE",
                },
            ],
        });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        
        res.json({ 
            success: true, 
            response: response.text()
        });
    } catch (error) {
        console.error('算命分析失败:', error);
        res.json({ 
            success: false, 
            error: error.message || '分析失败'
        });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🔮 AI算命大师测试服务器启动成功！`);
    console.log(`🌐 访问地址: http://localhost:${PORT}`);
    console.log(`🧪 准备开始专业测试...`);
});

module.exports = app;