import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addTask } from '../tasksSlice';
import { addTaskToColumn } from '../../board/boardSlice';

export function AddTaskForm({ columnId }) {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) =>
    state.users.ids.map((id) => state.users.entities[id]),
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskId = `task-${Date.now()}`;
    dispatch(
      addTask({
        id: taskId,
        columnId,
        title: title.trim(),
        description: description.trim(),
        priority,
        assigneeId: assigneeId || null,
      }),
    );
    dispatch(addTaskToColumn({ columnId, taskId }));

    setTitle('');
    setDescription('');
    setPriority('medium');
    setAssigneeId('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button className="btn-secondary" onClick={() => setIsOpen(true)} style={{ marginTop: '0.5rem' }}>
        + Add Task
      </button>
    );
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
      />
      <div className="form-row">
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <button type="submit" className="btn-primary">
          Add Task
        </button>
        <button type="button" className="btn-secondary" onClick={() => setIsOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
