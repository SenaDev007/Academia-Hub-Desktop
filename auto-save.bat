@echo off
title Sauvegarde Academia Hub Desktop
echo =====================================
echo  📦 Sauvegarde du projet Academia Hub
echo =====================================

REM Se placer dans le bon répertoire
cd /d "%~dp0"

REM Vérifier si Git est disponible
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git n'est pas installé ou non accessible
    echo 📥 Téléchargez Git depuis: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Initialiser le dépôt Git si nécessaire
if not exist .git (
    echo 🔧 Initialisation du dépôt Git...
    git init
    git branch -M main
)

REM Configurer l'utilisateur Git (ajustez selon vos besoins)
git config user.name "SenaDev007"
git config user.email "votre-email@example.com"

REM Ajouter le dépôt distant si nécessaire
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔗 Configuration du dépôt distant...
    git remote add origin https://github.com/SenaDev007/Academia-Hub-Desktop.git
)

REM Ajouter tous les fichiers
echo 📁 Ajout des fichiers...
git add .

REM Créer un commit avec la date actuelle
set "datetime=%date% %time%"
git commit -m "Sauvegarde automatique - %datetime%"

REM Pousser vers GitHub
echo 🚀 Envoi vers GitHub...
git push -u origin main

if %errorlevel% neq 0 (
    echo ⚠️ Erreur lors du push. Tentative avec force...
    git push -f origin main
)

echo ✅ Sauvegarde terminée avec succès !
echo 🌐 Vérifiez votre dépôt: https://github.com/SenaDev007/Academia-Hub-Desktop
echo.
pause
