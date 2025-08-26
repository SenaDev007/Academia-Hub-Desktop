@echo off
title Sauvegarde Academia Hub Desktop
cd /d "%~dp0"

echo 🚀 Sauvegarde du projet en cours...

REM Configuration Git
git config user.name "SenaDev007"
git config user.email "sena@example.com"

REM Ajouter tous les fichiers
git add .

REM Créer un commit avec la date actuelle
set "datestr=%date% %time%"
git commit -m "Sauvegarde auto - %datestr%"

REM Pousser vers GitHub
git remote set-url origin https://github.com/SenaDev007/Academia-Hub-Desktop.git
git push -f origin main

echo ✅ Projet sauvegardé avec succès !
echo 🌐 Vérifiez: https://github.com/SenaDev007/Academia-Hub-Desktop
pause
