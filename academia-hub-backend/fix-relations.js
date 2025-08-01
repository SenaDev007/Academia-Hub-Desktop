const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf-8');

// Liste des champs à ajouter au modèle School
const fieldsToAdd = [
  '// Relations avec les modèles manquants',
  '  workHours       WorkHours[]',
  '  rooms           Room[]',
  '  roomReservations RoomReservation[]',
  '  scheduleEntries ScheduleEntry[]',
  '  feeConfigurations FeeConfiguration[]',
  '  closingDays     ClosingDay[]',
  '  invoices        Invoice[]',
  '  invoiceItems    InvoiceItem[]',
  '  feeTypes        FeeType[]',
  '  schedules       Schedule[]',
  '  closingDayPayments ClosingDay[] @relation("ClosingDayPayments")',
  '  closingDayCreatedBy ClosingDay[] @relation("ClosingDayCreatedBy")',
  '  closingDayClosedBy ClosingDay[] @relation("ClosingDayClosedBy")',
  '  // Fin des relations ajoutées' 
].join('\n');

// Trouver la position pour insérer les champs (juste avant le dernier '}' du modèle School)
const schoolModelRegex = /model School \{[\s\S]*?\n\}/;
const schoolModelMatch = content.match(schoolModelRegex);

if (schoolModelMatch) {
  const schoolModel = schoolModelMatch[0];
  const updatedSchoolModel = schoolModel.replace(/\n\}/, `\n${fieldsToAdd}\n}`);
  content = content.replace(schoolModelRegex, updatedSchoolModel);
}

// Ajouter les relations manquantes pour les autres modèles
const relationsToAdd = [
  // Ajouter la relation inverse pour Student.scheduleEntries
  { 
    model: 'model Student',
    field: '  scheduleEntries ScheduleEntry[] @relation("StudentScheduleEntries")',
    position: 'before' // Ajouter avant le dernier '}'
  },
  // Ajouter la relation inverse pour Class.scheduleEntries (FromClass)
  { 
    model: 'model Class',
    field: '  fromScheduleEntries ScheduleEntry[] @relation("FromClass")',
    position: 'before'
  },
  // Ajouter la relation inverse pour Class.scheduleEntries (ToClass)
  { 
    model: 'model Class',
    field: '  toScheduleEntries ScheduleEntry[] @relation("ToClass")',
    position: 'before'
  },
  // Ajouter la relation inverse pour FeeType.feeConfigurations
  { 
    model: 'model FeeType',
    field: '  configurations FeeConfiguration[]',
    position: 'before'
  },
  // Ajouter la relation inverse pour FeeType.invoiceItems
  { 
    model: 'model FeeType',
    field: '  invoiceItems InvoiceItem[]',
    position: 'before'
  },
  // Ajouter la relation inverse pour User.createdClosingDays
  { 
    model: 'model User',
    field: '  createdClosingDays ClosingDay[] @relation("ClosingDayCreatedBy")',
    position: 'before'
  },
  // Ajouter la relation inverse pour User.closedClosingDays
  { 
    model: 'model User',
    field: '  closedClosingDays ClosingDay[] @relation("ClosingDayClosedBy")',
    position: 'before'
  },
  // Ajouter la relation inverse pour Payment.invoice
  { 
    model: 'model Payment',
    field: '  invoice Invoice? @relation(fields: [invoiceId], references: [id])\n  invoiceId String?',
    position: 'before',
    replace: true
  },
  // Ajouter la relation inverse pour Payment.closingDay
  { 
    model: 'model Payment',
    field: '  closingDay ClosingDay? @relation(fields: [closingDayId], references: [id])\n  closingDayId String?',
    position: 'before',
    replace: true
  },
  // Ajouter la relation inverse pour Room.schedules
  { 
    model: 'model Room',
    field: '  schedules Schedule[]',
    position: 'before',
    replace: false
  },
  // Ajouter la relation inverse pour Schedule.room
  { 
    model: 'model Schedule',
    field: '  room Room? @relation(fields: [roomId], references: [id])\n  roomId String?',
    position: 'before',
    replace: true
  }
];

// Fonction pour ajouter un champ à un modèle
function addFieldToModel(modelName, field, position = 'before', replace = false) {
  const modelRegex = new RegExp(`(${modelName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\{[^}]*)\\}`);
  const modelMatch = content.match(modelRegex);
  
  if (modelMatch) {
    let updatedModel = modelMatch[1];
    
    if (replace) {
      // Remplacer le champ existant
      updatedModel = updatedModel.replace(/\s+[^\s]+\s+\w+\?\s+@relation\([^)]+\)\s+\w+\?/g, '');
      updatedModel = updatedModel.replace(/\s+\w+\s+\w+\?/g, '');
    }
    
    if (position === 'before') {
      updatedModel = `${updatedModel}\n${field}\n`;
    } else {
      updatedModel = `\n${field}${updatedModel}`;
    }
    
    content = content.replace(modelRegex, `${updatedModel}}`);
  }
}

// Ajouter tous les champs de relation manquants
relationsToAdd.forEach(({ model, field, position, replace }) => {
  addFieldToModel(model, field, position, replace);
});

// Écrire le contenu mis à jour dans un nouveau fichier
const fixedPath = schemaPath + '.fixed';
fs.writeFileSync(fixedPath, content);
console.log(`Fixed schema written to: ${fixedPath}`);

console.log('\nTo apply changes, run:');
console.log(`cp -f "${fixedPath}" "${schemaPath}"`);
