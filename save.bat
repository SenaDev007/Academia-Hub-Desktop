@echo off
echo Sauvegarde du projet Academia Hub Desktop...

REM Vérifier si Git est installé
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Git n'est pas installé ou non accessible dans PATH
    pause
    exit /b 1
)

REM Initialiser le dépôt Git si nécessaire
if not exist .git (
    echo Initialisation du dépôt Git...
    git init
)

REM Ajouter tous les fichiers
echo Ajout de tous les fichiers...
git add .

REM Créer un commit avec la date actuelle
set "datestr=%date% %time%"
git commit -m "Sauvegarde automatique - %datestr%"

REM Vérifier si le dépôt distant existe
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo Ajout du dépôt distant...
    git remote add origin https://github.com/SenaDev007/Academia-Hub-Desktop.git
)

REM Pousser les changements
echo Envoi des changements vers GitHub...
git push -u origin main

echo Sauvegarde terminée !
pause
