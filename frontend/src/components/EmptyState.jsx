export default function EmptyState({ icon = '🔍', title, hint, action }) {
  return (
    <div className="card empty">
      <div className="big">{icon}</div>
      <h3 style={{ margin: '8px 0 4px' }}>{title}</h3>
      <p className="mut">{hint}</p>
      {action}
    </div>
  );
}
