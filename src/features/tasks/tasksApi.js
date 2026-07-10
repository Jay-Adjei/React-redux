const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockTasks = [
  {
    id: 'task-1',
    columnId: 'col-todo',
    title: 'Set up project repository',
    description: 'Initialize the repo with Vite, JavaScript, and Redux Toolkit.',
    priority: 'high',
    assigneeId: 'user-1',
    order: 0,
  },
  {
    id: 'task-2',
    columnId: 'col-todo',
    title: 'Design wireframes',
    description: 'Create low-fidelity wireframes for the Kanban board layout.',
    priority: 'medium',
    assigneeId: 'user-2',
    order: 1,
  },
  {
    id: 'task-3',
    columnId: 'col-progress',
    title: 'Implement Redux store',
    description: 'Configure the store with board, tasks, and users slices.',
    priority: 'high',
    assigneeId: 'user-1',
    order: 0,
  },
  {
    id: 'task-4',
    columnId: 'col-done',
    title: 'Write project README',
    description: 'Document setup instructions and lab objectives.',
    priority: 'low',
    assigneeId: 'user-3',
    order: 0,
  },
];

export async function fetchTasksFromApi() {
  await delay(1200);
  return mockTasks;
}

export async function saveTaskToApi(task) {
  await delay(600);
  return task;
}

export async function deleteTaskFromApi(taskId) {
  await delay(500);
  return taskId;
}
