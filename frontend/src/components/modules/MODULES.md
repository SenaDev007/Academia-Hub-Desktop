# Documentation des Modules Academia Hub Pro

## 1. Module Students

### Structure Principale
```tsx
// Students.tsx
- Liste des élèves avec filtres
- Recherche avancée
- Tableau de données avec pagination
- Boutons d'action (ajouter, modifier, supprimer)
- Modals associés
- Statistiques
- Filtrage par classe
```

### Modals
1. StudentModal
   - Formulaire complet d'élève
   - Upload photo de profil
   - Sélection de classe
   - Gestion documents
   - Validation des données
   - Mode création/modification

2. AbsenceModal
   - Saisie des absences
   - Période (matin, après-midi)
   - Justification
   - Génération d'excuses
   - Historique
   - Notification parents

3. DisciplineModal
   - Gestion des sanctions
   - Types de sanctions
   - Raisons
   - Suivi
   - Professeur

4. ClassTransferModal
   - Transfert de classe
   - Validation
   - Notification parents

5. DocumentGenerationModal
   - Génération de documents
   - Format (PDF, DOCX)
   - Personnalisation

6. TrombinoscopeModal
   - Génération de trombinoscope
   - Format
   - Options de tri

7. ConfirmModal
   - Confirmation d'actions
   - Avertissements
   - Validation

8. AlertModal
   - Notifications
   - Messages
   - Types (success, error, info, warning)

### Données
- Élèves (identifiant, nom, classe, âge, etc.)
- Absences (date, période, raison, justification)
- Incidents disciplinaires
- Statistiques d'inscription
- Classes disponibles
- Statuts (actif, absent, suspendu)
- Frais (payés, en attente, en retard)

## 2. Module Finance

### Structure Principale
```tsx
// Finance.tsx
- Tableau de bord financier
- Gestion des frais
- Paiements
- Suivi des factures
- Rapports financiers
- Statistiques
```

### Modals
1. InvoiceModal
   - Création de factures
   - Types de frais (inscription, réinscription, scolarité, cantine, transport, etc.)
   - Validation
   - Génération PDF

2. ExpenseModal
   - Saisie des dépenses
   - Catégories (équipement, personnel, maintenance, etc.)
   - Validation
   - Attachements

3. FeeTypeModal
   - Configuration des frais
   - Types de frais (12 types)
   - Tarification
   - Validation

4. FeeConfigurationModal
   - Configuration des frais
   - Niveaux scolaires (PS à Terminale)
   - Tarification
   - Validation

5. PayrollModal
   - Gestion des paies
   - Calcul salaires
   - Génération bulletins
   - Validation

6. PayrollBatchModal
   - Gestion des lots
   - Validation
   - Export

7. PayrollReportModal
   - Génération rapports
   - Filtrage
   - Export

8. PayrollDeclarationModal
   - Déclarations sociales
   - Validation
   - Export

9. PayrollSettingsModal
   - Configuration paies
   - Paramètres
   - Validation

10. ClosingDayModal
    - Clôture comptable
    - Validation
    - Export

11. BudgetModal
    - Gestion budget
    - Validation
    - Export

12. PaymentModal
    - Gestion paiements
    - Méthodes (carte, mobile money, virement)
    - Validation
    - Export

13. ConfirmModal
    - Confirmation actions
    - Avertissements
    - Validation

14. AlertModal
    - Notifications
    - Messages
    - Types (success, error, info, warning)

### Données
- Frais par année scolaire
- Paiements en attente
- Revenus mensuels
- Frais collectés
- Élèves à jour
- Paiements récents
- Frais en attente
- Statistiques financières

## 3. Module Planning

### Structure Principale
```tsx
// Planning.tsx
- Emploi du temps interactif
- Cahier de texte
- Cahier journal
- Fiches pédagogiques
- Statistiques
- Gestion des pauses
- Gestion des horaires
- Tableau de bord
```

### Modals
1. ClassModal
   - Création de classes
   - Niveaux (Maternelle, Primaire, Collège, Lycée)
   - Validation
   - Professeur principal
   - Salle

2. RoomModal
   - Gestion salles
   - Types (Salle de classe, Laboratoire, Salle spécialisée)
   - Équipements
   - Capacité
   - Status
   - Validation

3. SubjectModal
   - Gestion matières
   - Coefficients
   - Validation

4. BreakModal
   - Gestion pauses
   - Types (récréation, déjeuner)
   - Durées
   - Classes concernées
   - Validation

5. RoomReservationModal
   - Réservation salles
   - Gestion équipements
   - Validation

6. TeacherAssignmentModal
   - Attribution enseignants
   - Heures par semaine
   - Classes
   - Validation

7. ScheduleEntryModal
   - Création emploi du temps
   - Validation

8. TeacherAvailabilityModal
   - Gestion disponibilités
   - Validation

9. WorkHoursModal
   - Gestion horaires
   - Heures de travail
   - Pause déjeuner
   - Validation

10. ConfirmModal
    - Confirmation actions
    - Avertissements
    - Validation

11. AlertModal
    - Notifications
    - Messages
    - Types (success, error, info, warning)

