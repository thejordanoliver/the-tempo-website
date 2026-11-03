export function State({ loading, error, empty, onRetry }) {
  if (!loading && !error && !empty) return null;
  return (
    <div className="page-state" role="status">
      <p>{loading ? "Loading…" : error || empty}</p>
      {error && onRetry && (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
