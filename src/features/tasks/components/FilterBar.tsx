import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setFilterAssignee } from '../tasksSlice';
import { selectFilterAssigneeId } from '../tasksSelectors';

export function FilterBar() {
  const dispatch = useAppDispatch();
  const filterAssigneeId = useAppSelector(selectFilterAssigneeId);
  const users = useAppSelector((state) => state.users.ids.map((id) => state.users.entities[id]));

  return (
    <div className="filter-bar">
      <label htmlFor="assignee-filter">Filter by assignee:</label>
      <select
        id="assignee-filter"
        value={filterAssigneeId ?? ''}
        onChange={(e) => dispatch(setFilterAssignee(e.target.value || null))}
      >
        <option value="">All assignees</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}