### Données
- Classes (id, nom, niveau, élèves, professeur, salle)
- Salles (id, nom, type, capacité, équipements)
- Matières (id, nom, code, coefficient)
- Enseignants (id, nom, matière, classes, heures)
- Emploi du temps (jour, heure, matière, professeur, classe, salle)
- Statistiques (classes actives, enseignants, salles disponibles, taux d'occupation)
- Pauses (nom, type, horaires, durée, niveaux)

## 4. Module Cafeteria

### Structure Principale
```tsx
// Cafeteria.tsx
- Gestion des menus
- Gestion des allergies
- Gestion des stocks
- Gestion des paiements
- Statistiques
- Tableau de bord
```

### Modals
1. MenuModal
   - Création de menus
   - Types (Déjeuner, Collation)
   - Plats (entrée, plat principal, accompagnement, dessert)
   - Scores nutritionnels (A, B, C, D, E)
   - Allergènes
   - Coût
   - Réservations
   - Validation

2. AllergyModal
   - Gestion des allergies
   - Étudiants concernés
   - Sévérité
   - Menus alternatifs
   - Contacts parents
   - Certificats médicaux
   - Validation

3. StockModal
   - Gestion des stocks
   - Catégories (Viandes, Légumes, Produits laitiers)
   - Quantités et unités
   - Dates de péremption
   - Fournisseurs
   - Coûts
   - Alertes de stock minimum
   - Validation

4. PaymentModal
   - Gestion des paiements
   - Méthodes (Carte prépayée, Tickets restaurant)
   - Solde
   - Transactions
   - Dépenses mensuelles
   - Statuts
   - Validation

5. ConfirmModal
   - Confirmation actions
   - Avertissements
   - Validation

6. AlertModal
   - Notifications
   - Messages
   - Types (success, error, info, warning)

### Données
- Menus (repas, collations)
- Allergies (étudiants, alternatives)
- Stocks (produits, fournisseurs)
- Paiements (cartes, tickets)
- Statistiques (repas, fréquentation, revenus, satisfaction)
- Inventaire (produits, quantités, dates)
- Scores nutritionnels (A à E)
- Alertes (stocks bas, allergies, péremptions)

## 5. Module HR

### Structure Principale
```tsx
// HR.tsx
- Gestion du personnel
- Évaluations
- Formations
- Contrats
- Statistiques
- Tableau de bord
```

### Modals
1. TeacherModal
   - Création de professeurs
   - Données personnelles
   - Poste
   - Département
   - Date d'embauche
   - Type de contrat
   - Salaire
   - Contact
   - Adresse
   - Statut
   - Performance
   - Dernière évaluation
   - Validation

2. EvaluationModal
   - Évaluations des enseignants
   - Notes
   - Commentaires
   - Date
   - Validation

3. TrainingModal
   - Gestion des formations
   - Titre
   - Catégorie (Pédagogie, Management, Sécurité)
   - Formateur
   - Dates
   - Durée
   - Participants
   - Coût
   - Statut
   - Validation

4. ContractModal
   - Gestion des contrats
   - Nom employé
   - ID employé
   - Poste
   - Type (CDI, CDD)
   - Dates
   - Salaire
   - Heures de travail
   - Statut
   - Date de renouvellement
   - Validation

5. ConfirmModal
   - Confirmation actions
   - Avertissements
   - Validation

6. AlertModal
   - Notifications
   - Messages
   - Types (success, error, info, warning)

### Données
- Personnel (professeurs, administratifs)
- Évaluations (notes, commentaires)
- Formations (internes, externes)
- Contrats (CDI, CDD)
- Statistiques (effectifs, masse salariale, formations, satisfaction)
- États (actif, en congé, etc.)
- Types de contrats (CDI, CDD)
- Départements (Enseignement, Administration)

## 6. Module Infirmerie

### Structure Principale
```tsx
// Infirmerie.tsx
- Dossiers médicaux
- Gestion des visites
- Suivi des médicaments
- Rapports médicaux
- Gestion des urgences
```

### Modals
1. MedicalRecordModal
   - Création dossiers
   - Histoire médicale
   - Allergies
   - Validation

2. VisitModal
   - Saisie visites
   - Prescription
   - Validation

3. MedicationModal
   - Gestion médicaments
   - Validation
   - Documentation

4. EmergencyModal
   - Gestion urgences
   - Contact
   - Validation

5. ConfirmModal
   - Confirmation actions
   - Avertissements
   - Validation

6. AlertModal
   - Notifications
   - Messages
   - Types (success, error, info, warning)

## 7. Module QHSE

### Structure Principale
```tsx
// QHSE.tsx
- Tableau de bord
- Gestion des incidents
- Audits
- Conformité
- Économies d'énergie
- Formations
- Statistiques
```

### Modals
1. IncidentModal
   - Déclaration incidents
   - Catégories (Hygiène, Sécurité)
   - Localisation
   - Priorité (faible, moyenne, haute)
   - Statut (en attente, en cours, résolu)
   - Résolution
   - Date de fermeture
   - Validation

2. AuditModal
   - Gestion audits
   - Types (Interne, Externe)
   - Date
   - Auditeur
   - Statut
   - Score
   - Conformités
   - Rapport
   - Validation

3. EnvironmentalModal
   - Gestion environnement
   - Consommation électricité
   - Consommation eau
   - Gestion des déchets
   - Recyclage
   - Émissions CO2
   - Validation

4. TrainingModal
   - Formation QHSE
   - Types de formations
   - Validation

5. EquipmentModal
   - Gestion équipements
   - Types (extincteurs, alarmes)
   - Localisation
   - Dernier contrôle
   - Prochain contrôle
   - Status
   - Notes
   - Validation

6. ConfirmModal
   - Confirmation actions
   - Avertissements
   - Validation

7. AlertModal
   - Notifications
   - Messages
   - Types (success, error, info, warning)

### Données
- Incidents (signalés, résolus)
- Audits (internes, externes)
- Conformité
- Économies d'énergie
- Équipements de sécurité
- Formations QHSE
- Statistiques (incidents, audits, conformité, économies)
- Données environnementales (électricité, eau, déchets, CO2)
- Équipements de sécurité (extincteurs, alarmes)

## 8. Module Boutique

### Structure Principale
```tsx
// Boutique.tsx
- Tableau de bord
- Catalogue produits
- Gestion des stocks
- Commandes en ligne
- Paiements
- Statistiques
```

### Modals
1. ProductModal
   - Ajout produits
   - Gestion stocks
   - Prix
   - Variants
   - Description
   - Images
   - Validation

2. OrderModal
   - Commande produits
   - Paiement
   - Validation

3. StockModal
   - Gestion stocks
   - Alertes
   - Validation

4. CategoryModal
   - Gestion catégories
   - Validation
   - Documentation

5. ConfirmModal
   - Confirmation actions
   - Avertissements
   - Validation

6. AlertModal
   - Notifications
   - Messages
   - Types (success, error, info, warning)

## 9. Module Communication

### Structure Principale
```tsx
// Communication.tsx
- Messagerie
- Notifications
- Annuaire
- Calendrier
- Statistiques
```

### Modals
1. MessageModal
   - Création messages
   - Types (SMS, Email, Notification)
   - Recipients (parents, classes, individuels)
   - Sujet
   - Contenu
   - Template
   - Statut
   - Taux de lecture
   - Validation

2. ContactModal
   - Gestion contacts
   - Parents
   - Étudiants
   - Classes
   - Préférences de contact
   - Dernier contact
   - Validation

3. TemplateModal
   - Gestion templates
   - Catégories (Absence, Finance, Pédagogie)
   - Variables dynamiques
   - Validation

4. ConfirmModal
   - Confirmation actions
   - Avertissements
   - Validation

5. AlertModal
   - Notifications
   - Messages
   - Types (success, error, info, warning)

### Données
- Messages (SMS, Email, Notification)
- Contacts (parents, enseignants)
- Templates
- Statistiques (taux de lecture, envois)
- Préférences de contact
- Historique des communications
- Taux de livraison
- Taux de lecture par typesement

## 10. Module Settings

### Structure Principale
```tsx
// Settings.tsx
- Configuration établissement
- Gestion utilisateurs
- Sécurité
- Notifications
- Facturation
- Documents
- Données
- Système
```

### Modals
1. SchoolSettingsModal
   - Configuration établissement
   - Nom
   - Type
   - Adresse
   - Contact
   - Logo
   - Validation

2. UserManagementModal
   - Gestion utilisateurs
   - Rôles (Directeur, Enseignant, Secrétaire, Comptable, Surveillant)
   - Permissions par rôle
   - Validation

3. SecurityModal
   - Configuration sécurité
   - Authentification
   - RBAC
   - Audit
   - Validation

4. NotificationSettingsModal
   - Configuration notifications
   - Canaux (SMS, Email, Push)
   - Préférences
   - Validation

5. BillingModal
   - Configuration facturation
   - Modes de paiement
   - Tarification
   - Validation

6. DocumentSettingsModal
   - Configuration documents
   - Templates
   - Archivage
   - Validation

7. DataSettingsModal
   - Configuration données
   - Sauvegarde
   - Restauration
   - Validation

8. SystemSettingsModal
   - Configuration système
   - Paramètres généraux
   - Mises à jour
   - Validation

9. ConfirmModal
   - Confirmation actions
   - Avertissements
   - Validation

10. AlertModal
    - Notifications
    - Messages
    - Types (success, error, info, warning)

### Données
- Configuration établissement
- Utilisateurs (administrateurs, enseignants, personnel)
- Rôles et permissions
- Notifications
- Facturation
- Documents
- Données système
- Paramètres système
- Logs d'audit
- Sauvegardes
- Mises à jour système

## Architecture Commune

### Composants Partagés
1. Modals
   - BaseModal (foundation)
   - ConfirmModal (confirmations)
   - AlertModal (notifications)
   - DocumentModal (documents)
   - FilterModal (filtrage)
   - SearchModal (recherche)
   - MenuModal (menus)
   - ClassModal (classes)
   - RoomModal (salles)
   - SubjectModal (matières)
   - BreakModal (pauses)
   - TeacherModal (enseignants)
   - ContractModal (contrats)
   - TrainingModal (formations)
   - ProductModal (produits)
   - OrderModal (commandes)
   - MessageModal (messages)
   - TemplateModal (templates)

2. Tableaux de données
   - Pagination (10, 25, 50, 100)
   - Filtrage (texte, dates, statuts)
   - Tri (asc, desc)
   - Export (Excel, PDF)
   - Sélection multiple

3. Formulaires
   - Validation (required, format, range)
   - Upload (images, documents)
   - Autocomplete
   - Rich text
   - Date picker

4. Notifications
   - Toast (success, error, info, warning)
   - Badge
   - Bell
   - Email
   - SMS

5. API GraphQL
   - Queries
   - Mutations
   - Subscriptions
   - Types génériques
   - Validation

### Modules Frontend

1. Module Étudiants (Students)
```typescript
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  class: string;
  age: number;
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
  status: 'active' | 'absent' | 'inactive';
  fees: 'paid' | 'pending' | 'unpaid';
  photo: string | null;
  enrollmentDate: string;
  medicalInfo: string;
}
```

Modals:
- StudentModal
- AbsenceModal
- DisciplineModal
- ClassTransferModal
- DocumentGenerationModal
- TrombinoscopeModal
- ConfirmModal
- AlertModal

Fonctionnalités:
- Gestion des étudiants
- Suivi des présences
- Gestion disciplinaire
- Transferts de classe
- Génération de documents
- Visualisation des étudiants

2. Module Finance
```typescript
interface FeeType {
  id: number;
  name: string;
  description: string;
}

interface FeeConfiguration {
  year: string;
  fees: {
    inscription: number[];
    reinscription: number[];
    scolarite: number[];
  };
}
```

Modals:
- InvoiceModal
- ExpenseModal
- FeeTypeModal
- FeeConfigurationModal
- ClosingDayModal
- BudgetModal
- PayrollModal
- PayrollBatchModal
- PayrollReportModal
- PayrollDeclarationModal
- PayrollSettingsModal
- PaymentModal
- ConfirmModal
- AlertModal

Fonctionnalités:
- Gestion des factures
- Suivi des dépenses
- Configuration des frais
- Gestion de la paie
- Déclarations fiscales
- Rapports financiers

3. Module Planning
```typescript
interface Break {
  name: string;
  type: 'recreation' | 'break';
  startTime: string;
  endTime: string;
  duration: number;
  levels: string[];
}

interface WorkHours {
  startTime: string;
  endTime: string;
  lunchBreakStart: string;
  lunchBreakEnd: string;
  courseDuration: number;
  breakBetweenCourses: number;
  workDays: number[];
}
```

Modals:
- ClassModal
- RoomModal
- SubjectModal
- BreakModal
- RoomReservationModal
- TeacherAssignmentModal
- ScheduleEntryModal
- TeacherAvailabilityModal
- WorkHoursModal

Fonctionnalités:
- Gestion des classes
- Réservation des salles
- Attribution des enseignants
- Planification des cours
- Gestion des pauses
- Cahier de texte
- Cahier journal
- Fiches pédagogiques

4. Module Boutique
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  status: 'active' | 'inactive';
}

