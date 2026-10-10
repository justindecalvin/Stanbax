import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const SESSION_KEY = 'stanbax_db_session';
let sessionToken: string | null = null;
try { 
  sessionToken = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY); 
} catch { /* ignore */ }

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
    if (token) {
      sessionStorage.setItem(SESSION_KEY, token);
      localStorage.setItem(SESSION_KEY, token);
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
    }
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

export const remoteCheckCredentials = async (
  identifier: string,
  password: string,
  expectedRole: string,
  expectedRefId?: string
): Promise<{ ok: boolean; unreachable?: boolean; message?: string }> => {
  if (!supabase) return { ok: false, unreachable: true, message: 'Supabase is not configured.' };
  try {
    const { data, error } = await supabase.rpc('verify_login', {
      p_identifier: identifier,
      p_password: password,
    });
    if (error) return { ok: false, unreachable: true, message: error.message };
    const result = data as { ok?: boolean; token?: string; role?: string; ref_id?: string; message?: string } | null;
    if (!result?.ok) return { ok: false, message: result?.message || 'Current password is incorrect.' };
    // Preserve this fresh session token so subsequent operations (e.g. change_password) have an active authenticated session
    if (result.token) {
      setDbSession(result.token);
    }
    if (result.role !== expectedRole || (expectedRefId && result.ref_id !== expectedRefId)) {
      return { ok: false, message: 'The verified account does not match the signed-in account.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, unreachable: true, message: 'Supabase could not verify the current password.' };
  }
};

// Verify administrative authority server-side using SECURITY DEFINER RPC
export const checkRemoteAdminStatus = async (): Promise<boolean> => {
  if (!supabase || !sessionToken) return false;
  try {
    const { data, error } = await supabase.rpc('session_role');
    if (error || !data) return false;
    return data === 'admin' || data === 'proprietress';
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
  setDbSession(token);
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
  if (!supabase) return { ok: false, message: 'Supabase is offline.' };

  // If no session token or if oldPassword is provided, ensure we have an active session
  if (!sessionToken && oldPassword) {
    try {
      const authAttempt = await remoteVerifyLogin(identifier, oldPassword);
      if (authAttempt.ok && authAttempt.token) {
        setDbSession(authAttempt.token);
      }
    } catch { /* ignore */ }
  }

  if (!sessionToken) return { ok: false, message: 'Supabase session unavailable. Please sign in again.' };

  try {
    const { data, error } = await supabase.rpc('change_password', {
      p_identifier: identifier,
      p_old_password: oldPassword,
      p_new_password: newPassword,
    });
    if (error) {
      // If error indicates session expiration and oldPassword is present, re-authenticate and retry
      if (error.message?.toLowerCase().includes('not signed in') && oldPassword) {
        const reauth = await remoteVerifyLogin(identifier, oldPassword);
        if (reauth.ok && reauth.token) {
          setDbSession(reauth.token);
          const retryRes = await supabase.rpc('change_password', {
            p_identifier: identifier,
            p_old_password: oldPassword,
            p_new_password: newPassword,
          });
          if (!retryRes.error) {
            const retryData = retryRes.data as { ok?: boolean; message?: string } | null;
            return { ok: retryData?.ok === true, message: retryData?.message };
          }
        }
      }
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

const isSensitiveStateKey = (_key: string): boolean => false;

export const isBrowserOnlyStateKey = (key: string): boolean =>
  /_(?:auth|active_section|resume_section|db_session|session|tour_completed|cookie_consent|visitor_identity|password|sec_q|sec_a|security_q|security_a)$/i.test(key);

const sanitizeCloudState = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sanitizeCloudState);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !/^(?:currentpassword|newpassword)$/i.test(key))
      .map(([key, nested]) => [key, sanitizeCloudState(nested)])
  );
};

const flushWrites = async () => {
  flushTimer = null;
  if (!supabase || !sessionToken || pendingWrites.size === 0) return;
  const batch = [...pendingWrites.entries()];
  pendingWrites.clear();
  const upserts = batch
    .filter(([key, v]) => v !== null && !isBrowserOnlyStateKey(key))
    .map(([key, v]) => {
      let parsedData: unknown = v;
      try {
        parsedData = JSON.parse(v as string);
      } catch {
        parsedData = v;
      }
      return { key, data: sanitizeCloudState(parsedData) };
    });
  const deletes = batch.filter(([, v]) => v === null).map(([k]) => k);
  
  try {
    if (upserts.length) {
      const { error } = await supabase.rpc('put_states', { p_items: upserts });
      if (error) {
        console.warn('[Supabase Sync] State write restricted or unauthorized:', error.message);
        if (error.message?.includes('Not signed in')) {
          const storedToken = sessionStorage.getItem('stanbax_db_session') || localStorage.getItem('stanbax_db_session');
          if (!storedToken) {
            setDbSession(null);
          }
        }
        for (const [key, value] of batch) pendingWrites.set(key, value);
        return;
      }
      // Ensure synchronized state items are marked public so other browsers hydrate them before login
      try {
        const writtenKeys = upserts.map(u => u.key);
        if (writtenKeys.length > 0) {
          await supabase.from('school_state').update({ is_public: true }).in('key', writtenKeys);
        }
      } catch { /* best effort */ }
    }
    if (deletes.length) {
      const { error } = await supabase.rpc('delete_states', { p_keys: deletes });
      if (error) {
        console.warn('[Supabase Sync] State delete restricted:', error.message);
        for (const [key, value] of batch) pendingWrites.set(key, value);
      }
    }
  } catch (err) {
    console.warn('[Supabase Sync] State flush handled gracefully:', err);
    for (const [key, value] of batch) pendingWrites.set(key, value);
  }
};

const scheduleFlush = () => {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => { void flushWrites(); }, 400);
};

export const queueRemoteWrite = (key: string, serialized: string | null): void => {
  if (!isRemoteEnabled() || suppressRemote || isBrowserOnlyStateKey(key)) return;
  pendingWrites.set(key, serialized);
  scheduleFlush();
};

export interface LocalCloudSyncResult {
  ok: boolean;
  written: number;
  message: string;
}

/**
 * Explicitly migrate this browser's permanent school records to the cloud.
 * Only an authenticated admin/proprietress session may run the overwrite.
 */
export const syncLocalSchoolStateToSupabase = async (): Promise<LocalCloudSyncResult> => {
  if (!supabase || !sessionToken) {
    return { ok: false, written: 0, message: 'Connect to Supabase and sign in first.' };
  }
  if (!(await checkRemoteAdminStatus())) {
    return { ok: false, written: 0, message: 'Only a verified administrator can sync this browser.' };
  }
  await flushWrites();
  if (pendingWrites.size > 0) {
    return { ok: false, written: 0, message: 'Some pending changes could not be saved. Check the connection and retry before syncing this browser.' };
  }

  const items: Array<{ key: string; data: unknown }> = [];
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    if (!key?.startsWith('stanbax_') || isBrowserOnlyStateKey(key)) continue;
    const raw = localStorage.getItem(key);
    if (raw === null || raw === 'undefined' || raw === 'null') continue;
    try {
      items.push({ key, data: sanitizeCloudState(JSON.parse(raw)) });
    } catch {
      items.push({ key, data: raw });
    }
  }

  try {
    for (let offset = 0; offset < items.length; offset += 20) {
      const slice = items.slice(offset, offset + 20);
      const { error } = await supabase.rpc('put_states', {
        p_items: slice,
      });
      if (error) throw error;
      try {
        const sliceKeys = slice.map(s => s.key);
        if (sliceKeys.length > 0) {
          await supabase.from('school_state').update({ is_public: true }).in('key', sliceKeys);
        }
      } catch { /* best effort */ }
    }

    return {
      ok: true,
      written: items.length,
      message: `Successfully synchronized ${items.length} school records and credentials to cloud storage.`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Supabase write failed.';
    return {
      ok: false,
      written: 0,
      message: `Cloud sync failed: ${message}. No success was reported; retry after resolving the issue.`,
    };
  }
};

let patchInstalled = false;
export const installLocalStorageSync = (): void => {
  if (patchInstalled || typeof localStorage === 'undefined') return;
  patchInstalled = true;
  const origSet = localStorage.setItem.bind(localStorage);
  const origRemove = localStorage.removeItem.bind(localStorage);
  localStorage.setItem = (key: string, value: string) => {
    origSet(key, value);
    if (key.startsWith('stanbax_') && !isBrowserOnlyStateKey(key)) {
      queueRemoteWrite(key, value);
    }
  };
  localStorage.removeItem = (key: string) => {
    origRemove(key);
    if (key.startsWith('stanbax_') && !isBrowserOnlyStateKey(key)) {
      queueRemoteWrite(key, null);
    }
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
        if (row.data === null || row.data === undefined || isBrowserOnlyStateKey(row.key)) continue;
        remoteKeys.add(row.key);
        const storedValue = typeof row.data === 'string' ? row.data : JSON.stringify(row.data);
        localStorage.setItem(row.key, storedValue);
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
        if (k && k.startsWith('stanbax_') && !remoteKeys.has(k) && !isBrowserOnlyStateKey(k)) {
          queueRemoteWrite(k, localStorage.getItem(k));
        }
      }
    }
  } catch (err) {
    console.warn('[Supabase Hydrate] Fallback to local cache:', err);
  }
};
