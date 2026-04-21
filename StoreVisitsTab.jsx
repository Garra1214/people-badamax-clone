import { useState, useEffect } from 'react';
import { save, load } from '../storage.js';
import { inp, lbl } from './shared.jsx';

const defaultForm = () => ({
  store: '', date: new Date().toISOString().split('T')[0], totalPeople: '',
  storeManager: { name: '', notes: '' },
  subManager:   { name: '', notes: '' },
  sellers: [{ name: '', notes: '' }],
});

export default function StoreVisitsTab() {
  const [visits, setVisits] = useState([]);
  const [mode, setMode] = useState('list'); // 'list' | 'form'
  const [form, setForm] = useState(defaultForm());
  const [editId, setEditId] = useState(null);

  useEffect(() => { const d = load('store-visits'); if (d) setVisits(d); }, []);

  const persist = v => { setVisits(v); save('store-visits', v); };
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setRole = (role, k, v) => setForm(p => ({ ...p, [role]: { ...p[role], [k]: v } }));
  const setSeller = (i, k, v) => setForm(p => { const s = [...p.sellers]; s[i] = { ...s[i], [k]: v }; return { ...p, sellers: s }; });

  const submit = () => {
    if (!form.store.trim()) return;
    const entry = { ...form, id: editId || Date.now() };
    persist(editId ? visits.map(v => v.id === editId ? entry : v) : [...visits, entry]);
    setMode('list'); setEditId(null); setForm(defaultForm());
  };

  const openEdit = (v) => { setForm(v); setEditId(v.id); setMode('form'); };

  const ta = { ...inp, resize: 'vertical' };

  if (mode === 'form') {
    return (
      <div style={{ padding: 28, overflowY: 'auto', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: 0 }}>{editId ? 'Editar' : 'Nueva'} Visita a Tienda</h2>
          <button onClick={() => { setMode('list'); setEditId(null); }} style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#64748b' }}>✕ Cancelar</button>
        </div>
        <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* General */}
          <section style={{ background: '#fff', borderRadius: 14, padding: 22, border: '1.5px solid #f1f5f9' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Información General</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px', gap: 14 }}>
              <div><label style={lbl}>Tienda Visitada</label><input value={form.store} onChange={e => setF('store', e.target.value)} placeholder="Nombre de la tienda" style={inp} /></div>
              <div><label style={lbl}>Fecha de Visita</label><input type="date" value={form.date} onChange={e => setF('date', e.target.value)} style={inp} /></div>
              <div><label style={lbl}>N° Personas</label><input type="number" value={form.totalPeople} onChange={e => setF('totalPeople', e.target.value)} placeholder="0" style={inp} /></div>
            </div>
          </section>

          {/* Jefe */}
          <section style={{ background: '#fff', borderRadius: 14, padding: 22, border: '1.5px solid #f1f5f9' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>👔 Jefe de Tienda</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
              <div><label style={lbl}>Nombre</label><input value={form.storeManager.name} onChange={e => setRole('storeManager', 'name', e.target.value)} style={inp} /></div>
              <div><label style={lbl}>Apuntes</label><textarea value={form.storeManager.notes} onChange={e => setRole('storeManager', 'notes', e.target.value)} rows={3} style={ta} /></div>
            </div>
          </section>

          {/* Subjefe */}
          <section style={{ background: '#fff', borderRadius: 14, padding: 22, border: '1.5px solid #f1f5f9' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>👤 Subjefe de Tienda</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
              <div><label style={lbl}>Nombre</label><input value={form.subManager.name} onChange={e => setRole('subManager', 'name', e.target.value)} style={inp} /></div>
              <div><label style={lbl}>Apuntes</label><textarea value={form.subManager.notes} onChange={e => setRole('subManager', 'notes', e.target.value)} rows={3} style={ta} /></div>
            </div>
          </section>

          {/* Vendedores */}
          <section style={{ background: '#fff', borderRadius: 14, padding: 22, border: '1.5px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>🛍️ Vendedores</div>
              <button onClick={() => setF('sellers', [...form.sellers, { name: '', notes: '' }])} style={{ padding: '5px 14px', background: '#d1fae5', color: '#059669', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>+ Agregar Vendedor</button>
            </div>
            {form.sellers.map((s, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 12, marginBottom: 12, padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                <div><label style={{ ...lbl, color: '#94a3b8' }}>Vendedor {i + 1}</label><input value={s.name} onChange={e => setSeller(i, 'name', e.target.value)} placeholder="Nombre" style={inp} /></div>
                <div><label style={{ ...lbl, color: '#94a3b8' }}>Apuntes</label><textarea value={s.notes} onChange={e => setSeller(i, 'notes', e.target.value)} placeholder="Observaciones..." rows={2} style={ta} /></div>
                <button onClick={() => setF('sellers', form.sellers.filter((_, j) => j !== i))} disabled={form.sellers.length === 1}
                  style={{ background: '#fee2e2', border: 'none', borderRadius: 8, padding: '0 10px', cursor: 'pointer', color: '#ef4444', fontSize: 16, alignSelf: 'end', marginBottom: 0, height: 36, opacity: form.sellers.length === 1 ? 0.3 : 1 }}>✕</button>
              </div>
            ))}
          </section>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setMode('list'); setEditId(null); }} style={{ padding: '10px 22px', border: '1.5px solid #e2e8f0', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748b' }}>Cancelar</button>
            <button onClick={submit} style={{ padding: '10px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>💾 Guardar Informe</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 28, overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: 0 }}>Informes de Visita a Tienda</h2>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Registro de visitas y observaciones por tienda</p>
        </div>
        <button onClick={() => { setMode('form'); setForm(defaultForm()); setEditId(null); }} style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
          + Nueva Visita
        </button>
      </div>

      {visits.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏪</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#334155', marginBottom: 6 }}>No hay informes de visita</div>
          <div style={{ fontSize: 13 }}>Registra tu primera visita a tienda</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {visits.map(v => (
            <div key={v.id} style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1.5px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b' }}>🏪 {v.store}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>📅 {v.date} · {v.totalPeople || '?'} personas</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(v)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 7, padding: '5px 11px', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#64748b' }}>Editar</button>
                  <button onClick={() => persist(visits.filter(x => x.id !== v.id))} style={{ background: '#fee2e2', border: 'none', borderRadius: 7, padding: '5px 11px', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#ef4444' }}>✕</button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {v.storeManager?.name && (
                  <div style={{ background: '#e0f2fe', borderRadius: 8, padding: '8px 12px' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#0284c7' }}>👔 JEFE: </span>
                    <span style={{ fontSize: 12, color: '#0c4a6e', fontWeight: 600 }}>{v.storeManager.name}</span>
                    {v.storeManager.notes && <div style={{ fontSize: 11, color: '#0369a1', marginTop: 3 }}>{v.storeManager.notes.slice(0, 80)}{v.storeManager.notes.length > 80 ? '…' : ''}</div>}
                  </div>
                )}
                {v.subManager?.name && (
                  <div style={{ background: '#ede9fe', borderRadius: 8, padding: '8px 12px' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed' }}>👤 SUBJEFE: </span>
                    <span style={{ fontSize: 12, color: '#4c1d95', fontWeight: 600 }}>{v.subManager.name}</span>
                    {v.subManager.notes && <div style={{ fontSize: 11, color: '#6d28d9', marginTop: 3 }}>{v.subManager.notes.slice(0, 80)}{v.subManager.notes.length > 80 ? '…' : ''}</div>}
                  </div>
                )}
                {v.sellers?.filter(s => s.name).length > 0 && (
                  <div style={{ background: '#d1fae5', borderRadius: 8, padding: '8px 12px' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#059669' }}>🛍️ VENDEDORES: </span>
                    <span style={{ fontSize: 12, color: '#064e3b' }}>{v.sellers.filter(s => s.name).map(s => s.name).join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