interface Order {
  id: string;
  products: Product[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered';
  customer: Customer;
  payment: Payment;
}
```

Modals:
- ProductModal
- OrderModal
- StockModal
- ConfirmModal
- AlertModal

Fonctionnalités:
- Catalogue produits
- Gestion des stocks
- Commandes clients
- Paiements
- Statistiques
- Tableau de bord

5. Module Communication
Le module Communication gère toutes les interactions avec les parents, les élèves et le personnel. Il permet d'envoyer des messages personnalisés via SMS, email ou notifications push, de gérer les templates de messages, de suivre les statistiques d'ouverture et de maintenir un historique complet des communications.

```typescript
interface Message {
  id: number;
  type: 'sms' | 'email' | 'notification';
  recipient: string;
  subject: string;
  content: string;
  sentAt: string;
  status: 'delivered' | 'pending' | 'failed';
  readRate: number;
}

interface Contact {
  id: number;
  parentName: string;
  studentName: string;
  class: string;
  phone: string;
  email: string;
  preferredContact: 'sms' | 'email' | 'phone';
  lastContact: string;
}

interface Template {
  id: number;
  name: string;
  category: string;
  content: string;
}
```

Modals:
- MessageModal
- TemplateModal
- ContactModal
- ConfirmModal
- AlertModal

Fonctionnalités:
- Communication multi-canaux (SMS, Email, Notifications)
- Gestion des contacts parents
- Templates personnalisables
- Suivi des messages
- Statistiques d'ouverture
- Historique des communications
- IA intégrée pour la rédaction

6. Module Boutique
Le module Boutique gère la vente et la distribution de tous les produits scolaires : uniformes, fournitures, livres, électronique, équipement sportif et snacks. Il inclut la gestion des stocks, des commandes, des paiements et des livraisons, avec un tableau de bord complet pour suivre les ventes et les stocks.

```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  variants: string[];
  description: string;
  imageUrl: string;
  rating: number;
  sales: number;
  status: 'active' | 'low_stock' | 'out_of_stock';
}

interface Order {
  id: string;
  customerName: string;
  customerType: 'Parent' | 'Élève' | 'Enseignant';
  items: number;
  total: number;
  date: string;
  status: 'delivered' | 'processing' | 'pending';
  paymentMethod: 'card' | 'mobile_money' | 'school_account';
  deliveryMethod: 'pickup' | 'student';
}

interface StockMovement {
  id: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  user: string;
  reason: string;
}
```

Modals:
- ProductModal
- OrderModal
- StockModal
- ConfirmModal
- AlertModal

Fonctionnalités:
- Gestion des produits (catégories, stocks, prix)
- Gestion des commandes
- Suivi des stocks
- Statistiques de vente
- Gestion des livraisons
- Paiements multiples
- Tableau de bord

7. Module Settings
Le module Settings centralise toutes les configurations de l'établissement, depuis les paramètres de base comme le nom et l'adresse jusqu'aux configurations avancées de sécurité, notifications, facturation, documents et système. Il permet une gestion complète des utilisateurs, rôles et permissions, ainsi que la configuration des politiques de données et mises à jour.

```typescript
interface Configuration {
  school: {
    name: string;
    type: 'École primaire' | 'Collège' | 'Lycée' | 'Université' | 'Centre de formation';
    address: string;
    phone: string;
    email: string;
    logo: string;
  };
  users: {
    roles: {
      name: string;
      permissions: string[];
      description: string;
    }[];
    users: {
      id: string;
      name: string;
      email: string;
      role: string;
      status: 'active' | 'inactive';
    }[];
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      requireUppercase: boolean;
    };
    sessionTimeout: number;
    loginAttempts: number;
  };
  notifications: {
    types: string[];
    preferences: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  billing: {
    currency: string;
    taxRate: number;
    terms: string;
    paymentMethods: string[];
  };
  documents: {
    templates: {
      name: string;
      content: string;
      variables: string[];
    }[];
    storage: {
      provider: string;
      maxFileSize: number;
      allowedTypes: string[];
    };
  };
  data: {
    retention: number;
    backup: {
      frequency: string;
      location: string;
    };
    export: {
      formats: string[];
      schedule: string;
    };
  };
  system: {
    version: string;
    updates: {
      automatic: boolean;
      schedule: string;
    };
    logs: {
      retention: number;
      level: string;
    };
  };
}
```

Modals:
- SchoolSettingsModal
- UserManagementModal
- SecurityModal
- NotificationSettingsModal
- BillingModal
- DocumentSettingsModal
- DataSettingsModal
- SystemSettingsModal
- ConfirmModal
- AlertModal

Fonctionnalités:
1. Configuration Établissement
- Informations générales
- Types d'établissement
- Contact et logo
- Paramètres de base

2. Gestion des Utilisateurs
- Rôles et permissions
- Création d'utilisateurs
- Gestion des accès
- Statistiques

3. Sécurité
- Politique de mots de passe
- Sessions
- Tentatives de connexion
- Audit

4. Notifications
- Types de notifications
- Préférences
- Templates
- Gestion des abonnements

5. Facturation
- Devise
- Taux de TVA
- Conditions
- Méthodes de paiement

6. Documents
- Templates
- Stockage
- Gestion des fichiers
- Export

7. Données
- Retention
- Sauvegarde
- Export
- Archivage

8. Système
- Version
- Mises à jour
- Logs
- Configuration système

8. Module RH
Le module RH gère l'ensemble des aspects liés au personnel de l'établissement : recrutement, contrats, évaluations, formations, documents et statistiques. Il permet une gestion complète des ressources humaines avec un suivi détaillé des performances et des formations.

```typescript
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  hireDate: string;
  contract: 'CDI' | 'CDD' | 'CDDU' | 'CDDU' | 'Alternance';
  salary: number;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'on-leave' | 'inactive';
  performance: number;
  lastEvaluation: string;
  evaluations: Evaluation[];
  trainings: Training[];
  documents: Document[];
}

