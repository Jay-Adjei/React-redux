import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchTasks } from "../../tasks/tasksSlice";
import {
  selectColumns,
  selectTasksStatus,
  selectTasksError,
} from "../../tasks/tasksSelectors";
import { Column } from "../../columns/components/Column";
import { FilterBar } from "../../tasks/components/FilterBar";
import { TaskSkeleton } from "../../tasks/components/TaskSkeleton";

export function Board() {
  const dispatch = useAppDispatch();
  const board = useAppSelector((state) => state.board.activeBoard);
  const columns = useAppSelector(selectColumns);
  const status = useAppSelector(selectTasksStatus);
  const error = useAppSelector(selectTasksError);

  useEffect(() => {
    // TODO [Level 2]: Dispatch fetchTasks when status is 'idle' to trigger async data loading
    if (status === "idle") {
      dispatch(fetchTasks());
      console.log(status, error);
    }
  }, [dispatch, status]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>{board.title}</h1>
        <div className="app-header-actions">
          <FilterBar />
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button
            className="btn-secondary"
            onClick={() => dispatch(fetchTasks())}
          >
            Retry
          </button>
        </div>
      )}

      {status === "loading" ? (
        <div className="board">
          <TaskSkeleton />
          <TaskSkeleton />
          <TaskSkeleton />
        </div>
      ) : (
        <div className="board">
          {columns.map((column) => (
            <Column key={column.id} columnId={column.id} title={column.title} />
          ))}
        </div>
      )}
    </div>
  );
}
