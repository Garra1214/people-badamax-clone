import { useState, useEffect } from 'react';
import { save, load } from '../storage.js';
import { inp, lbl } from './shared.jsx';

const STEP_TYPES = [
  { value: 'task',     label: 'Tarea',      color: '#6366f1', emoji: '📋' },
  { value: 'approval', label: 'Aprobación', color: '#f59e0b', emoji: '✅' },
  { value: 'meeting',  label: 'Reunión',    color: '#0ea5e9', emoji: '👥' },
  { value: 'document', label: 'Documento',  color: '#10b981', emoji: '📄' },
  { value: 'review',   label: 'Revisión',   color: '#ec4899', emoji: '🔍' },
];

const defaultStep = () => ({ label: '', responsible: '', duration: '', type: 'task' });
const defaultFlow = () => ({ name: '', description: '', steps: [] });

export default function FlowsTab() {
  const [flows, setFlows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultFlow());
  const [step, setStep] = useState(defaultStep());
  const [editId, setEditId] = useState(null);

  useEffect(() => { const d = load('flows'); if (d) setFlows(d); }, []);

  const persist = updated => { setFlows(updated); save('flows', updated); };
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addStep = () => {
    if (step.label.trim()) { setF('steps', [...form.steps, { ...step, id: Date.now() }]); setStep(defaultStep()); }
  };

  const submit = () => {
    if (!form.name.trim()) return;
    const entry = { ...form, id: editId || Date.now(), createdAt: new Date().toLocaleDateString('es-CL') };
    persist(editId ? flows.map(f => f.id === editId ? entry : f) : [...flows, entry]);
    setShowForm(false); setEditId(null); setForm(defaultFlow());
  };

  const openEdit = (flow) => {
    setForm(flow); setEditId(flow.id); setShowForm(true);
  };

  return (
    <div style={{ padding: 28, overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: 0 }}>Flujos de Proceso</h2>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Diseña y gestiona los flujos de trabajo del área</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(defaultFlow()); }}
          style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
          + Nuevo Flujo
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1.5px solid #e0e7ff', marginBottom: 28, boxShadow: '0 4px 16px rgba(99,102,241,0.08)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', margin: '0 0 18px' }}>{editId ? 'Editar' : 'Crear'} Flujo</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div><label style={lbl}>Nombre del Flujo</label><input value={form.name} onChange={e => setF('name', e.target.value)} placeholder="Ej: Proceso de Onboarding" style={inp} /></div>
            <div><label style={lbl}>Descripción</label><input value={form.description} onChange={e => setF('description', e.target.value)} placeholder="Descripción breve" style={inp} /></div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Agregar Paso</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 80px 120px auto', gap: 8, marginBottom: 14, alignItems: 'end' }}>
            {[
              { label: 'Nombre del paso', val: step.label, key: 'label', ph: 'Ej: Revisar CV' },
              { label: 'Responsable', val: step.responsible, key: 'responsible', ph: 'Quién' },
              { label: 'Días', val: step.duration, key: 'duration', ph: '3d' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 3 }}>{f.label}</label>
                <input value={f.val} onChange={e => setStep(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph} style={inp} onKeyDown={e => e.key === 'Enter' && addStep()} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 3 }}>Tipo</label>
              <select value={step.type} onChange={e => setStep(p => ({ ...p, type: e.target.value }))} style={inp}>
                {STEP_TYPES.map(t => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
              </select>
            </div>
            <button onClick={addStep} style={{ padding: '8px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 800, fontSize: 16 }}>+</button>
          </div>

          {form.steps.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18, padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
              {form.steps.map((s, i) => {
                const t = STEP_TYPES.find(x => x.value === s.type) || STEP_TYPES[0];
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {i > 0 && <span style={{ color: '#94a3b8', fontSize: 12 }}>→</span>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${t.color}15`, border: `1.5px solid ${t.color}40`, borderRadius: 20, padding: '4px 10px 4px 8px' }}>
                      <span style={{ fontSize: 13 }}>{t.emoji}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: t.color }}>{s.label}</span>
                      {s.responsible && <span style={{ fontSize: 10, color: '#94a3b8' }}>({s.responsible})</span>}
                      <button onClick={() => setF('steps', form.steps.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 11, padding: 0, marginLeft: 2, lineHeight: 1 }}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setShowForm(false); setEditId(null); }} style={{ padding: '9px 20px', border: '1.5px solid #e2e8f0', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748b' }}>Cancelar</button>
            <button onClick={submit} style={{ padding: '9px 22px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>💾 Guardar Flujo</button>
          </div>
        </div>
      )}

      {flows.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#334155', marginBottom: 6 }}>No hay flujos creados</div>
          <div style={{ fontSize: 13 }}>Crea tu primer flujo de proceso</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
          {flows.map(flow => (
            <div key={flow.id} style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1.5px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>{flow.name}</div>
                  {flow.description && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{flow.description}</div>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(flow)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#64748b' }}>Editar</button>
                  <button onClick={() => persist(flows.filter(f => f.id !== flow.id))} style={{ background: '#fee2e2', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#ef4444' }}>✕</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                {flow.steps.map((s, i) => {
                  const t = STEP_TYPES.find(x => x.value === s.type) || STEP_TYPES[0];
                  return (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {i > 0 && <span style={{ color: '#cbd5e1', fontSize: 11 }}>→</span>}
                      <div style={{ background: `${t.color}15`, border: `1px solid ${t.color}30`, borderRadius: 14, padding: '3px 9px', fontSize: 10, fontWeight: 700, color: t.color }}>
                        {t.emoji} {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>📅 {flow.createdAt} · {flow.steps.length} paso{flow.steps.length !== 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
