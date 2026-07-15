import { createSelector } from "@reduxjs/toolkit";

const selectTasksState = (state) => state.tasks;
const selectBoardState = (state) => state.board;

// TODO [Level 3]: Convert this to a memoized selector using createSelector from @reduxjs/toolkit
// export const selectAllTasks = (state) => {
//   const tasksState = selectTasksState(state);
//   return tasksState.ids.map((id) => tasksState.entities[id]);
// };

export const selectAllTasks = createSelector([selectTasksState], (tasksState) =>
  tasksState.ids.map((id) => tasksState.entities[id]),
);

// TODO [Level 3]: Write a memoized selector to filter tasks by assignee ID and column ID
// export const selectTasksByColumnId = (columnId) => (state) => {
// // Unoptimized stub — returns tasks for this column without assignee filtering
//   const tasks = selectAllTasks(state);
//   return tasks
//     .filter((task) => task.columnId === columnId)
//     .sort((a, b) => a.order - b.order);
// };

export const selectTasksByColumnId = (columnId) =>
  createSelector([selectAllTasks, selectTasksState], (tasks, tasksState) => {
    const filterAssigneeId = tasksState.filterAssigneeId;
    return tasks
      .filter((task) => {
        if (task.columnId !== columnId) return false;
        if (filterAssigneeId && task.assigneeId !== filterAssigneeId)
          return false;
        return true;
      })
      .sort((a, b) => a.order - b.order);
  });

export const selectTaskById = (taskId) => (state) => {
  return selectTasksState(state).entities[taskId];
};

export const selectFilterAssigneeId = (state) => {
  return selectTasksState(state).filterAssigneeId;
};

export const selectTasksStatus = (state) => {
  return selectTasksState(state).status;
};

export const selectTasksError = (state) => {
  return selectTasksState(state).error;
};

export const selectColumnTaskIds = (columnId) => (state) => {
  return selectBoardState(state).columns[columnId]?.taskIds ?? [];
};

export const selectColumns = (state) => {
  const boardState = selectBoardState(state);
  return boardState.activeBoard.columnIds.map((id) => boardState.columns[id]);
};

export const selectActiveBoard = (state) => {
  return selectBoardState(state).activeBoard;
};
