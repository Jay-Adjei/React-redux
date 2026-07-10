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

interface ColumnProps {
  columnId: string;
  title: string;
}

export function Column({ columnId, title }: ColumnProps) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasksByColumnId(columnId));
  const taskEntities = useAppSelector((state) => state.tasks.entities);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = useCallback((taskId: string) => {
    setDraggingTaskId(taskId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingTaskId(null);
    setIsDragOver(false);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
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
        reorderColumnTasks({ columnId: fromColumnId, taskIds: [...(tasks.map((t) => t.id))] }),
      );
    }

    setDraggingTaskId(null);
  };

  const handleCardDragStart = (taskId: string) => {
    handleDragStart(taskId);
    // Store task id for cross-column drops
    const event = window.event as DragEvent | undefined;
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
