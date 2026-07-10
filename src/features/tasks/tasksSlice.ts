import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { Priority, Task } from '../../types';
import {
  deleteTaskFromApi,
  fetchTasksFromApi,
  mockTasks,
  saveTaskToApi,
} from './tasksApi';

interface TasksState {
  entities: Record<string, Task>;
  ids: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filterAssigneeId: string | null;
  optimisticMoves: Record<string, { fromColumnId: string; toColumnId: string }>;
}

const initialState: TasksState = {
  entities: Object.fromEntries(mockTasks.map((task) => [task.id, task])),
  ids: mockTasks.map((task) => task.id),
  status: 'idle',
  error: null,
  filterAssigneeId: null,
  optimisticMoves: {},
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  return fetchTasksFromApi();
});

export const persistTask = createAsyncThunk('tasks/persistTask', async (task: Task) => {
  return saveTaskToApi(task);
});

export const removeTaskRemote = createAsyncThunk(
  'tasks/removeTaskRemote',
  async (taskId: string) => {
    return deleteTaskFromApi(taskId);
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (
      state,
      action: PayloadAction<{
        id?: string;
        columnId: string;
        title: string;
        description?: string;
        priority?: Priority;
        assigneeId?: string | null;
      }>,
    ) => {
      const id = action.payload.id ?? `task-${Date.now()}`;
      const task: Task = {
        id,
        columnId: action.payload.columnId,
        title: action.payload.title,
        description: action.payload.description ?? '',
        priority: action.payload.priority ?? 'medium',
        assigneeId: action.payload.assigneeId ?? null,
        order: state.ids.length,
      };
      state.entities[id] = task;
      state.ids.push(id);
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      delete state.entities[action.payload];
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
    updateTask: (
      state,
      action: PayloadAction<{
        id: string;
        title?: string;
        description?: string;
        priority?: Priority;
        assigneeId?: string | null;
      }>,
    ) => {
      const task = state.entities[action.payload.id];
      if (!task) return;
      if (action.payload.title !== undefined) task.title = action.payload.title;
      if (action.payload.description !== undefined) {
        task.description = action.payload.description;
      }
      if (action.payload.priority !== undefined) task.priority = action.payload.priority;
      if (action.payload.assigneeId !== undefined) {
        task.assigneeId = action.payload.assigneeId;
      }
    },
    setFilterAssignee: (state, action: PayloadAction<string | null>) => {
      state.filterAssigneeId = action.payload;
    },
    moveTaskOptimistic: (
      state,
      action: PayloadAction<{
        taskId: string;
        fromColumnId: string;
        toColumnId: string;
        toIndex: number;
      }>,
    ) => {
      const task = state.entities[action.payload.taskId];
      if (!task) return;

      state.optimisticMoves[action.payload.taskId] = {
        fromColumnId: action.payload.fromColumnId,
        toColumnId: action.payload.toColumnId,
      };
      task.columnId = action.payload.toColumnId;
      task.order = action.payload.toIndex;
    },
    revertOptimisticMove: (state, action: PayloadAction<string>) => {
      const move = state.optimisticMoves[action.payload];
      const task = state.entities[action.payload];
      if (move && task) {
        task.columnId = move.fromColumnId;
      }
      delete state.optimisticMoves[action.payload];
    },
    confirmOptimisticMove: (state, action: PayloadAction<string>) => {
      delete state.optimisticMoves[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities = Object.fromEntries(action.payload.map((task) => [task.id, task]));
        state.ids = action.payload.map((task) => task.id);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch tasks';
      })
      .addCase(persistTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(persistTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities[action.payload.id] = action.payload;
        if (!state.ids.includes(action.payload.id)) {
          state.ids.push(action.payload.id);
        }
      })
      .addCase(persistTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to save task';
      })
      .addCase(removeTaskRemote.fulfilled, (state, action) => {
        delete state.entities[action.payload];
        state.ids = state.ids.filter((id) => id !== action.payload);
        state.status = 'succeeded';
      })
      .addCase(removeTaskRemote.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to delete task';
      });
  },
});

export const {
  addTask,
  deleteTask,
  updateTask,
  setFilterAssignee,
  moveTaskOptimistic,
  revertOptimisticMove,
  confirmOptimisticMove,
} = tasksSlice.actions;

export default tasksSlice.reducer;
