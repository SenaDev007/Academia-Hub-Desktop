const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf-8');

// Liste des modèles uniques
const uniqueModels = new Set();
const lines = content.split('\n');
const cleanLines = [];
let currentModel = null;
let skipUntilNextModel = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Détecter le début d'un modèle
  if (line.startsWith('model ')) {
    const modelName = line.split(' ')[1];
    
    if (uniqueModels.has(modelName)) {
      console.log(`Found duplicate model: ${modelName}, skipping...`);
      skipUntilNextModel = true;
      continue;
    }
    
    uniqueModels.add(modelName);
    currentModel = modelName;
    skipUntilNextModel = false;
  }
  
  // Si on est dans un modèle en double, on le saute
  if (skipUntilNextModel) {
    if (line === '}' && currentModel) {
      skipUntilNextModel = false;
      currentModel = null;
    }
    continue;
  }
  
  // Ajouter la ligne au résultat si on ne la saute pas
  cleanLines.push(lines[i]);
}

// Écrire le contenu nettoyé dans un nouveau fichier
const cleanContent = cleanLines.join('\n');
const backupPath = schemaPath + '.backup';
const cleanPath = schemaPath + '.clean';

// Créer une sauvegarde
fs.writeFileSync(backupPath, content);
console.log(`Backup created at: ${backupPath}`);

// Écrire le contenu nettoyé
fs.writeFileSync(cleanPath, cleanContent);
console.log(`Cleaned schema written to: ${cleanPath}`);

console.log('\nTo apply changes, run:');
console.log(`copy /Y ${cleanPath} ${schemaPath}`);
