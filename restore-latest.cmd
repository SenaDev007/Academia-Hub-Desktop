@echo off
title Restauration Academia Hub Desktop
color 0A

echo =========================================
echo  🔄 RESTAURATION DEPUIS GITHUB
echo =========================================

cd /d "%~dp0"

echo 📥 Restauration de la dernière version...
echo.

REM Sauvegarder les modifications locales si nécessaire
echo 💾 Sauvegarde des modifications locales...
git stash save "Sauvegarde locale avant restauration"

REM Récupérer la dernière version depuis GitHub
echo 🌐 Récupération depuis GitHub...
git fetch origin

REM Restaurer la dernière version
echo 🔧 Restauration de la dernière version...
git reset --hard origin/main
git clean -fd

REM Nettoyer le stash
git stash drop

echo.
echo ✅ RESTAURATION TERMINÉE !
echo 📂 Dossier: %cd%
echo 🌐 Dépôt: https://github.com/SenaDev007/Academia-Hub-Desktop
echo.
pause
