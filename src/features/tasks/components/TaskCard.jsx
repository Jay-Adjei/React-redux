import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { deleteTask, updateTask } from "../tasksSlice";
import { removeTaskFromColumn } from "../../board/boardSlice";
import { selectTaskById } from "../tasksSelectors";

export function TaskCard({ taskId, columnId, onDragStart, onDragEnd }) {
  const dispatch = useAppDispatch();

  // TODO [Level 1]: Use useAppSelector with selectTaskById to read the task from the store
  const task = useAppSelector(selectTaskById(taskId));

  // TODO [Level 1]: Use useAppSelector to read users from state.users.entities
  const users = useAppSelector((state) => state.users.entities);

  const isOptimistic = useAppSelector(
    (state) => state.tasks.optimisticMoves[taskId] !== undefined,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  if (!task) return null;

  const assignee = task.assigneeId ? users[task.assigneeId] : null;

  const handleEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO [Level 1]: Dispatch updateTask with the edited title and description
    dispatch(
      updateTask({
        id: task.id,
        title: editTitle,
        description: editDescription,
      }),
    );
    setIsEditing(false);
  };

  const handleDelete = () => {
    // TODO [Level 1]: Dispatch deleteTask and removeTaskFromColumn actions
    dispatch(deleteTask(task.id));
    void removeTaskFromColumn;
    void columnId;
  };

  return (
    <div
      className={`task-card${isOptimistic ? " optimistic" : ""}`}
      draggable
      onDragStart={() => onDragStart(taskId)}
      onDragEnd={onDragEnd}
    >
      {isEditing ? (
        <div className="edit-form">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
          />
          <div className="form-row">
            <button className="btn-primary" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-card-header">
            <span className="task-title">{task.title}</span>
            <div className="task-actions">
              <button onClick={handleEdit} title="Edit">
                ✏️
              </button>
              <button onClick={handleDelete} title="Delete">
                🗑️
              </button>
            </div>
          </div>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          <div className="task-footer">
            <span className={`priority-badge priority-${task.priority}`}>
              {task.priority}
            </span>
            {assignee && (
              <span className="assignee-avatar" title={assignee.name}>
                {assignee.avatar}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
