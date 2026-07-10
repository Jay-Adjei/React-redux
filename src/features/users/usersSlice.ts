import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';
import { mockUsers } from './mockUsers';

interface UsersState {
  entities: Record<string, User>;
  ids: string[];
}

const initialState: UsersState = {
  entities: Object.fromEntries(mockUsers.map((user) => [user.id, user])),
  ids: mockUsers.map((user) => user.id),
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.entities[action.payload.id] = action.payload;
      state.ids.push(action.payload.id);
    },
  },
});

export const { addUser } = usersSlice.actions;
export default usersSlice.reducer;
