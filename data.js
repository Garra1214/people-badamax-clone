export const LIFECYCLE = [
  {
    id: 'atraccion', icon: '🎯', color: '#6366f1', label: 'Atracción de Talento',
    subsystems: [
      { id: 'reclutamiento', label: 'Reclutamiento' },
      { id: 'seleccion', label: 'Selección' },
      { id: 'employer_branding', label: 'Employer Branding' },
      { id: 'banco_talentos', label: 'Banco de Talentos' },
    ],
  },
  {
    id: 'incorporacion', icon: '🚀', color: '#0ea5e9', label: 'Incorporación',
    subsystems: [
      { id: 'onboarding', label: 'Onboarding' },
      { id: 'induccion', label: 'Inducción Organizacional' },
      { id: 'integracion', label: 'Integración al Equipo' },
    ],
  },
  {
    id: 'desarrollo', icon: '📈', color: '#10b981', label: 'Desarrollo & Crecimiento',
    subsystems: [
      { id: 'capacitacion', label: 'Capacitación' },
      { id: 'evaluacion', label: 'Evaluación de Desempeño' },
      { id: 'plan_carrera', label: 'Plan de Carrera' },
      { id: 'coaching', label: 'Coaching & Mentoring' },
      { id: 'liderazgo', label: 'Desarrollo de Liderazgo' },
    ],
  },
  {
    id: 'bienestar', icon: '🌱', color: '#f59e0b', label: 'Bienestar y Clima',
    subsystems: [
      { id: 'clima', label: 'Clima Organizacional' },
      { id: 'beneficios', label: 'Beneficios' },
      { id: 'salud', label: 'Salud Laboral' },
      { id: 'balance', label: 'Balance Vida-Trabajo' },
    ],
  },
  {
    id: 'cultura', icon: '🏛️', color: '#8b5cf6', label: 'Cultura y Comunicación',
    subsystems: [
      { id: 'cultura_org', label: 'Cultura Organizacional' },
      { id: 'comunicacion', label: 'Comunicación Interna' },
      { id: 'valores', label: 'Valores y Propósito' },
    ],
  },
  {
    id: 'reconocimiento', icon: '⭐', color: '#ec4899', label: 'Reconocimiento',
    subsystems: [
      { id: 'prog_reconocimiento', label: 'Programas de Reconocimiento' },
      { id: 'incentivos', label: 'Incentivos no Monetarios' },
    ],
  },
  {
    id: 'desvinculacion', icon: '🔄', color: '#64748b', label: 'Desvinculación',
    subsystems: [
      { id: 'offboarding', label: 'Offboarding' },
      { id: 'entrevista_salida', label: 'Entrevista de Salida' },
      { id: 'alumni', label: 'Red de Ex-colaboradores' },
    ],
  },
];

export const ALL_SUBS = LIFECYCLE.flatMap(l =>
  l.subsystems.map(s => ({ ...s, system: l.label, systemId: l.id, color: l.color, icon: l.icon }))
);

export const STATUS_OPTIONS = [
  { value: 'pendiente',   label: 'Pendiente',    color: '#64748b', bg: '#f1f5f9' },
  { value: 'en_progreso', label: 'En Progreso',  color: '#0284c7', bg: '#e0f2fe' },
  { value: 'revision',    label: 'En Revisión',  color: '#d97706', bg: '#fef3c7' },
  { value: 'completado',  label: 'Completado',   color: '#059669', bg: '#d1fae5' },
  { value: 'pausado',     label: 'Pausado',      color: '#ef4444', bg: '#fee2e2' },
];

export const DEFAULT_SUB = {
  progress: 0, responsible: '', startDate: '', reviewDate: '', endDate: '',
  currentState: '', desiredState: '', notes: '', driveLinks: [], status: 'pendiente',
};

export const NINE_BOX_CELLS = [
  { perf: 2, pot: 2, label: 'Estrella',              emoji: '⭐', color: '#047857', bg: '#bbf7d0', action: 'Retener y acelerar su desarrollo' },
  { perf: 2, pot: 1, label: 'Alto Desempeño',        emoji: '🚀', color: '#059669', bg: '#d1fae5', action: 'Desarrollar y dar mayor responsabilidad' },
  { perf: 2, pot: 0, label: 'Experto Consolidado',   emoji: '🏆', color: '#0d9488', bg: '#ccfbf1', action: 'Retener, reconocer y asignar como mentor' },
  { perf: 1, pot: 2, label: 'Potencial sin Explotar',emoji: '💡', color: '#6366f1', bg: '#e0e7ff', action: 'Coaching intensivo y nuevos desafíos' },
  { perf: 1, pot: 1, label: 'Núcleo Sólido',         emoji: '💙', color: '#0284c7', bg: '#e0f2fe', action: 'Mantener motivado y con metas claras' },
  { perf: 1, pot: 0, label: 'Inconsistente',         emoji: '⚠️', color: '#d97706', bg: '#fef3c7', action: 'Plan de mejora y monitoreo cercano' },
  { perf: 0, pot: 2, label: 'Enigma',                emoji: '🔮', color: '#8b5cf6', bg: '#ede9fe', action: 'Identificar y remover barreras' },
  { perf: 0, pot: 1, label: 'Bajo Rendimiento',      emoji: '📉', color: '#ef4444', bg: '#fee2e2', action: 'Plan de desempeño urgente' },
  { perf: 0, pot: 0, label: 'Bajo Aporte',           emoji: '🔴', color: '#dc2626', bg: '#fecaca', action: 'Decisión crítica requerida' },
];

export const POSITIONS = [
  { value: 'jefe_tienda',    label: 'Jefe de Tienda' },
  { value: 'subjefe_tienda', label: 'Subjefe de Tienda' },
  { value: 'vendedor',       label: 'Vendedor' },
];

export const PERF_QUESTIONS = [
  'Cumple metas y KPIs de su tienda',
  'Mantiene operación ordenada (estándares, stock, ejecución)',
  'Logra resultados a través de su equipo (no solo él/ella)',
];

export const POT_QUESTIONS = [
  'Aprende rápido y mejora con feedback',
  'Toma buenas decisiones sin supervisión',
  'Podría manejar una tienda más grande o compleja',
];

export function getBoxCell(perfAvg, potAvg) {
  const lvl = avg => avg >= 3.68 ? 2 : avg >= 2.34 ? 1 : 0;
  return NINE_BOX_CELLS.find(c => c.perf === lvl(perfAvg) && c.pot === lvl(potAvg));
}