interface Contract {
  id: string;
  employeeName: string;
  employeeId: string;
  position: string;
  contractType: 'CDI' | 'CDD' | 'CDDU' | 'Alternance';
  startDate: string;
  endDate: string | null;
  salary: number;
  workingHours: string;
  status: 'active' | 'expired' | 'terminated';
  renewalDate: string | null;
  documents: Document[];
}

interface Training {
  id: string;
  title: string;
  category: string;
  instructor: string;
  startDate: string;
  endDate: string;
  duration: string;
  participants: number;
  cost: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  evaluations: Evaluation[];
}

interface Evaluation {
  id: string;
  employeeId: string;
  date: string;
  score: number;
  comments: string;
  evaluator: string;
  category: string;
  documents: Document[];
}
```

Modals:
- TeacherModal
- EvaluationModal
- TrainingModal
- ContractModal
- DocumentModal
- ConfirmModal
- AlertModal

Fonctionnalités:
1. Gestion du Personnel
- Profils employés
- Statuts et positions
- Départements
- Informations personnelles
- Documents

2. Contrats
- Types de contrats
- Durées
- Salaires
- Renouvellements
- Archivage

3. Évaluations
- Performance
- Commentaires
- Catégories
- Historique
- Documents

4. Formations
- Programme
- Participants
- Coûts
- Suivi
- Évaluations

5. Documents
- Contrats
- Évaluations
- Formations
- Autres

6. Statistiques
- Personnel actif
- Masse salariale
- Formations
- Satisfaction

7. Gestion Administrative
- Congés
- Absences
- Remplacements
- Planning

8. Communication
- Notifications
- Rapports
- Documents
- Historique

9. Module QHSE
Le module QHSE gère la qualité, la sécurité, l'environnement et la santé au travail. Il permet de suivre les incidents, les audits, les données environnementales et l'état des équipements de sécurité. Il inclut également la gestion des actions correctives et des maintenances.

```typescript
interface Incident {
  id: string;
  title: string;
  category: string;
  location: string;
  reportedBy: string;
  reportDate: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  resolution: string;
  closedDate: string | null;
  documents: Document[];
  actions: Action[];
}

interface Audit {
  id: string;
  title: string;
  type: 'Interne' | 'Externe';
  date: string;
  auditor: string;
  status: 'scheduled' | 'completed';
  score: number;
  findings: number;
  majorNonConformities: number;
  minorNonConformities: number;
  report: string;
  followUp: FollowUp[];
}

interface EnvironmentalData {
  date: string;
  electricity: number;
  water: number;
  waste: number;
  recycled: number;
  co2: number;
  targets: {
    electricity: number;
    water: number;
    waste: number;
    recycled: number;
    co2: number;
  };
}

interface SafetyEquipment {
  id: string;
  type: string;
  location: string;
  lastCheck: string;
  nextCheck: string;
  status: 'operational' | 'maintenance' | 'out-of-service';
  notes: string;
  maintenanceHistory: Maintenance[];
}

interface Action {
  id: string;
  incidentId: string;
  description: string;
  responsible: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
  documents: Document[];
}

interface Maintenance {
  id: string;
  equipmentId: string;
  date: string;
  type: string;
  description: string;
  technician: string;
  status: 'completed' | 'pending';
  documents: Document[];
}
```

Modals:
- IncidentModal
- AuditModal
- EnvironmentalModal
- SafetyEquipmentModal
- ActionModal
- MaintenanceModal
- DocumentModal
- ConfirmModal
- AlertModal

Fonctionnalités:
1. Gestion des Incidents
- Signalement
- Catégorisation
- Priorisation
- Suivi
- Documentation
- Actions correctives

2. Audits
- Planification
- Conduite
- Rapports
- Non-conformités
- Suivi des actions
- Archivage

3. Environnement
- Consommations
- Déchets
- Recyclage
- Émissions
- Objectifs
- Indicateurs

4. Sécurité
- Équipements
- Maintenance
- Contrôles
- Formations
- Plans d'urgence

5. Documentation
- Rapports
- Procédures
- Registres
- Archives
- Conformité

6. Indicateurs
- Incidents
- Audits
- Conformité
- Environnement
- Sécurité

7. Prévention
- Formation
- Communication
- Planification
- Risques
- Mesures

8. Conformité
- Réglementation
- Procédures
- Documentation
- Audits
- Actions

10. Module Planning
Le module Planning gère l'ensemble des aspects liés à l'organisation des cours, des salles et des enseignants. Il permet de créer et de gérer les emplois du temps, les récréations, les réservations de salles et les disponibilités des enseignants. Il inclut également un cahier de texte et des fiches pédagogiques.

```typescript
interface Break {
  name: string;
  type: 'recreation' | 'break';
  startTime: string;
  endTime: string;
  duration: number;
  levels: string[];
}

interface WorkHours {
  startTime: string;
  endTime: string;
  lunchBreakStart: string;
  lunchBreakEnd: string;
  courseDuration: number;
  breakBetweenCourses: number;
  workDays: number[];
}

interface Class {
  id: string;
  name: string;
  level: string;
  students: number;
  mainTeacher: string;
  room: string;
  schedule: ScheduleEntry[];
}

interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  equipment: string[];
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  reservations: RoomReservation[];
}

interface Subject {
  id: string;
  name: string;
  code: string;
  level: string;
  coefficient: number;
  teachers: string[];
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  classes: string[];
  hoursPerWeek: number;
  availability: TeacherAvailability[];
}

interface ScheduleEntry {
  id: number;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  class: string;
  room: string;
  duration: string;
}

