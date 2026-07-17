import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteTaskFromApi,
  fetchTasksFromApi,
  mockTasks,
  saveTaskToApi,
} from "./tasksApi";
import { act } from "react";

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
      const { title, desc, priority, assigneeId, taskId, columnId } =
        action.payload;
      const task = {
        id: taskId,
        title,
        description: desc,
        priority,
        assigneeId,
        columnId,
        order: state.ids.length,
      };
      state.entities[taskId] = task;
      state.ids.push(taskId);
    },
    deleteTask: (state, action) => {
      // TODO [Level 1]: Implement the deleteTask reducer here
      // Hint: Remove the task from state.entities and state.ids
      const taskId = action.payload;
      delete state.entities[taskId];
      state.ids = state.ids.filter((id) => id !== taskId);
    },
    updateTask: (state, action) => {
      // TODO [Level 1]: Implement the updateTask reducer here
      // Hint: Find the task by id and update the provided fields
      const { taskId, title, desc } = action.payload;
      state.entities[taskId].title = title;
      state.entities[taskId].description = desc;
    },
    setFilterAssignee: (state, action) => {
      state.filterAssigneeId = action.payload;
    },
    moveTaskOptimistic: (state, action) => {
      // TODO [Level 3]: Implement optimistic move — update task.columnId and track in optimisticMoves
      state.entities[action.payload.id].columnId = action.payload.toColumnId;
      state.entities[action.payload.id].order = action.payload.order;
      state.optimisticMoves = {
        fromColumnId: action.payload.fromColumnId,
        toColumnId: action.payload.toColumnId,
      };
    },
    revertOptimisticMove: (state, action) => {
      // TODO [Level 3]: Revert an optimistic move using optimisticMoves record
      state.entities[action.payload].columnId =
        state.optimisticMoves.fromColumnId;
    },
    confirmOptimisticMove: (state, action) => {
      // TODO [Level 3]: Clear the optimistic move tracking entry on success
      state.optimisticMoves = {};
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
      .addCase(persistTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(persistTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities[action.payload.id] = action.payload;
        if (!state.ids.includes(action.payload.id)) {
          state.ids.push(action.payload.id);
        }
      })
      .addCase(persistTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      })
      .addCase(removeTaskRemote.fulfilled, (state, action) => {
        delete state.entities[action.payload.id];
        state.ids = state.ids.filter((id) => id !== action.payload.id);
      })
      .addCase(removeTaskRemote.rejected, (state, action) => {
        state.status = "loading";
        state.error = action.payload.error;
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
