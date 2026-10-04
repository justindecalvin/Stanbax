import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://dznuxdinqxjcgwgpqvna.supabase.co') as string | undefined;
const SUPABASE_URL = rawUrl ? rawUrl.trim().replace(/\/+$/, '') : undefined;
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_l7ga_by2ObUIQSYLqmY3yg_1fjQjCF2') as string | undefined;

const SESSION_KEY = 'stanbax_db_session';
let sessionToken: string | null = null;
try {
  if (typeof window !== 'undefined') {
    sessionToken = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
  }
} catch {
  // ignore in non-browser or storage restricted context
}

const authedFetch: typeof fetch = (input, init) => {
  if (!sessionToken) return fetch(input, init);
  const headers = new Headers(init?.headers);
  headers.set('x-stanbax-session', sessionToken);
  return fetch(input, { ...init, headers });
};

// Initialize the Supabase client using environment variables
export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { fetch: authedFetch },
      })
    : null;

export const isRemoteEnabled = (): boolean => supabase !== null;

export const setDbSession = (token: string | null): void => {
  sessionToken = token;
  try {
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem(SESSION_KEY, token);
        localStorage.setItem(SESSION_KEY, token);
      } else {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_KEY);
      }
    }
  } catch {
    // ignore
  }
};

export interface VerifyLoginResult {
  ok: boolean;
  token?: string;
  role?: string;
  refId?: string;
  message?: string;
  unreachable?: boolean;
}

export const remoteVerifyLogin = async (
  identifier: string,
  password: string
): Promise<VerifyLoginResult> => {
  if (!supabase) return { ok: false, unreachable: true };
  
  // Timeout protection: 8 seconds maximum so login never hangs indefinitely
  const timeoutPromise = new Promise<VerifyLoginResult>((resolve) => {
    setTimeout(() => {
      resolve({ ok: false, unreachable: true, message: 'Remote connection timed out. Falling back to local authentication.' });
    }, 8000);
  });

  const requestPromise = (async (): Promise<VerifyLoginResult> => {
    try {
      const { data, error } = await supabase.rpc('verify_login', {
        p_identifier: identifier,
        p_password: password,
      });
      if (error) return { ok: false, unreachable: true, message: error.message };
      const d = data as Record<string, unknown> | null;
      if (!d || d.ok !== true) {
        return { ok: false, message: (d?.message as string) || 'Invalid credentials.' };
      }
      return {
        ok: true,
        token: d.token as string,
        role: d.role as string,
        refId: d.ref_id as string,
      };
    } catch {
      return { ok: false, unreachable: true };
    }
  })();

  return Promise.race([requestPromise, timeoutPromise]);
};

export const completeRemoteLogin = async (token: string, targetSection: string): Promise<never> => {
  setDbSession(token);
  try {
    sessionStorage.setItem('stanbax_resume_section', targetSection);
    localStorage.setItem('stanbax_resume_section', targetSection);
  } catch {
    // ignore
  }
  await hydrateFromSupabase();
  window.location.reload();
  return new Promise<never>(() => {});
};

export const remoteLogout = async (): Promise<void> => {
  if (!supabase || !sessionToken) {
    setDbSession(null);
    return;
  }
  try {
    await supabase.rpc('logout_session', { p_token: sessionToken });
  } catch {
    // ignore
  } finally {
    setDbSession(null);
  }
};

export const remoteChangePassword = async (
  identifier: string,
  oldPassword: string | null,
  newPassword: string
): Promise<void> => {
  if (!supabase || !sessionToken) return;
  try {
    await supabase.rpc('change_password', {
      p_identifier: identifier,
      p_old_password: oldPassword,
      p_new_password: newPassword,
    });
  } catch {
    // ignore
  }
};

export const remoteCreateCredential = async (
  identifier: string,
  password: string,
  role: string,
  refId: string,
  aliases: string[] = []
): Promise<void> => {
  if (!supabase || !sessionToken) return;
  try {
    await supabase.rpc('create_credential', {
      p_identifier: identifier,
      p_password: password,
      p_role: role,
      p_ref_id: refId,
      p_aliases: aliases,
    });
  } catch {
    // ignore
  }
};

// Write-through database synchronization
const pendingWrites = new Map<string, string | null>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let suppressRemote = false;

const flushWrites = async () => {
  flushTimer = null;
  if (!supabase || !sessionToken) {
    pendingWrites.clear();
    return;
  }
  const batch = [...pendingWrites.entries()];
  pendingWrites.clear();
  const upserts = batch
    .filter(([, v]) => v !== null)
    .map(([key, v]) => ({ key, data: JSON.parse(v as string) }));
  const deletes = batch.filter(([, v]) => v === null).map(([k]) => k);
  try {
    if (upserts.length) await supabase.rpc('put_states', { p_items: upserts });
    if (deletes.length) await supabase.rpc('delete_states', { p_keys: deletes });
  } catch {
    // local copy already saved
  }
};

const scheduleFlush = () => {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    void flushWrites();
  }, 400);
};

export const queueRemoteWrite = (key: string, serialized: string | null): void => {
  if (!isRemoteEnabled() || suppressRemote) return;
  pendingWrites.set(key, serialized);
  scheduleFlush();
};

let patchInstalled = false;
export const installLocalStorageSync = (): void => {
  if (patchInstalled || typeof localStorage === 'undefined') return;
  patchInstalled = true;
  const origSet = localStorage.setItem.bind(localStorage);
  const origRemove = localStorage.removeItem.bind(localStorage);
  localStorage.setItem = (key: string, value: string) => {
    origSet(key, value);
    if (key.startsWith('stanbax_')) queueRemoteWrite(key, value);
  };
  localStorage.removeItem = (key: string) => {
    origRemove(key);
    if (key.startsWith('stanbax_')) queueRemoteWrite(key, null);
  };
};

export const hydrateFromSupabase = async (): Promise<void> => {
  if (!supabase) return;
  try {
    const { data, error } = await supabase
      .from('school_state')
      .select('key, data');
    if (error || !data) return;
    const remoteKeys = new Set<string>();
    suppressRemote = true;
    try {
      for (const row of data as Array<{ key: string; data: unknown }>) {
        if (row.data === null || row.data === undefined) continue;
        remoteKeys.add(row.key);
        localStorage.setItem(row.key, JSON.stringify(row.data));
      }
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k?.startsWith('stanbax_')) {
          const v = localStorage.getItem(k);
          if (v === 'null' || v === 'undefined') localStorage.removeItem(k);
        }
      }
    } finally {
      suppressRemote = false;
    }
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('stanbax_') && !remoteKeys.has(k)) {
        queueRemoteWrite(k, localStorage.getItem(k));
      }
    }
  } catch {
    // offline -> local seeds remain
  }
};

export default supabase;