interface RoomReservation {
  id: string;
  room: string;
  startTime: string;
  endTime: string;
  purpose: string;
  requester: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface TeacherAvailability {
  id: string;
  teacher: string;
  day: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'unavailable';
}
```

Modals:
- ClassModal
- RoomModal
- SubjectModal
- BreakModal
- RoomReservationModal
- TeacherAssignmentModal
- ScheduleEntryModal
- TeacherAvailabilityModal
- WorkHoursModal
- ConfirmModal
- AlertModal

Fonctionnalités:
1. Gestion des Classes
- Création
- Modification
- Planning
- Effectifs
- Enseignants

2. Gestion des Salles
- Types
- Capacités
- Équipements
- Statuts
- Réservations

3. Gestion des Matières
- Coefficients
- Niveaux
- Enseignants
- Planning

4. Gestion des Enseignants
- Charges
- Disponibilités
- Planning
- Affectations

5. Planning
- Emploi du temps
- Récréations
- Pause déjeuner
- Statuts

6. Cahier de Texte
- Journal
- Fiches pédagogiques
- Ressources
- Communication

7. Statistiques
- Classes actives
- Enseignants
- Salles
- Occupation

8. Documentation
- Cahier de texte
- Fiches pédagogiques
- Ressources
- Historique

11. Module Students
Le module Students gère l'ensemble des aspects liés aux élèves : profils, absences, discipline, transferts et documents. Il permet une gestion complète des effectifs avec un suivi détaillé des présences, des incidents disciplinaires et des documents médicaux.

```typescript
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  class: string;
  age: number;
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
  status: 'active' | 'absent' | 'suspended';
  fees: 'paid' | 'pending' | 'overdue';
  photo: string | null;
  enrollmentDate: string;
  medicalInfo: string;
  absences: Absence[];
  disciplinaryRecords: DisciplinaryRecord[];
  documents: Document[];
}

interface Absence {
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  period: string;
  reason: string;
  justified: boolean;
  parentNotified: boolean;
}

interface DisciplinaryRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  incident: string;
  severity: 'minor' | 'major';
  action: string;
  teacher: string;
}

interface StudentDocument {
  id: string;
  studentId: string;
  type: 'medical' | 'administrative' | 'academic' | 'discipline';
  title: string;
  content: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Class {
  id: string;
  name: string;
  level: string;
  students: Student[];
  teacher: string;
  schedule: ScheduleEntry[];
}
```

Modals:
- StudentModal
- AbsenceModal
- DisciplineModal
- ClassTransferModal
- DocumentGenerationModal
- TrombinoscopeModal
- ConfirmModal
- AlertModal

Fonctionnalités:
1. Gestion des Élèves
- Profils
- Classes
- Statuts
- Contact
- Documents
- Photos
- Historique

2. Absences
- Signalement
- Justification
- Suivi
- Statistiques
- Notifications

3. Discipline
- Incidents
- Sévérité
- Actions
- Historique
- Documentation

4. Transferts
- Classes
- Documentation
- Validation
- Historique

5. Documents
- Génération
- Stockage
- Partage
- Validation
- Historique

6. Statistiques
- Effectifs
- Présences
- Absences
- Nouveaux
- Transferts

7. Communication
- Parents
- Notifications
- Documents
- Historique

8. Médical
- Informations
- Documents
- Suivi
- Alertes

12. Module Finance
Le module Finance gère l'ensemble des aspects financiers de l'établissement : frais scolaires, paiements, factures, dépenses, budget et paie. Il permet une gestion complète des flux financiers avec un suivi détaillé des paiements, des dépenses et des budgets.

```typescript
interface FeeType {
  id: number;
  name: string;
  description: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'one-time';
  status: 'active' | 'inactive';
}

interface Payment {
  id: string;
  studentName: string;
  class: string;
  amount: number;
  date: string;
  method: 'Carte bancaire' | 'Mobile Money' | 'Virement bancaire' | 'Espèces';
  status: 'completed' | 'pending' | 'failed';
  type: string;
  reference: string;
}

interface PendingFee {
  studentName: string;
  class: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  parentPhone: string;
  type: string;
}

interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paymentMethod: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
  total: number;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: Document[];
}

interface Budget {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  status: 'draft' | 'approved' | 'rejected';
  documents: Document[];
}

interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid';
  documents: Document[];
}
```

Modals:
- InvoiceModal
- ExpenseModal
- FeeTypeModal
- FeeConfigurationModal
- ClosingDayModal
- BudgetModal
- PayrollModal
- PayrollBatchModal
- PayrollReportModal
- PayrollDeclarationModal
- PayrollSettingsModal
- PaymentModal
- ConfirmModal
- AlertModal

Fonctionnalités:
1. Gestion des Frais
- Types de frais
- Configuration
- Collecte
- Suivi
- Rappels

2. Paiements
- Méthodes
- Statuts
- Historique
- Rappels
- Documents

3. Factures
- Génération
- Envoi
- Paiement
- Suivi
- Documents

4. Dépenses
- Catégories
- Validation
- Documents
- Budget

5. Paie
- Salaires
- Déclarations
- Rapports
- Documents
- Configuration

6. Budget
- Planification
- Suivi
- Rapports
- Documents
- Validation

7. Statistiques
- Revenus
- Dépenses
- Frais
- Paiements
- Salaires

8. Documentation
- Factures
- Déclarations
- Rapports
- Contrats
- Historique

13. Module Cafeteria
Le module Cafeteria gère l'ensemble des aspects liés à la restauration scolaire : menus, allergies, inventaire, paiements et statistiques. Il permet une gestion complète de la restauration avec un suivi détaillé des réservations, des stocks et des paiements.

```typescript
interface Menu {
  id: string;
  date: string;
  type: string;
  starter: string;
  main: string;
  side: string;
  dessert: string;
  nutritionalScore: string;
  allergens: string[];
  cost: number;
  reservations: number;
  status: 'confirmed' | 'planned' | 'cancelled';
}

interface Allergy {
  studentName: string;
  class: string;
  allergies: string[];
  severity: 'low' | 'medium' | 'high';
  alternativeMenu: string;
  parentContact: string;
  medicalCertificate: string;
}

interface InventoryItem {
  id: string;
  product: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  supplier: string;
  cost: number;
  status: 'good' | 'expiring' | 'expired';
  minStock: number;
}

interface Payment {
  id: string;
  studentName: string;
  class: string;
  paymentMethod: 'Carte prépayée' | 'Tickets restaurant' | 'Espèces';
  balance: number;
  lastTransaction: string;
  monthlySpent: number;
  status: 'active' | 'low-balance' | 'inactive';
}

interface Statistics {
  mealsPerDay: number;
  attendanceRate: number;
  monthlyRevenue: number;
  satisfactionRating: number;
  reservations: number;
  servedMeals: number;
}
```

Modals:
- MenuModal
- InventoryModal
- AllergyModal
- PaymentModal
- ConfirmModal
- AlertModal

Fonctionnalités:
1. Gestion des Menus
- Planification
- Alimentation
- Allergènes
- Score nutritionnel
- Réservations

2. Gestion des Allergies
- Étudiants
- Sévérité
- Menus alternatifs
- Contact
- Certificats

3. Inventaire
- Produits
- Catégories
- Quantités
- Dates limites
- Fournisseurs

4. Paiements
- Méthodes
- Soldes
- Transactions
- Statuts
- Historique

5. Statistiques
- Repas
- Fréquentation
- Revenus
- Satisfaction
- Réservations

6. Documentation
- Menus
- Allergies
- Inventaire
- Paiements
- Rapports

7. Communication
- Parents
- Étudiants
- Fournisseurs
- Rapports

8. Gestion
- Planification
- Validation
- Suivi
- Alertes

6. Module Settings
```typescript
interface Configuration {
  school: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  users: {
    roles: Role[];
    permissions: Permission[];
  };
  notifications: {
    types: string[];
    preferences: NotificationPreferences;
  };
  billing: {
    currency: string;
    taxRate: number;
    terms: string;
  };
  documents: {
    templates: string[];
    storage: StorageConfig;
  };
  data: {
    retention: number;
    backup: BackupConfig;
  };
  system: {
    version: string;
    updates: UpdateConfig;
  };
}
```

Modals:
- SchoolSettingsModal
- UserManagementModal
- SecurityModal
- NotificationSettingsModal
- BillingModal
- DocumentSettingsModal
- DataSettingsModal
- SystemSettingsModal
- ConfirmModal
- AlertModal

Fonctionnalités:
- Configuration établissement
- Gestion utilisateurs
- Sécurité
- Notifications
- Facturation
- Documents
- Données
- Système

7. Module RH (HR)
```typescript
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  contractType: 'CDI' | 'CDD' | 'Alternance';
  salary: number;
  status: 'active' | 'inactive';
  photo: string | null;
}

