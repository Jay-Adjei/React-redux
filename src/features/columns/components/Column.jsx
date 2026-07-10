import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { reorderColumnTasks, removeTaskFromColumn, addTaskToColumn } from '../../board/boardSlice';
import {
  moveTaskOptimistic,
  confirmOptimisticMove,
  revertOptimisticMove,
  persistTask,
} from '../../tasks/tasksSlice';
import { selectTasksByColumnId } from '../../tasks/tasksSelectors';
import { TaskCard } from '../../tasks/components/TaskCard';
import { AddTaskForm } from '../../tasks/components/AddTaskForm';

export function Column({ columnId, title }) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasksByColumnId(columnId));
  const taskEntities = useAppSelector((state) => state.tasks.entities);
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = useCallback((taskId) => {
    setDraggingTaskId(taskId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingTaskId(null);
    setIsDragOver(false);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const taskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
    if (!taskId) return;

    const task = taskEntities[taskId];
    if (!task || task.columnId === columnId) return;

    const fromColumnId = task.columnId;
    const toIndex = tasks.length;

    dispatch(
      moveTaskOptimistic({
        taskId,
        fromColumnId,
        toColumnId: columnId,
        toIndex,
      }),
    );

    dispatch(removeTaskFromColumn({ columnId: fromColumnId, taskId }));
    dispatch(addTaskToColumn({ columnId, taskId }));

    const updatedTask = { ...task, columnId, order: toIndex };
    try {
      await dispatch(persistTask(updatedTask)).unwrap();
      dispatch(confirmOptimisticMove(taskId));
    } catch {
      dispatch(revertOptimisticMove(taskId));
      dispatch(removeTaskFromColumn({ columnId, taskId }));
      dispatch(addTaskToColumn({ columnId: fromColumnId, taskId }));
      dispatch(
        reorderColumnTasks({ columnId: fromColumnId, taskIds: [...tasks.map((t) => t.id)] }),
      );
    }

    setDraggingTaskId(null);
  };

  const handleCardDragStart = (taskId) => {
    handleDragStart(taskId);
    const event = window.event;
    if (event?.dataTransfer) {
      event.dataTransfer.setData('text/plain', taskId);
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        <span className="column-title">{title}</span>
        <span className="column-count">{tasks.length}</span>
      </div>
      <div
        className={`column-tasks${isDragOver ? ' drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tasks.length === 0 ? (
          <div className="empty-column">Drop tasks here</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              taskId={task.id}
              columnId={columnId}
              onDragStart={handleCardDragStart}
              onDragEnd={handleDragEnd}
            />
          ))
        )}
      </div>
      <AddTaskForm columnId={columnId} />
    </div>
  );
}
