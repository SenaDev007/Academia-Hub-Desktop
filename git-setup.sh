#!/bin/bash

# Vérifier si le répertoire est un dépôt Git
if [ ! -d ".git" ]; then
    echo "Initialisation du dépôt Git..."
    git init
fi

# Ajouter tous les fichiers
echo "Ajout des fichiers..."
git add .

# Créer un commit
echo "Création du commit..."
git commit -m "Initial commit"

# Vérifier si la branche est 'main'
if [ "$(git branch --show-current)" != "main" ]; then
    echo "Renommage de la branche en 'main'..."
    git branch -M main
fi

# Vérifier si le dépôt distant existe déjà
if ! git remote | grep -q "origin"; then
    echo "Ajout du dépôt distant..."
    git remote add origin https://github.com/SenaDev007/Academia-Hub-Desktop.git
else
    echo "Mise à jour de l'URL du dépôt distant..."
    git remote set-url origin https://github.com/SenaDev007/Academia-Hub-Desktop.git
fi

# Pousser les changements
echo "Envoi des changements vers GitHub..."
git push -f -u origin main

echo "Configuration Git terminée !"
