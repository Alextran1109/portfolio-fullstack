export default function CrudForm({
  fields,
  form,
  editingId,
  onChange,
  onSubmit,
  onCancel,
  saving,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-grid">
        {fields.map((f) => {
          if (f.onlyCreate && editingId) return null;
          const val = form[f.name] ?? '';
          const Tag = f.type === 'textarea' ? 'textarea' : 'input';
          const inputType =
            f.type === 'textarea' ? undefined : f.type === 'date' ? 'date' : f.type || 'text';
          const htmlRequired = f.onlyCreate
            ? Boolean(f.required && !editingId)
            : Boolean(f.required);
          return (
            <label key={f.name}>
              {f.label}
              {htmlRequired ? ' *' : ''}
              <Tag
                type={Tag === 'input' ? inputType : undefined}
                rows={f.type === 'textarea' ? 3 : undefined}
                value={val}
                required={htmlRequired}
                onChange={(e) => onChange(f.name, e.target.value)}
                data-cy={f.dataCy || `field-${f.name}`}
              />
            </label>
          );
        })}
      </div>
      <div className="form-actions">
        <button type="submit" className="primary" disabled={saving} data-cy="crud-submit">
          {editingId ? 'Update' : 'Create'}
        </button>
        {editingId && (
          <button type="button" disabled={saving} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
