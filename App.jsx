import { useState, useEffect } from 'react';
import { save, load } from './storage.js';
import { EditProvider, useEdit, ET } from './EditContext.jsx';
import Dashboard from './components/Dashboard.jsx';
import SistemasTab from './components/SistemasTab.jsx';
import SubsystemModal from './components/SubsystemModal.jsx';
import FlowsTab from './components/FlowsTab.jsx';
import StoreVisitsTab from './components/StoreVisitsTab.jsx';
import NineBoxTab from './components/NineBoxTab.jsx';

const TAB_KEYS = [
  { id: 'dashboard', key: 'tab.dashboard', icon: '📊' },
  { id: 'sistemas',  key: 'tab.sistemas',  icon: '🗂️' },
  { id: 'flujos',    key: 'tab.flujos',    icon: '⚡' },
  { id: 'visitas',   key: 'tab.visitas',   icon: '🏪' },
  { id: 'ninebox',   key: 'tab.ninebox',   icon: '🎯' },
];

function AppInner() {
  const { editMode, setEditMode, saveAndExit, discardAndExit } = useEdit();
  const [activeTab, setActiveTab]         = useState('dashboard');
  const [subsystemData, setSubsystemData] = useState({});
  const [openModal, setOpenModal]         = useState(null);
  const [toast, setToast]                 = useState(null);

  useEffect(() => { const d = load('subsystems'); if (d) setSubsystemData(d); }, []);

  const saveSubsystem = (id, data) => {
    const updated = { ...subsystemData, [id]: data };
    setSubsystemData(updated);
    save('subsystems', updated);
    setOpenModal(null);
    setToast('✅ Cambios guardados');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'DM Sans', system-ui, sans-serif", background: '#f0f2f7', overflow: 'hidden' }}>

      {/* Edit mode banner */}
      {editMode && (
        <div style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, zIndex: 200 }}>
          <span style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>✏️ Modo Edición Activo</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>Haz clic en cualquier nombre subrayado para cambiarlo</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button onClick={discardAndExit} style={{ padding: '5px 16px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#fff' }}>
              Cancelar
            </button>
            <button onClick={saveAndExit} style={{ padding: '5px 16px', background: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 800, color: '#6366f1' }}>
              💾 Guardar Cambios
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ background: '#1a2744', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, flexShrink: 0, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 28 }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>👥</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              <ET nameKey="app.title" style={{ color: '#fff', fontSize: 14, fontWeight: 800 }} />
            </div>
            <div style={{ fontSize: 10, color: '#64748b', letterSpacing: '0.05em', marginTop: 1 }}>
              <ET nameKey="app.subtitle" style={{ color: '#64748b', fontSize: 10, letterSpacing: '0.05em' }} />
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: 4 }}>
          {TAB_KEYS.map(t => (
            <button key={t.id} onClick={() => { if (!editMode) setActiveTab(t.id); }}
              style={{ padding: '7px 15px', border: 'none', borderRadius: 8, cursor: editMode ? 'default' : 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', background: activeTab === t.id ? 'rgba(255,255,255,0.14)' : 'transparent', color: activeTab === t.id ? '#fff' : '#64748b' }}>
              <span>{t.icon}</span>
              <ET nameKey={t.key} style={{ color: 'inherit', fontSize: 12, fontWeight: 700 }} />
            </button>
          ))}
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 12, color: '#475569' }}>
            {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          {!editMode ? (
            <button onClick={() => setEditMode(true)}
              style={{ padding: '7px 16px', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#c7d2fe', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
              ✏️ Editar
            </button>
          ) : (
            <button onClick={saveAndExit}
              style={{ padding: '7px 16px', background: '#6366f1', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 800, color: '#fff' }}>
              💾 Guardar
            </button>
          )}
        </div>
      </header>

      <main style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'dashboard' && <Dashboard subsystemData={subsystemData} />}
        {activeTab === 'sistemas'  && <SistemasTab subsystemData={subsystemData} onOpenSub={setOpenModal} />}
        {activeTab === 'flujos'    && <FlowsTab />}
        {activeTab === 'visitas'   && <StoreVisitsTab />}
        {activeTab === 'ninebox'   && <NineBoxTab />}
      </main>

      {openModal && (
        <SubsystemModal
          sub={openModal}
          data={subsystemData[openModal.id] || {}}
          onSave={data => saveSubsystem(openModal.id, data)}
          onClose={() => setOpenModal(null)}
        />
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1e293b', color: '#fff', padding: '12px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <EditProvider>
      <AppInner />
    </EditProvider>
  );
}
