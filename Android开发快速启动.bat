@echo off
echo 🚀 AI算命大师 - Android开发环境快速配置
echo ================================================

echo.
echo 📋 第一步：检查环境
echo ================================================
echo 正在检查Java环境...
java -version
if %errorlevel% neq 0 (
    echo ❌ Java未安装，正在安装...
    choco install openjdk17 -y
) else (
    echo ✅ Java环境正常
)

echo.
echo 正在检查Node.js环境...
node -v
if %errorlevel% neq 0 (
    echo ❌ Node.js未安装，请先安装Node.js
    pause
    exit /b 1
) else (
    echo ✅ Node.js环境正常
)

echo.
echo 📱 第二步：配置Android环境
echo ================================================
if not exist "%ANDROID_HOME%" (
    echo ❌ Android SDK未配置
    echo 请按照以下步骤操作：
    echo 1. 安装Android Studio
    echo 2. 配置ANDROID_HOME环境变量
    echo 3. 重新运行此脚本
    pause
    exit /b 1
) else (
    echo ✅ Android SDK已配置: %ANDROID_HOME%
)

echo.
echo 🔧 第三步：安装项目依赖
echo ================================================
echo 安装npm依赖...
call npm install

echo.
echo 🛠️ 第四步：生成签名密钥
echo ================================================
if not exist "android\app\fortune-master-key.keystore" (
    echo 正在生成签名密钥...
    keytool -genkey -v -keystore android\app\fortune-master-key.keystore -alias fortune-master -keyalg RSA -keysize 2048 -validity 10000
    echo ✅ 签名密钥生成完成
) else (
    echo ✅ 签名密钥已存在
)

echo.
echo 📦 第五步：构建APK
echo ================================================
echo 清理之前的构建...
cd android
call gradlew clean

echo 构建Release APK...
call gradlew assembleRelease

echo 构建AAB文件 (Google Play)...
call gradlew bundleRelease

cd ..

echo.
echo 🎉 Android构建完成！
echo ================================================
echo APK文件位置: android\app\build\outputs\apk\release\
echo AAB文件位置: android\app\build\outputs\bundle\release\
echo.
echo 🚀 下一步：
echo 1. 测试APK在真机上的运行
echo 2. 准备Google Play商店素材
echo 3. 注册Google Play开发者账户
echo.
pause