@echo off
echo 🚀 AI算命大师 - GitHub一键部署脚本
echo ================================================

echo.
echo 📋 第一步：检查Git环境
echo ================================================
git --version
if %errorlevel% neq 0 (
    echo ❌ Git未安装，请先安装Git
    echo 下载地址：https://git-scm.com/download/win
    pause
    exit /b 1
) else (
    echo ✅ Git环境正常
)

echo.
echo 📁 第二步：初始化Git仓库
echo ================================================
if not exist .git (
    echo 正在初始化Git仓库...
    git init
    echo ✅ Git仓库初始化完成
) else (
    echo ✅ Git仓库已存在
)

echo.
echo 📝 第三步：创建.gitignore文件
echo ================================================
if not exist .gitignore (
    echo 正在创建.gitignore文件...
    (
        echo # 依赖包
        echo node_modules/
        echo npm-debug.log*
        echo yarn-debug.log*
        echo yarn-error.log*
        echo.
        echo # 构建输出
        echo /build/
        echo /dist/
        echo /android/app/build/
        echo /ios/build/
        echo.
        echo # 系统文件
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # IDE文件
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo.
        echo # 密钥文件
        echo *.keystore
        echo *.p12
        echo *.key
        echo *.pem
        echo.
        echo # 日志文件
        echo *.log
        echo logs/
        echo.
        echo # 临时文件
        echo tmp/
        echo temp/
        echo .cache/
    ) > .gitignore
    echo ✅ .gitignore文件创建完成
) else (
    echo ✅ .gitignore文件已存在
)

echo.
echo 📦 第四步：添加文件到Git
echo ================================================
echo 正在添加所有文件...
git add .
echo ✅ 文件添加完成

echo.
echo 💾 第五步：提交代码
echo ================================================
echo 正在提交代码...
git commit -m "🔮 AI算命大师 - 初始版本，ready for APK构建"
if %errorlevel% equ 0 (
    echo ✅ 代码提交成功
) else (
    echo ⚠️ 可能没有新的更改需要提交
)

echo.
echo 🌐 第六步：连接GitHub仓库
echo ================================================
echo.
echo 📋 请按照以下步骤操作：
echo.
echo 1. 访问 https://github.com
echo 2. 点击右上角的 "+" 号
echo 3. 选择 "New repository"
echo 4. 仓库名称建议：ai-fortune-master
echo 5. 描述：AI算命大师 - 专业中国传统八字命理分析应用
echo 6. 选择 "Public" （免费GitHub Actions）
echo 7. 不要勾选 "Initialize this repository with..."
echo 8. 点击 "Create repository"
echo.
echo 📝 创建完成后，复制仓库URL（例如：https://github.com/username/ai-fortune-master.git）

echo.
set /p repo_url="请输入您的GitHub仓库URL: "

if "%repo_url%"=="" (
    echo ❌ 未输入仓库URL，脚本退出
    pause
    exit /b 1
)

echo.
echo 🔗 第七步：添加远程仓库
echo ================================================
echo 正在添加远程仓库：%repo_url%
git remote add origin %repo_url%
if %errorlevel% equ 0 (
    echo ✅ 远程仓库添加成功
) else (
    echo ⚠️ 远程仓库可能已存在，正在更新...
    git remote set-url origin %repo_url%
)

echo.
echo 🚀 第八步：推送代码到GitHub
echo ================================================
echo 正在推送代码...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo ✅ 代码推送成功！
) else (
    echo ❌ 推送失败，请检查：
    echo   1. GitHub仓库URL是否正确
    echo   2. 是否有GitHub账户权限
    echo   3. 网络连接是否正常
    pause
    exit /b 1
)

echo.
echo 🎉 部署完成！
echo ================================================
echo ✅ 您的AI算命大师代码已成功上传到GitHub！
echo.
echo 🚀 下一步：启动自动APK构建
echo ================================================
echo 1. 访问您的GitHub仓库：%repo_url%
echo 2. 点击 "Actions" 标签
echo 3. 如果看到 "Build Android APK" 工作流，点击它
echo 4. 点击 "Run workflow" 按钮
echo 5. 等待15分钟左右构建完成
echo 6. 在 "Artifacts" 部分下载APK文件
echo.
echo 💡 提示：
echo - 第一次构建可能需要更长时间
echo - 构建成功后您将获得可安装的APK文件
echo - 同时会生成适用于Google Play的AAB文件
echo.
echo 🔮 恭喜！您的AI算命大师即将变成真正的Android应用！
echo.
pause