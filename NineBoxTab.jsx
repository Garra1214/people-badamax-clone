import { useState, useEffect } from 'react';
import { save, load } from '../storage.js';
import { NINE_BOX_CELLS, POSITIONS, PERF_QUESTIONS, POT_QUESTIONS, getBoxCell } from '../data.js';
import { inp, lbl, StarRating } from './shared.jsx';

const defaultForm = () => ({
  store: '', region: '', zonal: '',
  personName: '', position: 'jefe_tienda',
  q1: 3, q2: 3, q3: 3,
  q4: 3, q5: 3, q6: 3,
  rehire: null,
});

function calcScores(form) {
  const perfAvg = (form.q1 + form.q2 + form.q3) / 3;
  const potAvg  = (form.q4 + form.q5 + form.q6) / 3;
  return { perfAvg, potAvg };
}

export default function NineBoxTab() {
  const [evals, setEvals] = useState([]);
  const [mode, setMode] = useState('grid'); // 'grid' | 'form' | 'list'
  const [form, setForm] = useState(defaultForm());
  const [editId, setEditId] = useState(null);
  const [filterStore, setFilterStore] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [hoveredBox, setHoveredBox] = useState(null);

  useEffect(() => { const d = load('ninebox'); if (d) setEvals(d); }, []);

  const persist = data => { setEvals(data); save('ninebox', data); };
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.personName.trim() || form.rehire === null) return;
    const { perfAvg, potAvg } = calcScores(form);
    const cell = getBoxCell(perfAvg, potAvg);
    const entry = { ...form, id: editId || Date.now(), perfAvg, potAvg, cellKey: `${cell.perf}-${cell.pot}`, date: new Date().toLocaleDateString('es-CL') };
    persist(editId ? evals.map(e => e.id === editId ? entry : e) : [...evals, entry]);
    setMode('grid'); setEditId(null); setForm(defaultForm());
  };

  const openEdit = (ev) => { setForm(ev); setEditId(ev.id); setMode('form'); };
  const getPos = (v) => POSITIONS.find(p => p.value === v)?.label || v;

  const filtered = evals.filter(e =>
    (!filterStore || e.store.toLowerCase().includes(filterStore.toLowerCase())) &&
    (!filterRegion || e.region.toLowerCase().includes(filterRegion.toLowerCase()))
  );

  // Live preview while filling form
  const { perfAvg, potAvg } = calcScores(form);
  const previewCell = getBoxCell(perfAvg, potAvg);

  // ── FORM VIEW ────────────────────────────────────────────────────────────
  if (mode === 'form') {
    return (
      <div style={{ padding: 28, overflowY: 'auto', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: 0 }}>{editId ? 'Editar' : 'Nueva'} Evaluación Nine Box</h2>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Cuestionario corto — Escala 1 a 5 estrellas</p>
          </div>
          <button onClick={() => { setMode('grid'); setEditId(null); }} style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#64748b' }}>✕ Cancelar</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, maxWidth: 960, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Basic info */}
            <section style={{ background: '#fff', borderRadius: 14, padding: 22, border: '1.5px solid #f1f5f9' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>📍 Datos de la Persona</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Nombre Completo</label><input value={form.personName} onChange={e => setF('personName', e.target.value)} placeholder="Nombre de la persona evaluada" style={inp} /></div>
                <div>
                  <label style={lbl}>Cargo</label>
                  <select value={form.position} onChange={e => setF('position', e.target.value)} style={inp}>
                    {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Nombre de la Tienda</label><input value={form.store} onChange={e => setF('store', e.target.value)} placeholder="Ej: Tienda Centro" style={inp} /></div>
                <div><label style={lbl}>Región</label><input value={form.region} onChange={e => setF('region', e.target.value)} placeholder="Ej: Región Metropolitana" style={inp} /></div>
                <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Zonal / Zona</label><input value={form.zonal} onChange={e => setF('zonal', e.target.value)} placeholder="Ej: Zona Centro-Norte" style={inp} /></div>
              </div>
            </section>

            {/* Performance */}
            <section style={{ background: '#fff', borderRadius: 14, padding: 22, border: '1.5px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📊</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b' }}>DESEMPEÑO</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Promedio: {perfAvg.toFixed(1)} / 5</div>
                </div>
                <div style={{ flex: 1, height: 4, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginLeft: 8 }}>
                  <div style={{ width: `${(perfAvg / 5) * 100}%`, background: '#10b981', height: '100%', borderRadius: 4, transition: 'width 0.3s' }} />
                </div>
              </div>
              {PERF_QUESTIONS.map((q, i) => (
                <div key={i} style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 8 }}>
                    <span style={{ color: '#10b981', fontWeight: 800, marginRight: 6 }}>{i + 1}.</span>{q}
                  </div>
                  <StarRating value={form[`q${i + 1}`]} onChange={v => setF(`q${i + 1}`, v)} />
                </div>
              ))}
            </section>

            {/* Potential */}
            <section style={{ background: '#fff', borderRadius: 14, padding: 22, border: '1.5px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>💡</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b' }}>POTENCIAL</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Promedio: {potAvg.toFixed(1)} / 5</div>
                </div>
                <div style={{ flex: 1, height: 4, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginLeft: 8 }}>
                  <div style={{ width: `${(potAvg / 5) * 100}%`, background: '#6366f1', height: '100%', borderRadius: 4, transition: 'width 0.3s' }} />
                </div>
              </div>
              {POT_QUESTIONS.map((q, i) => (
                <div key={i} style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 8 }}>
                    <span style={{ color: '#6366f1', fontWeight: 800, marginRight: 6 }}>{i + 1}.</span>{q}
                  </div>
                  <StarRating value={form[`q${i + 4}`]} onChange={v => setF(`q${i + 4}`, v)} />
                </div>
              ))}
            </section>

            {/* Rehire filter */}
            <section style={{ background: '#fff', borderRadius: 14, padding: 22, border: `2px solid ${form.rehire === null ? '#fcd34d' : form.rehire ? '#bbf7d0' : '#fecaca'}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>⚠️ Filtro Obligatorio</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 14 }}>¿Volverías a contratar a esta persona?</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[true, false].map(val => (
                  <button key={String(val)} onClick={() => setF('rehire', val)}
                    style={{ padding: '12px 28px', border: `2px solid ${form.rehire === val ? (val ? '#059669' : '#ef4444') : '#e2e8f0'}`, borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700, background: form.rehire === val ? (val ? '#d1fae5' : '#fee2e2') : '#fff', color: form.rehire === val ? (val ? '#059669' : '#ef4444') : '#64748b', transition: 'all 0.2s' }}>
                    {val ? '✅ Sí' : '❌ No'}
                  </button>
                ))}
              </div>
              {form.rehire === false && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef2f2', borderRadius: 8, fontSize: 12, color: '#dc2626', fontWeight: 600 }}>
                  🔴 Esta persona será marcada con alerta roja en el Nine Box
                </div>
              )}
            </section>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setMode('grid'); setEditId(null); }} style={{ padding: '10px 22px', border: '1.5px solid #e2e8f0', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748b' }}>Cancelar</button>
              <button onClick={submit} disabled={!form.personName.trim() || form.rehire === null}
                style={{ padding: '10px 28px', background: form.personName.trim() && form.rehire !== null ? '#6366f1' : '#e2e8f0', color: form.personName.trim() && form.rehire !== null ? '#fff' : '#94a3b8', border: 'none', borderRadius: 8, cursor: form.personName.trim() && form.rehire !== null ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 700, transition: 'all 0.2s' }}>
                💾 Guardar Evaluación
              </button>
            </div>
          </div>

          {/* Live preview */}
          <div style={{ position: 'sticky', top: 20 }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1.5px solid #f1f5f9' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Vista Previa</div>
              {form.personName && (
                <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', marginBottom: 14, borderLeft: `4px solid ${previewCell.color}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{form.personName}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{getPos(form.position)} {form.store && `· ${form.store}`}</div>
                </div>
              )}
              <div style={{ background: previewCell.bg, border: `2px solid ${previewCell.color}`, borderRadius: 10, padding: 16, textAlign: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{previewCell.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: previewCell.color }}>{previewCell.label}</div>
                <div style={{ fontSize: 11, color: previewCell.color, marginTop: 4, opacity: 0.8 }}>{previewCell.action}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 2 }}>Desempeño</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#10b981' }}>{perfAvg.toFixed(1)}</div>
                </div>
                <div style={{ background: '#eef2ff', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 2 }}>Potencial</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#6366f1' }}>{potAvg.toFixed(1)}</div>
                </div>
              </div>
              {form.rehire !== null && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: form.rehire ? '#d1fae5' : '#fee2e2', borderRadius: 8, fontSize: 12, fontWeight: 700, color: form.rehire ? '#059669' : '#dc2626', textAlign: 'center' }}>
                  {form.rehire ? '✅ Sí contrataría' : '❌ No contrataría'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── GRID VIEW ────────────────────────────────────────────────────────────
  const GRID_ORDER = [
    { perf: 2, pot: 0 }, { perf: 2, pot: 1 }, { perf: 2, pot: 2 },
    { perf: 1, pot: 0 }, { perf: 1, pot: 1 }, { perf: 1, pot: 2 },
    { perf: 0, pot: 0 }, { perf: 0, pot: 1 }, { perf: 0, pot: 2 },
  ];

  return (
    <div style={{ padding: 28, overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: 0 }}>Nine Box — Evaluación de Talento</h2>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Matriz de desempeño vs potencial por colaborador</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setMode(mode === 'list' ? 'grid' : 'list')}
            style={{ padding: '9px 18px', border: '1.5px solid #e2e8f0', background: '#fff', borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
            {mode === 'list' ? '🔲 Ver Grid' : '📋 Ver Lista'}
          </button>
          <button onClick={() => { setMode('form'); setForm(defaultForm()); setEditId(null); }}
            style={{ padding: '9px 18px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
            + Nueva Evaluación
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input value={filterStore} onChange={e => setFilterStore(e.target.value)} placeholder="🔍 Filtrar por tienda..." style={{ ...inp, width: 200, fontSize: 12 }} />
        <input value={filterRegion} onChange={e => setFilterRegion(e.target.value)} placeholder="🔍 Filtrar por región..." style={{ ...inp, width: 200, fontSize: 12 }} />
        {(filterStore || filterRegion) && (
          <button onClick={() => { setFilterStore(''); setFilterRegion(''); }} style={{ padding: '8px 14px', background: '#f1f5f9', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, color: '#64748b' }}>✕ Limpiar</button>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
          <span style={{ fontWeight: 700, color: '#1e293b' }}>{filtered.length}</span> evaluaciones
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#334155', marginBottom: 6 }}>No hay evaluaciones aún</div>
          <div style={{ fontSize: 13 }}>Agrega la primera evaluación Nine Box</div>
        </div>
      ) : mode === 'list' ? (
        // LIST VIEW
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(ev => {
            const cell = NINE_BOX_CELLS.find(c => `${c.perf}-${c.pot}` === ev.cellKey) || NINE_BOX_CELLS[4];
            return (
              <div key={ev.id} style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: cell.bg, border: `2px solid ${cell.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{cell.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{ev.personName}</span>
                    {!ev.rehire && <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>⚠️ No recontratría</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{getPos(ev.position)} · {ev.store} {ev.region && `· ${ev.region}`}</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>DESEMPEÑO</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#10b981' }}>{ev.perfAvg?.toFixed(1)}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>POTENCIAL</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#6366f1' }}>{ev.potAvg?.toFixed(1)}</div>
                  </div>
                  <div style={{ background: cell.bg, color: cell.color, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{cell.label}</div>
                  <button onClick={() => openEdit(ev)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 7, padding: '6px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#64748b' }}>Editar</button>
                  <button onClick={() => persist(evals.filter(e => e.id !== ev.id))} style={{ background: '#fee2e2', border: 'none', borderRadius: 7, padding: '6px 10px', cursor: 'pointer', fontSize: 11, color: '#ef4444', fontWeight: 700 }}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // GRID VIEW
        <div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 4, paddingLeft: 60 }}>
            {['Bajo Potencial', 'Potencial Medio', 'Alto Potencial'].map(l => (
              <div key={l} style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#94a3b8', padding: '6px 0', background: '#f8fafc', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {/* Y axis labels */}
            <div style={{ width: 52, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Alto\nDesempeño', 'Desempeño\nMedio', 'Bajo\nDesempeño'].map(l => (
                <div key={l} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.3, whiteSpace: 'pre-line' }}>{l}</div>
                </div>
              ))}
            </div>
            {/* Grid */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, minmax(140px, auto))', gap: 4 }}>
              {GRID_ORDER.map(({ perf, pot }) => {
                const cell = NINE_BOX_CELLS.find(c => c.perf === perf && c.pot === pot);
                const people = filtered.filter(e => e.cellKey === `${perf}-${pot}`);
                const isHovered = hoveredBox === `${perf}-${pot}`;
                return (
                  <div key={`${perf}-${pot}`}
                    onMouseEnter={() => setHoveredBox(`${perf}-${pot}`)}
                    onMouseLeave={() => setHoveredBox(null)}
                    style={{ background: isHovered ? cell.bg : `${cell.bg}88`, border: `2px solid ${isHovered ? cell.color : `${cell.color}50`}`, borderRadius: 10, padding: '12px 10px', transition: 'all 0.2s', minHeight: 140 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span style={{ fontSize: 16 }}>{cell.emoji}</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: cell.color }}>{cell.label}</div>
                        {people.length > 0 && <div style={{ fontSize: 10, color: cell.color, opacity: 0.7 }}>{people.length} persona{people.length !== 1 ? 's' : ''}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {people.map(ev => (
                        <div key={ev.id} onClick={() => openEdit(ev)}
                          style={{ background: '#fff', borderRadius: 7, padding: '7px 9px', cursor: 'pointer', border: `1px solid ${cell.color}30`, transition: 'all 0.15s' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {ev.personName}
                                {!ev.rehire && <span style={{ marginLeft: 4, color: '#dc2626' }}>🔴</span>}
                              </div>
                              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{getPos(ev.position)}</div>
                              {ev.store && <div style={{ fontSize: 10, color: '#94a3b8' }}>{ev.store}</div>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>D:{ev.perfAvg?.toFixed(1)}</div>
                              <div style={{ fontSize: 10, color: '#6366f1', fontWeight: 700 }}>P:{ev.potAvg?.toFixed(1)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {isHovered && people.length === 0 && (
                      <div style={{ fontSize: 10, color: cell.color, opacity: 0.6, fontStyle: 'italic', marginTop: 4 }}>{cell.action}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{ marginTop: 20, background: '#fff', borderRadius: 12, padding: '14px 18px', border: '1.5px solid #f1f5f9' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Referencia de Cuadrantes</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
              {NINE_BOX_CELLS.map(c => (
                <div key={`${c.perf}-${c.pot}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{c.emoji}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.label}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.4 }}>{c.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
