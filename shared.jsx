import { STATUS_OPTIONS } from '../data.js';

export const getStatus = (s) => STATUS_OPTIONS.find(o => o.value === s) || STATUS_OPTIONS[0];

export function Badge({ status }) {
  const s = getStatus(status);
  return (
    <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

export function ProgressBar({ value, color = '#6366f1', height = 7 }) {
  return (
    <div style={{ background: '#e2e8f0', borderRadius: 8, height, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color, height: '100%', borderRadius: 8, transition: 'width 0.4s' }} />
    </div>
  );
}

export function StarRating({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <button key={i} onClick={() => onChange(i)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: i <= value ? '#f59e0b' : '#e2e8f0', padding: '0 1px', lineHeight: 1 }}>
          ★
        </button>
      ))}
      <span style={{ fontSize: 13, color: '#64748b', marginLeft: 6, fontWeight: 700 }}>{value}/5</span>
    </div>
  );
}

export const inp = {
  width: '100%', padding: '8px 12px', border: '1.5px solid #e2e8f0',
  borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none',
  background: '#fafafa', boxSizing: 'border-box',
};

export const lbl = {
  fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4,
  display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em',
};

export function Card({ children, style = {} }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', ...style }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }) {
  return <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', margin: '0 0 16px' }}>{children}</h3>;
}
