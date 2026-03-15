// ── Shared data loading & caching ─────────────────────────────────────────

const _cache = {};

export async function loadJSON(path) {
  if (_cache[path]) return _cache[path];
  const base = getBase();
  const r = await fetch(base + path);
  if (!r.ok) throw new Error(`Failed to load ${path}: ${r.status}`);
  _cache[path] = await r.json();
  return _cache[path];
}

export async function loadAll() {
  const [areas, faculty, capabilities] = await Promise.all([
    loadJSON('data/areas.json'),
    loadJSON('data/faculty.json'),
    loadJSON('data/capabilities.json'),
  ]);
  return { areas, faculty, capabilities };
}

// Resolve base path for both root and sub-directory pages (area/, faculty/)
function getBase() {
  const p = location.pathname;
  if (p.includes('/area/') || p.includes('/faculty/') || p.includes('/capabilities/')) return '../';
  return '';
}

// ── Area color utilities ───────────────────────────────────────────────────

export function getAreaColor(area) {
  return area?.color ?? '#64748B';
}

// Make a pale tinted background from a hex color
export function tintColor(hex, alpha = 0.12) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── URL helpers ────────────────────────────────────────────────────────────

export function areaUrl(areaId) {
  if (location.pathname.includes('/area/')) return `?id=${areaId}`;
  return `area/?id=${areaId}`;
}

export function facultyUrl(facultyId) {
  if (location.pathname.includes('/faculty/')) return `?id=${facultyId}`;
  return `faculty/?id=${facultyId}`;
}

// ── Query param helper ─────────────────────────────────────────────────────

export function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}
