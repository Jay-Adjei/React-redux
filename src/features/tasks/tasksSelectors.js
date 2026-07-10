import { createSelector } from '@reduxjs/toolkit';

const selectTasksState = (state) => state.tasks;
const selectBoardState = (state) => state.board;

export const selectAllTasks = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.ids.map((id) => tasksState.entities[id]),
);

export const selectTasksByColumnId = (columnId) =>
  createSelector([selectAllTasks, selectTasksState], (tasks, tasksState) => {
    const filterAssigneeId = tasksState.filterAssigneeId;
    return tasks
      .filter((task) => {
        if (task.columnId !== columnId) return false;
        if (filterAssigneeId && task.assigneeId !== filterAssigneeId) return false;
        return true;
      })
      .sort((a, b) => a.order - b.order);
  });

export const selectTaskById = (taskId) =>
  createSelector([selectTasksState], (tasksState) => {
    return tasksState.entities[taskId];
  });

export const selectFilterAssigneeId = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.filterAssigneeId,
);

export const selectTasksStatus = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.status,
);

export const selectTasksError = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.error,
);

export const selectColumnTaskIds = (columnId) =>
  createSelector([selectBoardState], (boardState) => {
    return boardState.columns[columnId]?.taskIds ?? [];
  });

export const selectColumns = createSelector([selectBoardState], (boardState) => {
  return boardState.activeBoard.columnIds.map((id) => boardState.columns[id]);
});

export const selectActiveBoard = createSelector(
  [selectBoardState],
  (boardState) => boardState.activeBoard,
);
