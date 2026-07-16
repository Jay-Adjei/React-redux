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
      // TODO [Level 1]: Implement addTaskToColumn — push taskId into the column's taskIds array
      const {taskId, columnId} = action.payload;
      state.columns[columnId].taskIds.push(taskId);
    },
    removeTaskFromColumn: (state, action) => {
      // TODO [Level 1]: Implement removeTaskFromColumn — filter taskId out of the column's taskIds
      void state;
      void action;
    },
    reorderColumnTasks: (state, action) => {
      // TODO [Level 3]: Implement reorderColumnTasks — replace the column's taskIds array
      void state;
      void action;
    },
  },
});

export const { renameColumn, addTaskToColumn, removeTaskFromColumn, reorderColumnTasks } =
  boardSlice.actions;
export default boardSlice.reducer;
