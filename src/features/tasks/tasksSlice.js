import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {
  deleteTaskFromApi,
  fetchTasksFromApi,
  mockTasks,
  saveTaskToApi,
} from './tasksApi';

const initialState = {
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

export const persistTask = createAsyncThunk('tasks/persistTask', async (task) => {
  return saveTaskToApi(task);
});

export const removeTaskRemote = createAsyncThunk(
  'tasks/removeTaskRemote',
  async (taskId) => {
    return deleteTaskFromApi(taskId);
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      // TODO [Level 1]: Implement the addTask reducer here
      // Hint: Generate an id, create a Task object, add it to state.entities and state.ids
      void state;
      void action;
    },
    deleteTask: (state, action) => {
      // TODO [Level 1]: Implement the deleteTask reducer here
      // Hint: Remove the task from state.entities and state.ids
      void state;
      void action;
    },
    updateTask: (state, action) => {
      // TODO [Level 1]: Implement the updateTask reducer here
      // Hint: Find the task by id and update the provided fields
      void state;
      void action;
    },
    setFilterAssignee: (state, action) => {
      state.filterAssigneeId = action.payload;
    },
    moveTaskOptimistic: (state, action) => {
      // TODO [Level 3]: Implement optimistic move — update task.columnId and track in optimisticMoves
      void state;
      void action;
    },
    revertOptimisticMove: (state, action) => {
      // TODO [Level 3]: Revert an optimistic move using optimisticMoves record
      void state;
      void action;
    },
    confirmOptimisticMove: (state, action) => {
      // TODO [Level 3]: Clear the optimistic move tracking entry on success
      void state;
      void action;
    },
  },
  extraReducers: (builder) => {
    // TODO [Level 2]: Handle fetchTasks.pending — set status to 'loading' and clear error
    // TODO [Level 2]: Handle fetchTasks.fulfilled — populate entities and ids, set status to 'succeeded'
    // TODO [Level 2]: Handle fetchTasks.rejected — set status to 'failed' and store error message
    // TODO [Level 2]: Handle persistTask.pending, .fulfilled, and .rejected lifecycle states
    // TODO [Level 2]: Handle removeTaskRemote.fulfilled and .rejected lifecycle states
    void builder;
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
