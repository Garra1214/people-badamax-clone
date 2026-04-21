import { useState } from 'react';
import { LIFECYCLE, DEFAULT_SUB } from '../data.js';
import { Badge, ProgressBar } from './shared.jsx';
import { useEdit, ETLight } from '../EditContext.jsx';

export default function SistemasTab({ subsystemData, onOpenSub }) {
  const [expandedSystem, setExpandedSystem] = useState(LIFECYCLE[0].id);
  const [selectedSub, setSelectedSub] = useState(null);
  const { getName } = useEdit();

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: 268, borderRight: '1.5px solid #f1f5f9', overflowY: 'auto', padding: '20px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 16px 12px', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Employee Journey
        </div>
        {LIFECYCLE.map(l => {
          const systemLabel = getName(`system.${l.id}`);
          return (
            <div key={l.id}>
              <button onClick={() => setExpandedSystem(expandedSystem === l.id ? null : l.id)}
                style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, border: 'none', background: expandedSystem === l.id ? `${l.color}18` : 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{l.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: expandedSystem === l.id ? l.color : '#334155' }}>
                    <ETLight nameKey={`system.${l.id}`} style={{ color: expandedSystem === l.id ? l.color : '#334155', fontSize: 12, fontWeight: 700 }} />
                  </div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>
                    {l.subsystems.filter(s => subsystemData[s.id]?.status === 'completado').length}/{l.subsystems.length} completados
                  </div>
                </div>
                <span style={{ fontSize: 10, color: '#94a3b8', flexShrink: 0 }}>{expandedSystem === l.id ? '▲' : '▼'}</span>
              </button>

              {expandedSystem === l.id && (
                <div style={{ paddingLeft: 8 }}>
                  {l.subsystems.map(s => {
                    const d = subsystemData[s.id] || DEFAULT_SUB;
                    const isSel = selectedSub === s.id;
                    const subLabel = getName(`sub.${s.id}`);
                    return (
                      <button key={s.id}
                        onClick={() => {
                          setSelectedSub(s.id);
                          onOpenSub({ ...s, label: subLabel, color: l.color, icon: l.icon, system: systemLabel });
                        }}
                        style={{ width: '100%', padding: '8px 12px 8px 32px', display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: isSel ? `${l.color}20` : 'transparent', cursor: 'pointer', textAlign: 'left', borderLeft: isSel ? `3px solid ${l.color}` : '3px solid transparent' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: isSel ? 700 : 500, color: isSel ? l.color : '#475569' }}>
                            <ETLight nameKey={`sub.${s.id}`} style={{ color: isSel ? l.color : '#475569', fontSize: 11, fontWeight: isSel ? 700 : 500 }} />
                          </div>
                          <div style={{ marginTop: 3 }}><ProgressBar value={d.progress} color={l.color} height={4} /></div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: l.color, flexShrink: 0 }}>{d.progress}%</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cards grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: 0 }}>Gestión de Subsistemas</h2>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Haz clic en cualquier subsistema para editarlo</p>
        </div>

        {LIFECYCLE.map(l => {
          const systemLabel = getName(`system.${l.id}`);
          return (
            <div key={l.id} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 22 }}>{l.icon}</span>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', margin: 0 }}>
                  <ETLight nameKey={`system.${l.id}`} style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }} />
                </h3>
                <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
                {l.subsystems.map(s => {
                  const d = subsystemData[s.id] || DEFAULT_SUB;
                  const isSel = selectedSub === s.id;
                  const subLabel = getName(`sub.${s.id}`);
                  return (
                    <button key={s.id}
                      onClick={() => {
                        setSelectedSub(s.id);
                        onOpenSub({ ...s, label: subLabel, color: l.color, icon: l.icon, system: systemLabel });
                      }}
                      style={{ background: '#fff', border: `1.5px solid ${isSel ? l.color : '#f1f5f9'}`, borderRadius: 12, padding: '16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: isSel ? `0 0 0 3px ${l.color}20` : '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', lineHeight: 1.3, flex: 1 }}>
                          {subLabel}
                        </div>
                        <Badge status={d.status} />
                      </div>
                      <ProgressBar value={d.progress} color={l.color} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#94a3b8' }}>
                        <span>{d.responsible || 'Sin asignar'}</span>
                        <span style={{ fontWeight: 700, color: l.color }}>{d.progress}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
