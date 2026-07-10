# Kanban Redux Lab

A hands-on, progressive **fill-in-the-blanks** learning project for mastering **React**, **Redux Toolkit**, and **React-Redux**. Build a Trello-style Kanban board by implementing commented-out logic across three difficulty levels.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Two-Branch Workflow

This repo uses a **lab + solutions** branching model:

| Branch | Purpose |
|--------|---------|
| `main` | **Your workspace.** Scaffolded app with `TODO` markers. Implement exercises here. |
| `solutions` | **Answer key.** Fully working, completed implementation. |

### Checking Your Work

```bash
# See everything you still need to implement
git diff solutions..main

# Check a specific file
git diff solutions..main -- src/features/tasks/tasksSlice.ts

# Peek at the solution for one file (without switching branches)
git show solutions:src/features/tasks/tasksSlice.ts
```

> **Tip:** Work on `main`. Only peek at `solutions` when you're truly stuck.

---

## Project Architecture

```
src/
├── app/
│   ├── store.ts          # Redux store configuration
│   └── hooks.ts          # Typed useAppDispatch / useAppSelector
├── features/
│   ├── board/
│   │   ├── boardSlice.ts           # Board & column state
│   │   └── components/Board.tsx    # Top-level board layout
│   ├── columns/
│   │   └── components/Column.tsx   # Column + drag-and-drop (Level 3)
│   ├── tasks/
│   │   ├── tasksSlice.ts           # Task CRUD + async thunks
│   │   ├── tasksApi.ts             # Mock API with simulated delay
│   │   ├── tasksSelectors.ts       # Memoized selectors (Level 3)
│   │   └── components/
│   │       ├── TaskCard.tsx
│   │       ├── AddTaskForm.tsx
│   │       ├── FilterBar.tsx
│   │       └── TaskSkeleton.tsx
│   └── users/
│       ├── usersSlice.ts
│       └── mockUsers.ts
└── types/
    └── index.ts          # Shared TypeScript interfaces
```

### Global State Shape

```typescript
{
  board: {
    activeBoard: { id, title, columnIds: string[] },
    columns: {
      [columnId]: { id, title, taskIds: string[] }
    }
  },
  tasks: {
    entities: { [taskId]: Task },
    ids: string[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
    filterAssigneeId: string | null,
    optimisticMoves: { [taskId]: { fromColumnId, toColumnId } }
  },
  users: {
    entities: { [userId]: User },
    ids: string[]
  }
}
```

### Domain Models

| Entity | Fields |
|--------|--------|
| **Board** | `id`, `title`, `columnIds` |
| **Column** | `id`, `title`, `taskIds` |
| **Task** | `id`, `columnId`, `title`, `description`, `priority`, `assigneeId`, `order` |
| **User** | `id`, `name`, `avatar` |

---

## Lab Levels

Work through the levels **in order**. Each level builds on the previous one.

### Level 1 — Beginner: Core React & Redux

**Concepts:** `createSlice`, synchronous reducers, `useSelector`, `useDispatch`

**Your tasks:**

| File | What to implement |
|------|-------------------|
| `src/features/tasks/tasksSlice.ts` | `addTask`, `deleteTask`, and `updateTask` reducers |
| `src/features/tasks/components/AddTaskForm.tsx` | Wire `useAppDispatch` to dispatch `addTask` + `addTaskToColumn` |
| `src/features/tasks/components/TaskCard.tsx` | Wire `useAppSelector` to read task data; wire dispatch for edit/delete |
| `src/features/board/boardSlice.ts` | `addTaskToColumn` and `removeTaskFromColumn` reducers |

**How to verify:**
- Click **+ Add Task** — a new card appears in the column
- Click the edit (✏️) button — you can change title and description
- Click delete (🗑️) — the card is removed

**Search for:** `TODO [Level 1]`

---

### Level 2 — Intermediate: Async Actions & Middleware

**Concepts:** `createAsyncThunk`, `extraReducers`, loading/error UI states

**Your tasks:**

| File | What to implement |
|------|-------------------|
| `src/features/tasks/tasksSlice.ts` | All `extraReducers` cases for `fetchTasks`, `persistTask`, and `removeTaskRemote` |
| `src/features/board/components/Board.tsx` | Ensure `fetchTasks` is dispatched on mount (if unwired) |

**How to verify:**
- On page load, skeleton loaders appear briefly (~1.2s), then tasks render
- If the mock API fails, an error banner appears with a **Retry** button
- Dragging a task between columns persists via the mock API (after Level 3)

**Search for:** `TODO [Level 2]`

---

### Level 3 — Advanced: Performance & Optimistic UI

**Concepts:** `createSelector` memoization, drag-and-drop state, optimistic updates

**Your tasks:**

| File | What to implement |
|------|-------------------|
| `src/features/tasks/tasksSelectors.ts` | Memoized `selectTasksByColumnId` with assignee filtering |
| `src/features/tasks/tasksSlice.ts` | `moveTaskOptimistic`, `revertOptimisticMove`, `confirmOptimisticMove` reducers |
| `src/features/board/boardSlice.ts` | `reorderColumnTasks` reducer for array splicing |
| `src/features/columns/components/Column.tsx` | Full drag-and-drop drop handler with optimistic update + rollback |

**How to verify:**
- Filter tasks by assignee — only matching cards show in each column
- Drag a card between columns — it moves instantly (optimistic), then persists
- Open React DevTools Profiler — columns shouldn't re-render when unrelated tasks change

**Search for:** `TODO [Level 3]`

---

## Finding All TODOs

```bash
grep -rn "TODO \[Level" src/
```

---

## Tech Stack

- **React 19** with TypeScript
- **Vite 6** for dev server and bundling
- **Redux Toolkit** (`@reduxjs/toolkit`) — `createSlice`, `createAsyncThunk`, `createSelector`
- **React-Redux** (`react-redux`) — `Provider`, `useSelector`, `useDispatch`

---

## Recommended Learning Path

1. Read `src/app/store.ts` to understand how slices are combined
2. Complete **Level 1** — get basic CRUD working locally
3. Complete **Level 2** — add async data fetching with loading states
4. Complete **Level 3** — optimize with selectors and add drag-and-drop
5. Compare your `main` branch against `solutions` with `git diff`

Happy learning! 🎯
