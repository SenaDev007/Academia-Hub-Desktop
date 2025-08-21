#!/usr/bin/env python3
import subprocess
import os
from datetime import datetime

def run_git_command(cmd):
    """Exécuter une commande git et retourner le résultat"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd="d:\\Projet YEHI OR Tech\\Academia Hub Desktop")
        return result.stdout.strip(), result.stderr.strip(), result.returncode
    except Exception as e:
        return "", str(e), 1

def save_project():
    """Sauvegarder automatiquement le projet sur GitHub"""
    print("🚀 Sauvegarde du projet Academia Hub Desktop...")
    
    # Vérifier l'état du dépôt
    print("📊 Vérification de l'état du dépôt...")
    stdout, stderr, returncode = run_git_command("git status")
    print(stdout)
    
    # Ajouter tous les fichiers
    print("📁 Ajout de tous les fichiers...")
    stdout, stderr, returncode = run_git_command("git add .")
    if returncode != 0:
        print(f"⚠️ Erreur lors de l'ajout des fichiers: {stderr}")
    
    # Créer un commit avec la date actuelle
    print("💾 Création du commit...")
    date_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_message = f"Sauvegarde automatique - {date_str}"
    stdout, stderr, returncode = run_git_command(f'git commit -m "{commit_message}"')
    
    if returncode != 0 and "nothing to commit" not in stderr:
        print(f"⚠️ Erreur lors du commit: {stderr}")
        return
    elif "nothing to commit" in stderr:
        print("ℹ️ Aucun changement à sauvegarder")
        return
    
    # Vérifier et configurer le dépôt distant
    print("🔗 Configuration du dépôt distant...")
    stdout, stderr, returncode = run_git_command("git remote -v")
    
    if "origin" not in stdout:
        stdout, stderr, returncode = run_git_command("git remote add origin https://github.com/SenaDev007/Academia-Hub-Desktop.git")
        if returncode != 0:
            print(f"⚠️ Erreur lors de l'ajout du dépôt distant: {stderr}")
    
    # Pousser les changements
    print("🚀 Envoi des changements vers GitHub...")
    stdout, stderr, returncode = run_git_command("git push -u origin main")
    
    if returncode == 0:
        print("✅ Sauvegarde terminée avec succès !")
    else:
        print(f"⚠️ Erreur lors du push: {stderr}")
        print("💡 Essayez: git push -f origin main")

if __name__ == "__main__":
    save_project()
