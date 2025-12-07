export interface Role {
  id: string;
  owners: string[];
  category: string;
  subcategory: string;
  duties: string[];
  description: string;
}

export const mockRoles: Role[] = [
  {
    id: '1',
    owners: ['María García', 'Carlos López'],
    category: 'Gerente de Proyectos',
    subcategory: 'Tecnología',
    duties: ['Planificación de proyectos', 'Gestión de recursos', 'Control de presupuesto', 'Seguimiento de entregas'],
    description: 'Responsable de la planificación, ejecución y cierre de proyectos tecnológicos.'
  },
  {
    id: '2',
    owners: ['Ana Martínez'],
    category: 'Analista de Datos',
    subcategory: 'Business Intelligence',
    duties: ['Análisis de datos', 'Creación de reportes', 'Visualización de información'],
    description: 'Encargado de analizar datos y generar insights para la toma de decisiones.'
  },
  {
    id: '3',
    owners: ['Pedro Sánchez', 'Laura Fernández', 'Miguel Torres'],
    category: 'Desarrollador Senior',
    subcategory: 'Desarrollo',
    duties: ['Desarrollo de software', 'Code review', 'Mentoring', 'Arquitectura de soluciones', 'Documentación técnica'],
    description: 'Desarrollador con experiencia avanzada en tecnologías frontend y backend.'
  },
  {
    id: '4',
    owners: ['Roberto Díaz'],
    category: 'Jefe de Recursos Humanos',
    subcategory: 'Recursos Humanos',
    duties: ['Gestión del talento', 'Capacitación', 'Políticas de bienestar', 'Desarrollo profesional'],
    description: 'Gestiona el talento humano de la organización.'
  }
];