interface Contract {
  id: string;
  employee: Employee;
  type: 'CDI' | 'CDD' | 'Alternance';
  startDate: string;
  endDate: string;
  salary: number;
  benefits: string[];
  status: 'draft' | 'active' | 'expired';
}
```

Modals:
- EmployeeModal
- ContractModal
- LeaveRequestModal
- PerformanceReviewModal
- TrainingModal
- DocumentModal
- ConfirmModal
- AlertModal

Fonctionnalités:
- Gestion des employés
- Contrats et recrutement
- Congés et absences
- Évaluations
- Formation
- Documents

8. Module QHSE
```typescript
interface Audit {
  id: string;
  title: string;
  date: string;
  type: 'sécurité' | 'qualité' | 'environnement';
  findings: AuditFinding[];
  status: 'planifié' | 'en cours' | 'terminé';
}

interface Incident {
  id: string;
  date: string;
  type: 'accident' | 'incident' | 'presque-accident';
  description: string;
  severity: 'faible' | 'modéré' | 'grave';
  status: 'en cours' | 'traité' | 'fermé';
}
```

Modals:
- AuditModal
- IncidentModal
- ActionPlanModal
- RiskAssessmentModal
- DocumentModal
- ConfirmModal
- AlertModal

Fonctionnalités:
- Audits et contrôles
- Gestion des incidents
- Plans d'action
- Évaluation des risques
- Documentation

9. Module Infirmerie
```typescript
interface MedicalRecord {
  id: string;
  student: Student;
  date: string;
  symptoms: string[];
  diagnosis: string;
  treatment: string;
  followUp: string;
  status: 'ouverte' | 'fermée';
}

interface MedicalCheckup {
  id: string;
  student: Student;
  date: string;
  type: 'régulier' | 'urgent' | 'suivi';
  results: string;
  recommendations: string;
  nextCheckup: string;
}
```

Modals:
- MedicalRecordModal
- MedicalCheckupModal
- AppointmentModal
- EmergencyContactModal
- DocumentModal
- ConfirmModal
- AlertModal

Fonctionnalités:
- Dossiers médicaux
- Consultations
- Suivi médical
- Gestion des urgences
- Vaccinations
- Documents médicaux

### Modals Communs

1. BaseModal
```typescript
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  animation?: 'fade' | 'slide' | 'scale';
  position?: 'top' | 'center' | 'bottom';
  className?: string;
}
```

2. ConfirmModal
```typescript
interface ConfirmModalProps extends BaseModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onConfirm: () => void;
  onCancel?: () => void;
}
```

3. AlertModal
```typescript
interface AlertModalProps extends BaseModalProps {
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  position?: 'top' | 'center' | 'bottom';
  onClose?: () => void;
}
```

4. DocumentModal
```typescript
interface DocumentModalProps extends BaseModalProps {
  documentType: 'pdf' | 'docx' | 'xls';
  template?: string;
  data: Record<string, any>;
  onGenerate: (document: Document) => void;
  onSave?: () => void;
  onClose: () => void;
}
```

5. FilterModal
```typescript
interface FilterModalProps extends BaseModalProps {
  filters: Filter[];
  onFilter: (filters: Filter[]) => void;
  onSave?: () => void;
  onShare?: () => void;
  onClose: () => void;
}
```

6. SearchModal
```typescript
interface SearchModalProps extends BaseModalProps {
  searchFields: SearchField[];
  onSearch: (query: SearchQuery) => void;
  onFilter: (filters: Filter[]) => void;
  onSort: (sort: Sort) => void;
  onClose: () => void;
}
```

7. MenuModal
```typescript
interface MenuModalProps extends BaseModalProps {
  menuItems: MenuItem[];
  onSelect: (item: MenuItem) => void;
  onCloseMenu?: () => void;
  onClose: () => void;
}
```

8. SettingsModal
```typescript
interface SettingsModalProps extends BaseModalProps {
  settings: Record<string, any>;
  onSave: (settings: Record<string, any>) => void;
  onClose: () => void;
}
```

### Types Communs pour les Modals

1. Types de base
```typescript
enum ModalSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl'
}

enum ModalType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning'
}

enum ModalPosition {
  TOP = 'top',
  CENTER = 'center',
  BOTTOM = 'bottom'
}

enum ModalAnimation {
  FADE = 'fade',
  SLIDE = 'slide',
  SCALE = 'scale'
}
```

2. Interfaces de données
```typescript
interface Filter {
  field: string;
  value: any;
  operator: string;
}

interface SearchField {
  name: string;
  type: 'text' | 'date' | 'select';
  label: string;
}

interface SearchQuery {
  [key: string]: any;
}

interface Sort {
  field: string;
  direction: 'asc' | 'desc';
}

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  data: any;
  generatedAt: Date;
  status: 'pending' | 'generated' | 'failed';
}
```

3. Validation
```typescript
interface Validation {
  isValid: boolean;
  errors: Record<string, string[]>;
  validate: (data: any) => boolean;
  formatErrors: (errors: any) => string[];
}
```

4. États et Actions
```typescript
interface ModalState {
  isOpen: boolean;
  data: any;
  loading: boolean;
  error: string | null;
}

interface ModalActions {
  open: (data?: any) => void;
  close: () => void;
  confirm: () => void;
  cancel: () => void;
}
```

### Best Practices pour les Modals

1. Gestion d'état
- Utiliser useState pour l'état local
- Utiliser useReducer pour des états complexes
- Utiliser useContext pour l'état global
- Gérer les chargements et erreurs

2. Validation
- Valider les données avant l'ouverture
- Valider les formulaires
- Gérer les erreurs
- Afficher les messages d'erreur

3. Performance
- Lazy loading des composants
- Memoisation des callbacks
- Optimisation des rendus
- Gestion de la mémoire

4. Accessibilité
- Clavier navigation
- Focus management
- ARIA labels
- Screen reader support

5. Sécurité
- Validation des entrées
- Protection XSS
- Gestion des permissions
- Audit logs
   - Confirmation actions
   - Avertissements
   - Validation
   - Types (success, error, info, warning)

3. AlertModal
   - Notifications
   - Messages
   - Types (success, error, info, warning)
   - Durée
   - Position

4. DocumentModal
   - Génération documents
   - Format (PDF, DOCX)
   - Personnalisation
   - Export
   - Validation

5. FilterModal
   - Filtrage avancé
   - Sauvegarde
   - Partage
   - Validation

6. SearchModal
   - Recherche avancée
   - Filtres
   - Tri
   - Validation

7. MenuModal
   - Navigation
   - Actions
   - Validation

8. ClassModal
   - Gestion classes
   - Professeur
   - Salle
   - Validation

9. RoomModal
   - Gestion salles
   - Capacité
   - Équipements
   - Validation

10. SubjectModal
    - Gestion matières
    - Coefficients
    - Validation

11. BreakModal
    - Gestion pauses
    - Types
    - Durées
    - Validation

12. TeacherModal
    - Gestion enseignants
    - Heures
    - Classes
    - Validation

13. ContractModal
    - Gestion contrats
    - Types
    - Durées
    - Validation

14. TrainingModal
    - Gestion formations
    - Participants
    - Coûts
    - Validation

15. ProductModal
    - Gestion produits
    - Stocks
    - Prix
    - Validation

16. OrderModal
    - Gestion commandes
    - Clients
    - Articles
    - Validation

17. MessageModal
    - Gestion messages
    - Types
    - Templates
    - Validation

18. TemplateModal
    - Gestion templates
    - Variables
    - Validation

### Types et Interfaces Communs

1. Base Types
```typescript
// Types communs
enum ModalSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl'
}

