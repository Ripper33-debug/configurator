export type ConfigShareState = {
  color: string;
  isDeployed: boolean;
  isInteriorView: boolean;
  isInsideView?: boolean;
};

const SHORTCODE_STORAGE_KEY = 'wh_share_codes_v1';

function getStore(): Record<string, ConfigShareState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(SHORTCODE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStore(store: Record<string, ConfigShareState>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SHORTCODE_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}

export function encodeConfigToQuery(config: ConfigShareState): string {
  const params = new URLSearchParams();
  params.set('color', config.color);
  params.set('d', config.isDeployed ? '1' : '0');
  params.set('i', config.isInteriorView ? '1' : '0');
  if (typeof config.isInsideView === 'boolean') {
    params.set('in', config.isInsideView ? '1' : '0');
  }
  return params.toString();
}

export function decodeConfigFromQuery(search: string): Partial<ConfigShareState> | null {
  try {
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    const color = params.get('color');
    if (!color) return null;
    return {
      color,
      isDeployed: params.get('d') === '1',
      isInteriorView: params.get('i') === '1',
      isInsideView: params.get('in') === '1'
    };
  } catch {
    return null;
  }
}

function generateCode(): string {
  // 6-char base36 code
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function saveShortCode(config: ConfigShareState): string {
  const store = getStore();
  let code = generateCode();
  while (store[code]) {
    code = generateCode();
  }
  store[code] = config;
  setStore(store);
  return code;
}

export function resolveShortCode(code: string): ConfigShareState | null {
  const store = getStore();
  return store[code] || null;
}

export function buildShareUrl(baseUrl: string, config: ConfigShareState): string {
  const query = encodeConfigToQuery(config);
  const url = new URL(baseUrl);
  url.search = query;
  return url.toString();
}


