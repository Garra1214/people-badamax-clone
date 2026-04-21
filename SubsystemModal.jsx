import { useState } from 'react';
import { STATUS_OPTIONS, DEFAULT_SUB } from '../data.js';
import { ProgressBar, inp, lbl } from './shared.jsx';

export default function SubsystemModal({ sub, data, onSave, onClose }) {
  const [form, setForm] = useState({ ...DEFAULT_SUB, ...data });
  const [newLink, setNewLink] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const addLink = () => {
    if (newLink.trim()) { set('driveLinks', [...form.driveLinks, { url: newLink.trim() }]); setNewLink(''); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 18, width: 'min(780px, 96vw)', maxHeight: '92vh', overflow: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.22)' }}>
        {/* Header */}
        <div style={{ padding: '22px 28px', borderBottom: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{sub.icon} {sub.system}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', marginTop: 3 }}>{sub.label}</div>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748b' }}>✕ Cerrar</button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div>
            <label style={lbl}>Estado</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} style={inp}>
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Responsable</label>
            <input value={form.responsible} onChange={e => set('responsible', e.target.value)} placeholder="Nombre del responsable" style={inp} />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={lbl}>Avance: {form.progress}%</label>
            <input type="range" min={0} max={100} value={form.progress} onChange={e => set('progress', +e.target.value)} style={{ width: '100%', accentColor: sub.color, marginBottom: 6 }} />
            <ProgressBar value={form.progress} color={sub.color} />
          </div>
          <div><label style={lbl}>Fecha de Inicio</label><input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Fecha de Revisión</label><input type="date" value={form.reviewDate} onChange={e => set('reviewDate', e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Fecha de Término</label><input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} style={inp} /></div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={lbl}>Estado Actual</label>
            <textarea value={form.currentState} onChange={e => set('currentState', e.target.value)} placeholder="Describe cómo está el subsistema actualmente..." rows={3} style={{ ...inp, resize: 'vertical' }} />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={lbl}>Estado Deseado</label>
            <textarea value={form.desiredState} onChange={e => set('desiredState', e.target.value)} placeholder="¿A dónde quieres llegar con este subsistema?" rows={3} style={{ ...inp, resize: 'vertical' }} />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={lbl}>Notas Internas</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Observaciones, acuerdos, pendientes..." rows={4} style={{ ...inp, resize: 'vertical' }} />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={lbl}>Archivos (Links Drive)</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input value={newLink} onChange={e => setNewLink(e.target.value)} placeholder="https://drive.google.com/..." style={{ ...inp, flex: 1 }} onKeyDown={e => e.key === 'Enter' && addLink()} />
              <button onClick={addLink} style={{ padding: '8px 16px', background: sub.color, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>+ Agregar</button>
            </div>
            {form.driveLinks.map((lk, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: '8px 12px', borderRadius: 8, marginBottom: 6, border: '1px solid #e2e8f0' }}>
                <span>📎</span>
                <a href={lk.url} target="_blank" rel="noreferrer" style={{ flex: 1, fontSize: 12, color: '#6366f1', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lk.url}</a>
                <button onClick={() => set('driveLinks', form.driveLinks.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14 }}>✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px', borderTop: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 10, position: 'sticky', bottom: 0, background: '#fff' }}>
          <button onClick={onClose} style={{ padding: '10px 22px', border: '1.5px solid #e2e8f0', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748b' }}>Cancelar</button>
          <button onClick={() => onSave(form)} style={{ padding: '10px 24px', background: sub.color, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>💾 Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}