enum ModalType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning'
}

enum ModalPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  CENTER = 'center'
}

// Interfaces communes
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  title?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface Filter {
  field: string;
  value: any;
  operator: string;
}

interface SearchField {
  name: string;
  type: 'text' | 'date' | 'select';
  label: string;
}

interface SearchQuery {
  [key: string]: any;
}

interface Sort {
  field: string;
  direction: 'asc' | 'desc';
}

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

interface Validation {
  isValid: boolean;
  errors: Record<string, string[]>;
}

### Services et Utilitaires

1. Validation Service
```typescript
interface ValidationService {
  validateForm: (data: any, schema: Schema) => Promise<Validation>;
  validateInput: (value: any, rules: ValidationRules) => boolean;
  formatErrors: (errors: any) => string[];
}

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}
```

2. Notification Service
```typescript
interface NotificationService {
  success: (message: string, options?: NotificationOptions) => void;
  error: (message: string, options?: NotificationOptions) => void;
  info: (message: string, options?: NotificationOptions) => void;
  warning: (message: string, options?: NotificationOptions) => void;
}

interface NotificationOptions {
  duration?: number;
  position?: ModalPosition;
  onClose?: () => void;
}
```

3. Modal Service
```typescript
interface ModalService {
  open: <T>(component: React.ComponentType<T>, props: T) => void;
  close: () => void;
  confirm: (options: ConfirmModalProps) => Promise<boolean>;
  alert: (options: AlertModalProps) => Promise<void>;
}
```

4. Document Service
```typescript
interface DocumentService {
  generate: (type: 'pdf' | 'docx', data: any) => Promise<Blob>;
  download: (blob: Blob, filename: string) => void;
  preview: (blob: Blob) => void;
}
```

5. Filter Service
```typescript
interface FilterService {
  apply: (data: any[], filters: Filter[]) => any[];
  save: (name: string, filters: Filter[]) => void;
  load: (name: string) => Filter[];
  share: (filters: Filter[]) => string;
}
```

6. Search Service
```typescript
interface SearchService {
  search: (query: SearchQuery, fields: SearchField[]) => Promise<any[]>;
  filter: (data: any[], filters: Filter[]) => any[];
  sort: (data: any[], sort: Sort) => any[];
}
```

7. Menu Service
```typescript
interface MenuService {
  open: (menu: MenuItem[]) => void;
  close: () => void;
  select: (item: MenuItem) => void;
}
```

8. Cache Service
```typescript
interface CacheService {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T) => Promise<void>;
  delete: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}
```

9. Storage Service
```typescript
interface StorageService {
  upload: (file: File, path: string) => Promise<string>;
  download: (path: string) => Promise<Blob>;
  delete: (path: string) => Promise<void>;
  list: (path: string) => Promise<string[]>;
}
```

10. Date Service
```typescript
interface DateService {
  format: (date: Date, format: string) => string;
  parse: (input: string, format: string) => Date;
  compare: (date1: Date, date2: Date) => number;
  add: (date: Date, amount: number, unit: 'days' | 'months' | 'years') => Date;
}
```

11. Logger Service
```typescript
interface LoggerService {
  info: (message: string, meta?: any) => void;
  error: (error: Error, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
  debug: (message: string, meta?: any) => void;
}
```

### Hooks Personnalisés

1. useModal
```typescript
interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const useModal = (): UseModalReturn => {
  // Implémentation
};
```

2. useForm
```typescript
interface UseFormReturn {
  values: Record<string, any>;
  errors: Record<string, string[]>;
  handleChange: (e: React.ChangeEvent) => void;
  handleSubmit: (e: React.FormEvent) => void;
  reset: () => void;
}

const useForm = (initialValues: Record<string, any>): UseFormReturn => {
  // Implémentation
};
```

3. useFilter
```typescript
interface UseFilterReturn {
  filters: Filter[];
  addFilter: (filter: Filter) => void;
  removeFilter: (index: number) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

const useFilter = (): UseFilterReturn => {
  // Implémentation
};
```

4. useSearch
```typescript
interface UseSearchReturn {
  query: string;
  results: any[];
  loading: boolean;
  search: (query: string) => void;
  clear: () => void;
}

const useSearch = (fields: SearchField[]): UseSearchReturn => {
  // Implémentation
};
```

5. useSort
```typescript
interface UseSortReturn {
  sort: Sort;
  toggleSort: (field: string) => void;
  sortedData: any[];
}

const useSort = (data: any[]): UseSortReturn => {
  // Implémentation
};
```

6. useNotification
```typescript
interface UseNotificationReturn {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const useNotification = (): UseNotificationReturn => {
  // Implémentation
};
```

7. useValidation
```typescript
interface UseValidationReturn {
  isValid: boolean;
  errors: Record<string, string[]>;
  validate: (data: any) => void;
  reset: () => void;
}

const useValidation = (rules: ValidationRules): UseValidationReturn => {
  // Implémentation
};
```

8. useCache
```typescript
interface UseCacheReturn {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, value: T) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const useCache = (): UseCacheReturn => {
  // Implémentation
};
```

9. useStorage
```typescript
interface UseStorageReturn {
  upload: (file: File) => Promise<string>;
  download: (path: string) => Promise<Blob>;
  delete: (path: string) => Promise<void>;
  list: () => Promise<string[]>;
}

const useStorage = (): UseStorageReturn => {
  // Implémentation
};
```

10. useDocument
```typescript
interface UseDocumentReturn {
  generate: (type: 'pdf' | 'docx') => Promise<Blob>;
  download: (blob: Blob) => void;
  preview: (blob: Blob) => void;
}

const useDocument = (): UseDocumentReturn => {
  // Implémentation
};
```

### Contextes React

1. AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  token: string | null;
}

