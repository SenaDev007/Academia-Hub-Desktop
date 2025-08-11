# Guide d'Intégration Backend-Frontend

Ce guide vous accompagne pour intégrer complètement le backend dans votre projet Academia Hub Pro.

## 🚀 Installation Rapide

### 1. Installation des dépendances
```bash
# Installer toutes les dépendances (frontend + backend)
npm run setup
```

### 2. Configuration de l'environnement

#### Backend (backend/.env)
```bash
# Copier le fichier d'exemple
cp backend/.env.example backend/.env

# Configurer les variables
DATABASE_URL="postgresql://user:password@localhost:5432/academia_hub"
JWT_SECRET="your-secret-key"
PORT=3001
```

#### Frontend (.env.local)
```bash
# Copier le fichier d'exemple
cp .env.example .env.local

# Configurer l'URL de l'API
VITE_API_BASE_URL="http://localhost:3001/api"
```

### 3. Initialisation de la base de données
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Lancement du projet complet
```bash
# Lancer backend et frontend simultanément
npm run start

# Ou séparément :
npm run dev:backend  # Terminal 1
npm run dev:frontend # Terminal 2
```

## 🏗️ Architecture de l'API

### Structure des services
```
src/services/api/
├── config.ts         # Configuration Axios
├── index.ts          # Export de tous les services
├── auth.ts           # Authentification
├── schools.ts        # Écoles
├── students.ts       # Étudiants
├── classes.ts        # Classes
├── teachers.ts       # Enseignants
├── subjects.ts       # Matières
├── grades.ts         # Notes
├── academicYears.ts  # Années académiques
├── dashboard.ts      # Tableau de bord
├── exams.ts          # Examens
├── schedules.ts      # Emplois du temps
├── finance.ts        # Finance
├── reports.ts        # Rapports
└── notifications.ts  # Notifications
```

### Utilisation dans les composants

#### Hook personnalisé (useApi)
```typescript
import { useApi } from '../hooks/useApi';
import { studentsService } from '../services/api';

function StudentsList() {
  const { data, loading, error, refetch } = useApi(
    () => studentsService.getStudents(),
    { immediate: true }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.students.map(student => (
        <div key={student.id}>{student.firstName} {student.lastName}</div>
      ))}
    </div>
  );
}
```

#### Utilisation directe
```typescript
import { authService } from '../services/api';

async function handleLogin(email: string, password: string) {
  try {
    const response = await authService.login({ email, password });
    console.log('Logged in:', response.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

## 🔧 Configuration du Proxy

Le proxy est déjà configuré dans `vite.config.ts` :

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

## 🧪 Test de l'Intégration

### Composant de test
Un composant `ApiTest.tsx` est disponible pour tester l'intégration :

```typescript
// Importer et utiliser dans App.tsx
import ApiTest from './components/ApiTest';

function App() {
  return (
    <div>
      <ApiTest />
    </div>
  );
}
```

### Endpoints de test
- **Backend Health**: GET http://localhost:3001/api/health
- **Login**: POST http://localhost:3001/api/auth/login
- **Students**: GET http://localhost:3001/api/students
- **Classes**: GET http://localhost:3001/api/classes

## 📋 Scripts Disponibles

```bash
# Installation
npm run setup          # Installe toutes les dépendances
npm run install:backend # Installe uniquement backend

# Développement
npm run start          # Lance backend + frontend
npm run dev:full       # Alias pour start
npm run dev:backend    # Lance uniquement backend
npm run dev:frontend   # Lance uniquement frontend

# Build
npm run build          # Build frontend
npm run preview        # Preview frontend build
```

## 🔐 Authentification

### Flow d'authentification
1. Login via `authService.login()`
2. Token stocké dans localStorage
3. Intercepteur Axios ajoute automatiquement le token
4. Logout via `authService.logout()`

### Exemple d'utilisation
```typescript
import { authService } from '../services/api';

// Login
const login = async () => {
  const response = await authService.login({
    email: 'admin@school.com',
    password: 'password'
  });
  
  // Le token est automatiquement stocké
  console.log('User:', response.user);
};

// Vérifier l'authentification
const isAuth = authService.isAuthenticated();
const user = authService.getCurrentUser();
```

## 🐛 Dépannage

### Problèmes courants

#### 1. CORS Error
- Vérifiez que le backend tourne sur localhost:3001
- Le proxy Vite devrait résoudre les problèmes CORS

#### 2. Module not found
- Assurez-vous d'avoir exécuté `npm run setup`
- Vérifiez que le dossier `backend/node_modules` existe

#### 3. Database connection
- Vérifiez DATABASE_URL dans backend/.env
- Assurez-vous que PostgreSQL est en cours d'exécution

#### 4. Port already in use
- Backend: Changez PORT dans backend/.env
- Frontend: Changez le port dans vite.config.ts

### Logs de débogage
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
npm run dev:frontend

# Vérifier les endpoints
curl http://localhost:3001/api/health
curl http://localhost:3001/api/auth/me -H "Authorization: Bearer YOUR_TOKEN"
```

## 📁 Structure du Projet Complet

```
Academia Hub Pro/
├── backend/                    # Backend Express + Prisma
│   ├── src/
│   │   ├── routes/            # Routes API
│   │   ├── controllers/       # Contrôleurs
│   │   ├── models/           # Modèles Prisma
│   │   └── server.js         # Point d'entrée
│   ├── prisma/
│   └── .env                  # Variables backend
├── src/
│   ├── services/api/         # Services API frontend
│   ├── hooks/               # Hooks React
│   ├── components/          # Composants React
│   └── ...                  # Autres fichiers frontend
├── .env.local               # Variables frontend
└── INTEGRATION_GUIDE.md     # Ce guide
```

## 🎯 Prochaines Étapes

1. **Configurer votre base de données** avec vos données réelles
2. **Tester l'authentification** avec vos utilisateurs
3. **Intégrer les services API** dans vos composants existants
4. **Ajouter des tests** pour vos composants
5. **Configurer le déploiement** (staging/production)

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs dans les terminaux
2. Consultez la documentation backend dans `backend/SETUP.md`
3. Testez avec le composant `ApiTest.tsx`
4. Contactez l'équipe de développement
