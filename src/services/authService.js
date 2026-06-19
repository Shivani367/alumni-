import supabase from '../supabaseClient';

const ACCOUNTS_KEY = 'alumni-connect-accounts';
const SESSION_KEY = 'alumni-connect-session';
const RESET_KEY = 'alumni-connect-reset-email';
const AUTH_EVENT = 'alumni-auth-change';

const useSupabase = process.env.REACT_APP_USE_SUPABASE === 'true';

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const notify = () => window.dispatchEvent(new Event(AUTH_EVENT));

const digest = async (value) => {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const localSession = () => readJson(SESSION_KEY, null);

export const getSession = async () => {
  if (useSupabase) {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }
  return localSession();
};

export const signUp = async ({ email, password, profile }) => {
  if (useSupabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: profile },
    });
    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        ...profile,
      });
      if (profileError) throw profileError;
    }
    return data.session;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readJson(ACCOUNTS_KEY, []);
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error('An account with this email already exists. Please log in.');
  }

  const user = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    profile,
    passwordHash: await digest(password),
  };
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, user]));
  const session = { user: { id: user.id, email: user.email, user_metadata: profile } };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  notify();
  return session;
};

export const signIn = async ({ email, password }) => {
  if (useSupabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.session;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readJson(ACCOUNTS_KEY, []);
  const account = accounts.find((candidate) => candidate.email === normalizedEmail);
  if (!account || account.passwordHash !== await digest(password)) {
    throw new Error('Invalid email or password.');
  }

  const session = {
    user: { id: account.id, email: account.email, user_metadata: account.profile },
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  notify();
  return session;
};

export const signOut = async () => {
  if (useSupabase) {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } else {
    localStorage.removeItem(SESSION_KEY);
    notify();
  }
};

export const requestPasswordReset = async (email) => {
  if (useSupabase) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) throw error;
    return 'Password reset email sent successfully.';
  }

  const normalizedEmail = email.trim().toLowerCase();
  const exists = readJson(ACCOUNTS_KEY, []).some((account) => account.email === normalizedEmail);
  if (!exists) throw new Error('No local account was found for that email.');
  sessionStorage.setItem(RESET_KEY, normalizedEmail);
  return 'Account verified. You can now choose a new password.';
};

export const updatePassword = async (password) => {
  if (useSupabase) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return;
  }

  const email = sessionStorage.getItem(RESET_KEY) || localSession()?.user?.email;
  if (!email) throw new Error('Start from the Forgot Password page first.');
  const accounts = readJson(ACCOUNTS_KEY, []);
  const index = accounts.findIndex((account) => account.email === email);
  if (index < 0) throw new Error('Account not found.');
  accounts[index] = { ...accounts[index], passwordHash: await digest(password) };
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  sessionStorage.removeItem(RESET_KEY);
};

export const onAuthChange = (callback) => {
  if (useSupabase) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
    return () => data.subscription.unsubscribe();
  }
  const handler = () => callback(localSession());
  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
};

export const authMode = useSupabase ? 'supabase' : 'local';
