import { createSlice } from '@reduxjs/toolkit';

const initialColumns = {
  'col-todo': { id: 'col-todo', title: 'To Do', taskIds: ['task-1', 'task-2'] },
  'col-progress': { id: 'col-progress', title: 'In Progress', taskIds: ['task-3'] },
  'col-done': { id: 'col-done', title: 'Done', taskIds: ['task-4'] },
};

const initialState = {
  activeBoard: {
    id: 'board-1',
    title: 'Product Sprint',
    columnIds: ['col-todo', 'col-progress', 'col-done'],
  },
  columns: initialColumns,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    renameColumn: (state, action) => {
      const column = state.columns[action.payload.columnId];
      if (column) {
        column.title = action.payload.title;
      }
    },
    addTaskToColumn: (state, action) => {
      const column = state.columns[action.payload.columnId];
      if (column && !column.taskIds.includes(action.payload.taskId)) {
        column.taskIds.push(action.payload.taskId);
      }
    },
    removeTaskFromColumn: (state, action) => {
      const column = state.columns[action.payload.columnId];
      if (column) {
        column.taskIds = column.taskIds.filter((id) => id !== action.payload.taskId);
      }
    },
    reorderColumnTasks: (state, action) => {
      const column = state.columns[action.payload.columnId];
      if (column) {
        column.taskIds = action.payload.taskIds;
      }
    },
  },
});

export const { renameColumn, addTaskToColumn, removeTaskFromColumn, reorderColumnTasks } =
  boardSlice.actions;
export default boardSlice.reducer;
