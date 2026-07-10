import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Board, Column } from '../../types';

interface BoardState {
  activeBoard: Board;
  columns: Record<string, Column>;
}

const initialColumns: Record<string, Column> = {
  'col-todo': { id: 'col-todo', title: 'To Do', taskIds: ['task-1', 'task-2'] },
  'col-progress': { id: 'col-progress', title: 'In Progress', taskIds: ['task-3'] },
  'col-done': { id: 'col-done', title: 'Done', taskIds: ['task-4'] },
};

const initialState: BoardState = {
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
    renameColumn: (state, action: PayloadAction<{ columnId: string; title: string }>) => {
      const column = state.columns[action.payload.columnId];
      if (column) {
        column.title = action.payload.title;
      }
    },
    addTaskToColumn: (state, action: PayloadAction<{ columnId: string; taskId: string }>) => {
      // TODO [Level 1]: Implement addTaskToColumn — push taskId into the column's taskIds array
      void state;
      void action;
    },
    removeTaskFromColumn: (state, action: PayloadAction<{ columnId: string; taskId: string }>) => {
      // TODO [Level 1]: Implement removeTaskFromColumn — filter taskId out of the column's taskIds
      void state;
      void action;
    },
    reorderColumnTasks: (
      state,
      action: PayloadAction<{ columnId: string; taskIds: string[] }>,
    ) => {
      // TODO [Level 3]: Implement reorderColumnTasks — replace the column's taskIds array
      void state;
      void action;
    },
  },
});

export const { renameColumn, addTaskToColumn, removeTaskFromColumn, reorderColumnTasks } =
  boardSlice.actions;
export default boardSlice.reducer;
