# 🚀 Plan d'Implémentation Backend PostgreSQL

## 📊 Analyse des Modules

### Modules Identifiés:
1. **Gestion Élèves** - CRUD élèves, absences, discipline
2. **Gestion Enseignants** - CRUD enseignants, affectations
3. **Module Examens** - Saisie notes, bulletins, statistiques
4. **Module Planning** - Cahier journal, fiches pédagogiques
5. **Gestion Financière** - Paie béninoise (CNSS/IRPP)
6. **EduCast IA** - Cours vidéo avec IA
7. **Réservations** - Salles, laboratoires
8. **Multi-Tenant** - Écoles, abonnements, KYC

## 🗄️ Architecture PostgreSQL

### 1. Structure des Tables Principales

```sql
-- Écoles (Multi-tenant)
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'starter',
    status VARCHAR(50) DEFAULT 'pending_payment',
    settings JSONB,
    max_students INT,
    max_teachers INT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Élèves
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id),
    matricule VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    class_id UUID REFERENCES classes(id),
    date_of_birth DATE,
    gender VARCHAR(10),
    parent_phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'active',
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enseignants
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    salary DECIMAL(10,2),
    hire_date DATE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Classes
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id),
    academic_year_id UUID REFERENCES academic_years(id),
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    capacity INT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Matières
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    coefficient FLOAT DEFAULT 1,
    level VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notes
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id),
    subject_id UUID REFERENCES subjects(id),
    class_id UUID REFERENCES classes(id),
    teacher_id UUID REFERENCES teachers(id),
    trimester VARCHAR(10) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL,
    value DECIMAL(4,2) NOT NULL,
    max_value DECIMAL(4,2) DEFAULT 20,
    coefficient FLOAT DEFAULT 1,
    comment TEXT,
    date DATE DEFAULT NOW()
);

-- Absences
CREATE TABLE absences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id),
    class_id UUID REFERENCES classes(id),
    date DATE NOT NULL,
    type VARCHAR(50) DEFAULT 'justified',
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Discipline
CREATE TABLE discipline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id),
    class_id UUID REFERENCES classes(id),
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    date DATE DEFAULT NOW(),
    action_taken TEXT
);

-- Emploi du temps
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id),
    class_id UUID REFERENCES classes(id),
    teacher_id UUID REFERENCES teachers(id),
    subject_id UUID REFERENCES subjects(id),
    day_of_week INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

-- Paie (Bénin)
CREATE TABLE payrolls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id),
    teacher_id UUID REFERENCES teachers(id),
    month INT NOT NULL,
    year INT NOT NULL,
    base_salary DECIMAL(10,2) NOT NULL,
    cnss_employee DECIMAL(10,2),
    cnss_employer DECIMAL(10,2),
    irpp DECIMAL(10,2),
    net_salary DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(school_id, teacher_id, month, year)
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id),
    student_id UUID REFERENCES students(id),
    type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Plan d'Implémentation par Phases

### Phase 1: Infrastructure (Jours 1-3)
- [ ] Configuration PostgreSQL
- [ ] Installation Node.js + Express
- [ ] Configuration Prisma ORM
- [ ] Structure projet backend
- [ ] Variables d'environnement

### Phase 2: Authentification (Jours 4-6)
- [ ] JWT authentication
- [ ] Middleware multi-tenant
- [ ] Gestion des rôles
- [ ] Validation des données
- [ ] Rate limiting

### Phase 3: CRUD Core (Jours 7-12)
- [ ] Routes écoles
- [ ] Routes utilisateurs
- [ ] Routes élèves
- [ ] Routes enseignants
- [ ] Routes classes
- [ ] Routes matières

### Phase 4: Module Examens (Jours 13-16)
- [ ] Système de notes
- [ ] Calcul des moyennes
- [ ] Génération bulletins
- [ ] Tableaux d'honneur
- [ ] Export PDF

### Phase 5: Planning & Finance (Jours 17-20)
- [ ] Emploi du temps
- [ ] Cahier journal
- [ ] Fiches pédagogiques
- [ ] Calcul paie béninoise
- [ ] CNSS/IRPP

### Phase 6: Services Avancés (Jours 21-24)
- [ ] Upload fichiers
- [ ] Notifications email/SMS
- [ ] Cache Redis
- [ ] Analytics
- [ ] Logs et audit

### Phase 7: Tests & Déploiement (Jours 25-28)
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Documentation API
- [ ] Docker setup
- [ ] CI/CD pipeline

## 🔧 Configuration Backend

### package.json
```json
{
  "name": "academia-hub-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "prisma migrate dev",
    "seed": "prisma db seed"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "@prisma/client": "^5.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5",
    "nodemailer": "^6.9.0",
    "twilio": "^4.0.0"
  }
}
```

### .env.example
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/academia_hub_pro"

# Auth
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SMS
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# File Upload
UPLOAD_DIR=uploads/
MAX_FILE_SIZE=5242880

# Redis
REDIS_URL=redis://localhost:6379
```

## 📱 Endpoints API Principaux

### Authentification
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/refresh

### Élèves
- GET /api/:schoolId/students
- POST /api/:schoolId/students
- GET /api/:schoolId/students/:id
- PUT /api/:schoolId/students/:id
- DELETE /api/:schoolId/students/:id

### Notes
- GET /api/:schoolId/grades
- POST /api/:schoolId/grades
- GET /api/:schoolId/grades/student/:studentId
- GET /api/:schoolId/grades/class/:classId

### Bulletins
- GET /api/:schoolId/reports/report-card/:studentId
- POST /api/:schoolId/reports/generate

### Paie
- POST /api/:schoolId/payroll/calculate/:teacherId
- GET /api/:schoolId/payroll/:month/:year
- GET /api/:schoolId/payroll/teacher/:teacherId

## 🎯 Prochaines Étapes

1. **Configuration initiale** - Suivre la Phase 1
2. **Tests avec Postman** - Valider chaque endpoint
3. **Intégration frontend** - Connecter les composants React
4. **Optimisation performance** - Index PostgreSQL, cache Redis
5. **Monitoring** - Logs, métriques, alertes

## 📞 Support & Ressources

- **Documentation Prisma**: https://prisma.io/docs
- **Express.js Guide**: https://expressjs.com/guide
- **PostgreSQL Best Practices**: https://postgresql.org/docs
- **JWT Authentication**: https://jwt.io/introduction
