@echo off
title Restauration Academia Hub Desktop
echo =========================================
echo  🔄 Restauration de la dernière version
echo =========================================

REM Se placer dans le bon répertoire
cd /d "%~dp0"

echo 📥 Restauration depuis GitHub en cours...

REM Vérifier si Git est installé
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git n'est pas installé
    pause
    exit /b 1
)

REM Vérifier si c'est un dépôt Git
if exist .git (
    echo 🔄 Mise à jour depuis le dépôt distant...
    git fetch origin
    git reset --hard origin/main
    git clean -fd
) else (
    echo 📦 Clonage du dépôt depuis GitHub...
    cd /d "%~dp0\.."
    rmdir /s /q "Academia Hub Desktop" 2>nul
    git clone https://github.com/SenaDev007/Academia-Hub-Desktop.git "Academia Hub Desktop"
    cd "Academia Hub Desktop"
)

echo ✅ Restauration terminée avec succès !
echo 🌐 Dépôt: https://github.com/SenaDev007/Academia-Hub-Desktop
echo.
pause
