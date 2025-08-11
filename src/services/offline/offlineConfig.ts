export interface OfflineEndpointConfig {
  strategy: 'server-wins' | 'client-wins' | 'merge' | 'manual';
  priority: 'high' | 'medium' | 'low';
  ttl?: number; // Time to live in milliseconds
}

export const OFFLINE_CONFIG: Record<string, OfflineEndpointConfig> = {
  // Module Students
  '/api/students': { strategy: 'merge', priority: 'high', ttl: 7 * 24 * 60 * 60 * 1000 },
  '/api/students/enrollments': { strategy: 'client-wins', priority: 'high' },
  '/api/students/grades': { strategy: 'manual', priority: 'high' },
  '/api/students/attendance': { strategy: 'client-wins', priority: 'high' },

  // Module Transport
  '/api/transport/buses': { strategy: 'server-wins', priority: 'high' },
  '/api/transport/routes': { strategy: 'merge', priority: 'high' },
  '/api/transport/drivers': { strategy: 'server-wins', priority: 'medium' },
  '/api/transport/bookings': { strategy: 'client-wins', priority: 'high' },

  // Module Boutique
  '/api/boutique/products': { strategy: 'server-wins', priority: 'medium' },
  '/api/boutique/orders': { strategy: 'client-wins', priority: 'high' },
  '/api/boutique/inventory': { strategy: 'merge', priority: 'medium' },
  '/api/boutique/sales': { strategy: 'manual', priority: 'high' },

  // Module Cafeteria
  '/api/cafeteria/menus': { strategy: 'server-wins', priority: 'medium' },
  '/api/cafeteria/reservations': { strategy: 'client-wins', priority: 'high' },
  '/api/cafeteria/inventory': { strategy: 'merge', priority: 'low' },
  '/api/cafeteria/orders': { strategy: 'client-wins', priority: 'high' },

  // Module Communication
  '/api/communication/messages': { strategy: 'merge', priority: 'high' },
  '/api/communication/notifications': { strategy: 'client-wins', priority: 'medium' },
  '/api/communication/broadcasts': { strategy: 'server-wins', priority: 'low' },
  '/api/communication/alerts': { strategy: 'server-wins', priority: 'high' },

  // Module Educast
  '/api/educast/courses': { strategy: 'server-wins', priority: 'medium' },
  '/api/educast/videos': { strategy: 'server-wins', priority: 'low' },
  '/api/educast/progress': { strategy: 'client-wins', priority: 'high' },
  '/api/educast/assignments': { strategy: 'merge', priority: 'high' },

  // Module Finance
  '/api/finance/invoices': { strategy: 'server-wins', priority: 'high' },
  '/api/finance/payments': { strategy: 'manual', priority: 'high' },
  '/api/finance/accounting': { strategy: 'server-wins', priority: 'medium' },
  '/api/finance/reports': { strategy: 'server-wins', priority: 'low' },

  // Module Health
  '/api/health/records': { strategy: 'manual', priority: 'high' },
  '/api/health/appointments': { strategy: 'client-wins', priority: 'high' },
  '/api/health/medications': { strategy: 'server-wins', priority: 'high' },
  '/api/health/emergencies': { strategy: 'server-wins', priority: 'high' },

  // Module HR
  '/api/hr/employees': { strategy: 'server-wins', priority: 'medium' },
  '/api/hr/leaves': { strategy: 'manual', priority: 'high' },
  '/api/hr/payroll': { strategy: 'server-wins', priority: 'low' },
  '/api/hr/recruitment': { strategy: 'merge', priority: 'medium' },

  // Module Laboratory
  '/api/laboratory/equipment': { strategy: 'server-wins', priority: 'medium' },
  '/api/laboratory/experiments': { strategy: 'client-wins', priority: 'high' },
  '/api/laboratory/reservations': { strategy: 'merge', priority: 'high' },
  '/api/laboratory/results': { strategy: 'manual', priority: 'high' },

  // Module Library
  '/api/library/books': { strategy: 'server-wins', priority: 'medium' },
  '/api/library/loans': { strategy: 'client-wins', priority: 'high' },
  '/api/library/reservations': { strategy: 'merge', priority: 'high' },
  '/api/library/catalog': { strategy: 'server-wins', priority: 'low' },

  // Module Planning
  '/api/planning/schedules': { strategy: 'client-wins', priority: 'high' },
  '/api/planning/rooms': { strategy: 'server-wins', priority: 'medium' },
  '/api/planning/conflicts': { strategy: 'manual', priority: 'high' },
  '/api/planning/events': { strategy: 'merge', priority: 'medium' },

  // Module QHSE
  '/api/qhse/incidents': { strategy: 'client-wins', priority: 'high' },
  '/api/qhse/audits': { strategy: 'manual', priority: 'medium' },
  '/api/qhse/procedures': { strategy: 'server-wins', priority: 'low' },
  '/api/qhse/compliance': { strategy: 'server-wins', priority: 'medium' },

  // Module Settings
  '/api/settings/config': { strategy: 'server-wins', priority: 'low' },
  '/api/settings/users': { strategy: 'manual', priority: 'medium' },
  '/api/settings/permissions': { strategy: 'server-wins', priority: 'high' },
  '/api/settings/tenants': { strategy: 'server-wins', priority: 'high' },

  // Module Examen
  '/api/examen/exams': { strategy: 'server-wins', priority: 'high' },
  '/api/examen/grades': { strategy: 'manual', priority: 'high' },
  '/api/examen/planning': { strategy: 'merge', priority: 'high' },
  '/api/examen/surveillance': { strategy: 'client-wins', priority: 'high' },

  // API de test
  '/api/ping': { strategy: 'server-wins', priority: 'low' }
};