interface Credentials {
  email: string;
  password: string;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
```

2. ModalContext
```typescript
interface ModalContextType {
  openModal: <T>(component: React.ComponentType<T>, props: T) => void;
  closeModal: () => void;
  currentModal: React.ReactNode | null;
}

const ModalContext = React.createContext<ModalContextType | undefined>(undefined);
```

3. NotificationContext
```typescript
interface NotificationContextType {
  notify: (type: ModalType, message: string, options?: NotificationOptions) => void;
  clear: () => void;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);
```

4. FilterContext
```typescript
interface FilterContextType {
  filters: Filter[];
  addFilter: (filter: Filter) => void;
  removeFilter: (index: number) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

const FilterContext = React.createContext<FilterContextType | undefined>(undefined);
```

5. SearchContext
```typescript
interface SearchContextType {
  query: string;
  results: any[];
  loading: boolean;
  search: (query: string) => void;
  clear: () => void;
}

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);
```

6. SortContext
```typescript
interface SortContextType {
  sort: Sort;
  toggleSort: (field: string) => void;
  sortedData: any[];
}

const SortContext = React.createContext<SortContextType | undefined>(undefined);
```

7. ValidationContext
```typescript
interface ValidationContextType {
  isValid: boolean;
  errors: Record<string, string[]>;
  validate: (data: any) => void;
  reset: () => void;
}

const ValidationContext = React.createContext<ValidationContextType | undefined>(undefined);
```

8. CacheContext
```typescript
interface CacheContextType {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, value: T) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CacheContext = React.createContext<CacheContextType | undefined>(undefined);
```

9. StorageContext
```typescript
interface StorageContextType {
  upload: (file: File) => Promise<string>;
  download: (path: string) => Promise<Blob>;
  delete: (path: string) => Promise<void>;
  list: () => Promise<string[]>;
}

const StorageContext = React.createContext<StorageContextType | undefined>(undefined);
```

10. DocumentContext
```typescript
interface DocumentContextType {
  generate: (type: 'pdf' | 'docx') => Promise<Blob>;
  download: (blob: Blob) => void;
  preview: (blob: Blob) => void;
}

const DocumentContext = React.createContext<DocumentContextType | undefined>(undefined);
```

### Interfaces Modals
1. BaseModalProps
```typescript
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  title?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}
```

2. ConfirmModalProps
```typescript
interface ConfirmModalProps extends BaseModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ModalType;
  onConfirm: () => void;
}
```

3. AlertModalProps
```typescript
interface AlertModalProps extends BaseModalProps {
  title: string;
  message: string;
  type: ModalType;
  duration?: number;
  position?: ModalPosition;
}
```

4. DocumentModalProps
```typescript
interface DocumentModalProps extends BaseModalProps {
  documentType: 'pdf' | 'docx';
  template?: string;
  data: Record<string, any>;
  onGenerate: (document: Document) => void;
}
```

5. FilterModalProps
```typescript
interface FilterModalProps extends BaseModalProps {
  filters: Filter[];
  onFilter: (filters: Filter[]) => void;
  onSave?: () => void;
  onShare?: () => void;
}
```

6. SearchModalProps
```typescript
interface SearchModalProps extends BaseModalProps {
  searchFields: SearchField[];
  onSearch: (query: SearchQuery) => void;
  onFilter: (filters: Filter[]) => void;
  onSort: (sort: Sort) => void;
}
```

7. MenuModalProps
```typescript
interface MenuModalProps extends BaseModalProps {
  menuItems: MenuItem[];
  onSelect: (item: MenuItem) => void;
  onCloseMenu?: () => void;
}
```

8. ClassModalProps
```typescript
interface ClassModalProps extends BaseModalProps {
  class?: Class;
  teachers: Teacher[];
  rooms: Room[];
  onSave: (classData: Class) => void;
}
```

9. RoomModalProps
```typescript
interface RoomModalProps extends BaseModalProps {
  room?: Room;
  equipment: Equipment[];
  onSave: (roomData: Room) => void;
}
```

10. SubjectModalProps
```typescript
interface SubjectModalProps extends BaseModalProps {
  subject?: Subject;
  onSave: (subjectData: Subject) => void;
}
```

11. BreakModalProps
```typescript
interface BreakModalProps extends BaseModalProps {
  break?: Break;
  onSave: (breakData: Break) => void;
}
```

12. TeacherModalProps
```typescript
interface TeacherModalProps extends BaseModalProps {
  teacher?: Teacher;
  classes: Class[];
  onSave: (teacherData: Teacher) => void;
}
```

13. ContractModalProps
```typescript
interface ContractModalProps extends BaseModalProps {
  contract?: Contract;
  onSave: (contractData: Contract) => void;
}
```

14. TrainingModalProps
```typescript
interface TrainingModalProps extends BaseModalProps {
  training?: Training;
  participants: Participant[];
  onSave: (trainingData: Training) => void;
}
```

15. ProductModalProps
```typescript
interface ProductModalProps extends BaseModalProps {
  product?: Product;
  onSave: (productData: Product) => void;
}
```

16. OrderModalProps
```typescript
interface OrderModalProps extends BaseModalProps {
  order?: Order;
  onSave: (orderData: Order) => void;
}
```

17. MessageModalProps
```typescript
interface MessageModalProps extends BaseModalProps {
  message?: Message;
  onSave: (messageData: Message) => void;
}
```

18. TemplateModalProps
```typescript
interface TemplateModalProps extends BaseModalProps {
  template?: Template;
  onSave: (templateData: Template) => void;
}
```

   - Actions correctives

2. AuditModal
   - Planification des audits
   - Rapports d'audit
   - Suivi des actions

3. TrainingModal
   - Formation sécurité
   - Tests de connaissances
   - Certification

## 8. Module Boutique

### Structure Principale
```tsx
// Boutique.tsx
- Catalogue produits
- Gestion des stocks
- Commandes en ligne
- Paiements
- Statistiques
```

### Modals
1. AddProductModal
   - Ajout produits
   - Gestion stocks
   - Prix et promotions

2. OrderModal
   - Commande produits
   - Paiement
   - Suivi livraison

3. StockModal
   - Gestion stocks
   - Alertes réapprovisionnement
   - Historique mouvements

## 9. Module Communication

### Structure Principale
```tsx
// Communication.tsx
- Messagerie
- Notifications
- Annuaire
- Calendrier
- Documents partagés
```

### Modals
1. SendMessageModal
   - Rédaction messages
   - Attachements
   - Historique

2. NotificationModal
   - Configuration notifications
   - Gestion préférences
   - Rapports

3. DocumentShareModal
   - Partage documents
   - Droits d'accès
   - Historique versions

## 10. Module Settings

### Structure Principale
```tsx
// Settings.tsx
- Configuration générale
- Gestion utilisateurs
- Sécurité
- Intégrations
- Maintenance
```

### Modals
1. UserManagementModal
   - Création utilisateurs
   - Gestion rôles
   - Droits d'accès

2. SecurityModal
   - Configuration sécurité
   - Audit
   - Logs

3. IntegrationModal
   - Connexion API
   - Configuration services
   - Tests intégration

## Architecture Commune

### Composants Partagés
1. ModalBase
   - Base pour tous les modals
   - Gestion état
   - Validation

2. FormComponents
   - Champs de formulaire
   - Validation
   - Messages d'erreur

3. DataGrid
   - Tableaux de données
   - Filtrage
   - Tri
   - Pagination

### API et Services
1. GraphQL API
   - Requêtes optimisées
   - Cache
   - Error handling

2. Services
   - Authentification
   - Notifications
   - Logs
   - Audit

### Sécurité
1. RBAC
   - Gestion rôles
   - Droits d'accès
   - Audit

2. Validation
   - Données
   - Formats
   - Sécurité

### Performance
1. Optimisations
   - Lazy loading
   - Caching
   - Requêtes optimisées

2. Monitoring
   - Performance
   - Erreurs
   - Utilisation

## Documentation Technique

### Composants Principaux
```tsx
// Base components
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Form components
interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  validation?: (value: any) => boolean;
}

// Data grid
interface GridProps {
  columns: Array<{
    field: string;
    headerName: string;
    width: number;
  }>;
  rows: any[];
  pageSize?: number;
}
```

### API GraphQL
```graphql
# Queries
query GetModuleData($module: String!) {
  data: getModuleData(module: $module) {
    items
    total
    filters
  }
}

# Mutations
mutation UpdateModuleData($module: String!, $data: ModuleInput!) {
  update: updateModuleData(module: $module, data: $data) {
    success
    message
  }
}
```

### Security
```typescript
interface SecurityContext {
  user: User;
  roles: string[];
  permissions: string[];
  can: (action: string, resource: string) => boolean;
}
```

## Best Practices

1. Code Quality
   - TypeScript
   - Linting
   - Testing

2. Performance
   - Optimisation
   - Caching
   - Lazy loading

3. Security
   - Validation
   - Protection
   - Audit
