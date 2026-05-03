export type Role = 'admin' | 'viewer'

export interface UserProfile {
  id: string
  email: string
  role: Role
}

export type Status = 'green' | 'yellow' | 'red'

export interface Subsystem {
  id: string
  name: string
  status: Status
  kpi: string
  alert: string
  description?: string
  updated_at?: string
}

export type UpdateType = 'problema' | 'avance' | 'riesgo'
export type Priority = 'alta' | 'media' | 'baja'

export interface SubsystemUpdate {
  id: string
  subsystem_id: string
  type: UpdateType
  title: string
  description: string
  impact: string
  priority: Priority
  created_at: string
}

export interface AudioAnalysis {
  type: UpdateType
  title: string
  description: string
  impact: string
  priority: Priority
}
