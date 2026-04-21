const PREFIX = 'people_do_';

export const save = (key, data) => {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(data)); } catch (e) { console.error('Save error', e); }
};

export const load = (key) => {
  try { return JSON.parse(localStorage.getItem(PREFIX + key)); } catch { return null; }
};

export const remove = (key) => {
  try { localStorage.removeItem(PREFIX + key); } catch {}
};
