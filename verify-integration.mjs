import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Vérification de l\'intégration backend-frontend...\n');

// Vérifier la structure du backend
const backendChecks = [
  'package.json',
  'src/server.js',
  'src/routes',
  'prisma/schema.prisma',
  '.env.example'
];

// Vérifier la structure du frontend
const frontendChecks = [
  'src/services/api/config.ts',
  'src/services/api/index.ts',
  'src/services/api/auth.ts',
  'vite.config.ts',
  '.env.example'
];

let allGood = true;

console.log('📁 Backend structure:');
backendChecks.forEach(check => {
  const exists = fs.existsSync(path.join(__dirname, 'backend', check));
  console.log(`  ${exists ? '✅' : '❌'} ${check}`);
  if (!exists) allGood = false;
});

console.log('\n📁 Frontend API services:');
frontendChecks.forEach(check => {
  const exists = fs.existsSync(path.join(__dirname, check));
  console.log(`  ${exists ? '✅' : '❌'} ${check}`);
  if (!exists) allGood = false;
});

// Vérifier les scripts npm
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const hasBackendScripts = packageJson.scripts && packageJson.scripts['dev:backend'];
  console.log(`\n📦 NPM Scripts:`);
  console.log(`  ${hasBackendScripts ? '✅' : '❌'} Scripts backend configurés`);

  // Vérifier la configuration Vite
  const viteConfig = fs.readFileSync(path.join(__dirname, 'vite.config.ts'), 'utf8');
  const hasProxy = viteConfig.includes('proxy');
  console.log(`  ${hasProxy ? '✅' : '❌'} Configuration proxy Vite`);
} catch (error) {
  console.log(`  ❌ Erreur lors de la lecture des fichiers: ${error.message}`);
  allGood = false;
}

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 Intégration complète ! Tout est prêt.');
  console.log('\nProchaines étapes:');
  console.log('1. npm install');
  console.log('2. npm run install:backend');
  console.log('3. Configurer backend/.env');
  console.log('4. npm run start');
} else {
  console.log('⚠️  Certains fichiers manquent. Veuillez vérifier.');
}
console.log('='.repeat(50));
