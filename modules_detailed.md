# Modules d'Academia Hub Pro

## 1. Gestion Élèves

### 1.1 Profil Élève
- Informations personnelles
  - Nom, prénom
  - Date de naissance
  - Genre
  - Adresse, ville, code postal
  - Email (optionnel)
  - Téléphone (optionnel)
  - Pays (par défaut France)
  - Photo de profil
  - N° Educmaster (renseigné manuellement)
- Informations scolaires
  - Date d'inscription
  - Statut (actif, inactif, diplômé, transféré, exclu)
  - Classe (optionnelle)
  - Parent (optionnel)
- Informations médicales
  - Informations médicales
  - Allergies
  - Contact d'urgence
    - Nom
    - Téléphone
    - Relation
    - Adresse (optionnelle)
- Documents
  - Pièces d'identité
  - Documents académiques
  - Documents administratifs
- Relations
  - Documents (StudentDocument[])
  - Parent (Parent?)
  - Classe (Class?)
  - Notes (Grade[])
  - Absences (Absence[])
  - Emplois du temps (ScheduleEntry[])
- Informations médicales
  - Informations médicales
  - Allergies
  - Contact d'urgence
  - Documents médicaux
- Documents
  - Pièces d'identité
  - Documents académiques
  - Documents administratifs

### 1.2 Scolarité
- Suivi des classes
- Statut (actif, inactif, diplômé, transféré, exclu)
- Historique des classes
- Emploi du temps
- Transferts de classe
- Archivage des données

### 1.3 Notes et Bulletins
- Suivi des notes par matière
- Calcul des moyennes
- Génération de bulletins
- Historique des notes
- Système de coefficients
- Types de notes (EM1, EM2, EC, DS1, DS2)

### 1.4 Absences et Discipline
- Suivi des absences
- Types d'absences (justifiées, injustifiées)
- Motifs d'absences
- Système de discipline
- Sanctions
- Notes disciplinaires

## 2. Gestion Enseignants

### 2.1 Profil Enseignant
- Informations personnelles
  - Identité
  - Coordonnées
  - Numéro d'employé
  - Statut
- Compétences
  - Matières enseignées
  - Niveau d'expertise
  - Certifications

### 2.2 Gestion des Classes
- Affectations
- Emploi du temps
- Gestion des absences
- Suivi des notes
- Cahier journal

### 2.3 Paie
- Salaire de base
- Calcul CNSS/IRPP
- Avances et remboursements
- Historique des paiements
- Documents de paie

## 3. Module Examens

### 3.1 Gestion des Notes
- Saisie des notes
- Types de notes
- Coefficients
- Calculs de moyennes
- Génération de bulletins
- Historique des notes

### 3.2 Examens
- Types d'examens (DS1, DS2, etc.)
- Planning des examens
- Salle d'examen
- Surveillance
- Correction
- Validation des notes

### 3.3 Statistiques
- Moyennes par classe
- Évolution des notes
- Comparaison
- Taux de réussite
- Indicateurs de performance

## 4. Module Planning

### 4.1 Emploi du Temps
- Création des emplois du temps
- Gestion des créneaux
- Affectation des salles
- Gestion des absences
- Gestion des remplacements

### 4.2 Cahier Journal
- Création des fiches
- Suivi des cours
- Notes pédagogiques
- Gestion des absences
- Communication avec les parents

### 4.3 Réservations
- Salles
- Laboratoires
- Matériel
- Gestion des conflits
- Planning des réservations

## 5. Gestion Financière

### 5.1 Frais Scolaires
- Types de frais
- Configuration des frais
- Facturation
- Paiements
- Remboursements

### 5.2 Paie
- Calcul des salaires
- Déductions CNSS/IRPP
- Génération des fiches de paie
- Historique des paiements
- Documents de paie

### 5.3 Comptabilité
- Clôtures de caisse
- Bilans
- Rapports financiers
- Suivi des transactions

## 6. Multi-Tenant

### 6.1 Gestion des Écoles
- Création d'écoles
- Configuration
- Paramètres
- Statistiques
- Rapports

### 6.2 Abonnements
- Plans
- Tarification
- Facturation
- Gestion des limites
- Renouvellements

### 6.3 KYC
- Vérification des identités
- Documentation
- Conformité
- Archivage
- Audit

## 7. Sécurité et Authentification

### 7.1 Authentification
- JWT
- Refresh tokens
- Authentification multi-facteurs
- Gestion des sessions

### 7.2 Autorisations
- RBAC
- Permissions
- Rôles
- Gestion des accès
- Audit des actions

### 7.3 Sécurité des Données
- Chiffrement
- Sauvegardes
- Conformité RGPD
- Audit
- Logs

## 8. Notifications et Communication

### 8.1 Notifications
- Types de notifications
- Statuts
- Historique
- Personnalisation
- Gestion des préférences

### 8.2 Communication
- Emails
- SMS
- WhatsApp
- Notifications push
- Rapports

## 9. Reporting et Statistiques

### 9.1 Rapports
- Académiques
- Financiers
- Administratifs
- Statistiques
- Personnalisés

### 9.2 Statistiques
- Évolution
- Comparaisons
- Taux de réussite
- Performance
- Indicateurs

## 10. Gestion Documentaire

### 10.1 Documents
- Types
- Stockage
- Versioning
- Archivage
- Accès

### 10.2 Gestion
- Upload
- Validation
- Archivage
- Partage
- Sécurité

## 11. Audit et Conformité

### 11.1 Audit
- Actions
- Modifications
- Accès
- Sécurité
- Conformité

### 11.2 Conformité
- RGPD
- Règlementations
- Standards
- Vérifications
- Documentation

## 12. Module Cantine

### 12.1 Gestion des Menus
- Création des menus
- Types de repas
- Allergènes
- Prix
- Rotation des menus
- Planification

### 12.2 Commandes et Paiements
- Commandes individuelles
- Commandes collectives
- Prépaiement
- Abonnements
- Remboursements
- Historique des transactions

### 12.3 Stock et Approvisionnement
- Gestion des stocks
- Commandes fournisseurs
- Inventaire
- Alertes de stock
- Rotation des produits
- Traçabilité

### 12.4 Statistiques
- Consommation
- Préférences
- Coûts
- Rendement
- Satisfaction

## 13. Module Infirmerie

### 13.1 Dossier Médical
- Allergies
- Vaccinations
- Médicaments
- Maladies chroniques
- Intolérances
- Documents médicaux

### 13.2 Visites Médicales
- Types de visites
- Rendez-vous
- Suivi médical
- Mesures prises
- Médicaments administrés
- Notes médicales

### 13.3 Gestion des Médicaments
- Stock
- Administration
- Dosages
- Effets secondaires
- Alertes
- Traçabilité

### 13.4 Statistiques
- Consultations
- Types d'interventions
- Médicaments
- Évolution
- Prévention

## 14. Module Boutique

### 14.1 Catalogue
- Produits
- Catégories
- Prix
- Stock
- Photos
- Descriptions
- Tailles/Colors

### 14.2 Commandes
- Paniers
- Commandes individuelles
- Commandes collectives
- Paiements
- Livraisons
- Retours

### 14.3 Stock et Approvisionnement
- Gestion des stocks
- Commandes fournisseurs
- Inventaire
- Alertes de stock
- Rotation des produits
- Traçabilité

### 14.4 Statistiques
- Ventes
- Popularité
- Chiffre d'affaires
- Rotation des stocks
- Satisfaction clients
