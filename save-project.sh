#!/bin/bash

echo "🚀 Sauvegarde du projet Academia Hub Desktop..."

# Vérifier l'état du dépôt
echo "📊 Vérification de l'état du dépôt..."
git status

# Ajouter tous les fichiers
echo "📁 Ajout de tous les fichiers..."
git add .

# Créer un commit avec la date actuelle
echo "💾 Création du commit..."
git commit -m "Sauvegarde automatique - $(date '+%Y-%m-%d %H:%M:%S')"

# Vérifier si le dépôt distant existe
if ! git remote | grep -q "origin"; then
    echo "🔗 Ajout du dépôt distant..."
    git remote add origin https://github.com/SenaDev007/Academia-Hub-Desktop.git
fi

# Pousser les changements
echo "🚀 Envoi des changements vers GitHub..."
git push -u origin main

echo "✅ Sauvegarde terminée avec succès !"
