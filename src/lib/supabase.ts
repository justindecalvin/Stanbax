import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const SESSION_KEY = 'stanbax_db_session';
let sessionToken: string | null = null;
try { sessionToken = sessionStorage.getItem(SESSION_KEY); } catch { /* ignore */ }

const authedFetch: typeof fetch = (input, init) => {
  if (!sessionToken) return fetch(input, init);
  const headers = new Headers(init?.headers);
  headers.set('x-stanbax-session', sessionToken);
  return fetch(input, { ...init, headers });
};

// Client instantiated strictly with SUPABASE_URL and SUPABASE_ANON_KEY (Zero-Trust)
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
    if (token) sessionStorage.setItem(SESSION_KEY, token);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch { /* ignore */ }
};

export const getDbSession = (): string | null => sessionToken;

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
  try {
    const { data, error } = await supabase.rpc('verify_login', {
      p_identifier: identifier,
      p_password: password,
    });
    if (error) {
      console.warn('[Supabase Auth] Login verification rejected:', error.message);
      return { ok: false, unreachable: true, message: error.message };
    }
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
  } catch (err) {
    console.warn('[Supabase Auth] Remote verification unreachable:', err);
    return { ok: false, unreachable: true };
  }
};

// Verify administrative authority server-side using SECURITY DEFINER RPC
export const checkRemoteAdminStatus = async (): Promise<boolean> => {
  if (!supabase || !sessionToken) return false;
  try {
    const { data, error } = await supabase.rpc('is_admin_session');
    if (error || !data) return false;
    return data === true;
  } catch {
    return false;
  }
};

// After a remote-verified login, hydrate (now including private collections
// unlocked by the session token) then reload so every mounted state picks up
// the shared data. The portal section is stashed so App lands back in it.
export const completeRemoteLogin = async (token: string, targetSection: string): Promise<never> => {
  setDbSession(token);
  try { sessionStorage.setItem('stanbax_resume_section', targetSection); } catch { /* ignore */ }
  await hydrateFromSupabase();
  window.location.reload();
  // unreachable in a real browser, but satisfies typing in tests
  return new Promise<never>(() => {});
};

export const remoteLogout = async (): Promise<void> => {
  if (!supabase || !sessionToken) return;
  try {
    await supabase.rpc('logout_session', { p_token: sessionToken });
  } catch { /* ignore */ }
  setDbSession(null);
};

export const remoteChangePassword = async (
  identifier: string,
  oldPassword: string | null,
  newPassword: string
): Promise<{ ok: boolean; message?: string }> => {
  if (!supabase || !sessionToken) return { ok: false, message: 'Supabase offline or no session.' };
  try {
    const { data, error } = await supabase.rpc('change_password', {
      p_identifier: identifier,
      p_old_password: oldPassword,
      p_new_password: newPassword,
    });
    if (error) {
      console.warn('[Supabase Security] Password change rejected:', error.message);
      return { ok: false, message: error.message };
    }
    const d = data as { ok?: boolean; message?: string } | null;
    return { ok: d?.ok === true, message: d?.message };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Password update failed.' };
  }
};

export const remoteCreateCredential = async (
  identifier: string,
  password: string,
  role: string,
  refId: string,
  aliases: string[] = []
): Promise<{ ok: boolean; message?: string }> => {
  if (!supabase || !sessionToken) return { ok: false, message: 'Supabase offline or no session.' };
  try {
    const { data, error } = await supabase.rpc('create_credential', {
      p_identifier: identifier,
      p_password: password,
      p_role: role,
      p_ref_id: refId,
      p_aliases: aliases,
    });
    if (error) {
      console.warn('[Supabase Security] Credential creation unauthorized:', error.message);
      return { ok: false, message: error.message };
    }
    const d = data as { ok?: boolean; message?: string } | null;
    return { ok: d?.ok === true, message: d?.message };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Credential provisioning failed.' };
  }
};

// ---------------------------------------------------------------------------
// Write-through: every localStorage.setItem('stanbax_*', ...) also queues a
// remote upsert into the school_state KV table (debounced, best-effort).
// ---------------------------------------------------------------------------

const pendingWrites = new Map<string, string | null>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let suppressRemote = false;

const flushWrites = async () => {
  flushTimer = null;
  if (!supabase || !sessionToken) { pendingWrites.clear(); return; }
  const batch = [...pendingWrites.entries()];
  pendingWrites.clear();
  const upserts = batch
    .filter(([, v]) => v !== null)
    .map(([key, v]) => ({ key, data: JSON.parse(v as string) }));
  const deletes = batch.filter(([, v]) => v === null).map(([k]) => k);
  
  try {
    if (upserts.length) {
      const { error } = await supabase.rpc('put_states', { p_items: upserts });
      if (error) {
        console.warn('[Supabase Sync] State write restricted or unauthorized:', error.message);
        if (error.message?.includes('Not signed in')) {
          setDbSession(null);
        }
      }
    }
    if (deletes.length) {
      const { error } = await supabase.rpc('delete_states', { p_keys: deletes });
      if (error) {
        console.warn('[Supabase Sync] State delete restricted:', error.message);
      }
    }
  } catch (err) {
    console.warn('[Supabase Sync] State flush handled gracefully:', err);
  }
};

const scheduleFlush = () => {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => { void flushWrites(); }, 400);
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

// ---------------------------------------------------------------------------
// Hydration: pull all readable rows into localStorage before React renders,
// so every existing useState(localStorage.getItem(...)) initializer picks up
// the shared remote state. Public rows are readable without a session;
// private rows unlock after login.
// ---------------------------------------------------------------------------

export const hydrateFromSupabase = async (): Promise<void> => {
  if (!supabase) return;
  try {
    const { data, error } = await supabase
      .from('school_state')
      .select('key, data');
    if (error) {
      console.warn('[Supabase Hydrate] Read restricted or unavailable:', error.message);
      return;
    }
    if (!data) return;

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

    // Bootstrap local seeds to remote if missing and user has valid session
    if (sessionToken) {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('stanbax_') && !remoteKeys.has(k)) {
          queueRemoteWrite(k, localStorage.getItem(k));
        }
      }
    }
  } catch (err) {
    console.warn('[Supabase Hydrate] Fallback to local cache:', err);
  }
};
