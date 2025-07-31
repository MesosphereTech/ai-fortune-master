@echo off
chcp 65001 >nul
echo 🚀 AI Fortune Master - GitHub One-Click Deploy Script
echo ================================================

echo.
echo 📋 Step 1: Check Git Environment
echo ================================================
git --version
if %errorlevel% neq 0 (
    echo ❌ Git not installed, please install Git first
    echo Download: https://git-scm.com/download/win
    pause
    exit /b 1
) else (
    echo ✅ Git environment OK
)

echo.
echo 📁 Step 2: Initialize Git Repository
echo ================================================
if not exist .git (
    echo Initializing Git repository...
    git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

echo.
echo 📝 Step 3: Create .gitignore file
echo ================================================
if not exist .gitignore (
    echo Creating .gitignore file...
    (
        echo # Dependencies
        echo node_modules/
        echo npm-debug.log*
        echo yarn-debug.log*
        echo yarn-error.log*
        echo.
        echo # Build outputs
        echo /build/
        echo /dist/
        echo /android/app/build/
        echo /ios/build/
        echo.
        echo # System files
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # IDE files
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo.
        echo # Key files
        echo *.keystore
        echo *.p12
        echo *.key
        echo *.pem
        echo.
        echo # Log files
        echo *.log
        echo logs/
        echo.
        echo # Temp files
        echo tmp/
        echo temp/
        echo .cache/
    ) > .gitignore
    echo ✅ .gitignore file created
) else (
    echo ✅ .gitignore file already exists
)

echo.
echo 📦 Step 4: Add files to Git
echo ================================================
echo Adding all files...
git add .
echo ✅ Files added successfully

echo.
echo 💾 Step 5: Commit code
echo ================================================
echo Committing code...
git commit -m "🔮 AI Fortune Master - Initial version, ready for APK build"
if %errorlevel% equ 0 (
    echo ✅ Code committed successfully
) else (
    echo ⚠️ No new changes to commit
)

echo.
echo 🌐 Step 6: Connect to GitHub Repository
echo ================================================
echo.
echo 📋 Please follow these steps:
echo.
echo 1. Visit https://github.com
echo 2. Click the "+" button in the top right corner
echo 3. Select "New repository"
echo 4. Repository name suggestion: ai-fortune-master
echo 5. Description: AI Fortune Master - Professional Chinese Traditional Bazi Fortune Analysis App
echo 6. Select "Public" (for free GitHub Actions)
echo 7. Do NOT check "Initialize this repository with..."
echo 8. Click "Create repository"
echo.
echo 📝 After creation, copy the repository URL (example: https://github.com/username/ai-fortune-master.git)

echo.
set /p repo_url="Please enter your GitHub repository URL: "

if "%repo_url%"=="" (
    echo ❌ No repository URL entered, script exit
    pause
    exit /b 1
)

echo.
echo 🔗 Step 7: Add remote repository
echo ================================================
echo Adding remote repository: %repo_url%
git remote add origin %repo_url%
if %errorlevel% equ 0 (
    echo ✅ Remote repository added successfully
) else (
    echo ⚠️ Remote repository may already exist, updating...
    git remote set-url origin %repo_url%
)

echo.
echo 🚀 Step 8: Push code to GitHub
echo ================================================
echo Pushing code...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo ✅ Code pushed successfully!
) else (
    echo ❌ Push failed, please check:
    echo   1. GitHub repository URL is correct
    echo   2. You have GitHub account permissions
    echo   3. Network connection is normal
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment Complete!
echo ================================================
echo ✅ Your AI Fortune Master code has been successfully uploaded to GitHub!
echo.
echo 🚀 Next Step: Start Automatic APK Build
echo ================================================
echo 1. Visit your GitHub repository: %repo_url%
echo 2. Click the "Actions" tab
echo 3. If you see "Build Android APK" workflow, click it
echo 4. Click "Run workflow" button
echo 5. Wait about 15 minutes for build completion
echo 6. Download APK file from "Artifacts" section
echo.
echo 💡 Tips:
echo - First build may take longer
echo - Upon successful build you will get installable APK file
echo - Also generates AAB file suitable for Google Play
echo.
echo 🔮 Congratulations! Your AI Fortune Master is about to become a real Android app!
echo.
pause