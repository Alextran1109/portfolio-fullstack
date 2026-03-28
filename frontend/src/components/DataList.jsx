export default function DataList({ items, onEdit, onDelete, saving, titleLine, subLine }) {
  if (!items.length) {
    return <p className="muted">No items yet.</p>;
  }
  return (
    <ul className="list">
      {items.map((item) => (
        <li key={item.id}>
          <div>
            <strong>{titleLine(item)}</strong>
            {subLine ? <div className="muted">{subLine(item)}</div> : null}
          </div>
          <div className="form-actions">
            <button type="button" disabled={saving} onClick={() => onEdit(item)}>
              Edit
            </button>
            <button
              type="button"
              className="danger"
              disabled={saving}
              onClick={() => onDelete(item.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
