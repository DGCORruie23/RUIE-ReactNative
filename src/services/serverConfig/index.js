// URL fija del endpoint de validación — nunca debe cambiar en el código
export const VALIDATION_URL = 'https://ruie.inami.gob.mx/info/validacionL';
export const FALLBACK_BASE_URL = 'https://ruie2025.dgcor.com';

export async function fetchServerConfig() {
  const response = await fetch(VALIDATION_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`validacionL responded with status ${response.status}`);
  }
  const data = await response.json();
  return {
    url: (data.servidor_url || FALLBACK_BASE_URL).replace(/\/$/, ''),
    backupUrl: (data.servidor_backup_url || FALLBACK_BASE_URL).replace(/\/$/, ''),
    activo: data.activo ?? true,
    versionMinima: data.version_minima_app || '1.0.0',
    mensaje: data.mensaje || '',
    updatedAt: data.actualizado_en || new Date().toISOString(),
  };
}

export function isVersionOutdated(current, minimum) {
  const parse = (v) =>
    String(v).replace(/[^0-9.]/g, '').split('.').map(Number);
  const cur = parse(current);
  const min = parse(minimum);
  const len = Math.max(cur.length, min.length);
  for (let i = 0; i < len; i++) {
    const c = cur[i] ?? 0;
    const m = min[i] ?? 0;
    if (c < m) return true;
    if (c > m) return false;
  }
  return false;
}

export function shouldRefreshServerConfig(lastCheckedAt) {
  if (!lastCheckedAt) return true;
  const diffMs = Date.now() - new Date(lastCheckedAt).getTime();
  return diffMs / (1000 * 60 * 60) >= 4;
}
