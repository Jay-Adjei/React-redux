import { createSlice } from '@reduxjs/toolkit';
import { mockUsers } from './mockUsers';

const initialState = {
  entities: Object.fromEntries(mockUsers.map((user) => [user.id, user])),
  ids: mockUsers.map((user) => user.id),
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.entities[action.payload.id] = action.payload;
      state.ids.push(action.payload.id);
    },
  },
});

export const { addUser } = usersSlice.actions;
export default usersSlice.reducer;
