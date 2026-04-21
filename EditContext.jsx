import { createContext, useContext, useState, useEffect } from 'react';
import { LIFECYCLE } from './data.js';
import { save, load } from './storage.js';

// Build default names from data
const buildDefaults = () => {
  const names = {
    'app.title':    'People & DO',
    'app.subtitle': 'Gestión de Personas',
    'tab.dashboard': 'Dashboard',
    'tab.sistemas':  'Sistemas',
    'tab.flujos':    'Flujos',
    'tab.visitas':   'Visitas a Tienda',
    'tab.ninebox':   'Nine Box',
  };
  LIFECYCLE.forEach(l => {
    names[`system.${l.id}`] = l.label;
    l.subsystems.forEach(s => { names[`sub.${s.id}`] = s.label; });
  });
  return names;
};

export const DEFAULTS = buildDefaults();

const EditContext = createContext(null);

export function EditProvider({ children }) {
  const [editMode, setEditMode]     = useState(false);
  const [customNames, setCustomNames] = useState(() => load('customNames') || {});

  const getName = (key) => customNames[key] ?? DEFAULTS[key] ?? key;

  const setName = (key, value) =>
    setCustomNames(prev => ({ ...prev, [key]: value }));

  const saveAndExit = () => {
    save('customNames', customNames);
    setEditMode(false);
  };

  const discardAndExit = () => {
    setCustomNames(load('customNames') || {});
    setEditMode(false);
  };

  return (
    <EditContext.Provider value={{ editMode, setEditMode, getName, setName, saveAndExit, discardAndExit }}>
      {children}
    </EditContext.Provider>
  );
}

export const useEdit = () => useContext(EditContext);

// ─── EditableText ────────────────────────────────────────────────────────────
// Drop-in replacement for any static label.
// In view mode: renders text with given style.
// In edit mode: renders an inline input.
export function ET({ nameKey, style = {}, inputStyle = {}, placeholder }) {
  const { editMode, getName, setName } = useEdit();
  const value = getName(nameKey);

  if (!editMode) return <span style={style}>{value}</span>;

  return (
    <input
      value={value}
      onChange={e => setName(nameKey, e.target.value)}
      placeholder={placeholder || DEFAULTS[nameKey]}
      style={{
        background: 'transparent',
        border: 'none',
        borderBottom: '1.5px dashed rgba(255,255,255,0.4)',
        outline: 'none',
        color: 'inherit',
        fontFamily: 'inherit',
        fontWeight: 'inherit',
        fontSize: 'inherit',
        letterSpacing: 'inherit',
        padding: '0 2px',
        width: `${Math.max(60, value.length * 8 + 20)}px`,
        ...style,
        ...inputStyle,
      }}
    />
  );
}

// For use on light backgrounds
export function ETLight({ nameKey, style = {}, inputStyle = {} }) {
  const { editMode, getName, setName } = useEdit();
  const value = getName(nameKey);

  if (!editMode) return <span style={style}>{value}</span>;

  return (
    <input
      value={value}
      onChange={e => setName(nameKey, e.target.value)}
      style={{
        background: '#f0f4ff',
        border: '1.5px dashed #6366f1',
        borderRadius: 4,
        outline: 'none',
        color: 'inherit',
        fontFamily: 'inherit',
        fontWeight: 'inherit',
        fontSize: 'inherit',
        padding: '1px 6px',
        width: `${Math.max(80, value.length * 8 + 24)}px`,
        ...style,
        ...inputStyle,
      }}
    />
  );
}
