import supabase from '../supabaseClient';
import { authMode } from './authService';

const keyFor = (table) => `alumni-connect-${table}`;
const readLocal = (table) => {
  try {
    return JSON.parse(localStorage.getItem(keyFor(table))) || [];
  } catch {
    return [];
  }
};
const writeLocal = (table, items) => localStorage.setItem(keyFor(table), JSON.stringify(items));

export const listContent = async (table, email) => {
  if (authMode === 'supabase') {
    let query = supabase.from(table).select('*');
    if (email) query = query.eq('email_id', email);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
  const items = readLocal(table);
  return email ? items.filter((item) => item.email_id === email) : items;
};

export const getContent = async (table, id) => {
  if (authMode === 'supabase') {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }
  return readLocal(table).find((item) => String(item.id) === String(id)) || null;
};

export const saveContent = async (table, values, id) => {
  if (authMode === 'supabase') {
    const query = id
      ? supabase.from(table).update(values).eq('id', id)
      : supabase.from(table).insert([values]);
    const { error } = await query;
    if (error) throw error;
    return;
  }

  const items = readLocal(table);
  if (id) {
    writeLocal(table, items.map((item) => String(item.id) === String(id) ? { ...item, ...values } : item));
  } else {
    writeLocal(table, [{ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...values }, ...items]);
  }
};

export const deleteContent = async (table, id) => {
  if (authMode === 'supabase') {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    return;
  }
  writeLocal(table, readLocal(table).filter((item) => String(item.id) !== String(id)));
};
