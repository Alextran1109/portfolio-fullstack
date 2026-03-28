import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import CrudForm from './CrudForm';
import DataList from './DataList';

function buildPayload(form, fields, editingId) {
  const out = {};
  for (const f of fields) {
    if (f.onlyCreate && editingId) {
      if (form[f.name]) out[f.name] = form[f.name];
      continue;
    }
    if (f.onlyCreate && !editingId) {
      out[f.name] = form[f.name];
      continue;
    }
    let v = form[f.name];
    if (f.type === 'date' && v) {
      v = new Date(v).toISOString();
    }
    out[f.name] = v;
  }
  return out;
}

export default function EntityCrud({ title, resource, fields, emptyForm, titleLine, subLine }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => ({ ...emptyForm }));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await apiRequest(`/${resource}`);
      if (!r.success) throw new Error(r.message);
      setItems(r.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    load();
  }, [load]);

  const onChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const resetForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = buildPayload(form, fields, editingId);
      if (editingId) {
        const r = await apiRequest(`/${resource}/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        if (!r.success) throw new Error(r.message);
      } else {
        const r = await apiRequest(`/${resource}`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (!r.success) throw new Error(r.message);
      }
      resetForm();
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    setSaving(true);
    setError(null);
    try {
      const r = await apiRequest(`/${resource}/${id}`, { method: 'DELETE' });
      if (!r.success) throw new Error(r.message);
      if (editingId === id) resetForm();
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    const next = { ...emptyForm };
    for (const f of fields) {
      if (f.onlyCreate) {
        next[f.name] = '';
        continue;
      }
      const v = item[f.name];
      if (v == null) continue;
      next[f.name] = f.type === 'date' && typeof v === 'string' ? v.slice(0, 10) : v;
    }
    setForm(next);
  };

  return (
    <div>
      <h1>{title}</h1>
      {error && <div className="error">{error}</div>}
      <CrudForm
        fields={fields}
        form={form}
        editingId={editingId}
        onChange={onChange}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        saving={saving}
      />
      {loading ? (
        <p className="loading">Loading…</p>
      ) : (
        <DataList
          items={items}
          onEdit={startEdit}
          onDelete={handleDelete}
          saving={saving}
          titleLine={titleLine}
          subLine={subLine}
        />
      )}
    </div>
  );
}
