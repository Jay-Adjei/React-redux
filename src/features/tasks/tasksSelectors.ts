import type { RootState } from '../../app/store';
import type { Task } from '../../types';

const selectTasksState = (state: RootState) => state.tasks;
const selectBoardState = (state: RootState) => state.board;

// TODO [Level 3]: Convert this to a memoized selector using createSelector from @reduxjs/toolkit
export const selectAllTasks = (state: RootState): Task[] => {
  const tasksState = selectTasksState(state);
  return tasksState.ids.map((id) => tasksState.entities[id]);
};

// TODO [Level 3]: Write a memoized selector to filter tasks by assignee ID and column ID
export const selectTasksByColumnId = (columnId: string) => (state: RootState): Task[] => {
  // Unoptimized stub — returns tasks for this column without assignee filtering
  const tasks = selectAllTasks(state);
  return tasks
    .filter((task) => task.columnId === columnId)
    .sort((a, b) => a.order - b.order);
};

export const selectTaskById = (taskId: string) => (state: RootState): Task | undefined => {
  return selectTasksState(state).entities[taskId];
};

export const selectFilterAssigneeId = (state: RootState): string | null => {
  return selectTasksState(state).filterAssigneeId;
};

export const selectTasksStatus = (state: RootState) => {
  return selectTasksState(state).status;
};

export const selectTasksError = (state: RootState): string | null => {
  return selectTasksState(state).error;
};

export const selectColumnTaskIds = (columnId: string) => (state: RootState): string[] => {
  return selectBoardState(state).columns[columnId]?.taskIds ?? [];
};

export const selectColumns = (state: RootState) => {
  const boardState = selectBoardState(state);
  return boardState.activeBoard.columnIds.map((id) => boardState.columns[id]);
};

export const selectActiveBoard = (state: RootState) => {
  return selectBoardState(state).activeBoard;
};
