import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import {
  deleteTaskFromApi,
  fetchTasksFromApi,
  mockTasks,
  saveTaskToApi,
} from "./tasksApi";

const initialState = {
  entities: Object.fromEntries(mockTasks.map((task) => [task.id, task])),
  ids: mockTasks.map((task) => task.id),
  status: "idle",
  error: null,
  filterAssigneeId: null,
  optimisticMoves: {},
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  return fetchTasksFromApi();
});

export const persistTask = createAsyncThunk(
  "tasks/persistTask",
  async (task) => {
    return saveTaskToApi(task);
  },
);

export const removeTaskRemote = createAsyncThunk(
  "tasks/removeTaskRemote",
  async (taskId) => {
    return deleteTaskFromApi(taskId);
  },
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      // TODO [Level 1]: Implement the addTask reducer here
      // Hint: Generate an id, create a Task object, add it to state.entities and state.ids
      const { title, description, priority, assigneeId, columnId, id, order } =
        action.payload;
      const task = {
        id: id,
        title: title,
        description: description,
        priority: priority,
        assigneeId: assigneeId,
        columnId: columnId,
      };
      state.entities[id] = task;
      state.ids.push(id);
    },
    deleteTask: (state, action) => {
      // TODO [Level 1]: Implement the deleteTask reducer here
      // Hint: Remove the task from state.entities and state.ids
      delete state.entities[action.payload];
      state.ids = state.ids.filter((id) => id !== action.payload);
      console.log(state.entities);
    },
    updateTask: (state, action) => {
      // TODO [Level 1]: Implement the updateTask reducer here
      // Hint: Find the task by id and update the provided fields
      const { id, title, description } = action.payload;
      if (state.entities[id].id == id) {
        state.entities[id].title = title;
        state.entities[id].description = description;
        console.log(title, description);
      }
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
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities = Object.fromEntries(
          action.payload.map((task) => [task.id, task]),
        );
        state.ids = action.payload.map((task) => task.id);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      })
      .addCase(persistTask.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(persistTask.fulfilled, (state, action) => {
        state.status = "succeded";
        state.entities[action.payload.id] = action.payload;
        if (!state.ids.includes(action.payload.id)) {
          state.ids.push(action.payload.id);
        }
      })
      .addCase(persistTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeTaskRemote.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(removeTaskRemote.rejected, (state, action) => {
        state.status = "failed";
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
