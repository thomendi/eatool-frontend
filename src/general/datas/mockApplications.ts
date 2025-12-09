export interface Application {
  id: string;
  name: string;
  version: string;
  activeUsers: number;
  developer: string;
  description: string;
  status: 'active' | 'maintenance' | 'deprecated';
  lastUpdated: string;
}

export const mockApplications: Application[] = [
  {
    id: '1',
    name: 'CRM Principal',
    version: '3.2.1',
    activeUsers: 156,
    developer: 'SCI Solutions',
    description: 'Sistema de gestión de relaciones con clientes. Permite el seguimiento de leads, oportunidades de venta y gestión de contactos empresariales.',
    status: 'active',
    lastUpdated: '2024-12-01'
  },
  {
    id: '2',
    name: 'ERP Financiero',
    version: '5.0.0',
    activeUsers: 89,
    developer: 'SCI Solutions',
    description: 'Módulo de planificación de recursos empresariales enfocado en la gestión financiera, contabilidad y reportes fiscales.',
    status: 'active',
    lastUpdated: '2024-11-28'
  },
  {
    id: '3',
    name: 'Portal de Empleados',
    version: '2.1.4',
    activeUsers: 312,
    developer: 'HR Tech Corp',
    description: 'Plataforma de autoservicio para empleados. Incluye gestión de vacaciones, nóminas y documentos personales.',
    status: 'active',
    lastUpdated: '2024-11-25'
  },
  {
    id: '4',
    name: 'Inventario Pro',
    version: '1.8.2',
    activeUsers: 45,
    developer: 'LogiSoft',
    description: 'Sistema de gestión de inventarios y almacenes. Control de stock, movimientos y alertas de reposición.',
    status: 'maintenance',
    lastUpdated: '2024-10-15'
  },
  {
    id: '5',
    name: 'BI Dashboard',
    version: '4.3.0',
    activeUsers: 67,
    developer: 'DataViz Inc',
    description: 'Herramienta de inteligencia de negocios para visualización de datos y generación de reportes ejecutivos.',
    status: 'active',
    lastUpdated: '2024-12-03'
  },
  {
    id: '6',
    name: 'Sistema Legacy',
    version: '1.0.5',
    activeUsers: 12,
    developer: 'Internal Dev',
    description: 'Sistema heredado para procesos administrativos legacy. En proceso de migración.',
    status: 'deprecated',
    lastUpdated: '2023-06-10'
  }
];
