# Script PowerShell pour sauvegarder le projet sur GitHub
Write-Host "🚀 Sauvegarde du projet Academia Hub Desktop..." -ForegroundColor Green

# Vérifier l'état du dépôt
Write-Host "📊 Vérification de l'état du dépôt..." -ForegroundColor Yellow
& git status

# Ajouter tous les fichiers
Write-Host "📁 Ajout de tous les fichiers..." -ForegroundColor Yellow
& git add .

# Créer un commit avec la date actuelle
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
& git commit -m "Sauvegarde automatique - $date"

# Vérifier si le dépôt distant existe
$remoteExists = & git remote | Where-Object { $_ -eq "origin" }
if (-not $remoteExists) {
    Write-Host "🔗 Ajout du dépôt distant..." -ForegroundColor Yellow
    & git remote add origin https://github.com/SenaDev007/Academia-Hub-Desktop.git
}

# Pousser les changements
Write-Host "🚀 Envoi des changements vers GitHub..." -ForegroundColor Yellow
& git push -u origin main

Write-Host "✅ Sauvegarde terminée avec succès !" -ForegroundColor Green

# Pause pour voir les résultats
Read-Host "Appuyez sur Entrée pour continuer..."
