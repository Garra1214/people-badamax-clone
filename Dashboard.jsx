import { LIFECYCLE, ALL_SUBS, DEFAULT_SUB } from '../data.js';
import { Badge, ProgressBar, Card, SectionTitle } from './shared.jsx';
import { useEdit } from '../EditContext.jsx';

export default function Dashboard({ subsystemData }) {
  const { getName } = useEdit();

  const total       = ALL_SUBS.length;
  const completed   = ALL_SUBS.filter(s => subsystemData[s.id]?.status === 'completado').length;
  const inProgress  = ALL_SUBS.filter(s => subsystemData[s.id]?.status === 'en_progreso').length;
  const pending     = ALL_SUBS.filter(s => !subsystemData[s.id] || subsystemData[s.id]?.status === 'pendiente').length;
  const avgProgress = Math.round(ALL_SUBS.reduce((a, s) => a + (subsystemData[s.id]?.progress || 0), 0) / total);

  const byResp = {};
  ALL_SUBS.forEach(s => {
    const d = subsystemData[s.id];
    if (d?.responsible) {
      if (!byResp[d.responsible]) byResp[d.responsible] = { total: 0, progress: 0 };
      byResp[d.responsible].total++;
      byResp[d.responsible].progress += d.progress || 0;
    }
  });

  const bySystem = LIFECYCLE.map(l => {
    const subs = l.subsystems.map(s => ({ ...s, data: subsystemData[s.id] || DEFAULT_SUB }));
    const avg  = Math.round(subs.reduce((a, s) => a + s.data.progress, 0) / subs.length);
    const done = subs.filter(s => s.data.status === 'completado').length;
    return { ...l, subs, avg, done };
  });

  return (
    <div style={{ padding: 28, overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e293b', margin: 0 }}>Dashboard de Gestión de Personas</h2>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Vista consolidada del estado de todos los subsistemas</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Avance General', value: `${avgProgress}%`, icon: '📊', color: '#6366f1', sub: 'Promedio de todos los subsistemas' },
          { label: 'Completados',    value: completed,          icon: '✅', color: '#10b981', sub: `de ${total} subsistemas` },
          { label: 'En Progreso',    value: inProgress,         icon: '🔄', color: '#0ea5e9', sub: 'Activos actualmente' },
          { label: 'Pendientes',     value: pending,            icon: '⏳', color: '#f59e0b', sub: 'Sin iniciar' },
        ].map(k => (
          <Card key={k.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: k.color, marginTop: 6, lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{k.sub}</div>
              </div>
              <span style={{ fontSize: 26 }}>{k.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 24 }}>
        <Card>
          <SectionTitle>Avance por Sistema</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {bySystem.map(s => (
              <div key={s.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{s.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{getName(`system.${s.id}`)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>{s.done}/{s.subs.length}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.avg}%</span>
                  </div>
                </div>
                <ProgressBar value={s.avg} color={s.color} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Por Responsable</SectionTitle>
          {Object.keys(byResp).length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: '#94a3b8', fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👤</div>Aún no hay responsables asignados
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(byResp).map(([name, info]) => (
                <div key={name} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#6366f1' }}>{name[0]?.toUpperCase()}</div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#6366f1' }}>{Math.round(info.progress / info.total)}%</span>
                  </div>
                  <ProgressBar value={Math.round(info.progress / info.total)} color="#6366f1" />
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{info.total} subsistema{info.total !== 1 ? 's' : ''}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <SectionTitle>Todos los Subsistemas</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                {['Sistema', 'Subsistema', 'Responsable', 'Avance', 'Estado', 'Revisión'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#94a3b8', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_SUBS.map(s => {
                const d = subsystemData[s.id] || DEFAULT_SUB;
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '9px 12px', color: '#64748b' }}><span style={{ fontSize: 14 }}>{s.icon}</span></td>
                    <td style={{ padding: '9px 12px', fontWeight: 600, color: '#1e293b' }}>{getName(`sub.${s.id}`)}</td>
                    <td style={{ padding: '9px 12px', color: '#64748b' }}>{d.responsible || <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                    <td style={{ padding: '9px 12px', minWidth: 110 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1 }}><ProgressBar value={d.progress} color={s.color} height={5} /></div>
                        <span style={{ fontWeight: 700, color: s.color, fontSize: 11, minWidth: 30 }}>{d.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '9px 12px' }}><Badge status={d.status} /></td>
                    <td style={{ padding: '9px 12px', color: '#64748b' }}>{d.reviewDate || <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
