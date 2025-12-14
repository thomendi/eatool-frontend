export interface Risk {
  id: string;
  name: string;
  category: string;
  type: string;
  impact: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  probability: 'Baja' | 'Media' | 'Alta';
  level: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  description: string;
}

export const mockRisks: Risk[] = [
  {
    id: '1',
    name: 'Obsolescencia Tecnológica',
    category: 'TI',
    type: 'Tecnológico',
    impact: 'Alto',
    probability: 'Media',
    level: 'Alto',
    description: 'Riesgo de que los sistemas tecnológicos queden obsoletos y no puedan soportar las operaciones del negocio.'
  },
  {
    id: '2',
    name: 'Fuga de Datos',
    category: 'Seguridad',
    type: 'Seguridad de la Información',
    impact: 'Crítico',
    probability: 'Baja',
    level: 'Crítico',
    description: 'Exposición no autorizada de información confidencial de la organización o sus clientes.'
  },
  {
    id: '3',
    name: 'Dependencia de Proveedores',
    category: 'Operacional',
    type: 'Cadena de Suministro',
    impact: 'Alto',
    probability: 'Media',
    level: 'Medio',
    description: 'Alta dependencia de proveedores clave que podría afectar la continuidad operacional.'
  },
  {
    id: '4',
    name: 'Cambios Regulatorios',
    category: 'Legal',
    type: 'Cumplimiento',
    impact: 'Alto',
    probability: 'Alta',
    level: 'Alto',
    description: 'Cambios en la legislación que podrían requerir modificaciones significativas en los procesos.'
  },
  {
    id: '5',
    name: 'Pérdida de Talento Clave',
    category: 'RRHH',
    type: 'Capital Humano',
    impact: 'Medio',
    probability: 'Media',
    level: 'Medio',
    description: 'Riesgo de perder empleados clave que poseen conocimientos críticos para la organización.'
  }
];
