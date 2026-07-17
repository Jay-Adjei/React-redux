export function TaskSkeleton() {
  return (
    <div className="task-card" aria-hidden="true">
      <div className="task-card-header">
        <div className="skeleton" style={{ height: "0.95rem", width: "68%" }} />
        <div
          className="skeleton"
          style={{ height: "1.5rem", width: "1.5rem", borderRadius: "50%" }}
        />
      </div>

      <div
        className="skeleton"
        style={{ height: "0.8rem", width: "100%", marginBottom: "0.45rem" }}
      />
      <div
        className="skeleton"
        style={{ height: "0.8rem", width: "82%", marginBottom: "1rem" }}
      />

      <div className="task-footer">
        <div
          className="skeleton"
          style={{ height: "1.2rem", width: "4.5rem", borderRadius: "999px" }}
        />
        <div
          className="skeleton"
          style={{ width: "28px", height: "28px", borderRadius: "50%" }}
        />
      </div>
    </div>
  );
}
